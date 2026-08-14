import React, { useState } from 'react';
import { Programme, UserProfile, PublishedResult } from '../types';
import { 
  Search, Filter, Calendar, MapPin, Clock, Award, ShieldAlert, 
  Users, Info, ChevronDown, ChevronUp, UserCheck, BookOpen, 
  ListChecks, ArrowRight, Sparkles, Lock, CheckCircle2 
} from 'lucide-react';

interface ProgrammesViewProps {
  programmes: Programme[];
  users: UserProfile[];
  results: PublishedResult[];
  onNavigate: (view: string) => void;
}

export const ProgrammesView: React.FC<ProgrammesViewProps> = ({
  programmes = [],
  users = [],
  results = [],
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState<'All' | 'Stage' | 'Off-Stage'>('All');
  const [filterType, setFilterType] = useState<'All' | 'Individual' | 'Group'>('All');
  const [divisionFilter, setDivisionFilter] = useState<'All' | 'Boys' | 'Girls'>('All');
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string>('All');
  
  // Expanded Card tracker
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Process filters
  const filteredProgrammes = programmes.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = filterSection === 'All' || p.section === filterSection;
    const matchesType = filterType === 'All' || p.type === filterType;
    
    const catGrp = p.categoryGroup || '';
    const isGirls = catGrp.toLowerCase().includes('girls');
    const matchesDivision = divisionFilter === 'All' || (divisionFilter === 'Girls' ? isGirls : !isGirls);

    const matchesCategoryGroup = categoryGroupFilter === 'All' || catGrp.toLowerCase().includes(categoryGroupFilter.toLowerCase());
                                 
    return matchesSearch && matchesSection && matchesType && matchesDivision && matchesCategoryGroup;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24" id="programmes-view-container">
      
      {/* 1. EXECUTIVE ISLAMIC ARTS FEST HEADER BANNER */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-neutral-950 text-white shadow-2xl relative overflow-hidden">
        {/* Glow halo background accent */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <img 
            src="/meelad_fest_logo.jpg" 
            alt="Meelad Fest Logo" 
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg ring-4 ring-emerald-500/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider">
                COMPETITION REGISTRY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase tracking-wider">
                113 EVENTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <ListChecks className="text-emerald-400 shrink-0" size={28} />
              Meelad Fest Events Catalog
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              Explore all 113 scheduled competitions, rules, stages, and eligibility across Boys & Girls divisions
            </p>
          </div>
        </div>

        <span className="px-4 py-2 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start md:self-center">
          <Sparkles size={16} className="text-amber-400" />
          Live Stage Sync
        </span>
      </div>

      {/* 2. FILTER MATRIX TOOLBAR */}
      <div className="premium-card p-5 space-y-4" id="filter-matrix-panel">
        
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event code #, title, rules, or venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Group Selector Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
            Filter by Division / Category Group:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar scroll-smooth">
            {[
              'All',
              'Kiddies Boys',
              'Sub Junior Boys',
              'Junior Boys',
              'Senior Boys',
              'Super Senior Boys',
              'Sub Junior Girls',
              'Junior Girls',
              'Senior Girls',
            ].map(grp => (
              <button
                key={grp}
                onClick={() => setCategoryGroupFilter(grp)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  categoryGroupFilter === grp
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Grid with Clear Section Labels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Section Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              Venue Mode:
            </span>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 text-[11px] sm:text-xs font-bold">
              {(['All', 'Stage', 'Off-Stage'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`flex-1 py-1.5 px-1 rounded-lg transition-all cursor-pointer text-center truncate ${
                    filterSection === sec ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {sec === 'All' ? 'All Modes' : sec}
                </button>
              ))}
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              Event Type:
            </span>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 text-[11px] sm:text-xs font-bold">
              {(['All', 'Individual', 'Group'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-1.5 px-1 rounded-lg transition-all cursor-pointer text-center truncate ${
                    filterType === t ? 'bg-indigo-600 text-white shadow-xs font-black' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {t === 'All' ? 'All Types' : t}
                </button>
              ))}
            </div>
          </div>
          
          {/* Division Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              Division:
            </span>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 text-[11px] sm:text-xs font-bold">
              {(['All', 'Boys', 'Girls'] as const).map(div => (
                <button
                  key={div}
                  onClick={() => setDivisionFilter(div)}
                  className={`flex-1 py-1.5 px-1 rounded-lg transition-all cursor-pointer text-center truncate ${
                    divisionFilter === div ? 'bg-purple-600 text-white shadow-xs font-black' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 3. EVENT CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6" id="programme-list">
        {filteredProgrammes.length > 0 ? (
          filteredProgrammes.map((p) => {
            const isExpanded = expandedId === p.id;
            const isPublished = results.some(r => r.programmeId === p.id && r.locked);
            const judgeNames = (p.judges || []).map(jId => users.find(u => u.id === jId)?.name).filter(Boolean).join(', ');
            const enrolledStudents = users.filter(u => u.role === 'student' && (u.registeredProgrammeIds || []).includes(p.id));
            const isGirls = (p.categoryGroup || '').toLowerCase().includes('girls');

            return (
              <div 
                key={p.id}
                className={`premium-card p-4 sm:p-6 space-y-3.5 border border-neutral-200/80 dark:border-neutral-800/90 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 rounded-3xl ${isExpanded ? 'md:col-span-2' : ''}`}
              >
                {/* Row 1: Code, Category, Type, Status */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black font-mono font-black text-xs shrink-0">
                      #{p.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase shrink-0">
                      CAT {p.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                      p.type === 'Group' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {p.type}
                    </span>
                  </div>

                  {isPublished ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <CheckCircle2 size={11} /> Results Out
                    </span>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 whitespace-nowrap ${
                      p.status === 'Completed' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500' :
                      p.status === 'Live' ? 'bg-rose-500 text-white animate-pulse' :
                      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {p.status || 'Scheduled'}
                    </span>
                  )}
                </div>

                {/* Row 2: Division / Category Group Badge */}
                {p.categoryGroup && (
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider ${
                      isGirls ? 'bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-300 border border-pink-300/40' : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/40'
                    }`}>
                      {p.categoryGroup}
                    </span>
                  </div>
                )}

                {/* Row 3: Event Title */}
                <div className="cursor-pointer" onClick={() => toggleExpand(p.id)}>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tight group-hover:text-emerald-500 transition-colors leading-snug">
                    {p.title}
                  </h3>
                </div>

                {/* Row 4: Date, Time & Venue */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 font-semibold pt-1">
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Clock size={14} className="text-amber-500 shrink-0" />
                    {new Date(p.datetime).toLocaleDateString(undefined, {month:'short', day:'numeric'})} • {new Date(p.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 min-w-0 font-bold truncate">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{p.venue}</span>
                  </span>
                </div>

                {/* Row 5: Action Footer Bar */}
                <div 
                  onClick={() => toggleExpand(p.id)}
                  className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    <BookOpen size={13} className="text-emerald-500" />
                    {isExpanded ? 'Hide Details & Guidelines' : 'View Guidelines & Performers'}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl shrink-0">
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                {/* Expanded Details Accordion */}
                {isExpanded && (
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      
                      {/* Rules */}
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                        <h4 className="font-mono font-extrabold text-amber-500 uppercase flex items-center gap-1.5 text-[11px]">
                          <BookOpen size={14} /> Rules & Competition Guidelines
                        </h4>
                        <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                          {p.rules || 'Official competition rules apply. Performers must report 15 minutes prior to stage call.'}
                        </p>
                      </div>

                      {/* Participant Limits & Jury */}
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block">Max Entries per Team</span>
                            <span className="font-display font-black text-base text-neutral-900 dark:text-white">Max 4 Students</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block">Appointed Jury</span>
                            <span className="font-display font-bold text-emerald-500 text-xs">{judgeNames || 'Meelad Jury Panel'}</span>
                          </div>
                        </div>

                        {/* Enrolled Students Roster */}
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-extrabold text-indigo-400 uppercase text-[11px] flex items-center gap-1">
                              <Users size={14} /> Enrolled Performers ({enrolledStudents.length})
                            </span>
                            {isPublished && (
                              <button 
                                onClick={() => onNavigate('Results')}
                                className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                View Results <ArrowRight size={12}/>
                              </button>
                            )}
                          </div>

                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {enrolledStudents.length > 0 ? (
                              enrolledStudents.map(student => (
                                <div key={student.id} className="p-2 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-between text-xs">
                                  <span className="font-bold text-neutral-900 dark:text-white">{student.name}</span>
                                  <span className="font-mono text-[10px] text-amber-500 font-bold">Chest #{student.chestNo || 'N/A'}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-neutral-400 italic">No registered performers yet.</p>
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
            <Search size={36} className="text-neutral-500" />
            <p className="text-neutral-400 font-medium">No competition events match your current filter criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setFilterSection('All'); setFilterType('All'); setDivisionFilter('All'); setCategoryGroupFilter('All'); }} 
              className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
