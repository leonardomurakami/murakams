import Command from './Command';

class EchoCommand extends Command {
  execute(args) {
    return args.join(' ');
  }
}

export default EchoCommand;