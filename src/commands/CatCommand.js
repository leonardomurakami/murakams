import Command from './Command';

class CatCommand extends Command {
  async execute(args) {
    if (args.length === 0) {
      return this.error('Usage: cat <filename>', 2);
    }

    const path = args[0];
    const content = await this.dispatch(this.fileSystemActions.readFile(path)).unwrap();
    
    if (content === null) {
      return this.error(`File not found: ${path}`, 1);
    }

    return this.success(content);
  }
}

export default CatCommand;