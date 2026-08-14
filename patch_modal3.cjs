const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

let formStart = content.indexOf('<form onSubmit={handleProgFormSubmit}');
let formEnd = content.indexOf('</form>', formStart);
let formStr = content.substring(formStart, formEnd);
formStr = formStr.replace(/px-2 py-1\.5 text-xs rounded-lg/g, 'px-2 py-1 text-xs rounded');
formStr = formStr.replace(/px-2 py-1 text-xs rounded bg-white\/40/g, 'px-2 py-1 text-xs rounded bg-white/40');
formStr = formStr.replace(/px-2 py-1\.5/g, 'px-2 py-1');

content = content.substring(0, formStart) + formStr + content.substring(formEnd);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('patched modal 3');
