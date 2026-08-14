const fs = require('fs');
let content = fs.readFileSync('src/components/RegistrationView.tsx', 'utf8');

const target = `                  <div className="flex flex-col gap-4">
                    <select 
                      value={appealProgId} 
                      onChange={(e) => setAppealProgId(e.target.value)}
                      className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none appearance-none"
                    >
                      <option value="">-- Choose Programme --</option>
                      {programmes.filter(p => results.some(r => r.programmeId === p.id)).map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>

                    <textarea 
                      value={appealReason} 
                      onChange={(e) => setAppealReason(e.target.value)}
                      rows={4}
                      placeholder="Reason for appeal..."
                      className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"
                    />

                    <input 
                      type="text" 
                      value={appealFile} 
                      onChange={(e) => setAppealFile(e.target.value)}
                      placeholder="Supporting Link (Optional)"
                      className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
                    />`;

const replacement = `                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Select Programme</label>
                      <select 
                        value={appealProgId} 
                        onChange={(e) => setAppealProgId(e.target.value)}
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none appearance-none"
                      >
                        <option value="">-- Choose Programme --</option>
                        {programmes.filter(p => results.some(r => r.programmeId === p.id)).map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Statement of Concern</label>
                      <textarea 
                        value={appealReason} 
                        onChange={(e) => setAppealReason(e.target.value)}
                        rows={4}
                        placeholder="Reason for appeal..."
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Supporting Link (Optional)</label>
                      <input 
                        type="text" 
                        value={appealFile} 
                        onChange={(e) => setAppealFile(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
                      />
                    </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/RegistrationView.tsx', content);
  console.log("Patched RegistrationView form again successfully");
} else {
  console.log("Target not found!");
}
