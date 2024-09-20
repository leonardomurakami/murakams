import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const createNode = (name, content = null, isDirectory = false) => ({
  name,
  content,
  isDirectory,
  children: isDirectory ? {} : null,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
});

const initialState = {
  root: {
    name: '/',
    isDirectory: true,
    children: {
      synced:{
        name: 'synced',
        isDirectory: true,
        children:{
            'welcome.txt': createNode('welcome.txt', 'Welcome to my terminal portfolio! Type "help" to see available commands.'),
            'about.md': createNode('about.md', '# About Me\n\nHello! I\'m Leonardo Murakami, a Site Reliability Engineer passionate about technology and always eager to learn new things.\n\n## Skills\n- JavaScript (React, Node.js)\n- Python\n- Go\n- SQL\n- DevOps practices\n- AWS, K8s, Docker, Terraform\n\n## Interests\n- 🌐 Technology Enthusiast\n- 📊 Data Science and Machine Learning\n- 🐐 Studying goat farming\n\nFeel free to explore my files using the `ls` and `cat` commands!'),
            'projects.md': createNode('projects.md', 'Just like all my projects, this file is #TODO'),
            'saved_email.txt': createNode('saved_email.txt', 'From: it@murakams.com\nTo: all-employees@company.com\nSubject: WHO OPENED POPUPS *INSIDE* OUR SERVERS???\n\n...'),
            'contact.json': createNode('contact.json', JSON.stringify({
                email: "contato@murakams.com",
                linkedin: "https://linkedin.com/in/leonardo-murakami",
                github: "https://github.com/leonardomurakami"
            }, null, 2)),
            'skills.txt': createNode('skills.txt', 'Technical Skills:\n- Programming: JavaScript, Python, Go, SQL\n- Web Technologies: React, Node.js, HTML, CSS (not so much)\n- DevOps: Docker, Kubernetes, Jenkins\n...'),
            'hobbies.md': createNode('hobbies.md', '# Hobbies and Interests\n1. 📚 Doomscrolling instagram reels\n2. 🏋️ Gym and staying active\n...'),
            'why-goat-farming.txt': createNode('why-goat-farming.txt', 'You don\'t have to monitor the utilization on a goat.\nMilk a goat and the goat stays milked for a while.\n...')
        }
      }
    },
  },
  currentPath: '/',
};

const getNodeAtPath = (root, path) => {
  const parts = path.split('/').filter(Boolean);
  let node = root;
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
};

// Helper function to normalize paths
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

// Define available commands for autocomplete
const commands = [
  'ls', 'cd', 'cat', 'pwd', 'mkdir', 'touch', 'rm', 'write', 'echo', 'grep',
  'head', 'tail', 'find', 'help', 'clear', 'upgrade', 'downgrade'
];

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = normalizePath(action.payload);
    },
    createFile: (state, action) => {
      const { path, name, content } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && node.isDirectory) {
        node.children[name] = createNode(name, content);
      }
    },
    createDirectory: (state, action) => {
      const { path, name } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && node.isDirectory) {
        node.children[name] = createNode(name, null, true);
      }
    },
    deleteNode: (state, action) => {
      const { path } = action.payload;
      const parentPath = path.split('/').slice(0, -1).join('/');
      const name = path.split('/').pop();
      const parentNode = getNodeAtPath(state.root, parentPath);
      if (parentNode && parentNode.isDirectory) {
        delete parentNode.children[name];
      }
    },
    updateFileContent: (state, action) => {
      const { path, content } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && !node.isDirectory) {
        node.content = content;
        node.modifiedAt = new Date().toISOString();
      }
    },
  },
});

// Thunks
export const getAutocompleteSuggestions = createAsyncThunk(
  'fileSystem/getAutocompleteSuggestions',
  async (input, { getState }) => {
    const state = getState().fileSystem;

    // Split the input into tokens while handling multiple spaces
    const tokens = input.trim().split(/\s+/);

    // Determine if we're autocompleting a command or an argument
    if (tokens.length === 0 || (tokens.length === 1 && !input.endsWith(' '))) {
      // Autocomplete for commands
      const partialCommand = tokens[0] || '';
      return commands.filter((cmd) => cmd.startsWith(partialCommand));
    } else {
      // Autocomplete for file/directory names

      // Extract the last token (the one being autocompleted)
      let lastToken = tokens[tokens.length - 1];

      // If the input ends with a space, the user is starting a new argument
      if (input.endsWith(' ')) {
        lastToken = '';
      }

      // Handle options (skip tokens starting with '-')
      const args = tokens.slice(1).filter((token) => !token.startsWith('-'));
      lastToken = args.length > 0 ? args[args.length - 1] : lastToken;

      // Resolve the partial path relative to the current path
      const currentPath = state.currentPath;
      let fullPath = lastToken.startsWith('/')
        ? lastToken
        : `${currentPath}/${lastToken}`;
      fullPath = fullPath.replace(/\/+/g, '/');

      // Normalize the path to handle '.', '..', and redundant slashes
      fullPath = normalizePath(fullPath);

      // Separate the directory path and the partial file/directory name
      const lastSlashIndex = fullPath.lastIndexOf('/');
      const dirPath =
        lastSlashIndex >= 0 ? fullPath.substring(0, lastSlashIndex) || '/' : '/';
      const partial = fullPath.substring(lastSlashIndex + 1);

      const node = getNodeAtPath(state.root, dirPath);
      if (node && node.isDirectory) {
        // Filter and format the suggestions
        return Object.keys(node.children)
          .filter((name) => name.startsWith(partial))
          .map((name) => (node.children[name].isDirectory ? `${name}/` : name));
      }
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
