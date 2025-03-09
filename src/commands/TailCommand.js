import Command from './Command';

class TailCommand extends Command {
  async execute(args) {
    if (args.length < 1) {
      return this.error('Usage: tail [-n <num>] <filename>', 2);
    }
    
    let numLines = 10;
    let fileName;

    if (args[0] === '-n' && args.length >= 3) {
      numLines = parseInt(args[1], 10);
      fileName = args[2];
    } else {
      fileName = args[0];
    }

    const content = await this.dispatch(this.fileSystemActions.readFile(fileName)).unwrap();
    
    if (content === null) {
      return this.error(`File not found: ${fileName}`, 1);
    }

    const lines = content.split('\n').slice(-numLines);
    return this.success(lines.join('\n'));
  }
}

export default TailCommand;