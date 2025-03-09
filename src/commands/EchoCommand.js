import Command from './Command';

class EchoCommand extends Command {
  execute(args) {
    return this.success(args.join(' '));
  }
}

export default EchoCommand;