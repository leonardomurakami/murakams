import { deleteFile } from '../components/FileSystem';

const rmCommand = (args) => {
  if (args.length === 0) return 'Usage: rm <filename>';
  return deleteFile(args[0]) 
    ? `File ${args[0]} deleted successfully.` 
    : `File ${args[0]} not found or could not be deleted.`;
};

export default rmCommand;