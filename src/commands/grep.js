import { readFile } from '../components/FileSystem';

const grep = (args) => {
  if (args.length < 2) return 'Usage: grep <pattern> <filename>';
  const pattern = args[0];
  const fileName = args[1];
  const content = readFile(fileName);
  
  if (content === null) return `File not found: ${fileName}`;
  
  const regex = new RegExp(pattern, 'g');
  const matches = content.split('\n').filter(line => regex.test(line));
  
  return matches.length > 0 ? matches.join('\n') : 'No matches found';
};

export default grep;