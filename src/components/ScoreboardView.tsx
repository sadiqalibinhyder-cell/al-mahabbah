import React, { useState } from 'react';
import { Team, PublishedResult, Programme, UserProfile } from '../types';
import { Trophy, Award, Medal, Crown, Sparkles, User, Users, Flame, Zap, Shield, Star } from 'lucide-react';
import { calculateToppersFromResults } from '../utils/studentUtils';
import { calculateOfficialScoreboard } from '../utils/scoreboardEngine';

interface ScoreboardViewProps {
  teams: Team[];
  results: PublishedResult[];
  programmes: Programme[];
  users?: UserProfile[];
}

export const ScoreboardView: React.FC<ScoreboardViewProps> = ({
  teams,
  results,
  programmes,
  users = [],
}) => {
  const [festTab, setFestTab] = useState<'grand' | 'boys' | 'girls'>('grand');

  // Single Authoritative Official Scoreboard Calculation Engine
  const officialData = calculateOfficialScoreboard(results, programmes, teams);

  // Helper: Detailed breakdown for a team
  const getTeamBreakdown = (teamId: string) => {
    let stagePoints = 0;
    let offStagePoints = 0;
    let catAPoints = 0;
    let catBPoints = 0;
    let individualPoints = 0;
    let groupPoints = 0;
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;

    results.forEach(res => {
      const prog = programmes.find(p => p.id === res.programmeId);
      if (!prog) return;

      const isPublished = prog ? (prog.resultPublished === true) : (res.locked === true);
      if (!isPublished) return;

      const isGirlsProg = prog.categoryGroup ? prog.categoryGroup.toLowerCase().includes('girls') : false;

      res.rankings.forEach(ranking => {
        let targetId = ranking.teamId;
        if (targetId === 'diraya') targetId = isGirlsProg ? 'diraya_girls' : 'diraya_boys';
        if (targetId === 'furooha') targetId = isGirlsProg ? 'furooha_girls' : 'furooha_boys';
        if (targetId === 'swaraha') targetId = isGirlsProg ? 'swaraha_girls' : 'swaraha_boys';

        if (targetId === teamId) {
          if (prog.section === 'Stage') stagePoints += (ranking.points || 0);
          else offStagePoints += (ranking.points || 0);

          if (prog.category === 'A') catAPoints += (ranking.points || 0);
          else catBPoints += (ranking.points || 0);

          if (prog.type === 'Individual') individualPoints += (ranking.points || 0);
          else groupPoints += (ranking.points || 0);

          if (ranking.position === 1) goldCount += 1;
          else if (ranking.position === 2) silverCount += 1;
          else if (ranking.position === 3) bronzeCount += 1;
        }
      });
    });

    return {
      stagePoints,
      offStagePoints,
      catAPoints,
      catBPoints,
      individualPoints,
      groupPoints,
      goldCount,
      silverCount,
      bronzeCount
    };
  };

  // Group Color Themes (Executive Professional Palette)
  const GROUP_THEMES: Record<string, {
    headerGradient: string;
    cardBorder: string;
    shadow: string;
    titleColor: string;
    badgePill: string;
    icon: React.ReactNode;
    accentBg: string;
    accentText: string;
  }> = {
    diraya: {
      headerGradient: 'bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900',
      cardBorder: 'border-purple-500/30 dark:border-purple-500/50',
      shadow: 'shadow-purple-500/10',
      titleColor: 'text-purple-600 dark:text-purple-400',
      badgePill: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
      icon: <Trophy size={40} className="text-amber-300 fill-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.8)]" />,
      accentBg: 'bg-purple-50 dark:bg-purple-950/40',
      accentText: 'text-purple-600 dark:text-purple-300'
    },
    furooha: {
      headerGradient: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900',
      cardBorder: 'border-emerald-500/30 dark:border-emerald-500/50',
      shadow: 'shadow-emerald-500/10',
      titleColor: 'text-emerald-600 dark:text-emerald-400',
      badgePill: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
      icon: <Award size={40} className="text-teal-200 fill-teal-200/20 drop-shadow-[0_0_15px_rgba(153,246,228,0.8)]" />,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      accentText: 'text-emerald-600 dark:text-emerald-300'
    },
    swaraha: {
      headerGradient: 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700',
      cardBorder: 'border-amber-500/30 dark:border-amber-500/50',
      shadow: 'shadow-amber-500/10',
      titleColor: 'text-amber-600 dark:text-amber-400',
      badgePill: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
      icon: <Medal size={40} className="text-amber-200 fill-amber-200/20 drop-shadow-[0_0_15px_rgba(253,230,138,0.8)]" />,
      accentBg: 'bg-amber-50 dark:bg-amber-950/40',
      accentText: 'text-amber-600 dark:text-amber-300'
    }
  };

  const GROUPS = [
    { id: 'diraya', name: 'DIRAYA' },
    { id: 'furooha', name: 'FUROOHA' },
    { id: 'swaraha', name: 'SWARAHA' }
  ];

  // Calculate Grand Totals derived from the single central official score calculation engine
  const grandFestStandings = GROUPS.map(g => {
    const officialGroup = officialData.teams.find(t => t.id === g.id);
    const boysTeam = teams.find(t => (t.groupId === g.id || t.id.includes(g.id)) && (t.gender === 'Boys' || t.id.endsWith('_boys')));
    const girlsTeam = teams.find(t => (t.groupId === g.id || t.id.includes(g.id)) && (t.gender === 'Girls' || t.id.endsWith('_girls')));

    const boysBreakdown = boysTeam ? getTeamBreakdown(boysTeam.id) : { stagePoints: 0, offStagePoints: 0, goldCount: 0, silverCount: 0, bronzeCount: 0 };
    const girlsBreakdown = girlsTeam ? getTeamBreakdown(girlsTeam.id) : { stagePoints: 0, offStagePoints: 0, goldCount: 0, silverCount: 0, bronzeCount: 0 };

    const boysPoints = officialGroup ? officialGroup.boysPoints : (boysBreakdown.stagePoints + boysBreakdown.offStagePoints);
    const girlsPoints = officialGroup ? officialGroup.girlsPoints : (girlsBreakdown.stagePoints + girlsBreakdown.offStagePoints);
    const grandTotal = officialGroup ? officialGroup.totalPoints : (boysPoints + girlsPoints);

    return {
      ...g,
      boysTeam: boysTeam ? { ...boysTeam, points: boysPoints } : undefined,
      girlsTeam: girlsTeam ? { ...girlsTeam, points: girlsPoints } : undefined,
      boysPoints,
      girlsPoints,
      grandTotal,
      goldCount: boysBreakdown.goldCount + girlsBreakdown.goldCount,
      silverCount: boysBreakdown.silverCount + girlsBreakdown.silverCount,
      bronzeCount: boysBreakdown.bronzeCount + girlsBreakdown.bronzeCount,
    };
  }).sort((a, b) => b.grandTotal - a.grandTotal);

  // Filter Boys Division Teams derived strictly from central score calculation engine
  const boysFestStandings = teams
    .filter(t => t.gender === 'Boys' || t.id.endsWith('_boys'))
    .map(t => {
      const divTeam = officialData.divisionTeams.find(dt => dt.id === t.id);
      const breakdown = getTeamBreakdown(t.id);
      const computedPts = breakdown.stagePoints + breakdown.offStagePoints;
      return {
        ...t,
        points: divTeam ? divTeam.points : computedPts
      };
    })
    .sort((a, b) => b.points - a.points);

  // Filter Girls Division Teams derived strictly from central score calculation engine
  const girlsFestStandings = teams
    .filter(t => t.gender === 'Girls' || t.id.endsWith('_girls'))
    .map(t => {
      const divTeam = officialData.divisionTeams.find(dt => dt.id === t.id);
      const breakdown = getTeamBreakdown(t.id);
      const computedPts = breakdown.stagePoints + breakdown.offStagePoints;
      return {
        ...t,
        points: divTeam ? divTeam.points : computedPts
      };
    })
    .sort((a, b) => b.points - a.points);

  const highestGrandScore = grandFestStandings[0]?.grandTotal || 1;

  return (
    <div className="space-y-8 animate-fade-in pb-20 font-sans" id="scoreboard-view-container">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-neutral-950 via-purple-950 to-slate-950 p-6 md:p-10 text-white shadow-2xl border border-purple-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src="/meelad_fest_logo.jpg" 
              alt="Meelad Fest Official Emblem" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-2xl ring-4 ring-emerald-500/20 shrink-0"
            />
            <div>
              <span className="px-3.5 py-1 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 font-sans text-xs font-extrabold uppercase tracking-wider">
                Automatic Live Scoring Engine
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white flex items-center gap-3 mt-1.5">
                <Trophy className="text-amber-400 fill-amber-400 animate-pulse shrink-0" size={32} />
                Meelad Arts Fest Scoreboard
              </h2>
              <p className="text-xs sm:text-sm font-medium text-purple-200 mt-1 max-w-xl">
                Automatic realtime points aggregation for <span className="font-extrabold text-purple-300">DIRAYA</span>, <span className="font-extrabold text-emerald-300">FUROOHA</span>, and <span className="font-extrabold text-amber-300">SWARAHA</span> across Boys & Girls Divisions.
              </p>
            </div>
          </div>

          {/* Sub-View Selector Tabs */}
          <div className="flex flex-wrap p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0 gap-1.5 self-start lg:self-center" id="scoreboard-tab-group">
            <button
              onClick={() => setFestTab('grand')}
              className={`px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-display font-extrabold transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
                festTab === 'grand'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles size={15} />
              GRAND FEST
            </button>
            <button
              onClick={() => setFestTab('boys')}
              className={`px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-display font-extrabold transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
                festTab === 'boys'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <User size={15} />
              BOYS FEST
            </button>
            <button
              onClick={() => setFestTab('girls')}
              className={`px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-display font-extrabold transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
                festTab === 'girls'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users size={15} />
              GIRLS FEST
            </button>
          </div>
        </div>
      </div>

      {/* 1. GRAND FEST TAB */}
      {festTab === 'grand' && (
        <div className="space-y-8" id="grand-fest-view">
          
          {/* Executive Clean Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-stretch">
            {grandFestStandings.map((group, idx) => {
              const desktopOrder = idx === 0 ? 'md:order-2 md:-mt-6 ring-4 ring-amber-400/80 shadow-2xl' : idx === 1 ? 'md:order-1' : 'md:order-3 md:mt-4';
              
              const theme = GROUP_THEMES[group.id] || GROUP_THEMES['diraya'];

              const rankLabel = idx === 0 ? 'CHAMPION GROUP' : idx === 1 ? 'RUNNER UP' : '3RD PLACE';
              const rankBadgeIcon = idx === 0 ? <Crown size={14} className="text-amber-300 fill-amber-300" /> : idx === 1 ? <Award size={14} className="text-teal-200" /> : <Medal size={14} className="text-amber-200" />;

              return (
                <div 
                  key={group.id} 
                  className={`rounded-[36px] bg-white dark:bg-[#18181b] border-2 ${theme.cardBorder} ${theme.shadow} ${desktopOrder} overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-xl`}
                >
                  {/* Top Rich Banner Header */}
                  <div className={`p-6 sm:p-8 text-center text-white ${theme.headerGradient} relative overflow-hidden space-y-4`}>
                    
                    {/* Rank Pill Badge */}
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-display font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${theme.badgePill}`}>
                        {rankBadgeIcon}
                        {rankLabel}
                      </span>
                    </div>

                    {/* Circular Icon Crest Container */}
                    <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto shadow-2xl">
                      {theme.icon}
                    </div>

                    {/* Group Title */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">{group.name}</h3>
                      <span className="text-[11px] font-sans text-white/90 font-bold uppercase tracking-widest block mt-0.5">Grand Championship</span>
                    </div>
                  </div>

                  {/* Card Body Section */}
                  <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                    
                    {/* Points Counter Box */}
                    <div className="text-center p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-1">
                      <div className="text-5xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight tabular-nums">
                        {group.grandTotal}
                        <span className="text-xs font-sans font-bold text-neutral-400 uppercase ml-1.5 tracking-wider">PTS</span>
                      </div>
                      <div className="text-[11px] font-sans font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Automatic Realtime Aggregation
                      </div>
                    </div>

                    {/* Division Points Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40 text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-sans uppercase tracking-wider">
                          <User size={14} />
                          Boys Division
                        </div>
                        <div className="text-2xl font-display font-extrabold text-neutral-900 dark:text-white">
                          {group.boysPoints} <span className="text-[11px] font-sans font-bold text-neutral-400 uppercase">pts</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-200/50 dark:border-pink-800/40 text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-pink-600 dark:text-pink-400 font-sans uppercase tracking-wider">
                          <Users size={14} />
                          Girls Division
                        </div>
                        <div className="text-2xl font-display font-extrabold text-neutral-900 dark:text-white">
                          {group.girlsPoints} <span className="text-[11px] font-sans font-bold text-neutral-400 uppercase">pts</span>
                        </div>
                      </div>
                    </div>

                    {/* Formula Pill Bar */}
                    <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 font-sans">
                      <span className="uppercase text-[11px] font-extrabold text-neutral-400 tracking-wider">Formula:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold font-sans">
                        {group.boysPoints} (Boys) + {group.girlsPoints} (Girls) = {group.grandTotal} Total
                      </span>
                    </div>

                    {/* Medals Tally Stats Footer */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                        <span className="text-[10px] font-sans font-extrabold text-amber-500 uppercase flex items-center justify-center gap-1 tracking-wider">
                          <Crown size={11} /> 1st
                        </span>
                        <span className="font-display font-extrabold text-neutral-900 dark:text-white text-base block mt-0.5">{group.goldCount}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                        <span className="text-[10px] font-sans font-extrabold text-slate-400 uppercase flex items-center justify-center gap-1 tracking-wider">
                          <Award size={11} /> 2nd
                        </span>
                        <span className="font-display font-extrabold text-neutral-900 dark:text-white text-base block mt-0.5">{group.silverCount}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                        <span className="text-[10px] font-sans font-extrabold text-amber-700 uppercase flex items-center justify-center gap-1 tracking-wider">
                          <Medal size={11} /> 3rd
                        </span>
                        <span className="font-display font-extrabold text-neutral-900 dark:text-white text-base block mt-0.5">{group.bronzeCount}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Progress Bar Breakdown */}
          <div className="premium-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                <Flame size={20} className="text-amber-500" />
                Grand Championship Standings Chart
              </h3>
              <span className="text-xs font-sans font-bold text-neutral-400 uppercase tracking-wider">Boys Points + Girls Points</span>
            </div>

            <div className="space-y-6">
              {grandFestStandings.map((group, idx) => {
                const percentage = Math.max(10, (group.grandTotal / highestGrandScore) * 100);
                const boysWidth = group.grandTotal > 0 ? (group.boysPoints / group.grandTotal) * 100 : 50;
                const girlsWidth = group.grandTotal > 0 ? (group.girlsPoints / group.grandTotal) * 100 : 50;

                const theme = GROUP_THEMES[group.id] || GROUP_THEMES['diraya'];

                return (
                  <div key={group.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold font-sans">
                      <span className="text-neutral-900 dark:text-white font-extrabold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-white font-display text-[11px] font-black flex items-center justify-center ${theme.headerGradient}`}>
                          {idx + 1}
                        </span>
                        <span className={theme.titleColor}>{group.name}</span>
                      </span>
                      <span className="font-display text-neutral-900 dark:text-white font-extrabold text-sm">
                        {group.grandTotal} <span className="text-neutral-400 text-xs font-sans uppercase">PTS</span>
                      </span>
                    </div>

                    {/* Dual Stacked Progress Bar */}
                    <div className="h-5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex p-0.5 border border-neutral-200 dark:border-neutral-700">
                      <div 
                        className="h-full rounded-l-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[9px] font-sans font-extrabold text-white flex items-center justify-center px-1 uppercase"
                        style={{ width: `${(percentage * boysWidth) / 100}%` }}
                        title={`Boys: ${group.boysPoints} pts`}
                      >
                        {group.boysPoints > 0 && `Boys ${group.boysPoints}`}
                      </div>
                      <div 
                        className="h-full rounded-r-full bg-gradient-to-r from-pink-500 to-rose-600 text-[9px] font-sans font-extrabold text-white flex items-center justify-center px-1 uppercase"
                        style={{ width: `${(percentage * girlsWidth) / 100}%` }}
                        title={`Girls: ${group.girlsPoints} pts`}
                      >
                        {group.girlsPoints > 0 && `Girls ${group.girlsPoints}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 2. BOYS FEST TAB */}
      {festTab === 'boys' && (
        <div className="space-y-6" id="boys-fest-view">
          <div className="premium-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                  <User size={22} className="text-indigo-600" />
                  BOYS FEST CHAMPIONSHIP STANDINGS
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Automatically aggregated points for Boys Division programmes</p>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-sans text-xs font-extrabold uppercase tracking-wider">
                Boys Division
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {boysFestStandings.map((team, idx) => {
                const breakdown = getTeamBreakdown(team.id);
                const rankIcon = idx === 0 ? <Crown size={32} className="text-amber-400 fill-amber-400 mx-auto" /> : idx === 1 ? <Award size={32} className="text-slate-300 fill-slate-300 mx-auto" /> : <Medal size={32} className="text-amber-600 fill-amber-600 mx-auto" />;

                return (
                  <div key={team.id} className="p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-transparent space-y-4 text-center shadow-lg">
                    <div>{rankIcon}</div>
                    <h4 className="font-display font-black text-xl text-neutral-900 dark:text-white">{team.name}</h4>
                    
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/40">
                      <div className="text-4xl font-display font-black text-indigo-600 dark:text-indigo-400">{team.points}</div>
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mt-1">Boys Total Points</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-bold">Stage Pts</span>
                        <span className="font-display font-bold text-neutral-900 dark:text-white">{breakdown.stagePoints}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-bold">Off-Stage Pts</span>
                        <span className="font-display font-bold text-neutral-900 dark:text-white">{breakdown.offStagePoints}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. GIRLS FEST TAB */}
      {festTab === 'girls' && (
        <div className="space-y-6" id="girls-fest-view">
          <div className="premium-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                  <Users size={22} className="text-pink-600" />
                  GIRLS FEST CHAMPIONSHIP STANDINGS
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Automatically aggregated points for Girls Division programmes</p>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 font-sans text-xs font-extrabold uppercase tracking-wider">
                Girls Division
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {girlsFestStandings.map((team, idx) => {
                const breakdown = getTeamBreakdown(team.id);
                const rankIcon = idx === 0 ? <Crown size={32} className="text-amber-400 fill-amber-400 mx-auto" /> : idx === 1 ? <Award size={32} className="text-slate-300 fill-slate-300 mx-auto" /> : <Medal size={32} className="text-amber-600 fill-amber-600 mx-auto" />;

                return (
                  <div key={team.id} className="p-6 rounded-3xl border border-pink-500/20 bg-gradient-to-b from-pink-500/10 to-transparent space-y-4 text-center shadow-lg">
                    <div>{rankIcon}</div>
                    <h4 className="font-display font-black text-xl text-neutral-900 dark:text-white">{team.name}</h4>
                    
                    <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/40">
                      <div className="text-4xl font-display font-black text-pink-600 dark:text-pink-400">{team.points}</div>
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mt-1">Girls Total Points</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-bold">Stage Pts</span>
                        <span className="font-display font-bold text-neutral-900 dark:text-white">{breakdown.stagePoints}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-bold">Off-Stage Pts</span>
                        <span className="font-display font-bold text-neutral-900 dark:text-white">{breakdown.offStagePoints}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
