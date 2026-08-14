const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'controllers', 'postController.js');
let content = fs.readFileSync(filePath, 'utf8');

const target = '        ...post,';
const replacement = `        ...post,
        userId: post.isAnonymous ? { ...(post.userId || {}), username: "Anonymous User", profilePicture: "", _id: null } : post.userId,`;

content = content.split(target).join(replacement);

fs.writeFileSync(filePath, content);
console.log('Modified array returns in postController.js');
