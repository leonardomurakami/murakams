import { makeDirectory } from '../components/FileSystem';

const mkdir = (args) => {
  if (args.length === 0) return 'Usage: mkdir <directory>';
  const path = args[0];
  if (makeDirectory(path)) {
    return `Directory created: ${path}`;
  } else {
    return `Failed to create directory: ${path}`;
  }
};

export default mkdir;