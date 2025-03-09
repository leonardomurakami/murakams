import Command from './Command';

class MkdirCommand extends Command {
  async execute(args) {
    if (args.length === 0) {
      return this.error('Usage: mkdir <directory>', 2);
    }

    const dirName = args[0];
    const currentPath = this.getState().fileSystem.currentPath;
    
    await this.dispatch(this.fileSystemActions.createDirectory({ 
      path: currentPath, 
      name: dirName 
    }));

    return this.success(`Directory created: ${dirName}`);
  }
}

export default MkdirCommand;