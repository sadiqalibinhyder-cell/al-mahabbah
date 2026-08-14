const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace(
  '<form onSubmit={handleProgFormSubmit} className="p-6 space-y-4 text-xs text-neutral-800 dark:text-neutral-100">',
  '<form onSubmit={handleProgFormSubmit} className="p-4 sm:p-5 space-y-3 text-xs text-neutral-800 dark:text-neutral-100">'
);

content = content.replace(
  '<div className="grid grid-cols-2 gap-4">',
  '<div className="grid grid-cols-2 gap-3">'
);

// replace all "px-3 py-2" inside this form with "px-2.5 py-1.5"
// Actually, it's safer to target the specific blocks.
let formStart = content.indexOf('<form onSubmit={handleProgFormSubmit}');
let formEnd = content.indexOf('</form>', formStart);

let formStr = content.substring(formStart, formEnd);
formStr = formStr.replace(/px-3 py-2/g, 'px-2 py-1.5 text-xs');
formStr = formStr.replace(/grid grid-cols-3 gap-4/g, 'grid grid-cols-3 gap-2 sm:gap-3');
formStr = formStr.replace(/grid grid-cols-2 sm:grid-cols-3 gap-3/g, 'grid grid-cols-3 gap-2');
formStr = formStr.replace(/mb-1/g, 'mb-0.5');
formStr = formStr.replace(/mb-2 text-sm/g, 'mb-1 text-xs');
formStr = formStr.replace(/p-3 rounded-xl border-2 text-sm/g, 'p-1.5 sm:p-2 rounded-lg border-2 text-[10px] sm:text-xs');
formStr = formStr.replace(/w-4 h-4/g, 'w-3 h-3 sm:w-4 sm:h-4');

content = content.substring(0, formStart) + formStr + content.substring(formEnd);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('patched');
