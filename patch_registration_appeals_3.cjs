const fs = require('fs');
let content = fs.readFileSync('src/components/RegistrationView.tsx', 'utf8');

const target = `                    {appealErrorMsg && (
                      <div className="p-3 rounded-[12px] bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2 dark:bg-rose-900/20 dark:text-rose-400">
                        <AlertCircle size={14}/> {appealErrorMsg}
                      </div>
                    )}
                    {appealSuccessMsg && (
                      <div className="p-3 rounded-[12px] bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <CheckCircle2 size={14}/> {appealSuccessMsg}
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        if (!appealProgId || !appealReason.trim()) {
                          setAppealErrorMsg('Please provide a programme and reason.');
                          return;
                        }
                        onSubmitAppeal(appealProgId, appealReason, appealFile);
                        setAppealSuccessMsg('Appeal submitted successfully.');
                        setAppealErrorMsg('');
                        setAppealProgId('');
                        setAppealReason('');
                        setAppealFile('');
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-[16px] text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform"
                    >
                      Submit Official Appeal
                    </button>
                  </div>`;

const replacement = `                    {appealErrorMsg && (
                      <div className="md:col-span-2 p-3 rounded-[12px] bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2 dark:bg-rose-900/20 dark:text-rose-400">
                        <AlertCircle size={14}/> {appealErrorMsg}
                      </div>
                    )}
                    {appealSuccessMsg && (
                      <div className="md:col-span-2 p-3 rounded-[12px] bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <CheckCircle2 size={14}/> {appealSuccessMsg}
                      </div>
                    )}

                    <div className="md:col-span-2 pt-2">
                      <button 
                        onClick={() => {
                          if (!appealProgId || !appealReason.trim()) {
                            setAppealErrorMsg('Please provide a programme and reason.');
                            return;
                          }
                          onSubmitAppeal(appealProgId, appealReason, appealFile);
                          setAppealSuccessMsg('Appeal submitted successfully.');
                          setAppealErrorMsg('');
                          setAppealProgId('');
                          setAppealReason('');
                          setAppealFile('');
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-[16px] text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform"
                      >
                        Submit Official Appeal
                      </button>
                    </div>
                  </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/RegistrationView.tsx', content);
  console.log("Patched RegistrationView buttons successfully");
} else {
  console.log("Target not found!");
}
