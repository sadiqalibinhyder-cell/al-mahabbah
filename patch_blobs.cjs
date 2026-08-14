const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const blobStart = content.indexOf('{/* Background Decorative Ambient Glow Blobs');
const navStart = content.indexOf('{/* Top Nav bar Desktop');

if (blobStart !== -1 && navStart !== -1) {
    content = content.substring(0, blobStart) + content.substring(navStart);
}

// Ensure bottom safe area is in tailwind by adding a plugin or utility in index.css
fs.writeFileSync('src/App.tsx', content);
console.log('patched blobs');
