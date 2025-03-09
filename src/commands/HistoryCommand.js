import Command from './Command';

class HistoryCommand extends Command {
  execute(args) {
    const history = this.getState().command.history;
    
    if (history.length === 0) {
      return this.success('No commands in history');
    }

    const output = history
      .map((cmd, index) => `${(index + 1).toString().padStart(4)}  ${cmd}`)
      .join('\n');
    
    return this.success(output);
  }
}

export default HistoryCommand;