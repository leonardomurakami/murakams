import { writeFile, readFile } from '../components/FileSystem';

const touch = (args) => {
  if (args.length === 0) return 'Usage: touch <filename>';
  const fileName = args[0];
  const existingContent = readFile(fileName);
  if (existingContent !== null) {
    // File exists, update its modification time (in a real system)
    return `Updated timestamp of ${fileName}`;
  } else {
    // File doesn't exist, create it
    return writeFile(fileName, '') 
      ? `Created file ${fileName}`
      : `Error creating file ${fileName}`;
  }
};

export default touch;