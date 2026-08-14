const fs = require('fs');
let content = fs.readFileSync('src/components/RegistrationView.tsx', 'utf8');
const lines = content.split('\n');
lines.slice(25, 45).forEach(l => console.log(l));
