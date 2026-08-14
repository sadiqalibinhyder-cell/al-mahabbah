const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace('<option value="A">A (Higher weightage)</option>', '<option value="A">A (High)</option>');
content = content.replace('<option value="B">B (Standard weightage)</option>', '<option value="B">B (Std)</option>');
content = content.replace('<option value="Stage">Stage Performances</option>', '<option value="Stage">Stage</option>');
content = content.replace('<option value="Off-Stage">Off-Stage Creations</option>', '<option value="Off-Stage">Off-Stage</option>');
content = content.replace('<option value="Group">Group Event</option>', '<option value="Group">Group</option>');

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('patched selects');
