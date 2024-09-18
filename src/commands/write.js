import { writeFile } from '../components/FileSystem';

const write = (args) => {
  if (args.length < 2) return 'Usage: write <filename> <content>';
  const fileName = args[0];
  const fileContent = args.slice(1).join(' ');
  return writeFile(fileName, fileContent) 
    ? `File ${fileName} written successfully.` 
    : `Error writing file ${fileName}.`;
};

export default write;