import Command from './Command';

class UpgradeCommand extends Command {
  execute(args) {
    return { 
      type: 'upgrade',
      code: 0, 
      content: 'Shell upgraded to modern style.' 
    };
  }
}

export default UpgradeCommand;