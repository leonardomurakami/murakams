import { readFile } from '../components/FileSystem';

const less = (args) => {
  if (args.length === 0) return 'Usage: less <filename>';
  const fileName = args[0];
  const content = readFile(fileName);
  
  if (content === null) return `File not found: ${fileName}`;
  
  return `Content of ${fileName}:\n\n${content}\n\n`;
};

export default less;