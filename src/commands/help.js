const help = () => {
  return `
Available commands:
  ls [path]                  - List files in the specified directory (default: current directory)
  cat <filename>             - Display the contents of a file
  whoami                     - Display information about the user
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
  chmod <mode> <file>        - Change file mode (simulated)
  chown <owner> <file>       - Change file owner (simulated)
  help                       - Display this help message

Special features:
  >> : Output redirection (append)
    Example: echo "Hello" >> file.txt

Example usage:
  ls /documents
  cat /documents/note.txt
  write /documents/new_note.txt This is a new note.
  rm /documents/old_note.txt
  cd /documents
  pwd
  touch new_file.txt
  echo Hello, World!
  grep "important" note.txt
  head -n 5 long_file.txt
  tail -n 10 log_file.txt
  find / -name "*.txt"
`;
};

export default help;