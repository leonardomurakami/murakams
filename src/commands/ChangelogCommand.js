// WhoamiCommand.js
import Command from './Command';

const changelogContent = `
[17/09/2024]
- Initial release of this website
- Added basic commands and filesystem structure
- Added a simple markdown parser
    
[18/09/2024]
- Added a whole bunch of new commands
- Tried to improve the overall user experience
- Added more content to the filesystem
- Added autocomplete functionality

[19/09/2024]
- Broke the autocomplete functionality
- Installed popup virus

[20/09/2024]
- Fixed the autocomplete functionality

[26/09/2024]
- Improved how the filesystem is being used
- Added more commands
- Fixed a bunch of bugs
- Improved code efficiency
`;

class ChangelogCommand extends Command {
  execute(args) {
    return changelogContent;
  }
}

export default ChangelogCommand;