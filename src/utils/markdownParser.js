const parseMarkdown = (markdown) => {
    const lines = markdown.split('\n');
    let output = [];
  
    const colorCodes = {
      h1: '\x1b[1;33m', // Bold Yellow
      h2: '\x1b[1;36m', // Bold Cyan
      h3: '\x1b[1;32m', // Bold Green
      bold: '\x1b[1m',
      reset: '\x1b[0m'
    };
  
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        output.push(`${colorCodes.h1}${line.substring(2)}${colorCodes.reset}`);
      } else if (line.startsWith('## ')) {
        output.push(`${colorCodes.h2}${line.substring(3)}${colorCodes.reset}`);
      } else if (line.startsWith('### ')) {
        output.push(`${colorCodes.h3}${line.substring(4)}${colorCodes.reset}`);
      } else if (line.startsWith('- ')) {
        output.push(`  • ${line.substring(2)}`);
      } else {
        // Handle bold text
        let boldText = line.replace(/\*\*(.*?)\*\*/g, `${colorCodes.bold}$1${colorCodes.reset}`);
        output.push(boldText);
      }
    });
  
    return output.join('\n');
};
  
export default parseMarkdown;