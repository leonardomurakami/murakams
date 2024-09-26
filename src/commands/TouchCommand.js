import Command from './Command';

class TouchCommand extends Command {
  async execute(args) {
    if (args.length === 0) return 'Usage: touch <filename>';
    const fileName = args[0];
    const currentPath = this.getState().fileSystem.currentPath;
    await this.dispatch(this.fileSystemActions.createFile({ path: currentPath, name: fileName, content: '' }));
    return `File created: ${fileName}`;
  }
}

export default TouchCommand;