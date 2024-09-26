import Command from './Command';

class TailCommand extends Command {
  async execute(args) {
    if (args.length < 1) return 'Usage: tail [-n <num>] <filename>';
    
    let numLines = 10;
    let fileName;

    if (args[0] === '-n' && args.length >= 3) {
      numLines = parseInt(args[1], 10);
      fileName = args[2];
    } else {
      fileName = args[0];
    }

    const currentPath = this.getState().fileSystem.currentPath;
    const fullPath = `${currentPath}/${fileName}`.replace(/\/+/g, '/');
    const content = await this.dispatch(this.fileSystemActions.readFile(fullPath)).unwrap();
    
    if (content === null) return `File not found: ${fileName}`;

    const lines = content.split('\n');
    return lines.slice(-numLines).join('\n');
  }
}

export default TailCommand;