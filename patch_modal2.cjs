const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace('<label className="font-semibold text-neutral-400 block mb-0.5">Max Participants Per Team</label>', '<label className="font-semibold text-neutral-400 block mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden">Max Part.</label>');
content = content.replace('<label className="font-semibold text-neutral-400 block mb-0.5">Min Participants Per Team</label>', '<label className="font-semibold text-neutral-400 block mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden">Min Part.</label>');
content = content.replace('<label className="font-semibold text-neutral-400 block mb-0.5">Registration Deadline</label>', '<label className="font-semibold text-neutral-400 block mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden">Deadline</label>');
content = content.replace('rows={4}', 'rows={3}');
content = content.replace(/p-2\.5 rounded-xl border/g, 'p-1.5 sm:p-2 rounded-lg border');
content = content.replace('w-full px-2 py-1.5 text-xs rounded-lg bg-white/40', 'w-full px-2 py-1 text-xs rounded bg-white/40'); // For smaller padding

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('patched modal 2');
