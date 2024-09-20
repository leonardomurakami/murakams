import Command from './Command';

class MkdirCommand extends Command {
  async execute(args) {
    if (args.length === 0) return 'Usage: mkdir <directory>';
    const dirName = args[0];
    const currentPath = this.getState().fileSystem.currentPath;
    await this.dispatch(this.fileSystemActions.createDirectory({ path: currentPath, name: dirName }));
    return `Directory created: ${dirName}`;
  }
}

export default MkdirCommand;