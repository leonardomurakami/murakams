import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ROOT_PATH,
  AVAILABLE_COMMANDS,
  SYNCED_FOLDER_FILES
} from '../constants';

const createNode = (name, content = null, isDirectory = false) => ({
  name,
  content,
  isDirectory,
  children: isDirectory ? {} : null,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
});

const generateSyncedFolder = () => {
  const syncedFolder = { name: 'synced', isDirectory: true, children: {} };
  Object.entries(SYNCED_FOLDER_FILES).forEach(([name, fileData]) => {
    syncedFolder.children[name] = createNode(name, fileData.content, fileData.isDirectory);
  });
  return syncedFolder;
};

const initialState = {
  root: {
    name: ROOT_PATH,
    isDirectory: true,
    children: {
      synced: generateSyncedFolder()
    },
  },
  currentPath: ROOT_PATH,
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('fileSystemState');
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    // Always regenerate the synced folder
    parsedState.root.children.synced = generateSyncedFolder();
    return parsedState;
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('fileSystemState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState: loadState() || initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = normalizePath(action.payload);
      saveState(state);
    },
    createFile: (state, action) => {
      const { path, name, content } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && node.isDirectory) {
        node.children[name] = createNode(name, content);
      }
      saveState(state);
    },
    createDirectory: (state, action) => {
      const { path, name } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && node.isDirectory) {
        node.children[name] = createNode(name, null, true);
      }
      saveState(state);
    },
    deleteNode: (state, action) => {
      const { path } = action.payload;
      const parentPath = path.split('/').slice(0, -1).join('/');
      const name = path.split('/').pop();
      const parentNode = getNodeAtPath(state.root, parentPath);
      if (parentNode && parentNode.isDirectory) {
        delete parentNode.children[name];
      }
      saveState(state);
    },
    updateFileContent: (state, action) => {
      const { path, content } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && !node.isDirectory) {
        node.content = content;
        node.modifiedAt = new Date().toISOString();
      }
      saveState(state);
    },
  },
});

// Thunks
const getNodeAtPath = (root, path) => {
  const parts = path.split('/').filter(Boolean);
  let node = root;
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
};

const normalizePath = (pathStr) => {
  const parts = pathStr.split('/').filter(Boolean);
  const stack = [];
  for (const part of parts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
};

export const getAutocompleteSuggestions = createAsyncThunk(
  'fileSystem/getAutocompleteSuggestions',
  async (input, { getState }) => {
    const state = getState().fileSystem;
    const tokens = input.trim().split(/\s+/);

    // Command suggestions
    if (tokens.length === 1 && !input.endsWith(' ')) {
      const partialCommand = tokens[0] || '';
      return AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(partialCommand));
    }

    // File/directory suggestions
    let lastToken = tokens[tokens.length - 1];
    if (input.endsWith(' ')) {
      lastToken = '';
    }

    // Resolve the partial path
    const currentPath = state.currentPath;
    let fullPath = lastToken.startsWith('/')
      ? lastToken
      : `${currentPath}/${lastToken}`;
    fullPath = fullPath.replace(/\/+/g, '/');

    // Normalize the path
    fullPath = normalizePath(fullPath);

    // Separate the directory path and the partial file/directory name
    const lastSlashIndex = fullPath.lastIndexOf('/');
    const dirPath =
      lastSlashIndex >= 0 ? fullPath.substring(0, lastSlashIndex) || '/' : '/';
    const partial = fullPath.substring(lastSlashIndex + 1);

    const node = getNodeAtPath(state.root, dirPath);
    if (node && node.isDirectory) {
      // Filter and format the suggestions
      const suggestions = Object.keys(node.children)
        .filter((name) => name.startsWith(partial))
        .map((name) => {
          const childNode = node.children[name];
          // Only add trailing slash for directories
          return childNode.isDirectory ? `${name}/` : name;
        });

      // If we're in a subdirectory and the lastToken doesn't start with '/', add ".." as a suggestion
      if (dirPath !== '/' && partial === '' && !lastToken.startsWith('/')) {
        suggestions.unshift('..');
      }

      return suggestions;
    }

    return [];
  }
);

export const changeDirectory = createAsyncThunk(
  'fileSystem/changeDirectory',
  (path, { getState, dispatch }) => {
    const state = getState().fileSystem;
    let targetPath = path.startsWith('/')
      ? path
      : `${state.currentPath}/${path}`;
    targetPath = normalizePath(targetPath);
    const node = getNodeAtPath(state.root, targetPath);
    if (node && node.isDirectory) {
      dispatch(setCurrentPath(targetPath));
      return true;
    }
    return false;
  }
);

export const readDirectory = createAsyncThunk(
  'fileSystem/readDirectory',
  (path, { getState }) => {
    const state = getState().fileSystem;
    let targetPath;

    if (!path || path === '.') {
      targetPath = state.currentPath;
    } else if (path.startsWith('/')) {
      targetPath = path;
    } else {
      targetPath = `${state.currentPath}/${path}`;
    }

    targetPath = normalizePath(targetPath);

    const node = getNodeAtPath(state.root, targetPath);
    if (node && node.isDirectory) {
      return Object.keys(node.children).map(name =>
        node.children[name].isDirectory ? `${name}/` : name
      );
    }
    return null;
  }
);

export const readFile = createAsyncThunk(
  'fileSystem/readFile',
  (path, { getState }) => {
    const state = getState().fileSystem;
    let targetPath;

    if (path.startsWith('/')) {
      targetPath = path;
    } else {
      targetPath = `${state.currentPath}/${path}`;
    }
    targetPath = normalizePath(targetPath);

    const node = getNodeAtPath(state.root, targetPath);
    if (node && !node.isDirectory) {
      return node.content;
    }
    return null;
  }
);

export const { setCurrentPath, createFile, createDirectory, deleteNode, updateFileContent } = fileSystemSlice.actions;

export default fileSystemSlice.reducer;