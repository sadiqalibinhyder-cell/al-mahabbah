const fs = require('fs');
let content = fs.readFileSync('src/components/AppealManagement.tsx', 'utf8');

const regex = /<form onSubmit=\{handleSubmit\} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">[\s\S]*?<\/form>/;

const replacement = `<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs items-stretch">
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
              <div className="space-y-1.5 md:col-span-1 flex flex-col h-full">
                <label className="font-semibold text-neutral-400 block">Statement of Concern</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Please specify details such as lighting breakdowns, karaoke tracks stopped mid-performance, or stage crew interruption..."
                  className="w-full flex-1 min-h-[140px] px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Drag and drop file upload */}
              <div className="space-y-1.5 md:col-span-1 flex flex-col h-full">
                <label className="font-semibold text-neutral-400 block">Supporting Attachment (Optional)</label>
                
                <div 
                  id="drop-zone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={\`flex-1 min-h-[140px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all \${
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
              </div>

              {/* Message feedbacks */}
              <div className="md:col-span-2 flex flex-col gap-3 mt-1">
                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200/50 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <Check size={14} className="shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/30 border border-rose-200/50 text-rose-800 dark:text-rose-300 text-[11px] flex items-center gap-1.5">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={!selectedProgId || !reason.trim()}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold flex justify-center items-center gap-2 transition-colors"
                >
                  <Send size={16} />
                  Submit Grievance
                </button>
              </div>
            </form>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/AppealManagement.tsx', content);
  console.log("Patched AppealManagement grid successfully");
} else {
  console.log("Target not found with regex!");
}
