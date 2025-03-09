import Command from './Command';

class GrepCommand extends Command {
  async execute(args) {
    if (args.length < 1) {
      return this.error('Usage: grep <pattern> [-f filename]', 2);
    }

    const pattern = args[0];
    let content;

    if (args.includes('-f')) {
      const fileIndex = args.indexOf('-f') + 1;
      if (fileIndex >= args.length) {
        return this.error('No filename provided after -f flag', 2);
      }
      const fileName = args[fileIndex];
      content = await this.dispatch(this.fileSystemActions.readFile(fileName)).unwrap();
      
      if (content === null) {
        return this.error(`File not found: ${fileName}`, 1);
      }
    } else {
      content = args[args.length - 1];
    }
    
    try {
      const regex = new RegExp(pattern, 'g');
      const matches = content.split('\n').filter(line => regex.test(line));
      return this.success(matches.length > 0 ? matches.join('\n') : 'No matches found');
    } catch (error) {
      return this.error(`Invalid regular expression: ${pattern}`, 1);
    }
  }
}

export default GrepCommand;