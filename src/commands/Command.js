class Command {
    constructor(fileSystemActions, dispatch, getState) {
        this.fileSystemActions = fileSystemActions;
        this.dispatch = dispatch;
        this.getState = getState;
    }
  
    execute(args) {
      throw new Error('execute method must be implemented');
    }
}
  
export default Command;