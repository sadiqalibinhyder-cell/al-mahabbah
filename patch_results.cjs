const fs = require('fs');
let content = fs.readFileSync('src/components/ResultsView.tsx', 'utf8');

// The component has imports, some logic for grouping results, and then the return statement.
const startString = `return (`;
const idx = content.indexOf(startString);

if (idx !== -1) {
  const replacement = `return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20" id="results-view-container">
      {/* Premium Header */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
            <Award className="text-emerald-500" size={32} strokeWidth={2.5} />
            Official Results
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Verified rankings and performance evaluations</p>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="premium-card p-4 md:p-6 space-y-4" id="filter-matrix-panel">
        
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, participant, or team..."
            className="w-full pl-11 pr-4 py-3.5 bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[16px] text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 transition-shadow outline-none placeholder:text-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="flex bg-neutral-100 dark:bg-neutral-800/50 rounded-[14px] p-1 h-11" id="filter-category">
            <button
              onClick={() => setFilterCategory('All')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterCategory === 'All' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >All Cats</button>
            <button
              onClick={() => setFilterCategory('A')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterCategory === 'A' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Category A</button>
            <button
              onClick={() => setFilterCategory('B')}
              className={\`flex-1 rounded-[10px] text-xs font-bold transition-all \${filterCategory === 'B' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}\`}
            >Category B</button>
          </div>
          
          <select 
            value={filterCategoryGroup}
            onChange={(e) => setFilterCategoryGroup(e.target.value)}
            className="w-full px-4 py-0 bg-neutral-100 dark:bg-neutral-800/50 border-0 rounded-[14px] text-xs font-bold text-neutral-900 dark:text-white outline-none appearance-none h-11"
          >
            <option value="All">All Grades (Junior, Senior, etc.)</option>
            <option value="Sub Junior">Sub Junior</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Super Senior">Super Senior</option>
            <option value="All-Inclusive">General</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-8" id="results-cards-list">
        {groupedResults.length > 0 ? (
          groupedResults.map((group) => (
            <div key={group.groupName} className="space-y-4">
              <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white pl-2">
                {group.groupName} <span className="text-neutral-400 font-medium">Events</span>
              </h3>
              
              <div className="space-y-6">
                {group.items.map((res) => {
                  const prog = programmes.find(p => p.id === res.programmeId);
                  if (!prog) return null;
                  return (
                    <div 
                      key={res.programmeId}
                      className="premium-card overflow-hidden"
                    >
                      {/* Top Accent Line */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                      
                      {/* Card Header */}
                      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-black/5 dark:border-white/5">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{prog.code}</span>
                            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">CAT {prog.category}</span>
                            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{prog.section}</span>
                          </div>
                          <h4 className="text-lg md:text-xl font-display font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
                            {prog.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar size={14}/> Released {new Date(res.publishedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="shrink-0"/> {prog.venue.split('(')[0]}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => triggerShare(res.programmeId)}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors relative"
                            title="Copy result link"
                          >
                            {copiedId === res.programmeId && (
                              <span className="absolute -top-8 bg-neutral-900 text-white text-[10px] font-mono font-bold rounded px-2 py-1 whitespace-nowrap">
                                Copied!
                              </span>
                            )}
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Rankings Grid */}
                      <div className="p-5 md:p-6 bg-neutral-50/50 dark:bg-neutral-900/20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {res.rankings.map((ranking) => {
                            const isFirst = ranking.position === 1;
                            const isSecond = ranking.position === 2;
                            const medalBg = isFirst ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-900/30' :
                                            isSecond ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 border-neutral-300/50 dark:border-neutral-600/30' :
                                            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/30';
                            const medalText = ranking.position === 1 ? '1st' : ranking.position === 2 ? '2nd' : '3rd';
                            
                            const teamMeta = teams.find(t => t.id === ranking.teamId);
                            
                            return (
                              <div key={ranking.participantId} className="premium-surface p-4 rounded-[16px] border border-black/5 dark:border-white/5 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                                <div>
                                  <div className="flex items-start justify-between mb-3">
                                    <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-lg border shadow-sm \${medalBg}\`}>
                                      {medalText}
                                    </div>
                                    {ranking.grade !== 'None' && (
                                      <div className="px-2 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[9px] font-mono font-bold uppercase tracking-widest border border-violet-100 dark:border-violet-800/30">
                                        Grade {ranking.grade}
                                      </div>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-neutral-900 dark:text-white text-base leading-tight">
                                    {ranking.participantName}
                                  </h5>
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className={\`w-2 h-2 rounded-full \${teamMeta?.color || 'bg-neutral-300'}\`}></span>
                                    <span className="text-[11px] font-bold text-neutral-500">{ranking.teamName}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Added to Total</span>
                                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{ranking.points}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="premium-card p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Award size={32} className="text-neutral-300" />
            <p className="text-neutral-500 font-medium">No official results matching your criteria.</p>
            <button onClick={() => { setSearchQuery(''); setFilterCategory('All'); setFilterCategoryGroup('All'); }} className="text-sm font-bold text-emerald-500 hover:underline">Clear Filters</button>
          </div>
        )}
      </div>

    </div>
  );
};
`;

  content = content.substring(0, idx) + replacement;
  fs.writeFileSync('src/components/ResultsView.tsx', content);
  console.log('patched ResultsView');
}
