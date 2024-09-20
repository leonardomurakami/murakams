import CatCommand from '../commands/CatCommand';
import LsCommand from '../commands/LsCommand';
import CdCommand from '../commands/CdCommand';
import PwdCommand from '../commands/PwdCommand';
import MkdirCommand from '../commands/MkdirCommand';
import TouchCommand from '../commands/TouchCommand';
import RmCommand from '../commands/RmCommand';
import WriteCommand from '../commands/WriteCommand';
import EchoCommand from '../commands/EchoCommand';
import GrepCommand from '../commands/GrepCommand';
import HeadCommand from '../commands/HeadCommand';
import TailCommand from '../commands/TailCommand';
import LessCommand from '../commands/LessCommand';
import MoreCommand from '../commands/MoreCommand';
import FindCommand from '../commands/FindCommand';
import WhoamiCommand from '../commands/WhoamiCommand';
import HelpCommand from '../commands/HelpCommand';
import ClearCommand from '../commands/ClearCommand';
import UpgradeCommand from '../commands/UpgradeCommand';
import DowngradeCommand from '../commands/DowngradeCommand';

class CommandFactory {
    constructor(fileSystemActions, dispatch, getState) {
      this.fileSystemActions = fileSystemActions;
      this.dispatch = dispatch;
      this.getState = getState;
    }

  getCommand(commandName) {
    switch (commandName.toLowerCase()) {
      case 'cat': return new CatCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'ls': return new LsCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'cd': return new CdCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'pwd': return new PwdCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'mkdir': return new MkdirCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'touch': return new TouchCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'rm': return new RmCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'write': return new WriteCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'echo': return new EchoCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'grep': return new GrepCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'head': return new HeadCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'tail': return new TailCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'less': return new LessCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'more': return new MoreCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'find': return new FindCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'whoami': return new WhoamiCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'help': return new HelpCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'clear': return new ClearCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'upgrade': return new UpgradeCommand(this.fileSystemActions, this.dispatch, this.getState);
      case 'downgrade': return new DowngradeCommand(this.fileSystemActions, this.dispatch, this.getState);
      default:
        throw new Error(`Command not found: ${commandName}`);
    }
  }
}

export default CommandFactory;