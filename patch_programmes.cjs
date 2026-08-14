const fs = require('fs');
let content = fs.readFileSync('src/components/ProgrammesView.tsx', 'utf8');

// The file has standard imports and the component definition. 
// I will just replace everything after the start of the return statement.
const startString = `return (`;
const idx = content.indexOf(startString);

if (idx !== -1) {
  const replacement = `return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20" id="programmes-view-container">
      {/* Premium Header */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
            <ListChecks className="text-purple-500" size={32} strokeWidth={2.5} />
            Events Catalog
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Explore all scheduled festival competitions</p>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="premium-card p-4 md:p-6 space-y-4" id="filter-matrix-panel">
        
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-purple-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, code, or rules..."
            className="w-full pl-11 pr-4 py-3.5 bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[16px] text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 transition-shadow outline-none placeholder:text-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="flex bg-neutral-100 dark:bg-neutral-800/50 rounded-[14px] p-1 h-11" id="filter-section">
            <button
              onClick={() => setFilterSection('All')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterSection === 'All' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >All Modes</button>
            <button
              onClick={() => setFilterSection('Stage')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterSection === 'Stage' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Stage</button>
            <button
              onClick={() => setFilterSection('Off-Stage')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterSection === 'Off-Stage' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Off-Stage</button>
          </div>
          
          <div className="flex bg-neutral-100 dark:bg-neutral-800/50 rounded-[14px] p-1 h-11" id="filter-type">
            <button
              onClick={() => setFilterType('All')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterType === 'All' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >All Types</button>
            <button
              onClick={() => setFilterType('Group')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterType === 'Group' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Group</button>
            <button
              onClick={() => setFilterType('Individual')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterType === 'Individual' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Individual</button>
          </div>
          
          <div className="flex bg-neutral-100 dark:bg-neutral-800/50 rounded-[14px] p-1 h-11" id="filter-category">
            <button
              onClick={() => setFilterCategory('All')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterCategory === 'All' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >All Cats</button>
            <button
              onClick={() => setFilterCategory('A')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterCategory === 'A' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Cat A</button>
            <button
              onClick={() => setFilterCategory('B')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterCategory === 'B' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Cat B</button>
          </div>
        </div>
      </div>

      {/* Results / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6" id="programme-list">
        {filteredProgrammes.length > 0 ? (
          filteredProgrammes.map((p) => {
            const isExpanded = expandedId === p.id;
            const isPublished = results.some(r => r.programmeId === p.id && r.locked);
            const judgeNames = p.judges.map(jId => users.find(u => u.id === jId)?.name).filter(Boolean).join(', ');
            const enrolledStudents = users.filter(u => u.role === 'student' && u.registeredProgrammeIds.includes(p.id));
            
            return (
              <div 
                key={p.id}
                className={\`premium-card flex flex-col \${isExpanded ? 'md:col-span-2' : ''} transition-all duration-300\`}
              >
                {/* Card Header (Always visible) */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="p-5 md:p-6 flex items-center justify-between cursor-pointer select-none group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">{p.code}</span>
                      <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">CAT {p.category}</span>
                      <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{p.type}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(p.datetime).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(p.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1.5 truncate"><MapPin size={14} className="shrink-0"/> {p.venue}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {isPublished ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Results Out</span>
                    ) : (
                      <span className={\`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                        p.status === 'Completed' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400' :
                        p.status === 'Live' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400 animate-pulse' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      }\`}>{p.status}</span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 dark:border-neutral-800/50 p-5 md:p-6 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-b-3xl animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-4">
                        <div className="premium-surface p-4 rounded-[16px] border border-black/5 dark:border-white/5">
                          <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
                            <BookOpen size={14} className="text-purple-500" /> Rules & Criteria
                          </h4>
                          <div className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed font-medium">
                            {p.rules}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 text-xs font-mono">
                          <div className="flex-1 bg-white dark:bg-neutral-800 p-3 rounded-[12px] border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-neutral-400 uppercase font-bold mb-0.5">Min Participants</span>
                            <span className="font-bold text-neutral-900 dark:text-white text-sm">{p.minParticipants}</span>
                          </div>
                          <div className="flex-1 bg-white dark:bg-neutral-800 p-3 rounded-[12px] border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-neutral-400 uppercase font-bold mb-0.5">Max Participants</span>
                            <span className="font-bold text-neutral-900 dark:text-white text-sm">{p.maxParticipants}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="premium-surface p-4 rounded-[16px] border border-black/5 dark:border-white/5">
                          <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
                            <UserCheck size={14} className="text-blue-500" /> Appointed Jury
                          </h4>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{judgeNames || 'None Assigned'}</p>
                        </div>
                        
                        <div className="premium-surface p-4 rounded-[16px] border border-black/5 dark:border-white/5 h-full">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                              <Users size={14} className="text-green-500" /> Enrolled Students ({enrolledStudents.length})
                            </h4>
                            {isPublished && (
                              <button 
                                onClick={() => onNavigate('Results')}
                                className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                              >
                                View Results <ArrowRight size={12}/>
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {enrolledStudents.map(student => (
                              <div key={student.id} className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-black/5 dark:border-white/5 flex items-center justify-between">
                                <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 truncate">{student.name}</span>
                                <span className="text-[10px] font-mono text-neutral-400">{student.rollNo}</span>
                              </div>
                            ))}
                            {enrolledStudents.length === 0 && (
                              <p className="text-xs text-neutral-400 italic">No registrations yet.</p>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 premium-card p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Search size={32} className="text-neutral-300" />
            <p className="text-neutral-500 font-medium">No events match your current filters.</p>
            <button onClick={() => { setSearchQuery(''); setFilterCategory('All'); setFilterSection('All'); setFilterType('All'); }} className="text-sm font-bold text-purple-500 hover:underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};
`;

  content = content.substring(0, idx) + replacement;
  fs.writeFileSync('src/components/ProgrammesView.tsx', content);
  console.log('patched ProgrammesView');
}
