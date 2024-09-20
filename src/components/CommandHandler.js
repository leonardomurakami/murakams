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

const commandHandler = (input, dispatch, getState) => {
  const [commandName, ...args] = input.split(' ');
  
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
  
  try {
    const command = commandFactory.getCommand(commandName);
    return command.execute(args);
  } catch (error) {
    if (error.message.startsWith('Command not found')) {
      return `Command not found: ${commandName}. Type 'help' for a list of available commands.`;
    }
    console.error(`Error executing command ${commandName}:`, error);
    return `Error: ${error.message}`;
  }
};

export default commandHandler;