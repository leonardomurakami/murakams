import Command from './Command';

class LessCommand extends Command {
  async execute(args) {
    if (args.length === 0) {
      return this.error('Usage: less <filename>', 2);
    }

    const fileName = args[0];
    const content = await this.dispatch(this.fileSystemActions.readFile(fileName)).unwrap();
    
    if (content === null) {
      return this.error(`File not found: ${fileName}`, 1);
    }
    
    return this.success(`Content of ${fileName}:\n\n${content}\n\n`);
  }
}

export default LessCommand;