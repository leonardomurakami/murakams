import { readFile } from '../components/FileSystem';

const cat = (args) => {
  if (args.length === 0) return 'Usage: cat <filename>';
  const content = readFile(args[0]);
  return content !== null ? content : `File not found: ${args[0]}`;
};

export default cat;