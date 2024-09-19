import { readDirectory, getCurrentPath } from '../components/FileSystem';

const find = async (args) => {
  if (args.length < 1) return 'Usage: find [path] [-name pattern] [-type d|f] [-maxdepth n]';

  let path = getCurrentPath();
  let namePattern = null;
  let type = null;
  let maxDepth = Infinity;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-name':
        namePattern = new RegExp(args[++i].replace(/\*/g, '.*').replace(/\?/g, '.'));
        break;
      case '-type':
        type = args[++i];
        if (type !== 'd' && type !== 'f') {
          return 'Invalid type. Use "d" for directories or "f" for files.';
        }
        break;
      case '-maxdepth':
        maxDepth = parseInt(args[++i], 10);
        if (isNaN(maxDepth) || maxDepth < 0) {
          return 'Invalid maxdepth. Please provide a non-negative integer.';
        }
        break;
      default:
        if (i === 0 && !args[i].startsWith('-')) {
          path = args[i];
        }
    }
  }

  const searchDirectory = async (dir, depth = 0) => {
    if (depth > maxDepth) return [];

    const files = await readDirectory(dir);
    if (!files) return [];

    let results = [];

    for (const file of files) {
      const fullPath = `${dir}/${file}`;
      const isDirectory = file.endsWith('/');

      if (
        (namePattern === null || namePattern.test(file)) &&
        (type === null || (type === 'd' && isDirectory) || (type === 'f' && !isDirectory))
      ) {
        results.push(fullPath);
      }

      if (isDirectory && depth < maxDepth) {
        results = results.concat(await searchDirectory(fullPath, depth + 1));
      }
    }

    return results;
  };

  const results = await searchDirectory(path);
  return results.length > 0 ? results.join('\n') : 'No files found';
};

export default find;