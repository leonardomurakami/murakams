import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ROOT_PATH,
  AVAILABLE_COMMANDS,
} from '../constants';

const createNode = (name, content = null, isDirectory = false) => ({
  name,
  content,
  isDirectory,
  children: isDirectory ? {} : null,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
});

const initialState = {
  root: {
    name: ROOT_PATH,
    isDirectory: true,
    children: {
      synced:{
        name: 'synced',
        isDirectory: true,
        children:{
            'welcome.txt': createNode('welcome.txt', 'Welcome to my terminal portfolio! Type "help" to see available commands.'),
            'about.md': createNode('about.md', `# About Me
Hello! I'm Leonardo Murakami, a Site Reliability Engineer passionate about technology and always eager to learn new things.

## Skills
- JavaScript (React, Node.js)
- Python
- Go
- SQL
- DevOps practices
- AWS, K8s, Docker, Terraform

## Interests
- 🌐 Technology Enthusiast
- 📊 Data Science and Machine Learning
- 🐐 Studying goat farming

Feel free to explore my files using the \`ls\` and \`cat\` commands!  
            `),
            'projects.md': createNode('projects.md', 'Just like all my projects, this file is #TODO'),
            'saved_email.txt': createNode('saved_email.txt', `From: it@murakams.com
To: all-employees@company.com
Subject: WHO OPENED POPUPS *INSIDE* OUR SERVERS???

Dear Colleagues (if I can even call you that right now),

I hope this email finds you well, AND THOROUGHLY ASHAMED!

I've just spent the last 72 hours in a Kafka-esque nightmare, trying to figure out why our servers were running slower than a sloth swimming through molasses. And what did I discover? POPUPS. INSIDE THE SERVERS. I didn't even know that was possible!

Someone (AND BELIEVE ME, I WILL UNCOVER YOUR IDENTITY) apparently thought it would be hilarious to open every single popup ad in existence... INSIDE. OUR. SERVERS. Our poor hardware is now more clogged than a drain at a barbershop!

We've got flashing banners for discount mops in our RAM, spinning wheels promising free iPods in our CPUs, and a virtual used car salesman trying to sell a 1998 Honda Civic to our network switches. 

Here's what's going to happen:

1. The perpetrator will come forward. Not in an hour. Not after you've finished your popcorn. NOW.
2. You will explain to me, in excruciating detail, how you managed to open popups inside a server. I'm equal parts furious and impressed.
3. You will then close every. Single. Popup. By hand. Yes, even the ones that say "You can't close me! ;)"

If no one confesses, I will be forced to assume it was a group effort, and I swear on all that is holy in Silicon Valley, I will replace our entire IT infrastructure with a room full of carrier pigeons and abacuses. Don't test me on this.

Remember, I can see everything that happens on our network. I know who's been trying to download more gigahertz. It's only a matter of time before I trace these popups back to the source.

In conclusion, our servers are for processing data, not for testing how many "Congratulations! You've won!" messages can fit in a CPU cache. That's what your personal phones are for.

Exasperatedly yours,
Your Friendly (but currently questioning reality) IT Department

P.S. If anyone needs me, I'll be in the server room, trying to click the tiny 'x' on a popup selling beachfront property in Nebraska... that somehow appeared in our RAID controller.
  `),
            'contact.json': createNode('contact.json', JSON.stringify({
                email: "contato@murakams.com",
                linkedin: "https://linkedin.com/in/leonardo-murakami",
                github: "https://github.com/leonardomurakami"
            }, null, 2)),
            'skills.txt': createNode('skills.txt', `Technical Skills:
  - Programming: JavaScript, Python, Go, SQL
  - Web Technologies: React, Node.js, HTML, CSS (not so much)
  - DevOps: Docker, Kubernetes, Jenkins
  - Cloud Platforms: AWS, Google Cloud Platform (not so much)
  - Monitoring: Prometheus, Grafana, ELK Stack
  - Version Control: Git
  - Databases: PostgreSQL, Redis, MariaDB/MySQL, MongoDB (not so much)
  - Infrastructure as Code: Terraform, Ansible
  - Operating Systems: Linux (Ubuntu, CentOS), macOS, Windows (lol)`),
            'hobbies.md': createNode('hobbies.md', `# Hobbies and Interests
  1. 📚 Doomscrolling instagram reels
  2. 🏋️ Gym and staying active
  5. 🌱 Where is 3 and 4?
  6. 🧘 Going insane over how to apply a CRT Effect to this website
  7. 🎮 Occasional gaming to unwind
  8. 🐐 Researching sustainable farming practices`),
            'why-goat-farming.txt': createNode('why-goat-farming.txt', `You don't have to monitor the utilization on a goat.
Milk a goat and the goat stays milked for a while.
There are no 32-bit goats.
You don't have to do a demo on a goat. And if you ever do, the goat will do what it's supposed to do and there's not a lot that can keep it from doing it.
When a goat goes "down", you just bury it and buy a new goat.
Left alone, Billy goats and Nanny goats do what they're supposed to do. You don't need to format them, monitor them, be on-call for them, step, trace or inspect registers.
Nobody cares if you're not a Certified Goat Engineer yet.
Kill a goat to make a goat steak, and the goat stays dead.
Most people will take advice from a goat farmer on how to paint a fence, cook a steak, fix a tractor, etc. but most people somehow just don't want to hear it from a computer weenie.
Nobody can lie in a job interview about their goat experience.
Goats don't page you.
When it comes to "software" (food), EVERYTHING is compatible with a goat.
You don't need to buy a "goat 98" to fix all the bugs in your goat 95
You can tell whether a goat has been "debugged" by looking at it.
Goats don't become obsolete. If they do, as long as you didn't neuter them, they make the necessary upgrades themselves.
No commute.
Goats are kind of cute. Computers aren't cute unless they're Macintoshes, and those are just plain annoying.
No dress code. Of any kind. EVER.
You always have the right "file permissions" to milk a goat.
If a goat gives too many timeout errors, or does not avail you resources for your session, or if performance is generally slow for your applications on your goat, it just means you're having goat steak for dinner.
You don't need to visit "shareware dot com" to get some tools to milk a goat. You either have your bucket or you don't.
The bucket leaks, or it doesn't. You do not need to ask a network if you're still the owner of the bucket. You do not need to run a bucket compare against a copy you made of the bucket previously You couldn't care less about the checksum of the bucket.
You don't need to "free up some megs" before you milk a goat.
You get callouses on your hands - the way God intended!
You don't need to call a staff meeting to make sure everyone's milking goats the same way.
Nanny goats, with no TCP/IP stack loaded, and no DLC, still give milk.
Just about any barnyard animal is fault tolerant (except some cows).
You don't need to sign in with the front desk if you need to milk a goat on a weekend. You don't need to use a badge to open a front gate. If you find an empty coffee pot burning on the machine on a Saturday, you just yell at your wife.
You don't need to worry if you've been spending a lot of time milking what you will later find out to have been an improperly labelled "development goat".
There is no such thing as a "preferred goat," and your "goat context" is always correct. Passwords do not exist and your milking/slaughtering account will never be disabled because of intruder detection.
Carpal tunnel is guaranteed. Don't worry about it.
A goat has all the "patches" it will ever need. If it doesn't it just means you're having goat steak for dinner.
Goats that become full do an automatic "core dump" but they take care of getting themselves reset and on-line. You just have to clean up. You do not need to worry about defragmenting or compressing the goat. The goat does not have to be zipped, archived or converted to Goat-32.
As long as the stable hasn't caught fire, a goat couldn't care less about a power surge.
Goats don't have to be backed up at night.
Each and every one of the parts of a goat use the same interrupt, and the goat works just fine anyway.
A goat is a goat is a goat.
You don't EVER restart a goat. You do shut them down sometimes and it's the first step in many of your recipes.
Nobody ever needed to draft up a goat-milking requirements document.
You deliver applications to goats. Goats do not deliver applications to you.
A goat will do practically anything do get more comfortable. Computers have been known to display the same error message over and over again, all day, without regard to how frequently or how hard the monitor has been hit, slapped, punched or kicked.
You don't have to log off of a goat and listen to some silly "Exit Goat" sound effect for the next several minutes.
You won't find out from your next phone bill that you milked your goat too much for your budget.
On a goat, the SYS$ERR.LOG file is ALWAYS EMPTY.
Operating systems come & go, but goats will probably never be "orphaned" as they are expected to be produced by their manufacturer for quite some time to come.
There are no workstation licensing issues with goats.
You don't get in trouble for milking a goat during business hours, and nobody cares if you reformat it.
If it's late and you have a lot of goat-milking to do, at least you can see your kids before they have to go to bed. You can probably even make them help you milk your goats.
You don't need 32 megs of RAM to get started milking your goat.
Goat security is applied completely, thoroughly, and with all the features you'll ever need, using a stake and a rope.
Nobody ever got a general protection fault milking a goat.
You don't need to worry about your whole goat herd locking up if you put an ethernet goat and a token-ring goat together in the same stable.
You don't name goats. If you do name goats, you can give two or more goats the same name and this will not interfere with your ability to access any of the goats.
Your kids will not meet some pervert who wants to buy them a bus ticket when they play with a goat.
There is no closely-watched dispute between Microsoft and any competitor, over who will dominate the goat-milking product industry. You will probably never be asked to check-mark a box that says, Make this my default goat-milking bucket.
You do not want, need, or desire in any way for goats to run at a higher clock speed. And they don't.
You do not need to use a wrist strap to ground yourself before milking, and there's never a need to put your goat in a little plastic baggie. Unless making goat steak
There really aren't too many ways to improperly shut down a goat.
Surrounded by a room full of younger goat farmers, you don't need to worry about dating yourself talking about 300-baud or 4.7-Mhz goats.
y2k.
You do not need to buy anything to "uninstall" a goat. Maybe a gun or a knife.
Once you've filled a bucket with goat milk, the goat can crash and it doesn't matter whether you've "saved" or not. Just don't spill.
When you buy a new goat, the goat does not need to re-write registry keys on the farm that could have unforeseen effects on the other animals already residing there.
There are no easter eggs in a goat.
Your wife will never yell at you for removing all of the RAM from her goat.
You never need to learn Goat 2000, Goat Perfect 8, or Goat 123
You don't need an Internal IPX Address to boot a Goat.
Goats don't need a per-bucket license.
You will never spend 4 hours upgrading a goat over the wire.
There is no Goat Ops.
Goats follow upgrade procedures.
Goats eat org charts.
If a goat gets an uncleanable virus, you shoot it.
If a goat has a non-terminal virus it just does the poo-poo.
Goats don't need pagers and never get a 'please advise'.
Goats don't have to worry about whether or not it's Calcomp.
A goat farmer doesn't care if people can't remotely access his herd.
No MHN Goat herd.
No one gives a rat's ass if the goats aren't talking to each other.
Ever heard of a proprietary goat?
No goat analysis meetings.
No goat control meetings.
No meetings.
Goats will never need service pack 4.
No DS problems at GOATADRIVE.
You fuck the goat, he doesn't fuck you and the whole department.
A goat might bite you in the ass, but he won't fuck you.
Fuck Y2K.
Goats don't ever ask stupid questions.
Goats don't drive technology dollars away from your automobile lusts.
If a goat takes a "dump" in the middle of the night, you take care of it when you damn well feel like it.
Nobody will fire you for connecting "diskless goats" into a "goat server" when they think you should have purchased a massive mainframe goat to connect to a multitude of inexpensive "dumb goats".
ISO is not publishing any standards about how you should be farming your goats.
Counting from zero instead of one, doesn't apply to anything goat farmers do and looks stupid. Hexadecimal is unheard of.
When you sell a goat, you don't need to export it to a format that will be understood by the buyer's ancient goat-reading software.
All your stuff will still work when you buy your 100th goat, and your 256th goat, and your 65,536th goat...
People don't walk up to goat farmers at parties and whine about how they just got a French Alpine and don't know how to milk it.
Nobody can go through your goat and get you in trouble for what they find in there.
You don't have to administer a "user acceptance test" when you deliver goat cheese.
You don't need any special utilities to delete a goat that is not empty.
You don't need or want goats on your desktop, or shortcuts to goats on your desktop. Most goat farmers don't have desktops.
Nothing a goat farmer does requires a mouse. If you have mice you get a cat.
Goat farmer error messages: Goat not found; Goat dead; Goat not awake; Too soon after last milking; Billy goat detected. That's about all. You don't need silly numbers for these, and you don't need to look them up anywhere or check them out at goat.com.
There are no read-only oats. There are no hidden or system goats.
You don't need to mail anyone a core dump from a goat to fix a problem. The only time you would do this is to CAUSE a problem.
A goat that doesn't know what time it is will work just fine.
A goat that is not Y2K compliant will simply think it's not Y2K. This is doesn't even require documentation.
If your spouse doesn't authorize the purchase of a new goat, you simply encourage your goats to make one from existing parts.
A goat doesn't have enough fingers to press <shift><Shift><Ctrl><Alt><Esc>
Goats don't argue about it being another goats problem. They just kick each others ass.
If a goat had to document every time it took a shit, we would be out of forests.
Goats don't give a shit about email.
The only way a goat can deliver an 'application' is through it's ass.
Goats can't get there benefits revoked they are just made into goat steaks for dinner.
A goat farmer doesn't have to provide documentation on his goat's ablility to produce milk after the year 2000.
GoatEng.
Macintosh goat users will not make fun of you because your goat is more problematic & complicated than the goat they just bought.
Goat farmers who voted for Perot have pretty much the same type of goat as everyone else, so they can go back to arguing about politics like they were doing before 1984.
  `)
        }
      }
    },
  },
  currentPath: ROOT_PATH,
};

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = normalizePath(action.payload);
    },
    createFile: (state, action) => {
      const { path, name, content } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && node.isDirectory) {
        node.children[name] = createNode(name, content);
      }
    },
    createDirectory: (state, action) => {
      const { path, name } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && node.isDirectory) {
        node.children[name] = createNode(name, null, true);
      }
    },
    deleteNode: (state, action) => {
      const { path } = action.payload;
      const parentPath = path.split('/').slice(0, -1).join('/');
      const name = path.split('/').pop();
      const parentNode = getNodeAtPath(state.root, parentPath);
      if (parentNode && parentNode.isDirectory) {
        delete parentNode.children[name];
      }
    },
    updateFileContent: (state, action) => {
      const { path, content } = action.payload;
      const node = getNodeAtPath(state.root, path);
      if (node && !node.isDirectory) {
        node.content = content;
        node.modifiedAt = new Date().toISOString();
      }
    },
  },
});

// Thunks
const getNodeAtPath = (root, path) => {
  const parts = path.split('/').filter(Boolean);
  let node = root;
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
};

const normalizePath = (pathStr) => {
  const parts = pathStr.split('/').filter(Boolean);
  const stack = [];
  for (const part of parts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
};

export const getAutocompleteSuggestions = createAsyncThunk(
  'fileSystem/getAutocompleteSuggestions',
  async (input, { getState }) => {
    const state = getState().fileSystem;
    const tokens = input.trim().split(/\s+/);

    // Command suggestions
    if (tokens.length === 1 && !input.endsWith(' ')) {
      const partialCommand = tokens[0] || '';
      return AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(partialCommand));
    }

    // File/directory suggestions
    let lastToken = tokens[tokens.length - 1];
    if (input.endsWith(' ')) {
      lastToken = '';
    }

    // Resolve the partial path
    const currentPath = state.currentPath;
    let fullPath = lastToken.startsWith('/')
      ? lastToken
      : `${currentPath}/${lastToken}`;
    fullPath = fullPath.replace(/\/+/g, '/');

    // Normalize the path
    fullPath = normalizePath(fullPath);

    // Separate the directory path and the partial file/directory name
    const lastSlashIndex = fullPath.lastIndexOf('/');
    const dirPath =
      lastSlashIndex >= 0 ? fullPath.substring(0, lastSlashIndex) || '/' : '/';
    const partial = fullPath.substring(lastSlashIndex + 1);

    const node = getNodeAtPath(state.root, dirPath);
    if (node && node.isDirectory) {
      // Filter and format the suggestions
      const suggestions = Object.keys(node.children)
        .filter((name) => name.startsWith(partial))
        .map((name) => {
          const childNode = node.children[name];
          // Only add trailing slash for directories
          return childNode.isDirectory ? `${name}/` : name;
        });

      // If we're in a subdirectory and the lastToken doesn't start with '/', add ".." as a suggestion
      if (dirPath !== '/' && partial === '' && !lastToken.startsWith('/')) {
        suggestions.unshift('..');
      }

      return suggestions;
    }

    return [];
  }
);

export const changeDirectory = createAsyncThunk(
  'fileSystem/changeDirectory',
  (path, { getState, dispatch }) => {
    const state = getState().fileSystem;
    let targetPath = path.startsWith('/')
      ? path
      : `${state.currentPath}/${path}`;
    targetPath = normalizePath(targetPath);
    const node = getNodeAtPath(state.root, targetPath);
    if (node && node.isDirectory) {
      dispatch(setCurrentPath(targetPath));
      return true;
    }
    return false;
  }
);

export const readDirectory = createAsyncThunk(
  'fileSystem/readDirectory',
  (path, { getState }) => {
    const state = getState().fileSystem;
    let targetPath;

    if (!path || path === '.') {
      targetPath = state.currentPath;
    } else if (path.startsWith('/')) {
      targetPath = path;
    } else {
      targetPath = `${state.currentPath}/${path}`;
    }

    targetPath = normalizePath(targetPath);

    const node = getNodeAtPath(state.root, targetPath);
    if (node && node.isDirectory) {
      return Object.keys(node.children).map(name =>
        node.children[name].isDirectory ? `${name}/` : name
      );
    }
    return null;
  }
);

export const readFile = createAsyncThunk(
  'fileSystem/readFile',
  (path, { getState }) => {
    const state = getState().fileSystem;
    let targetPath;

    if (path.startsWith('/')) {
      targetPath = path;
    } else {
      targetPath = `${state.currentPath}/${path}`;
    }
    targetPath = normalizePath(targetPath);

    const node = getNodeAtPath(state.root, targetPath);
    if (node && !node.isDirectory) {
      return node.content;
    }
    return null;
  }
);

export const { setCurrentPath, createFile, createDirectory, deleteNode, updateFileContent } = fileSystemSlice.actions;

export default fileSystemSlice.reducer;