const help = () => {
    return `
  Available commands:
    ls [path]                  - List files in the specified directory (default: current directory)
    cat <filename>             - Display the contents of a file (autocomplete only works on the current directory for now)
    whoami                     - Display information about the user
    write <filename> <content> - Create or overwrite a file with the specified content
    rm <filename>              - Delete the specified file
    clear                      - Clear the terminal screen
    upgrade                    - Upgrade your shell to the latest version (Switch to modern shell style)
    downgrade                  - Downgrade your shell to the first version (Switch to classic shell style)
    help                       - Display this help message
  
  Example usage:
    ls files
    cat files/about.md
    write files/note.txt This is a new note.
    rm files/note.txt
    upgrade
    downgrade
  `;
  };
  
  export default help;