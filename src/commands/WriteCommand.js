import Command from './Command';

class WriteCommand extends Command {
  async execute(args) {
    if (args.length < 2) return 'Usage: write <filename> <content>';
    const fileName = args[0];
    const content = args.slice(1).join(' ');
    const currentPath = this.getState().fileSystem.currentPath;
    const fullPath = `${currentPath}/${fileName}`.replace(/\/+/g, '/');
    await this.dispatch(this.fileSystemActions.updateFileContent({ path: fullPath, content }));
    return `File ${fileName} written successfully.`;
  }
}

export default WriteCommand;