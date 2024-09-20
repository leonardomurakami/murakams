import Command from './Command';

class FindCommand extends Command {
  async execute(args) {
    if (args.length < 1) return 'Usage: find [path] [-name pattern]';

    let path = this.getState().fileSystem.currentPath;
    let namePattern = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-name' && i + 1 < args.length) {
        namePattern = new RegExp(args[++i].replace(/\*/g, '.*').replace(/\?/g, '.'));
      } else if (!namePattern) {
        path = args[i];
      }
    }

    const results = await this.findRecursive(path, namePattern);
    return results.length > 0 ? results.join('\n') : 'No files found';
  }

  async findRecursive(path, namePattern) {
    const files = await this.dispatch(this.fileSystemActions.readDirectory(path)).unwrap();
    if (!files) return [];

    let results = [];

    for (const file of files) {
      const fullPath = `${path}/${file}`.replace(/\/+/g, '/');
      const isDirectory = file.endsWith('/');

      if (!namePattern || namePattern.test(file)) {
        results.push(fullPath);
      }

      if (isDirectory) {
        results = results.concat(await this.findRecursive(fullPath, namePattern));
      }
    }

    return results;
  }
}

export default FindCommand;