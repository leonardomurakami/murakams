import parseMarkdown from '../utils/markdownParser';

const whoamiContent = `
# Leonardo Murakami

## Site Reliability Engineer

- 🌐 Technology Enthusiast
- 📊 Likes to dabble into general programming, technologies, etc. studies
- 🐐 Studying goat farming (\`cat default/why-goat-farming.txt\`)

### Skills (rating out of 5)
- Go                          (****-)
- Python                      (*****)
- SQL                         (****-)
- Kubernetes, Docker          (*****)
- AWS, GCP                    (*****)
- Terraform                   (*****)
- JavaScript (React, Node.js) (**---)

### Contact
- 📧 Email: contato@murakams.com
- 🔗 LinkedIn: [linkedin.com/in/leonardo-murakami](https://linkedin.com/in/leonardo-murakami)
- 🐙 GitHub: [github.com/leonardomurakami](https://github.com/leonardomurakami)

Feel free to explore my (non-existent) projects using the \`ls\` and \`cat\` commands!
`;

const whoami = () => {
  return parseMarkdown(whoamiContent);
};

export default whoami;