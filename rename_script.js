const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /Interview Experience GSMCOE Website/g, replace: 'Experio' },
  { regex: /Interview Experience \| GSMCOE/g, replace: 'Experio' },
  { regex: /\| Interview Experience/g, replace: '| Experio' },
  { regex: /Interview Experience GSMCOE/g, replace: 'Experio' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      // Special cases
      content = content.replace(/Verify your Email on Interview Experience/g, 'Verify your Email on Experio');
      content = content.replace(/Forgot Password on Interview Experience/g, 'Forgot Password on Experio');
      content = content.replace(/Welcome to Interview Experience/g, 'Welcome to Experio');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

const directoriesToProcess = [
  path.join(__dirname, 'client', 'src', 'pages'),
  path.join(__dirname, 'client', 'src', 'components'),
  path.join(__dirname, 'client', 'src', 'assets'),
  path.join(__dirname, 'server', 'services', 'mail'),
  path.join(__dirname, 'server', 'ai'),
  path.join(__dirname, 'server', 'modules'),
];

for (const dir of directoriesToProcess) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}
