const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const replacement = `              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel p-3 rounded-xl shadow-xs gap-3" id="crud-controls-bar">
                <div className="flex flex-wrap gap-2">
                  {['All', 'Sub Junior', 'Junior', 'Senior', 'Super Senior', 'General'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAdminProgrammeCategory(cat)}
                      className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer \${adminProgrammeCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                  
                <button 
                  onClick={triggerAddProg}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                >
                  <PlusCircle size={14} /> Add Programme
                </button>
              </div>`;

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('{/* Controls bar */}'));
let endIdx = -1;
for (let i = startIdx + 1; i < lines.length; i++) {
  if (lines[i].includes('</button>')) {
    endIdx = i + 2;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = [
    ...lines.slice(0, startIdx),
    replacement,
    ...lines.slice(endIdx)
  ];
  fs.writeFileSync('src/components/AdminPanel.tsx', newLines.join('\n'));
  console.log('Successfully replaced via JS slice');
}

