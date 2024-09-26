import Command from './Command';

class PwdCommand extends Command {
  execute() {
    return this.getState().fileSystem.currentPath;
  }
}

export default PwdCommand;