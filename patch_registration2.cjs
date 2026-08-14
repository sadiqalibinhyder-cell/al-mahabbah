const fs = require('fs');
let content = fs.readFileSync('src/components/RegistrationView.tsx', 'utf8');

// Find the original start of my bad return statement
const returnIndex = content.indexOf('return (');

if (returnIndex !== -1) {
  let beforeReturn = content.substring(0, returnIndex);

  const newReturn = `return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto" id="registration-view-container">
      {!currentUser ? (
        <div className="max-w-md mx-auto pt-12">
          <div className="premium-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn size={32} />
              </div>
              <h2 className="text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tight">Portal Access</h2>
              <p className="text-sm font-medium text-neutral-500">Sign in to manage your team or administrative duties.</p>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Email or ID</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[16px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  placeholder="leader@example.com"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[16px] px-4 py-3.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  placeholder="Enter password"
                />
              </div>

              {loginError && (
                <div className="p-4 rounded-[14px] bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0"/> {loginError}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-[16px] text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform"
              >
                Secure Login
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Workspace Header */}
          <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
                    <ShieldCheck className="text-blue-500" size={32} strokeWidth={2.5} />
                    Leaders Workspace
                  </h2>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                    Manage team roster, registrations, and official appeals
                  </p>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold text-xs rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>

              {/* Team Name Updater */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-[20px] flex flex-col md:flex-row md:items-end gap-4 border border-black/5 dark:border-white/5">
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">My Team Name</label>
                  <input 
                    type="text" 
                    value={newTeamName} 
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/5 rounded-[12px] px-4 py-2.5 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
                <button 
                  onClick={handleSaveTeamName}
                  className="w-full md:w-auto px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-[12px] hover:-translate-y-0.5 transition-transform whitespace-nowrap"
                >
                  Update Name
                </button>
              </div>
              {teamNameSuccess && (
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{teamNameSuccess}</p>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 px-1">
            {['roster', 'appeals'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveLeaderTab(tab as any)}
                className={\`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 \${
                  activeLeaderTab === tab 
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                    : 'premium-surface text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }\`}
              >
                {tab === 'roster' ? 'Team Roster & Events' : 'Appeals Desk'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeLeaderTab === 'roster' && (
              <div className="space-y-8">
                
                {/* Active Roster List */}
                <div className="premium-card p-6 md:p-8">
                  <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                    <Users size={20} className="text-blue-500"/>
                    Current Roster ({teamMembers.length})
                  </h3>
                  
                  {teamMembers.length > 0 ? (
                    <div className="space-y-4">
                      {teamMembers.map(member => (
                        <div key={member.id} className="premium-surface p-5 md:p-6 rounded-[24px] border border-black/5 dark:border-white/5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{member.chestNo}</span>
                                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{member.categoryGroup}</span>
                              </div>
                              <h4 className="font-bold text-neutral-900 dark:text-white text-lg">{member.name}</h4>
                            </div>
                            <button 
                              onClick={() => handleRemoveMember(member.id)}
                              className="px-4 py-2 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 font-bold text-xs rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                            >
                              Remove from Team
                            </button>
                          </div>
                          
                          {/* Member's Enrolled Events */}
                          <div className="pt-4 border-t border-black/5 dark:border-white/5">
                            <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Enrolled Events</h5>
                            <div className="space-y-2 mb-4">
                              {(member.registeredProgrammeIds || []).map(progId => {
                                const prog = programmes.find(p => p.id === progId);
                                return (
                                  <div key={progId} className="flex items-center justify-between bg-white dark:bg-neutral-800 p-3 rounded-[12px] border border-black/5 dark:border-white/5">
                                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{prog?.title || 'Unknown'} <span className="text-neutral-400 text-xs ml-2">({prog?.code})</span></span>
                                    <button 
                                      onClick={() => handleDeregisterMemberFromEvent(member.id, progId)}
                                      className="text-rose-500 hover:text-rose-600 p-1"
                                    >
                                      <Trash2 size={16}/>
                                    </button>
                                  </div>
                                );
                              })}
                              {!(member.registeredProgrammeIds?.length > 0) && (
                                <p className="text-xs text-neutral-400 italic">No events enrolled.</p>
                              )}
                            </div>
                            
                            {/* Enroll input */}
                            <div className="flex gap-2">
                              <select
                                id={\`enroll-\${member.id}\`}
                                className="flex-1 bg-neutral-100 dark:bg-neutral-900/50 border-0 rounded-[12px] px-3 py-2 text-sm font-medium text-neutral-900 dark:text-white outline-none"
                              >
                                <option value="">Add to event...</option>
                                {programmes.filter(p => !p.locked && !(member.registeredProgrammeIds || []).includes(p.id)).map(p => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                              </select>
                              <button 
                                onClick={() => {
                                  const selectEl = document.getElementById(\`enroll-\${member.id}\`) as HTMLSelectElement;
                                  if (selectEl && selectEl.value) {
                                    handleEnrollMemberInEvent(member.id, selectEl.value);
                                    selectEl.value = '';
                                  }
                                }}
                                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-[12px] text-xs font-bold"
                              >
                                Enroll
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-neutral-400 font-medium bg-neutral-50 dark:bg-neutral-900/20 rounded-[24px]">
                      Your team has no members yet.
                    </div>
                  )}
                </div>

                {/* Add New Members Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Create New Profile */}
                  <div className="premium-card p-6 md:p-8 space-y-6">
                    <h4 className="text-lg font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <UserPlus size={18} className="text-emerald-500"/> Create Profile
                    </h4>
                    
                    <form onSubmit={handleAddNewMember} className="space-y-4">
                      <input 
                        type="text" 
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[12px] px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white outline-none"
                      />
                      <input 
                        type="text" 
                        value={newStudentChestNo}
                        onChange={(e) => setNewStudentChestNo(e.target.value)}
                        placeholder="Chest Number (e.g. 101)"
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[12px] px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white outline-none"
                      />
                      <select
                        value={newStudentCategoryGroup}
                        onChange={(e) => setNewStudentCategoryGroup(e.target.value as any)}
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[12px] px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white outline-none appearance-none"
                      >
                        <option value="Sub Junior">Sub Junior</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Super Senior">Super Senior</option>
                      </select>
                      
                      {addMemberError && <p className="text-xs font-bold text-rose-600">{addMemberError}</p>}
                      {addMemberSuccess && <p className="text-xs font-bold text-emerald-600">{addMemberSuccess}</p>}
                      
                      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-[12px] transition-colors">
                        Register Member
                      </button>
                    </form>
                  </div>

                  {/* Add Existing Profile */}
                  <div className="premium-card p-6 md:p-8 space-y-6">
                    <h4 className="text-lg font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Search size={18} className="text-blue-500"/> Find Existing
                    </h4>
                    
                    <div className="space-y-4">
                      <select
                        value={selectedExistingStudentId}
                        onChange={(e) => setSelectedExistingStudentId(e.target.value)}
                        className="w-full bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[12px] px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white outline-none appearance-none"
                      >
                        <option value="">-- Select Student --</option>
                        {assignableStudents.map(student => (
                          <option key={student.id} value={student.id}>{student.name} (Chest: {student.chestNo})</option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={handleAddExistingMember}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-[12px] transition-colors"
                      >
                        Add to Team
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeLeaderTab === 'appeals' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="premium-card p-6 md:p-8 space-y-6 lg:col-span-1">
                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white">File Appeal</h3>
                    <p className="text-sm text-neutral-500">Submit a grievance for a completed event.</p>
                  </div>

                  <div className="space-y-4">
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
                    />

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
                  
                  {appeals.filter(a => a.teamId === currentUser?.teamId).length > 0 ? (
                    <div className="space-y-4">
                      {appeals.filter(a => a.teamId === currentUser?.teamId).map(appeal => (
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
        </>
      )}
    </div>
  );
};
`;

  content = beforeReturn + newReturn;
  fs.writeFileSync('src/components/RegistrationView.tsx', content);
  console.log('patched RegistrationView correctly');
}
