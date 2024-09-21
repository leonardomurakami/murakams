// File System Constants
export const ROOT_PATH = '/';

// User Information
export const DEFAULT_USER = 'user';
export const DEFAULT_HOST = 'murakams';

// Command List
export const AVAILABLE_COMMANDS = [
  'ls', 'cd', 'cat', 'pwd', 'mkdir', 'touch', 'rm', 'write', 'echo', 'grep',
  'head', 'tail', 'find', 'help', 'clear', 'upgrade', 'downgrade', 'whoami'
];

// Shell Style
export const DEFAULT_SHELL_STYLE = false;

// Colors
export const PROMPT_COLOR = '#0f0';
export const TEXT_COLOR = '#0f0';
export const BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.9)';
export const MODERN_BACKGROUND = 'linear-gradient(45deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.9))';

// Fonts
export const MODERN_FONT = "'Fira Code', 'Courier New', monospace";
export const CLASSIC_FONT = "'Courier New', monospace";

// Popup Generator
export const POPUP_INTERVAL = 5000;
export const MAX_POPUPS = 5;
export const POPUP_PROBABILITY = 0.3;