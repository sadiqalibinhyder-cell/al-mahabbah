import React, { useState } from 'react';
import { PublishedResult, Programme, Team, UserProfile } from '../types';
import { 
  Search, Filter, Award, Calendar, MapPin, Share2, ClipboardCheck, 
  Sparkles, BookOpen, Trophy, Medal, Crown, CheckCircle2, Lock, ChevronRight, Download
} from 'lucide-react';
import { downloadResultPoster } from '../utils/posterGenerator';

interface ResultsViewProps {
  results: PublishedResult[];
  programmes: Programme[];
  teams: Team[];
  users?: UserProfile[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results = [],
  programmes = [],
  teams = [],
  users = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<'All' | 'Stage' | 'Off-Stage'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Individual' | 'Group'>('All');
  const [divisionFilter, setDivisionFilter] = useState<'All' | 'Boys' | 'Girls'>('All');
  const [filterCategoryGroup, setFilterCategoryGroup] = useState<string>('All');
  
  // Link share state tracker
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerShare = (progId: string) => {
    setCopiedId(progId);
    navigator.clipboard.writeText(`${window.location.origin}/results?event=${progId}`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Demo Fallback Published Results if system has 0 published results
  const samplePublishedResults: PublishedResult[] = [
    {
      programmeId: 'prog_101',
      publishedAt: new Date().toISOString(),
      rankings: [
        { participantId: 'stu_101', participantName: 'Muammed Swalih', chestNo: 'B101', teamId: 'diraya_boys', teamName: 'DIRAYA BOYS', position: 1, points: 10, grade: 'A' },
        { participantId: 'stu_102', participantName: 'Ahmad Bilal', chestNo: 'B102', teamId: 'furooha_boys', teamName: 'FUROOHA BOYS', position: 2, points: 8, grade: 'A' },
        { participantId: 'stu_103', participantName: 'Zayd Rayan', chestNo: 'B103', teamId: 'swaraha_boys', teamName: 'SWARAHA BOYS', position: 3, points: 5, grade: 'B' },
      ]
    },
    {
      programmeId: 'prog_102',
      publishedAt: new Date().toISOString(),
      rankings: [
        { participantId: 'stu_104', participantName: 'Fatimah Zahra', chestNo: 'G201', teamId: 'diraya_girls', teamName: 'DIRAYA GIRLS', position: 1, points: 10, grade: 'A' },
        { participantId: 'stu_105', participantName: 'Aisha Maryam', chestNo: 'G202', teamId: 'furooha_girls', teamName: 'FUROOHA GIRLS', position: 2, points: 8, grade: 'A' },
        { participantId: 'stu_106', participantName: 'Khadija Safa', chestNo: 'G203', teamId: 'swaraha_girls', teamName: 'SWARAHA GIRLS', position: 3, points: 5, grade: 'B' },
      ]
    },
    {
      programmeId: 'prog_103',
      publishedAt: new Date().toISOString(),
      rankings: [
        { participantId: 'stu_107', participantName: 'Omar Farooq', chestNo: 'B301', teamId: 'furooha_boys', teamName: 'FUROOHA BOYS', position: 1, points: 10, grade: 'A' },
        { participantId: 'stu_108', participantName: 'Hamza Ali', chestNo: 'B302', teamId: 'swaraha_boys', teamName: 'SWARAHA BOYS', position: 2, points: 8, grade: 'A' },
        { participantId: 'stu_109', participantName: 'Hassan Usama', chestNo: 'B303', teamId: 'diraya_boys', teamName: 'DIRAYA BOYS', position: 3, points: 5, grade: 'B' },
      ]
    }
  ];

  const activeResults = results;

  // Filter published results
  const filteredResults = activeResults.filter(res => {
    const prog = programmes.find(p => p.id === res.programmeId);
    if (!prog) return false;

    // Only display results for programmes that are officially published
    if (!prog.resultPublished && !res.locked) return false;

    // Search matches
    const matchesSearch = 
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.rankings.some(r => 
        r.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.chestNo && r.chestNo.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    const matchesSection = sectionFilter === 'All' || prog.section === sectionFilter;
    const matchesType = typeFilter === 'All' || prog.type === typeFilter;
    
    const catGrp = prog.categoryGroup || '';
    const isGirls = catGrp.toLowerCase().includes('girls');
    const matchesDivision = divisionFilter === 'All' || (divisionFilter === 'Girls' ? isGirls : !isGirls);

    const matchesCategoryGroup = filterCategoryGroup === 'All' || catGrp.toLowerCase().includes(filterCategoryGroup.toLowerCase());

    return matchesSearch && matchesSection && matchesType && matchesDivision && matchesCategoryGroup;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24" id="results-view-container">
      
      {/* 1. EXECUTIVE ISLAMIC ARTS FEST HEADER BANNER */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-neutral-950 text-white shadow-2xl relative overflow-hidden">
        {/* Glow halo background accent */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <img 
            src="/meelad_fest_logo.jpg" 
            alt="Meelad Fest Official Logo" 
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg ring-4 ring-emerald-500/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider">
                OFFICIAL VERIFIED RESULTS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase tracking-wider">
                AUTO SCORE SYNC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Award className="text-emerald-400 shrink-0" size={28} />
              Meelad Fest Official Results & Rankings
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              Verified judge rankings, participant marks, grades, and point distribution across all categories
            </p>
          </div>
        </div>

        <span className="px-4 py-2 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start md:self-center">
          <CheckCircle2 size={16} className="text-emerald-400" />
          Jury Verified
        </span>
      </div>

      {/* 2. FILTER MATRIX TOOLBAR */}
      <div className="premium-card p-5 space-y-4" id="filter-matrix-panel">
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event title, chest #, participant, or team..."
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
                onClick={() => setFilterCategoryGroup(grp)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  filterCategoryGroup === grp
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Grid */}
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
                  onClick={() => setSectionFilter(sec)}
                  className={`flex-1 py-1.5 px-1 rounded-lg transition-all cursor-pointer text-center truncate ${
                    sectionFilter === sec ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
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
                  onClick={() => setTypeFilter(t)}
                  className={`flex-1 py-1.5 px-1 rounded-lg transition-all cursor-pointer text-center truncate ${
                    typeFilter === t ? 'bg-indigo-600 text-white shadow-xs font-black' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
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

      {/* 3. PUBLISHED RESULTS CARDS GRID */}
      <div className="space-y-6" id="results-cards-list">
        {filteredResults.length > 0 ? (
          filteredResults.map((res) => {
            const prog = programmes.find(p => p.id === res.programmeId);
            if (!prog) return null;

            const isGirls = (prog.categoryGroup || '').toLowerCase().includes('girls');

            return (
              <div 
                key={res.programmeId}
                className="premium-card p-6 md:p-8 space-y-6 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xl relative overflow-hidden rounded-3xl"
              >
                {/* Accent Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-0.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 font-mono font-black text-xs shrink-0">
                        #{prog.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase shrink-0">
                        CAT {prog.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                        isGirls ? 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-500/30' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30'
                      }`}>
                        {prog.categoryGroup || 'General'}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tight">
                      {prog.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-neutral-600 dark:text-neutral-400 font-bold">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <MapPin size={13} className="shrink-0" /> {prog.venue}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar size={13} className="shrink-0" /> Published {new Date(res.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                    <button
                      onClick={() => downloadResultPoster(prog, res)}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Download High-Resolution Result Poster PNG"
                    >
                      <Download size={14} /> Download Poster
                    </button>

                    <button 
                      onClick={() => triggerShare(res.programmeId)}
                      className="px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative"
                    >
                      {copiedId === res.programmeId ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Link Copied!
                        </span>
                      ) : (
                        <>
                          <Share2 size={14} /> Share Result
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* PODIUM RANKINGS GRID (1st, 2nd, 3rd) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {res.rankings.map((ranking) => {
                    const isFirst = ranking.position === 1;
                    const isSecond = ranking.position === 2;
                    const isThird = ranking.position === 3;

                    const student = users.find(u => u.id === ranking.participantId || (ranking.chestNo && u.chestNo === ranking.chestNo));
                    const displayName = student ? student.name : ranking.participantName;
                    const displayChest = student ? (student.chestNo || ranking.chestNo) : ranking.chestNo;
                    const displayTeam = student ? (teams.find(t => t.id === student.teamId)?.name || ranking.teamName) : ranking.teamName;

                    const cardBg = isFirst ? 'bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/60 dark:to-neutral-900 border-2 border-amber-400 text-amber-950 dark:text-amber-100 shadow-md' :
                                   isSecond ? 'bg-slate-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-neutral-900 border border-slate-300 dark:border-slate-400/60 text-slate-900 dark:text-slate-100' :
                                   'bg-orange-50 dark:bg-gradient-to-b dark:from-amber-950/20 dark:to-neutral-900 border border-amber-300 dark:border-amber-700/50 text-amber-950 dark:text-amber-200/90';

                    const badgeBg = isFirst ? 'bg-amber-400 text-black font-black' :
                                    isSecond ? 'bg-slate-300 text-black font-black' :
                                    'bg-amber-600 text-white font-black';

                    const icon = isFirst ? <Trophy className="text-amber-500 shrink-0" size={24} /> :
                                 isSecond ? <Medal className="text-slate-500 dark:text-slate-300 shrink-0" size={24} /> :
                                 <Medal className="text-amber-700 dark:text-amber-500 shrink-0" size={24} />;

                    return (
                      <div 
                        key={ranking.participantId || ranking.position} 
                        className={`p-5 rounded-2xl ${cardBg} space-y-3 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {icon}
                              <span className={`px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider ${badgeBg}`}>
                                {isFirst ? '1st Place' : isSecond ? '2nd Place' : '3rd Place'}
                              </span>
                            </div>

                            {ranking.grade && ranking.grade !== 'None' && (
                              <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 text-[10px] font-mono font-extrabold uppercase">
                                Grade {ranking.grade}
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-display font-black text-lg text-neutral-900 dark:text-white leading-tight">
                              {displayName}
                            </h4>
                            <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 mt-1">
                              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                                <Lock size={10} /> Chest #{displayChest || 'N/A'}
                              </span>
                              <span className="text-neutral-800 dark:text-neutral-300 font-extrabold">{displayTeam}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Awarded Points:</span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/40 font-black text-sm">
                            +{ranking.points} Pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })
        ) : (
          <div className="premium-card p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Award size={36} className="text-neutral-500" />
            <p className="text-neutral-400 font-medium">No published results match your filter criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSectionFilter('All'); setTypeFilter('All'); setDivisionFilter('All'); setFilterCategoryGroup('All'); }} 
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
