import Command from './Command';

class UpgradeCommand extends Command {
  execute(args) {
    return { 
      type: 'upgrade', 
      content: 'Shell upgraded to modern style.' 
    };
  }
}

export default UpgradeCommand;