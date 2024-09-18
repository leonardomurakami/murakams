import { listFiles } from '../components/FileSystem';

const ls = (args) => {
  const path = args[0] || '';
  const files = listFiles(path);

  if (!files) return `Directory not found: ${path}`;

  let output = [];

  files.forEach(item => {
    if (item === '.' || item === '..') {
      output.push(`\x1b[1;34m${item}\x1b[0m`);
    } else if (item === 'files' || files.indexOf(item + '/') !== -1) {
      output.push(`\x1b[1;34m${item}/\x1b[0m`);
    } else {
      output.push(item);
    }
  });

  return output.join('\n');
};

export default ls;