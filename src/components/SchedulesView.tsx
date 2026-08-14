import React, { useState, useEffect } from 'react';
import { Programme } from '../types';
import { 
  Calendar, Clock, MapPin, Search, Filter, Sparkles, Layers, 
  CheckCircle2, AlertCircle, Compass, Zap, Flame, Grid, List, 
  Clock3, ShieldAlert, FileText, Share2, Printer, Tag, Check, HelpCircle
} from 'lucide-react';
import { enrichProgrammesWithSchedule } from '../utils/scheduleData';

interface SchedulesViewProps {
  programmes: Programme[];
}

export const SchedulesView: React.FC<SchedulesViewProps> = ({ programmes: rawProgrammes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'All' | 'On-Stage' | 'Off-Stage'>('Off-Stage');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Boys' | 'Girls' | 'Boys & Girls'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'venue'>('timeline');

  // Always enrich programmes with official schedule metadata
  const programmes = enrichProgrammesWithSchedule(rawProgrammes);

  // Live timer tick for real-time countdown calculations
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Robust Date Matcher
  const isDateMatched = (scheduledDate?: string, filterDate?: string) => {
    if (!filterDate || filterDate === 'All') return true;
    if (!scheduledDate) return false;
    if (filterDate === 'TBD') return scheduledDate === 'TBD' || scheduledDate === 'Not Scheduled';

    const dayNum = filterDate.split(' ')[0]; // '11', '12', etc.
    return scheduledDate.includes(dayNum);
  };

  // Robust Category Matcher
  const isCategoryMatched = (p: Programme, catFilter: string) => {
    if (!catFilter || catFilter === 'All') return true;
    const catLevel = (p.categoryLevel || '').toLowerCase();
    const catGroup = (p.categoryGroup || '').toLowerCase();
    const target = catFilter.toLowerCase();

    if (target.includes('kiddies')) {
      return catLevel.includes('kiddies') || catGroup.includes('kiddies');
    }
    if (target.includes('sub junior')) {
      return catLevel.includes('sub junior') || catGroup.includes('sub junior');
    }
    if (target.includes('super senior')) {
      return catLevel.includes('super senior') || catGroup.includes('super senior');
    }
    if (target.includes('senior') && !target.includes('super')) {
      return catLevel === 'senior' || (catGroup.includes('senior') && !catGroup.includes('super'));
    }
    if (target.includes('junior') && !target.includes('sub')) {
      return catLevel === 'junior' || (catGroup.includes('junior') && !catGroup.includes('sub'));
    }
    if (target.includes('general')) {
      return catLevel.includes('general') || catGroup.includes('general');
    }

    return catLevel.includes(target) || catGroup.includes(target);
  };

  // Filter programmes
  const filtered = programmes.filter(p => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = p.title.toLowerCase().includes(q);
      const codeMatch = p.code.toLowerCase().includes(q);
      const venueMatch = (p.venue || '').toLowerCase().includes(q);
      if (!titleMatch && !codeMatch && !venueMatch) return false;
    }

    // Stage Type (On-Stage vs Off-Stage)
    if (stageFilter !== 'All') {
      const isOff = p.section === 'Off-Stage' || p.stageType === 'Off-Stage';
      if (stageFilter === 'Off-Stage' && !isOff) return false;
      if (stageFilter === 'On-Stage' && isOff) return false;
    }

    // Gender Filter
    if (genderFilter !== 'All') {
      const g = p.gender || (p.categoryGroup?.toLowerCase().includes('girls') ? 'Girls' : 'Boys');
      if (genderFilter === 'Boys' && g !== 'Boys' && g !== 'Boys & Girls') return false;
      if (genderFilter === 'Girls' && g !== 'Girls' && g !== 'Boys & Girls') return false;
      if (genderFilter === 'Boys & Girls' && g !== 'Boys & Girls') return false;
    }

    // Category Level Filter
    if (!isCategoryMatched(p, categoryFilter)) return false;

    // Date Filter
    if (!isDateMatched(p.scheduledDate, dateFilter)) return false;

    return true;
  });

  // Calculate stats
  const totalOffStage = programmes.filter(p => p.section === 'Off-Stage' || p.stageType === 'Off-Stage').length;
  const totalOnStage = programmes.filter(p => p.section === 'Stage' && p.stageType !== 'Off-Stage').length;

  // Group by Date -> Time slot for Timeline View
  const datesOrder = ['11.08.2026', '12.08.2026', '13.08.2026', '14.08.2026', '16.08.2026', '17.08.2026', '18.08.2026', '19.08.2026', '20.08.2026', 'TBD'];
  
  const timelineGrouped: Record<string, Record<string, Programme[]>> = {};

  filtered.forEach(p => {
    const d = p.scheduledDate || 'TBD';
    const t = p.startTime && p.endTime ? `${p.startTime}–${p.endTime}` : (p.startTime || 'TBD');

    if (!timelineGrouped[d]) timelineGrouped[d] = {};
    if (!timelineGrouped[d][t]) timelineGrouped[d][t] = [];
    timelineGrouped[d][t].push(p);
  });

  // Venue Grouping
  const venuesMap: Record<string, Programme[]> = {};
  filtered.forEach(p => {
    const v = p.venue || 'Examination Hall';
    if (!venuesMap[v]) venuesMap[v] = [];
    venuesMap[v].push(p);
  });

  // Date Label Helper
  const formatDateLabel = (d: string) => {
    if (d === 'TBD') return '📅 UNSCHEDULED / TBD';
    const parts = d.split('.');
    if (parts.length === 3) {
      const day = parts[0];
      const monthNames: Record<string, string> = { '08': 'AUGUST', '09': 'SEPTEMBER', '10': 'OCTOBER' };
      return `📅 ${day} ${monthNames[parts[1]] || 'AUGUST'} 2026`;
    }
    return `📅 ${d}`;
  };

  // Status Badge Component with Live Countdown
  const renderStatusBadge = (prog: Programme) => {
    if (!prog.scheduledDate || prog.scheduledDate === 'TBD' || !prog.startTime || prog.startTime === 'TBD') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-extrabold uppercase border border-amber-500/20 flex items-center gap-1">
          <HelpCircle size={12} /> TBD / Not Scheduled
        </span>
      );
    }

    if (prog.scheduleStatus === 'CANCELLED') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-extrabold uppercase border border-rose-500/20 flex items-center gap-1">
          <AlertCircle size={12} /> CANCELLED
        </span>
      );
    }

    if (prog.scheduleStatus === 'POSTPONED') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-extrabold uppercase border border-orange-500/20 flex items-center gap-1">
          <Clock size={12} /> POSTPONED
        </span>
      );
    }

    // Check target date & time vs Now
    const parts = prog.scheduledDate.split('.');
    if (parts.length === 3) {
      const year = parts[2];
      const month = parts[1];
      const day = parts[0];
      const startISO = `${year}-${month}-${day}T${prog.startTime}:00`;
      const endISO = `${year}-${month}-${day}T${prog.endTime || prog.startTime}:00`;

      const startDate = new Date(startISO);
      const endDate = new Date(endISO);

      if (now >= startDate && now <= endDate) {
        return (
          <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-mono text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md animate-pulse">
            <Flame size={13} /> 🔴 LIVE NOW
          </span>
        );
      }

      if (now > endDate) {
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-extrabold uppercase border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 size={12} /> ✓ COMPLETED
          </span>
        );
      }

      // Remaining Time Countdown
      const diffMs = startDate.getTime() - now.getTime();
      if (diffMs > 0 && diffMs < 24 * 3600 * 1000) {
        const hours = Math.floor(diffMs / (3600 * 1000));
        const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
        const secs = Math.floor((diffMs % (60 * 1000)) / 1000);
        const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;

        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black uppercase border border-indigo-500/20 flex items-center gap-1">
            <Clock3 size={12} className="text-indigo-500 animate-spin" />
            STARTS IN {pad(hours)}:{pad(mins)}:{pad(secs)}
          </span>
        );
      }
    }

    return (
      <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[10px] font-extrabold uppercase border border-sky-500/20 flex items-center gap-1">
        <Calendar size={12} /> UPCOMING
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24" id="schedules-view">
      
      {/* 1. EXECUTIVE ARTS FEST TIMETABLE BANNER */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-neutral-950 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20 shrink-0">
            <Calendar size={30} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider">
                MEELAD ARTS FEST 2026–27
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase tracking-wider">
                {totalOffStage} OFF-STAGE SCHEDULED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono text-[10px] font-black uppercase tracking-wider">
                {totalOnStage} ON-STAGE EVENTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-1">
              Off-Stage & Master Program Schedule
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              Official time-table for Kiddies, Sub Junior, Junior, Senior, Super Senior & General competitions
            </p>
          </div>
        </div>

        {/* View Mode Toggle Controls & Print */}
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          <div className="flex items-center gap-1 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800">
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'timeline' ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Clock size={14} />
              Daily Timeline
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid size={14} />
              Grid View
            </button>
            <button 
              onClick={() => setViewMode('venue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'venue' ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapPin size={14} />
              By Stage / Venue
            </button>
          </div>

          <button 
            onClick={() => window.print()}
            className="p-2.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Print Official Timetable"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* 2. MAIN STAGE FILTER SELECTOR (OFF-STAGE / ON-STAGE / ALL) */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-4 sm:gap-6 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setStageFilter('Off-Stage')}
          className={`pb-3 text-sm font-display font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            stageFilter === 'Off-Stage' 
              ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <FileText size={18} />
          OFF-STAGE SCHEDULE ({totalOffStage})
        </button>

        <button
          onClick={() => setStageFilter('On-Stage')}
          className={`pb-3 text-sm font-display font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            stageFilter === 'On-Stage' 
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Flame size={18} />
          ON-STAGE EVENTS ({totalOnStage})
        </button>

        <button
          onClick={() => setStageFilter('All')}
          className={`pb-3 text-sm font-display font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            stageFilter === 'All' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Layers size={18} />
          ALL FESTIVAL PROGRAMS ({programmes.length})
        </button>
      </div>

      {/* 3. DATE FILTER TABS BAR */}
      <div className="premium-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar size={13} className="text-emerald-500" /> FILTER BY OFFICIAL DATE
          </span>
          <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {filtered.length} Programs Matching
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[
            { id: 'All', label: 'ALL DATES' },
            { id: '11 AUG', label: '11 AUG' },
            { id: '12 AUG', label: '12 AUG' },
            { id: '13 AUG', label: '13 AUG' },
            { id: '14 AUG', label: '14 AUG' },
            { id: '16 AUG', label: '16 AUG' },
            { id: '17 AUG', label: '17 AUG' },
            { id: '18 AUG', label: '18 AUG' },
            { id: '19 AUG', label: '19 AUG' },
            { id: '20 AUG', label: '20 AUG' },
            { id: 'TBD', label: 'TBD / NOT SCHEDULED' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                dateFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. CATEGORY & GENDER FILTER TOOLBAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold pt-2 border-t border-neutral-200 dark:border-neutral-800">
          
          {/* Search Box */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              Search Schedule:
            </span>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-neutral-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code # or title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              Gender Division:
            </span>
            <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1 text-xs font-extrabold border border-neutral-200 dark:border-neutral-800">
              {(['All', 'Boys', 'Girls', 'Boys & Girls'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-[11px] cursor-pointer text-center truncate ${
                    genderFilter === g ? 'bg-indigo-600 text-white shadow-xs font-black' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              Category Level:
            </span>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-extrabold outline-none text-neutral-900 dark:text-white"
              >
                <option value="All">ALL CATEGORIES</option>
                <option value="Kiddies">Kiddies (Boys & Girls)</option>
                <option value="Sub Junior">Sub Junior</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Super Senior">Super Senior</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStageFilter('Off-Stage');
                setGenderFilter('All');
                setCategoryFilter('All');
                setDateFilter('All');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* 5. VIEW 1: DAILY TIMELINE VIEW (Chrono Card Layout) */}
      {viewMode === 'timeline' && (
        <div className="space-y-10">
          {Object.keys(timelineGrouped).length > 0 ? (
            Object.keys(timelineGrouped)
              .sort((a, b) => datesOrder.indexOf(a) - datesOrder.indexOf(b))
              .map(dateKey => {
                const timeSlots = Object.keys(timelineGrouped[dateKey]);

                return (
                  <div key={dateKey} className="space-y-6">
                    
                    {/* Date Section Header */}
                    <div className="flex items-center gap-3 border-b-2 border-emerald-500/40 pb-3">
                      <div className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-display font-black text-sm tracking-wide shadow-md uppercase flex items-center gap-2">
                        <Calendar size={16} />
                        {formatDateLabel(dateKey)}
                      </div>
                      <span className="text-xs font-mono font-extrabold text-neutral-400">
                        ({timeSlots.reduce((acc, ts) => acc + timelineGrouped[dateKey][ts].length, 0)} Competitions)
                      </span>
                    </div>

                    {/* Time Slots inside Date */}
                    <div className="space-y-6 pl-2 sm:pl-4 border-l-2 border-dashed border-neutral-200 dark:border-neutral-800">
                      {timeSlots.map(slotKey => {
                        const slotPrograms = timelineGrouped[dateKey][slotKey];

                        return (
                          <div key={slotKey} className="space-y-3 relative">
                            {/* Bullet dot on timeline line */}
                            <div className="absolute -left-[15px] sm:-left-[23px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-neutral-950 shadow-sm"></div>

                            {/* Time Badge */}
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-amber-400 font-mono font-black text-xs shadow-xs flex items-center gap-1.5">
                                <Clock size={13} />
                                {slotKey}
                              </span>
                            </div>

                            {/* Program Cards Grid for Time Slot */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {slotPrograms.map(prog => {
                                const catGrp = prog.categoryGroup || `${prog.categoryLevel} ${prog.gender}`;
                                const isGirls = (prog.gender === 'Girls' || (prog.categoryGroup || '').toLowerCase().includes('girls'));
                                const isKiddies = (prog.categoryLevel === 'Kiddies' || (prog.categoryGroup || '').toLowerCase().includes('kiddies'));

                                return (
                                  <div 
                                    key={prog.id} 
                                    className="premium-card p-5 space-y-4 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                  >
                                    <div className="space-y-3">
                                      
                                      {/* Header Badges */}
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="px-3 py-1 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 dark:text-amber-400 font-mono font-black text-xs shadow-xs shrink-0">
                                          #{prog.code}
                                        </span>

                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                                            prog.section === 'Off-Stage' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                          }`}>
                                            {prog.section || 'Off-Stage'}
                                          </span>

                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                                            isKiddies 
                                              ? 'bg-amber-400 text-black font-extrabold'
                                              : isGirls 
                                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' 
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                          }`}>
                                            {prog.categoryLevel || 'Sub Junior'} {prog.gender || 'Boys'}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Title */}
                                      <div>
                                        <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white leading-tight">
                                          {prog.title}
                                        </h3>
                                        <span className="text-[10px] font-mono text-neutral-400 font-semibold mt-1 block">
                                          Type: {prog.type} Competition ({prog.category || 'A'})
                                        </span>
                                      </div>
                                    </div>

                                    {/* Footer: Venue & Live Status Badge */}
                                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs font-semibold">
                                      <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                                        <span className="flex items-center gap-1.5 truncate">
                                          <MapPin size={15} className="text-rose-500 shrink-0" />
                                          <span className="truncate font-bold">{prog.venue || 'Off-Stage Hall'}</span>
                                        </span>
                                      </div>

                                      <div className="pt-1 flex items-center justify-between">
                                        {renderStatusBadge(prog)}
                                      </div>
                                    </div>

                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })
          ) : (
            <div className="text-center py-16 premium-card space-y-3">
              <Calendar size={40} className="mx-auto text-neutral-400" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Programs Match Your Filters</h3>
              <p className="text-xs text-neutral-500">Try adjusting your date, category, or gender filter settings.</p>
            </div>
          )}
        </div>
      )}

      {/* 6. VIEW 2: GRID CATALOGUE VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map(prog => {
              const catGrp = prog.categoryGroup || `${prog.categoryLevel} ${prog.gender}`;
              const isGirls = (prog.gender === 'Girls' || (prog.categoryGroup || '').toLowerCase().includes('girls'));
              const isKiddies = (prog.categoryLevel === 'Kiddies' || (prog.categoryGroup || '').toLowerCase().includes('kiddies'));

              return (
                <div 
                  key={prog.id} 
                  className="premium-card p-6 space-y-4 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 dark:text-amber-400 font-mono font-black text-xs shadow-xs shrink-0">
                        #{prog.code}
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                          prog.section === 'Off-Stage' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {prog.section || 'Off-Stage'}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                          isKiddies 
                            ? 'bg-amber-400 text-black font-extrabold'
                            : isGirls 
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' 
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {prog.categoryLevel || 'Sub Junior'} {prog.gender || 'Boys'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white leading-tight">
                        {prog.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-extrabold uppercase">
                          {prog.type} Competition
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Details: Date, Time & Venue */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs font-semibold">
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-emerald-500 shrink-0" />
                        {prog.scheduledDate || 'TBD'}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Clock size={14} className="shrink-0" />
                        {prog.startTime && prog.endTime ? `${prog.startTime}–${prog.endTime}` : (prog.startTime || 'TBD')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] pt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin size={14} className="text-rose-500 shrink-0" />
                        <span className="truncate">{prog.venue || 'Examination Room'}</span>
                      </span>
                      {renderStatusBadge(prog)}
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12 premium-card text-neutral-500 text-sm">
              No competition schedules match your search filters.
            </div>
          )}
        </div>
      )}

      {/* 7. VIEW 3: VENUE GROUPED VIEW */}
      {viewMode === 'venue' && (
        <div className="space-y-8">
          {Object.keys(venuesMap).map(venueName => (
            <div key={venueName} className="premium-card p-6 md:p-8 space-y-4 border border-emerald-500/20">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                  <MapPin className="text-rose-500" size={22} />
                  {venueName} ({venuesMap[venueName].length} Events Scheduled)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venuesMap[venueName].map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 text-white font-mono font-bold text-[10px]">
                        #{p.code}
                      </span>
                      <span className="text-[10px] font-mono text-amber-500 font-bold">
                        {p.scheduledDate || 'TBD'} | {p.startTime || 'TBD'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{p.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold">
                      <span>{p.categoryGroup || `${p.categoryLevel} ${p.gender}`}</span>
                      {renderStatusBadge(p)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
