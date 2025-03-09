import Command from './Command';

class TouchCommand extends Command {
  async execute(args) {
    if (args.length === 0) {
      return this.error('Usage: touch <filename>', 2);
    }

    const fileName = args[0];
    const currentPath = this.getState().fileSystem.currentPath;
    
    await this.dispatch(this.fileSystemActions.createFile({ 
      path: currentPath, 
      name: fileName, 
      content: '' 
    }));

    return this.success(`File created: ${fileName}`);
  }
}

export default TouchCommand;