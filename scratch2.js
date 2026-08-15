const fs = require('fs');
let content = fs.readFileSync('client/src/assets/images/icons/arrow-Photoroom.svg', 'utf8');

// Remove XML declaration
content = content.replace(/<\?xml.*?\?>/i, '');

// Add viewBox if missing, and remove hardcoded width/height
if (!content.includes('viewBox=')) {
  content = content.replace(/<svg(.*?)width=\"(\d+)\" height=\"(\d+)\"/, '<svg$1viewBox="0 0 $2 $3" width="100%" height="100%"');
}

fs.writeFileSync('client/src/assets/images/icons/arrow-Photoroom.svg', content.trim());
console.log('Fixed SVG tags.');
