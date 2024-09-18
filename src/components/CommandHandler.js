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

const commands = {
  cat,
  ls,
  whoami,
  write,
  rm,
  help,
  clear,
  upgrade,
  downgrade,
  cd,
  mkdir
};

const commandHandler = (input) => {
  const [command, ...args] = input.split(' ');
  const commandFunction = commands[command.toLowerCase()];

  if (commandFunction) {
    return commandFunction(args);
  } else {
    return `Command not found: ${command}. Type 'help' for a list of available commands.`;
  }
};

export default commandHandler;