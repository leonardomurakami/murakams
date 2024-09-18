import File, { initialFiles } from './File';

class Directory {
  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.contents = {};
  }

  addFile(file) {
    this.contents[file.name] = file;
  }

  addDirectory(dir) {
    this.contents[dir.name] = dir;
  }

  toJSON() {
    const jsonContents = {};
    for (const [name, item] of Object.entries(this.contents)) {
      jsonContents[name] = item instanceof File ? item.toJSON() : item.toJSON();
    }
    return {
      name: this.name,
      contents: jsonContents
    };
  }
  
  static fromJSON(json, parent = null) {
    const dir = new Directory(json.name, parent);
    for (const [name, item] of Object.entries(json.contents)) {
      if (item.content !== undefined) {
        dir.contents[name] = File.fromJSON(item);
      } else {
        dir.contents[name] = Directory.fromJSON(item, dir);
      }
    }
    return dir;
  }
}

class FileSystem {
  constructor() {
    this.root = new Directory('');
    this.currentDirectory = this.root;
    this.loadFromStorage();
  }
  
  loadFromStorage() {
    const savedFs = localStorage.getItem('fileSystem');
    if (savedFs) {
      const parsedFs = JSON.parse(savedFs);
      this.root = Directory.fromJSON(parsedFs);
      this.currentDirectory = this.root;
      this.ensureDefaultFolder();
    } else {
      this.initializeFileSystem();
    }
  }

  saveToStorage() {
    localStorage.setItem('fileSystem', JSON.stringify(this.root.toJSON()));
  }

  ensureDefaultFolder() {
    if (!this.root.contents['default']) {
      const defaultDir = new Directory('default', this.root);
      initialFiles.forEach(file => defaultDir.addFile(new File(file.name, file.content)));
      this.root.addDirectory(defaultDir);
    }
    this.saveToStorage();
  }

  initializeFileSystem() {
    const defaultDir = new Directory('default', this.root);
    initialFiles.forEach(file => defaultDir.addFile(new File(file.name, file.content)));
    this.root.addDirectory(defaultDir);
    this.saveToStorage();
  }

  readFile(path) {
    const { dir, fileName } = this.resolvePath(path);
    if (!dir) return null;
    const file = dir.contents[fileName];
    return file instanceof File ? file.content : null;
  }

  listFiles(path = '') {
    const dir = path ? this.resolvePath(path).dir : this.currentDirectory;
    return dir ? ['..', '.', ...Object.keys(dir.contents)] : null;
  }

  writeFile(path, content) {
    const { dir, fileName } = this.resolvePath(path);
    if (!dir) return false;
    if (dir.contents[fileName] instanceof File) {
      dir.contents[fileName].content = content;
      dir.contents[fileName].modifiedAt = new Date();
    } else {
      dir.contents[fileName] = new File(fileName, content);
    }
    this.saveToStorage();
    return true;
  }

  deleteFile(path) {
    const { dir, fileName } = this.resolvePath(path);
    if (!dir || !(dir.contents[fileName] instanceof File)) return false;
    delete dir.contents[fileName];
    this.saveToStorage();
    return true;
  }

  changeDirectory(path) {
    if (path === '/') {
      this.currentDirectory = this.root;
      return true;
    }
    if (path === '..') {
      if (this.currentDirectory.parent) {
        this.currentDirectory = this.currentDirectory.parent;
        return true;
      }
      return false;
    }
    const { dir } = this.resolvePath(path);
    if (!dir) return false;
    this.currentDirectory = dir;
    return true;
  }

  makeDirectory(path) {
    const { dir, fileName } = this.resolvePath(path);
    if (!dir || dir.contents[fileName]) return false;
    const newDir = new Directory(fileName, dir);
    dir.addDirectory(newDir);
    this.saveToStorage();
    return true;
  }

  resolvePath(path) {
    if (path === '/') return { dir: this.root, fileName: '' };
    const parts = path.split('/').filter(p => p);
    let current = path.startsWith('/') ? this.root : this.currentDirectory;
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '..') {
        current = current.parent || current;
      } else if (parts[i] !== '.') {
        if (!current.contents[parts[i]]) {
          if (i === parts.length - 1) {
            return { dir: current, fileName: parts[i] };
          }
          return { dir: null, fileName: null };
        }
        if (!(current.contents[parts[i]] instanceof Directory)) {
          if (i === parts.length - 1) {
            return { dir: current, fileName: parts[i] };
          }
          return { dir: null, fileName: null };
        }
        current = current.contents[parts[i]];
      }
    }
    return { dir: current, fileName: '' };
  }

  getCurrentPath() {
    const path = [];
    let current = this.currentDirectory;
    while (current !== this.root) {
      path.unshift(current.name);
      current = current.parent;
    }
    return '/' + path.join('/');
  }
}

const fileSystem = new FileSystem();

export const readFile = (path) => fileSystem.readFile(path);
export const listFiles = (path) => fileSystem.listFiles(path);
export const writeFile = (path, content) => fileSystem.writeFile(path, content);
export const deleteFile = (path) => fileSystem.deleteFile(path);
export const changeDirectory = (path) => fileSystem.changeDirectory(path);
export const makeDirectory = (path) => fileSystem.makeDirectory(path);
export const getCurrentPath = () => fileSystem.getCurrentPath();

export default FileSystem;