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

import { addToHistory } from '../redux/commandSlice';

const expandHistoryCommand = (command, history) => {
  if (!command.includes('!')) return command;

  const expandToken = (token) => {
    if (!token.startsWith('!')) return token;
    
    try {
      // !! - Previous command
      if (token === '!!') {
        if (history.length === 0) throw new Error('No commands in history');
        return history[history.length - 1];
      }
      
      // !$ - Last argument of previous command
      if (token === '!$') {
        if (history.length === 0) throw new Error('No commands in history');
        const lastCommand = history[history.length - 1];
        const parts = lastCommand.split(' ');
        return parts[parts.length - 1];
      }
      
      // !? - Search for most recent command containing string
      if (token.startsWith('!?')) {
        const searchTerm = token.slice(2);
        const found = [...history].reverse().find(cmd => cmd.includes(searchTerm));
        if (!found) throw new Error(`Event not found: ${searchTerm}`);
        return found;
      }
      
      // !-n - nth previous command
      if (token.startsWith('!-')) {
        const num = parseInt(token.slice(2));
        if (isNaN(num) || num < 1 || num > history.length) 
          throw new Error(`Event not found: ${token}`);
        return history[history.length - num];
      }
      
      // !n - Command at position n
      const num = parseInt(token.slice(1));
      if (!isNaN(num)) {
        if (num < 1 || num > history.length)
          throw new Error(`Event not found: ${token}`);
        return history[num - 1];
      }
      
      // !prefix - Most recent command starting with prefix
      const prefix = token.slice(1);
      const found = [...history].reverse().find(cmd => cmd.startsWith(prefix));
      if (!found) throw new Error(`Event not found: ${prefix}`);
      return found;
    } catch (error) {
      throw new Error(`bash: ${error.message}`);
    }
  };

  // Split on spaces but preserve quoted strings
  const tokens = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [command];
  return tokens.map(token => expandToken(token)).join(' ');
};

const parseCommand = (input) => {
  const tokens = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"' && input[i-1] !== '\\') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && (char === ' ' || char === '|' || char === '&')) {
      if (current) tokens.push(current);
      if (char === '|' || char === '&') {
        if (input[i+1] === char) {
          tokens.push(char + char);
          i++;
        } else {
          tokens.push(char);
        }
      }
      current = '';
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
};

const executeCommand = async (commandStr, dispatch, getState, fileSystemActions) => {
  // Split command and args, but handle empty/malformed input
  const tokens = commandStr.match(/(?:[^\s"]+|"[^"]*")+/g);
  if (!tokens || !tokens.length) {
    return { code: 1, content: 'Invalid command format' };
  }

  const command = tokens[0];
  const args = tokens.slice(1).map(arg => arg.replace(/^"(.*)"$/, '$1'));

  const redirectIndex = args.findIndex(arg => arg === '>>' || arg === '>');
  let redirectionType = null;
  let redirectionFile = null;

  if (redirectIndex !== -1) {
    redirectionType = args[redirectIndex];
    redirectionFile = args[redirectIndex + 1];
    args.splice(redirectIndex);
  }

  try {
    // Handle history command explicitly since it's a special case
    if (command === '!!') {
      const history = getState().command.history;
      if (history.length === 0) {
        throw new Error('No commands in history');
      }
      const lastCommand = history[history.length - 1];
      // Recursively execute the last command
      return executeCommand(lastCommand, dispatch, getState, fileSystemActions);
    }

    const commandFactory = new CommandFactory(fileSystemActions, dispatch, getState);
    const cmd = commandFactory.getCommand(command);
    const result = await cmd.execute(args);

    // Handle redirection
    if (redirectionType && result.code === 0) {
      const currentPath = getState().fileSystem.currentPath;
      const fullPath = `${currentPath}/${redirectionFile}`.replace(/\/+/g, '/');
      
      const content = result.content;

      if (redirectionType === '>>') {
        const existingContent = await dispatch(fileSystemActions.readFile(fullPath)).unwrap() || '';
        await dispatch(fileSystemActions.updateFileContent({ 
          path: fullPath, 
          content: existingContent ? existingContent + '\n' + content : content 
        }));
      } else {
        await dispatch(fileSystemActions.updateFileContent({ path: fullPath, content }));
      }
      return { code: 0, content: `Output redirected to ${redirectionFile}` };
    }

    return result;
  } catch (error) {
    if (error.message.startsWith('Command not found')) {
      return { code: 127, content: error.message };
    }
    return { code: 1, content: error.message };
  }
};

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

  try {
    // Parse into commands and operators first
    const tokens = parseCommand(input);
    let commands = [];
    let currentCommand = [];

    for (const token of tokens) {
      if (token === '|' || token === '||' || token === '&&') {
        if (currentCommand.length) {
          commands.push({ type: 'command', content: currentCommand.join(' ') });
          currentCommand = [];
        }
        commands.push({ type: 'operator', content: token });
      } else {
        currentCommand.push(token);
      }
    }
    if (currentCommand.length) {
      commands.push({ type: 'command', content: currentCommand.join(' ') });
    }

    // Then expand history in each command
    const history = getState().command.history;
    commands = commands.map(item => {
      if (item.type === 'command') {
        return { ...item, content: expandHistoryCommand(item.content, history) };
      }
      return item;
    });

    // Add to history after expansion
    if (commands.length > 0) {
      dispatch(addToHistory(input));
      const expandedCommand = commands
        .map(item => item.content)
        .join(' ');
      if (expandedCommand !== input) {
        dispatch(addToHistory(expandedCommand));
      }
    }

    let lastResult = null;
    let shouldExecute = true;

    for (let i = 0; i < commands.length; i++) {
      const current = commands[i];
      const next = commands[i + 1];

      if (current.type === 'command' && shouldExecute) {
        let commandInput = current.content;
        if (lastResult && commands[i - 1]?.content === '|') {
          commandInput = `${commandInput} "${lastResult.content}"`;
        }
        
        lastResult = await executeCommand(commandInput, dispatch, getState, fileSystemActions);
        
        if (next?.type === 'operator') {
          switch (next.content) {
            case '&&':
              shouldExecute = lastResult.code === 0;
              break;
            case '||':
              shouldExecute = lastResult.code !== 0;
              break;
            case '|':
              shouldExecute = true;
              break;
            default:
              shouldExecute = true;
              break;
          }
        }
      }
    } 

    return lastResult;
  } catch (error) {
    return {
      code: 1,
      content: error.message
    };
  }
};

export default commandHandler;