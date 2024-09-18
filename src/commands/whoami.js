import parseMarkdown from '../utils/markdownParser';

const whoamiContent = `
# Leonardo Murakami

## Site Reliability Engineer

- 🌐 Technology Enthusiast
- 📊 Likes to dabble into Data Science and Machine Learning studies
- 🐐 Studying goat farming 

### Skills
- JavaScript (React, Node.js)
- Python
- SQL
- DevOps

### Contact
- 📧 Email: contato@murakams.com
- 🔗 LinkedIn: [linkedin.com/in/leonardo-murakami](https://linkedin.com/in/leonardo-murakami)
- 🐙 GitHub: [github.com/leonardomurakami](https://github.com/leonardomurakami)

Feel free to explore my projects using the \`ls\` and \`cat\` commands!
`;

const whoami = () => {
  return parseMarkdown(whoamiContent);
};

export default whoami;