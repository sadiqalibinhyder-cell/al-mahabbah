const fs = require('fs');
let content = fs.readFileSync('src/components/RegistrationView.tsx', 'utf8');

// Use similar premium-card styles
const startString = `return (`;
const idx = content.indexOf(startString);

if (idx !== -1) {
  const replacement = `return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20" id="registration-view-container">
      {/* Premium Header */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-blue-500" size={32} strokeWidth={2.5} />
            Leaders Portal
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Manage team registrations and official appeals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-1" id="leaders-portal-tabs">
        {['Overview', 'New Registration', 'My Registrations', 'Appeals'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 \${
              activeTab === tab 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                : 'premium-surface text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }\`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="premium-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">My Team</h3>
                <p className="text-sm text-neutral-500">{teamProfile?.name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Registrations</h3>
                <p className="text-sm text-neutral-500">{myRegs.length} Approved / Pending</p>
              </div>
            </div>

            <div className="premium-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Appeals Filed</h3>
                <p className="text-sm text-neutral-500">{teamAppeals.length} Active Appeals</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'New Registration' && (
          <div className="premium-card p-6 md:p-8 max-w-2xl mx-auto space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white">Submit Registration</h3>
              <p className="text-sm text-neutral-500">Register a student for an upcoming event.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Select Event</label>
                <select 
                  value={regProgId} 
                  onChange={(e) => setRegProgId(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                >
                  <option value="">-- Choose Programme --</option>
                  {programmes.filter(p => !p.locked).map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Participant Name</label>
                <input 
                  type="text" 
                  value={regStudentName} 
                  onChange={(e) => setRegStudentName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>

              {regMsg && (
                <div className={\`p-4 rounded-[14px] text-xs font-bold flex items-center gap-2 \${
                  regMsg.includes('success') 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                }\`}>
                  {regMsg.includes('success') ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                  {regMsg}
                </div>
              )}

              <button 
                onClick={() => {
                  if (!regProgId || !regStudentName.trim()) {
                    setRegMsg('Please fill all fields');
                    return;
                  }
                  onRegister(regProgId, regStudentName);
                  setRegMsg('Registration submitted successfully!');
                  setRegProgId('');
                  setRegStudentName('');
                }}
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-[16px] text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform"
              >
                Submit Registration
              </button>
            </div>
          </div>
        )}

        {activeTab === 'My Registrations' && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white mb-6">Registered Participants</h3>
            {myRegs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRegs.map(reg => {
                  const prog = programmes.find(p => p.id === reg.programmeId);
                  return (
                    <div key={reg.id} className="premium-surface p-5 rounded-[20px] border border-black/5 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{prog?.code || '???'}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">{new Date(reg.datetime).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-neutral-900 dark:text-white text-base">{prog?.title || 'Unknown Programme'}</h4>
                      <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500"><User size={12}/></div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{reg.studentName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 font-medium bg-neutral-50 dark:bg-neutral-900/20 rounded-[24px]">
                No registrations found for your team.
              </div>
            )}
          </div>
        )}

        {activeTab === 'Appeals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="premium-card p-6 md:p-8 space-y-6 lg:col-span-1">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white">File Appeal</h3>
                <p className="text-sm text-neutral-500">Submit a grievance to the Admin Desk.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Event</label>
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Reason / Statement</label>
                  <textarea 
                    value={appealReason} 
                    onChange={(e) => setAppealReason(e.target.value)}
                    rows={4}
                    placeholder="Provide details..."
                    className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Attach Link (Optional)</label>
                  <input 
                    type="text" 
                    value={appealFile} 
                    onChange={(e) => setAppealFile(e.target.value)}
                    placeholder="e.g. proof.mp4"
                    className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
                  />
                </div>

                {appealErrorMsg && (
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
              </div>
            </div>

            <div className="premium-card p-6 md:p-8 lg:col-span-2">
              <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white mb-6">Appeals Log</h3>
              {teamAppeals.length > 0 ? (
                <div className="space-y-4">
                  {teamAppeals.map(appeal => (
                    <div key={appeal.id} className="premium-surface p-5 rounded-[20px] border border-black/5 dark:border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">{appeal.id}</span>
                          <h4 className="font-bold text-neutral-900 dark:text-white text-sm">{appeal.programmeTitle}</h4>
                        </div>
                        <span className={\`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                          appeal.status === 'Completed' || appeal.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : appeal.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            : appeal.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }\`}>
                          {appeal.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 italic bg-white/50 dark:bg-neutral-900/50 p-3 rounded-[12px]">
                        "{appeal.reason}"
                      </p>
                      {appeal.adminNotes && (
                        <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 p-3 rounded-[12px]">
                          <span className="font-bold uppercase text-[10px] block mb-1">Admin Note:</span>
                          {appeal.adminNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400 font-medium bg-neutral-50 dark:bg-neutral-900/20 rounded-[24px]">
                  No appeals filed.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
`;

  content = content.substring(0, idx) + replacement;
  fs.writeFileSync('src/components/RegistrationView.tsx', content);
  console.log('patched RegistrationView');
}
