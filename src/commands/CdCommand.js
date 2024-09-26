import Command from './Command';

class CdCommand extends Command {
  async execute(args) {
    if (args.length === 0) return 'Usage: cd <directory>';
    const path = args[0];
    const success = await this.dispatch(this.fileSystemActions.changeDirectory(path)).unwrap();
    if (success) {
      const newPath = this.getState().fileSystem.currentPath;
      return { type: 'cd', newPath, content: `Changed to ${newPath}` };
    } else {
      return `Directory not found: ${path}`;
    }
  }
}

export default CdCommand;