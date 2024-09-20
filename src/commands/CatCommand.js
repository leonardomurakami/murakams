import Command from './Command';

class CatCommand extends Command {
  async execute(args) {
    if (args.length === 0) return 'Usage: cat <filename>';
    const path = args[0];
    const content = await this.dispatch(this.fileSystemActions.readFile(path)).unwrap();
    return content !== null ? content : `File not found: ${path}`;
  }
}

export default CatCommand;