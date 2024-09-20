import Command from './Command';

class LsCommand extends Command {
  async execute(args) {
    let path = this.getState().fileSystem.currentPath;
    let showHidden = false;
    let longFormat = false;

    args.forEach(arg => {
      if (arg === '-a' || arg === '--all') showHidden = true;
      else if (arg === '-l') longFormat = true;
      else path = arg;
    });
    const files = await this.dispatch(this.fileSystemActions.readDirectory(path)).unwrap();

    if (!files) return `Directory not found: ${path}`;

    let output = files
      .filter(file => showHidden || !file.startsWith('.'))
      .map(file => {
        if (longFormat) {
          const permissions = file.endsWith('/') ? 'drwxr-xr-x' : '-rw-r--r--';
          const owner = 'user';
          const group = 'group';
          const size = '4096';
          const date = new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit'
          });
          return `${permissions} 1 ${owner} ${group} ${size.padStart(8)} ${date} ${file}`;
        }
        return file;
      });
    if (output.length > 0){
        return output.join('\n');
    }
    return ' ';
  }
}

export default LsCommand;