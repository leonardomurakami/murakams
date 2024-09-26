import Command from './Command';

class DowngradeCommand extends Command {
  execute(args) {
    return { 
      type: 'downgrade', 
      content: 'Shell downgraded to classic style.' 
    };
  }
}

export default DowngradeCommand;