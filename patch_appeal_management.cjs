const fs = require('fs');
let content = fs.readFileSync('src/components/AppealManagement.tsx', 'utf8');

const target = `            <form onSubmit={handleSubmit} className="space-y-4 text-xs">`;
const replacement = `            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/AppealManagement.tsx', content);
  console.log("Patched AppealManagement form successfully");
} else {
  console.log("Target not found!");
}
