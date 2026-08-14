import React, { useState } from 'react';
import { UserProfile, Team, Programme, PublishedResult } from '../types';
import { 
  Users, Search, UserCheck, Star, Award, Shield, Crown, Sparkles, 
  Lock, Trophy, ChevronRight, Layers, Flame, Medal, Compass, BookOpen, User
} from 'lucide-react';
import { 
  calculateToppersFromResults, 
  calculateOverallFestivalTopper, 
  calculateGenderOverallTopper,
  getCategoryFromClassAndGender 
} from '../utils/studentUtils';

interface PerformersViewProps {
  users: UserProfile[];
  teams: Team[];
  programmes: Programme[];
  results?: PublishedResult[];
}

export const PerformersView: React.FC<PerformersViewProps> = ({ 
  users, 
  teams, 
  programmes,
  results = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Boys' | 'Girls'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const students = users.filter(u => u.role === 'student');

  // Filter contenders
  const filteredStudents = students.filter(s => {
    const sGroup = s.group || (s.teamId?.includes('diraya') ? 'DIRAYA' : s.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
    const sGender = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
    const sCat = s.category || getCategoryFromClassAndGender(s.studentClass || '5', sGender);

    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.chestNo && s.chestNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (s.rollNo && s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTeam = selectedTeam === 'All' || s.teamId === selectedTeam || sGroup === selectedTeam;
    const matchesGender = selectedGender === 'All' || sGender === selectedGender;
    const matchesCategory = selectedCategory === 'All' || sCat === selectedCategory;

    return matchesSearch && matchesTeam && matchesGender && matchesCategory;
  });

  // Calculate Category Toppers, Overall Festival Topper (MAHABBAH TALENT), Boys Topper & Girls Topper
  const topperWinners = calculateToppersFromResults(users, results, programmes);
  const overallMahabbahTalent = calculateOverallFestivalTopper(users, results, programmes);
  const boysOverallTopper = calculateGenderOverallTopper(users, results, programmes, 'Boys');
  const girlsOverallTopper = calculateGenderOverallTopper(users, results, programmes, 'Girls');

  const boysToppersList = [
    { 
      gender: 'Boys', 
      category: 'Sub Junior', 
      title: 'EMERGING STAR', 
      icon: <Sparkles className="text-emerald-500 dark:text-emerald-400 shrink-0" size={20} />, 
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30' 
    },
    { 
      gender: 'Boys', 
      category: 'Junior', 
      title: 'RISING STAR', 
      icon: <Flame className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" size={20} />, 
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30' 
    },
    { 
      gender: 'Boys', 
      category: 'Senior', 
      title: 'SHINING STAR', 
      icon: <Award className="text-indigo-500 dark:text-indigo-400 shrink-0" size={20} />, 
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30' 
    },
    { 
      gender: 'Boys', 
      category: 'Super Senior', 
      title: 'ELITE STAR', 
      icon: <Crown className="text-purple-500 dark:text-purple-400 fill-purple-500 dark:fill-purple-400 shrink-0" size={20} />, 
      badgeBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30' 
    },
  ];

  const girlsToppersList = [
    { 
      gender: 'Girls', 
      category: 'Sub Junior', 
      title: 'EMERGING STAR', 
      icon: <Sparkles className="text-pink-500 dark:text-pink-400 shrink-0" size={20} />, 
      badgeBg: 'bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-500/30' 
    },
    { 
      gender: 'Girls', 
      category: 'Junior', 
      title: 'RISING STAR', 
      icon: <Flame className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" size={20} />, 
      badgeBg: 'bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-500/30' 
    },
    { 
      gender: 'Girls', 
      category: 'Senior', 
      title: 'ELITE STAR', 
      icon: <Crown className="text-rose-500 dark:text-rose-400 fill-rose-500 dark:fill-rose-400 shrink-0" size={20} />, 
      badgeBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30' 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24" id="performers-view">
      
      {/* 1. ULTRA-PROFESSIONAL CATEGORY TOPPER STAR TITLES SHOWCASE */}
      <section className="premium-card p-6 md:p-8 space-y-8 border-2 border-amber-400/40 bg-gradient-to-br from-neutral-950 via-slate-950 to-amber-950/30 text-white shadow-2xl relative overflow-hidden" id="performers-category-toppers">
        
        {/* Glow halo background accent */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/20 shrink-0">
              <Crown size={30} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest block">
                OFFICIAL INDIVIDUAL HONOURS & TOPPERS
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                Festival Star Honours & Toppers
              </h2>
              <p className="text-xs text-amber-200/70 font-medium">
                Automatically calculated overall and category-wise topper awards based on final judge results & points
              </p>
            </div>
          </div>

          <span className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start md:self-center">
            <Sparkles size={14} className="text-amber-400" />
            Auto-Calculated Standings
          </span>
        </div>

        {/* GRAND OVERALL FESTIVAL TOPPER: MAHABBAH TALENT HERO CARD */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-950/60 to-neutral-950 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-mono font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-1">
                  <Crown size={14} /> GRAND OVERALL FESTIVAL TOPPER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-mono text-[10px] font-bold uppercase border border-amber-500/40">
                  BOYS & GIRLS • ALL CATEGORIES
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-white tracking-tight flex items-center gap-2">
                <Trophy className="text-amber-400 shrink-0" size={32} />
                MAHABBAH TALENT 👑
              </h3>

              <p className="text-xs text-amber-200/80 font-medium max-w-xl leading-relaxed">
                The highest overall individual point achiever across all Boys & Girls categories (Sub Junior, Junior, Senior, Super Senior).
              </p>
            </div>

            {/* Overall Topper Winner Display */}
            <div className="shrink-0">
              {overallMahabbahTalent ? (
                <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/50 text-right space-y-1 min-w-56">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center justify-end gap-1">
                    <Trophy size={14} /> MAHABBAH TALENT WINNER
                  </div>
                  <div className="text-xl font-display font-black text-white">
                    {overallMahabbahTalent.studentName}
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-300 flex items-center justify-end gap-2">
                    <span className="flex items-center gap-1"><Lock size={10} /> #{overallMahabbahTalent.chestNo}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-black">
                      {overallMahabbahTalent.points} Pts
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 text-center space-y-1 min-w-56">
                  <span className="text-xs font-bold text-amber-300 block">
                    Awaiting Results Publication
                  </span>
                  <span className="text-[10px] font-mono text-amber-200/60 uppercase block">
                    Auto-computed from points
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SUB-SECTION 1: BOYS DIVISION TOPPERS & OVERALL BOYS TOPPER */}
        <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                <User size={20} />
              </div>
              <div>
                <h4 className="text-lg font-display font-black text-indigo-300 tracking-tight flex items-center gap-2">
                  BOYS STAR TOPPER
                </h4>
                <span className="text-[10px] font-mono text-indigo-400/80 uppercase">Sub Junior, Junior, Senior & Super Senior</span>
              </div>
            </div>

            {/* OVERALL BOYS TOPPER BADGE */}
            <div className="px-4 py-2 rounded-2xl bg-indigo-950/90 border border-indigo-400/50 flex items-center gap-3">
              <Crown className="text-indigo-400 shrink-0" size={20} />
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-300 uppercase tracking-widest block">
                  BOYS STAR TOPPER
                </span>
                <span className="text-xs font-display font-black text-white">
                  {boysOverallTopper ? `${boysOverallTopper.studentName} (${boysOverallTopper.points} Pts)` : 'BOYS STAR TOPPER'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {boysToppersList.map(item => {
              const winner = topperWinners.find(w => w.gender === item.gender && w.category === item.category);

              return (
                <div 
                  key={`${item.gender}_${item.category}`}
                  className="p-5 rounded-3xl bg-neutral-900/90 border border-indigo-500/30 hover:border-amber-400/60 transition-all duration-300 space-y-4 shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase border ${item.badgeBg}`}>
                      {item.gender} • {item.category}
                    </span>
                    <div className="p-1.5 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-widest block">
                      AWARD TITLE
                    </span>
                    <h3 className="text-lg font-display font-black text-white flex items-center gap-1.5">
                      <Medal size={18} className="text-amber-400 shrink-0" />
                      {item.title}
                    </h3>
                  </div>

                  {winner ? (
                    <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
                      <div className="text-sm font-display font-black text-amber-200">
                        {winner.studentName}
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-400/90">
                        <span className="flex items-center gap-1">
                          <Lock size={10} /> #{winner.chestNo}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-black">
                          {winner.points} Pts
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center space-y-1">
                      <span className="text-xs font-semibold text-neutral-400 block">
                        Awaiting Published Results
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">
                        Calculated on event finish
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* SUB-SECTION 2: GIRLS DIVISION TOPPERS & OVERALL GIRLS TOPPER */}
        <div className="p-6 rounded-3xl bg-pink-950/20 border border-pink-500/30 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-lg font-display font-black text-pink-300 tracking-tight flex items-center gap-2">
                  GIRLS STAR TOPPER
                </h4>
                <span className="text-[10px] font-mono text-pink-400/80 uppercase">Sub Junior, Junior & Senior</span>
              </div>
            </div>

            {/* OVERALL GIRLS TOPPER BADGE */}
            <div className="px-4 py-2 rounded-2xl bg-pink-950/90 border border-pink-400/50 flex items-center gap-3">
              <Crown className="text-pink-400 shrink-0" size={20} />
              <div>
                <span className="text-[9px] font-mono font-bold text-pink-300 uppercase tracking-widest block">
                  GIRLS STAR TOPPER
                </span>
                <span className="text-xs font-display font-black text-white">
                  {girlsOverallTopper ? `${girlsOverallTopper.studentName} (${girlsOverallTopper.points} Pts)` : 'GIRLS STAR TOPPER'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {girlsToppersList.map(item => {
              const winner = topperWinners.find(w => w.gender === item.gender && w.category === item.category);

              return (
                <div 
                  key={`${item.gender}_${item.category}`}
                  className="p-5 rounded-3xl bg-neutral-900/90 border border-pink-500/30 hover:border-amber-400/60 transition-all duration-300 space-y-4 shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase border ${item.badgeBg}`}>
                      {item.gender} • {item.category}
                    </span>
                    <div className="p-1.5 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-widest block">
                      AWARD TITLE
                    </span>
                    <h3 className="text-lg font-display font-black text-white flex items-center gap-1.5">
                      <Medal size={18} className="text-amber-400 shrink-0" />
                      {item.title}
                    </h3>
                  </div>

                  {winner ? (
                    <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
                      <div className="text-sm font-display font-black text-amber-200">
                        {winner.studentName}
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-400/90">
                        <span className="flex items-center gap-1">
                          <Lock size={10} /> #{winner.chestNo}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-black">
                          {winner.points} Pts
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center space-y-1">
                      <span className="text-xs font-semibold text-neutral-400 block">
                        Awaiting Published Results
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">
                        Calculated on event finish
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 2. CONTENDERS DIRECTORY HEADER */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-extrabold text-rose-500 uppercase tracking-widest block">
            STUDENT ARTISTS REGISTRY
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3 mt-0.5">
            <Users className="text-rose-500" size={32} strokeWidth={2.5} />
            Performers & Contenders Directory ({filteredStudents.length})
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Registered student artists, chest numbers 🔒, house assignments, and event entries
          </p>
        </div>
      </div>

      {/* 3. MULTI-FILTER TOOLBAR */}
      <div className="premium-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
          
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, chest #, roll ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Team Filter */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          >
            <option value="All">All House Teams (DIRAYA, FUROOHA, SWARAHA)</option>
            <option value="DIRAYA">DIRAYA</option>
            <option value="FUROOHA">FUROOHA</option>
            <option value="SWARAHA">SWARAHA</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          >
            <option value="All">All Gender Divisions</option>
            <option value="Boys">Boys Division</option>
            <option value="Girls">Girls Division</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Sub Junior">Sub Junior</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Super Senior">Super Senior (Boys)</option>
          </select>

        </div>
      </div>

      {/* 4. CONTENDERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => {
            const team = teams.find(t => t.id === student.teamId);
            const sGroup = student.group || (student.teamId?.includes('diraya') ? 'DIRAYA' : student.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
            const sGender = student.gender || (student.teamId?.includes('girls') ? 'Girls' : 'Boys');
            const sCat = student.category || getCategoryFromClassAndGender(student.studentClass || '5', sGender);

            const enrolledCount = student.registeredProgrammeIds?.length || 0;

            return (
              <div 
                key={student.id} 
                className="premium-card p-5 space-y-3 border border-neutral-200/60 dark:border-neutral-800/60 hover:scale-[1.01] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono font-black text-xs border border-amber-400/40">
                      <Lock size={11} className="text-amber-600" />
                      Chest #{student.chestNo || 'N/A'} 🔒
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      sGroup === 'DIRAYA' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                      sGroup === 'FUROOHA' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {sGroup} {sGender.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-base text-neutral-900 dark:text-white leading-tight">
                      {student.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-0.5">
                      <span>Class {student.studentClass || '5'}</span>
                      <span className="uppercase">{sCat}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-500">Enrolled Events:</span>
                  <span className="font-mono font-extrabold text-rose-500">{enrolledCount} Programs</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-12 premium-card text-neutral-500 text-sm">
            No contenders found matching your filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
