import { readFile } from '../components/FileSystem';

const tail = (args) => {
  if (args.length < 1) return 'Usage: tail [-n <num>] <filename>';
  
  let numLines = 10;
  let fileName;

  if (args[0] === '-n' && args.length >= 3) {
    numLines = parseInt(args[1], 10);
    fileName = args[2];
  } else {
    fileName = args[0];
  }

  const content = readFile(fileName);
  if (content === null) return `File not found: ${fileName}`;

  const lines = content.split('\n');
  return lines.slice(-numLines).join('\n');
};

export default tail;