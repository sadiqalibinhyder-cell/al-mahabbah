const fs = require('fs');
let content = fs.readFileSync('src/components/AppealManagement.tsx', 'utf8');

const target = `            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              {/* Event selection */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-400 block">Select Programme</label>
                <select
                  value={selectedProgId}
                  onChange={(e) => setSelectedProgId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 font-semibold"
                >
                  <option value="" className="bg-neutral-100 dark:bg-white/5">-- Choose Completed Programme --</option>
                  {eligibleProgrammes.map((p) => (
                    <option key={p.id} value={p.id} className="bg-neutral-100 dark:bg-white/5">
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
                {eligibleProgrammes.length === 0 && (
                  <span className="text-[10px] text-rose-500 italic block mt-1 font-semibold">
                    No completed programmes with published results found in your enrollment list.
                  </span>
                )}
              </div>

              {/* Grievance Statement */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-400 block">Statement of Concern</label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Please specify details such as lighting breakdowns, karaoke tracks stopped mid-performance, or stage crew interruption..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              {/* Drag and drop file upload */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-400 block">Supporting Attachment (Optional)</label>
                
                <div 
                  id="drop-zone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={\`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all \${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : attachedFile 
                      ? 'border-emerald-400 bg-emerald-500/5' 
                      : 'border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5'
                  }\`}
                >
                  <input 
                    type="file" 
                    id="file-upload-input"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer space-y-1.5 block">
                    <FileUp size={20} className="mx-auto text-neutral-400" />
                    {attachedFile ? (
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{attachedFile}</div>
                    ) : (
                      <div className="text-neutral-400">
                        Drag & Drop or <span className="text-indigo-600 dark:text-indigo-400 underline font-semibold">Browse proof video/docs</span>
                      </div>
                    )}
                    <span className="text-[9px] text-neutral-400 block">Support: MP4, PDF, JPEG (Max 10MB)</span>
                  </label>
                </div>
              </div>`;

const replacement = `            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Event selection */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-neutral-400 block">Select Programme</label>
                <select
                  value={selectedProgId}
                  onChange={(e) => setSelectedProgId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 font-semibold outline-none appearance-none"
                >
                  <option value="" className="bg-neutral-100 dark:bg-white/5">-- Choose Completed Programme --</option>
                  {eligibleProgrammes.map((p) => (
                    <option key={p.id} value={p.id} className="bg-neutral-100 dark:bg-white/5">
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
                {eligibleProgrammes.length === 0 && (
                  <span className="text-[10px] text-rose-500 italic block mt-1 font-semibold">
                    No completed programmes with published results found in your enrollment list.
                  </span>
                )}
              </div>

              {/* Grievance Statement */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-neutral-400 block">Statement of Concern</label>
                <textarea
                  rows={5}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Please specify details such as lighting breakdowns, karaoke tracks stopped mid-performance, or stage crew interruption..."
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Drag and drop file upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-neutral-400 block">Supporting Attachment (Optional)</label>
                
                <div 
                  id="drop-zone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={\`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all \${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : attachedFile 
                      ? 'border-emerald-400 bg-emerald-500/5' 
                      : 'border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5'
                  }\`}
                >
                  <input 
                    type="file" 
                    id="file-upload-input"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block w-full">
                    <FileUp size={24} className="mx-auto text-neutral-400" />
                    {attachedFile ? (
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{attachedFile}</div>
                    ) : (
                      <div className="text-neutral-400 text-sm">
                        Drag & Drop or <span className="text-indigo-600 dark:text-indigo-400 underline font-semibold">Browse proof video/docs</span>
                      </div>
                    )}
                    <span className="text-[10px] text-neutral-400 block mt-1">Support: MP4, PDF, JPEG (Max 10MB)</span>
                  </label>
                </div>
              </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/AppealManagement.tsx', content);
  console.log("Patched AppealManagement form successfully");
} else {
  console.log("Target not found!");
}
