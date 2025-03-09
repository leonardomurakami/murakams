import Command from './Command';

class DowngradeCommand extends Command {
  execute(args) {
    return { 
      type: 'downgrade',
      code: 0, 
      content: 'Shell downgraded to classic style.' 
    };
  }
}

export default DowngradeCommand;