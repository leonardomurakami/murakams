import Command from './Command';

class ClearCommand extends Command {
  execute(args) {
    return { 
      type: 'clear',
      code: 0,
      content: '' 
    };
  }
}

export default ClearCommand;