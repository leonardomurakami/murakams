import Command from './Command';

class PwdCommand extends Command {
  execute(args) {
    const currentPath = this.getState().fileSystem.currentPath;
    return this.success(currentPath);
  }
}

export default PwdCommand;