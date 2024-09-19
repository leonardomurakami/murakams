import { readDirectory, getCurrentPath } from '../components/FileSystem';

const ls = (args) => {
  let path = '';
  let showHidden = false;
  let longFormat = false;

  // Parse arguments
  args.forEach(arg => {
    if (arg === '-a' || arg === '--all') showHidden = true;
    else if (arg === '-l') longFormat = true;
    else if (!path) path = arg;
  });

  if (!path) path = getCurrentPath();

  const files = readDirectory(path);

  if (!files) return `Directory not found: ${path}`;

  let output = [];

  files.forEach(item => {
    if (!showHidden && item.startsWith('.') && item !== '.' && item !== '..') return;

    let displayName = item;
    let color = '';

    if (item.endsWith('/')) {
      color = '\x1b[1;34m'; // Blue for directories
    } else if (item.startsWith('.')) {
      color = '\x1b[1;32m'; // Green for hidden files
    } else {
      color = '\x1b[0m'; // Default color for regular files
    }

    if (longFormat) {
      const permissions = item.endsWith('/') ? 'drwxr-xr-x' : '-rw-r--r--';
      const owner = 'user';
      const group = 'group';
      const size = '4096';
      const date = new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'
      });
      output.push(`${permissions} 1 ${owner} ${group} ${size.padStart(8)} ${date} ${color}${displayName}\x1b[0m`);
    } else {
      output.push(`${color}${displayName}\x1b[0m`);
    }
  });

  return output.join('\n');
};

export default ls;