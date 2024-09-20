import Command from './Command';

class LessCommand extends Command {
  execute(args) {
    if (args.length === 0) return 'Usage: less <filename>';
    const fileName = args[0];
    const content = this.fileSystem.readFile(fileName);
    
    if (content === null) return `File not found: ${fileName}`;
    
    return `Content of ${fileName}:\n\n${content}\n\n`;
  }
}

export default LessCommand;