const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'pages', 'PostForm.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { regex: /bg-green-600/g, replace: 'bg-primary' },
  { regex: /bg-green-100/g, replace: 'bg-primary/20' },
  { regex: /bg-green-50/g, replace: 'bg-primary/10' },
  { regex: /text-green-700/g, replace: 'text-primary' },
  { regex: /text-green-600/g, replace: 'text-primary' },
  { regex: /text-green-900/g, replace: 'text-primary' },
  { regex: /hover:text-green-700/g, replace: 'hover:text-primary/80' },
  { regex: /hover:text-green-900/g, replace: 'hover:text-primary/80' },
  { regex: /border-green-600/g, replace: 'border-primary' },
  { regex: /border-green-500/g, replace: 'border-primary' },
  { regex: /hover:bg-green-700/g, replace: 'hover:bg-primary/90' },
  { regex: /focus:border-green-500/g, replace: 'focus:border-primary' },
  { regex: /focus:ring-green-500/g, replace: 'focus:ring-primary' },
  { regex: /focus:ring-green-300/g, replace: 'focus:ring-primary/30' },
  { regex: /ring-green-300/g, replace: 'ring-primary/30' }
];

for (const { regex, replace } of replacements) {
  content = content.replace(regex, replace);
}

fs.writeFileSync(filePath, content);
console.log('Replaced green with primary in PostForm.jsx');
