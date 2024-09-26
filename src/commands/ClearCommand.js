import Command from './Command';

class ClearCommand extends Command {
  execute(args) {
    return { type: 'clear', content: '' };
  }
}

export default ClearCommand;