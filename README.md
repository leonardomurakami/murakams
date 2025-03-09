# Murakams Terminal Website

A retro terminal-style personal website with interactive commands, filesystem simulation, and nostalgic Windows 98-style popups. Live at [murakams.com](https://murakams.com).

## Features

- Full terminal emulation with 20+ Unix-like commands
- Persistent virtual filesystem with file operations
- Command history and tab completion
- CRT screen effect with scanlines and RGB shift
- Windows 98-style popup windows
- Toggleable modern/classic UI modes

## Commands

Core commands include:
```bash
ls          # List directory contents
cat         # View file contents
cd          # Change directory
write       # Create/edit files
rm          # Remove files
whoami      # View profile information
help        # List all available commands
```

Use `help` for the complete command list.

## Tech Stack

- React
- Redux Toolkit for state management
- Styled Components for styling
- React-PowerGlitch for CRT effects
- React-Rnd for draggable windows

## Development

1. Clone the repository:
```bash
git clone https://github.com/leonardomurakami/murakams
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

## Project Structure

```
src/
  ├── components/      # React components
  ├── commands/        # Terminal command implementations
  ├── redux/          # Redux store and slices
  ├── constants/      # Global constants
  └── utils/          # Helper functions
```

## Core Components

- `Shell.js`: Main terminal interface
- `CommandLine.js`: Command input handling
- `FileSystem.js`: Virtual filesystem management
- `CRTEffect.js`: Retro display effects
- `PopupWindow.js`: Windows 98-style windows

## Contributing

Feel free to submit issues and pull requests.

## License

MIT License

## Author

Leonardo Murakami - [GitHub](https://github.com/leonardomurakami) | [LinkedIn](https://linkedin.com/in/leonardo-murakami)