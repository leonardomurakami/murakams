import CommandFactory from './CommandFactory';
import { 
  changeDirectory, 
  readDirectory, 
  readFile,
  createFile,
  createDirectory,
  deleteNode,
  updateFileContent
} from '../redux/fileSystemSlice';

const commandHandler = async (input, dispatch, getState) => {
  const fileSystemActions = {
    changeDirectory,
    readDirectory,
    readFile,
    createFile,
    createDirectory,
    deleteNode,
    updateFileContent
  };

  const commandFactory = new CommandFactory(fileSystemActions, dispatch, getState);
  
  // Split the input into command and arguments, considering quotes
  const [command, ...args] = input.match(/(?:[^\s"]+|"[^"]*")+/g).map(arg => arg.replace(/^"(.*)"$/, '$1'));

  // Check for redirection
  const redirectIndex = args.findIndex(arg => arg === '>>' || arg === '>');
  let redirectionType = null;
  let redirectionFile = null;

  if (redirectIndex !== -1) {
    redirectionType = args[redirectIndex];
    redirectionFile = args[redirectIndex + 1];
    args.splice(redirectIndex); // Remove redirection arguments
  }

  try {
    const cmd = commandFactory.getCommand(command);
    let result = await cmd.execute(args);

    if (redirectionType) {
      const currentPath = getState().fileSystem.currentPath;
      const fullPath = `${currentPath}/${redirectionFile}`.replace(/\/+/g, '/');
      
      if (typeof result === 'object' && result.content) {
        result = result.content;
      }

      if (redirectionType === '>>') {
        // Append to file
        const existingContent = await dispatch(readFile(fullPath)).unwrap() || '';
        let newFileContent = { path: fullPath, content: existingContent + '\n' + result }
        if (existingContent === ''){
          newFileContent = { path: fullPath, content: result };
        }
        await dispatch(updateFileContent(newFileContent));
      } else {
        await dispatch(updateFileContent({ path: fullPath, content: result }));
      }

      result = `Output redirected to ${redirectionFile}`;
    }

    return result;
  } catch (error) {
    if (error.message.startsWith('Command not found')) {
      return `Command not found: ${command}. Type 'help' for a list of available commands.`;
    }
    console.error(`Error executing command ${command}:`, error);
    return `Error: ${error.message}`;
  }
};

export default commandHandler;