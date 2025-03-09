import Command from './Command';

class CdCommand extends Command {
  async execute(args) {
    if (args.length === 0) {
      return this.error('Usage: cd <directory>', 2);
    }

    const path = args[0];
    const success = await this.dispatch(this.fileSystemActions.changeDirectory(path)).unwrap();

    if (success) {
      const newPath = this.getState().fileSystem.currentPath;
      return { 
        type: 'cd', 
        code: 0,
        newPath, 
        content: `Changed to ${newPath}` 
      };
    }

    return this.error(`Directory not found: ${path}`, 1);
  }
}

export default CdCommand;