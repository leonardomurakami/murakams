import Command from './Command';

const helpText = `
Available commands:
  whoami                     - Display information about the owner
  changelog                  - Display the changelog
  ls [path]                  - List files in the specified directory (default: current directory)
  cat <filename>             - Display the contents of a file
  write <filename> <content> - Create or overwrite a file with the specified content
  rm <filename>              - Delete the specified file
  clear                      - Clear the terminal screen
  upgrade                    - Upgrade your shell to the latest version (Switch to modern shell style)
  downgrade                  - Downgrade your shell to the first version (Switch to classic shell style)
  cd <directory>             - Change the current directory
  mkdir <directory>          - Create a new directory
  pwd                        - Print the current working directory
  touch <filename>           - Create a new file or update the timestamp of an existing file
  echo <text>                - Display a line of text
  grep <pattern> <filename>  - Search for a pattern in a file
  head [-n <num>] <filename> - Display the first part of a file
  tail [-n <num>] <filename> - Display the last part of a file
  less <filename>            - View file content with pagination
  more <filename>            - View file content with pagination
  find <path> -name <pattern> - Search for files in a directory hierarchy
  help                       - Display this help message

Special features:
  >> : Output redirection (append)
  >  : Output redirection (overwrite)
  |  : Pipe output to next command
  && : Execute next command only if current succeeds
  || : Execute next command only if current fails

Return codes:
  0: Success
  1: General error
  2: Usage error
  127: Command not found
`;

class HelpCommand extends Command {
  execute(args) {
    return this.success(helpText);
  }
}

export default HelpCommand;