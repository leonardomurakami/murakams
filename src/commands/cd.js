import { changeDirectory, getCurrentPath } from '../components/FileSystem';

const cd = (args) => {
  if (args.length === 0) return 'Usage: cd <directory>';
  const path = args[0];
  if (changeDirectory(path)) {
    return `Changed directory to: ${getCurrentPath()}`;
  } else {
    return `Directory not found: ${path}`;
  }
};

export default cd;