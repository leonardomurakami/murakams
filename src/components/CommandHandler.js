import cat from '../commands/cat';
import ls from '../commands/ls';
import whoami from '../commands/whoami';
import write from '../commands/write';
import rm from '../commands/rm';
import help from '../commands/help';
import clear from '../commands/clear';
import upgrade from '../commands/upgrade';
import downgrade from '../commands/downgrade';
import cd from '../commands/cd';
import mkdir from '../commands/mkdir';
import {easteregg, meaning} from '../commands/easteregg';
import pwd from '../commands/pwd';
import touch from '../commands/touch';
import echo from '../commands/echo';
import grep from '../commands/grep';
import head from '../commands/head';
import tail from '../commands/tail';
import less from '../commands/less';
import more from '../commands/more';
import find from '../commands/find';
import { readFile, writeFile } from '../components/FileSystem';

const commands = {
  cat, ls, whoami, write, rm, help, clear, upgrade, downgrade, cd, mkdir,
  easteregg, meaning, pwd, touch, echo, grep, head, tail, less, more, find
};

const appendToFile = async (filename, content) => {
  const existingContent = await readFile(filename);
  const newContent = existingContent ? `${existingContent}\n${content}` : content;
  await writeFile(filename, newContent);
};

const commandHandler = async (input) => {
  const redirectionIndex = input.indexOf('>>');
  let command, outputFile;

  if (redirectionIndex !== -1) {
    command = input.slice(0, redirectionIndex).trim();
    outputFile = input.slice(redirectionIndex + 2).trim();
  } else {
    command = input;
  }

  const [commandName, ...args] = command.split(' ');
  const commandFunction = commands[commandName.toLowerCase()];

  if (commandFunction) {
    try {
      const result = await commandFunction(args);
      
      if (outputFile) {
        await appendToFile(outputFile, result);
        return ``;
      } else {
        return result;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  } else {
    return `Command not found: ${commandName}. Type 'help' for a list of available commands.`;
  }
};

export default commandHandler;