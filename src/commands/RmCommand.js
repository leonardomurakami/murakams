import Command from './Command';

class RmCommand extends Command {
  async execute(args) {
    if (args.length === 0) {
      return this.error('Usage: rm <filename>', 2);
    }

    const fileName = args[0];
    const currentPath = this.getState().fileSystem.currentPath;
    const fullPath = `${currentPath}/${fileName}`.replace(/\/+/g, '/');
    
    await this.dispatch(this.fileSystemActions.deleteNode({ path: fullPath }));
    return this.success(`File deleted: ${fileName}`);
  }
}

export default RmCommand;