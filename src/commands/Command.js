class Command {
  constructor(fileSystemActions, dispatch, getState) {
      this.fileSystemActions = fileSystemActions;
      this.dispatch = dispatch;
      this.getState = getState;
  }

  async execute(args) {
    throw new Error('execute method must be implemented');
  }

  success(content) {
    return {
      code: 0,
      content: content
    };
  }

  error(message, code = 1) {
    return {
      code: code,
      content: `Error: ${message}`
    };
  }
}
  
export default Command;