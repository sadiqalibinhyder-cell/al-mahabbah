const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  'return item ? JSON.parse(item) : defaultValue;',
  'const parsed = item ? JSON.parse(item) : null;\n    return (parsed !== null && parsed !== undefined) ? parsed : defaultValue;'
);

fs.writeFileSync('src/data.ts', content);
console.log('patched data.ts');
