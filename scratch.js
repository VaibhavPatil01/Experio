const fs = require('fs');
let content = fs.readFileSync('client/src/assets/images/icons/arrow-Photoroom.svg', 'utf8');
const regex = /fill=\"#([0-9a-fA-F]{6})\"/gi;
let modified = content.replace(regex, (match, hex) => {
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  if (r > 200 && g > 200 && b > 200) {
    return match;
  }
  return 'fill="currentColor"';
});
fs.writeFileSync('client/src/assets/images/icons/arrow-Photoroom.svg', modified);
console.log('SVG updated.');
