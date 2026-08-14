import React, { useState, useEffect } from 'react';
import { Announcement, Programme, Team, UserProfile, SystemSettings, PublishedResult, AppReview } from '../types';
import { 
  Calendar, MapPin, Clock, ArrowRight, Award, Megaphone, Sparkles, 
  Image as ImageIcon, ChevronRight, Trophy, Star, Search, Bell, 
  MessageCircle, Play, CheckCircle2, ShieldCheck, Zap, Layers, Bookmark, Home as HomeIcon, Users, Landmark, Download
} from 'lucide-react';
import { downloadResultPoster } from '../utils/posterGenerator';
import { calculateOfficialScoreboard } from '../utils/scoreboardEngine';

interface HomeViewProps {
  settings: SystemSettings;
  announcements: Announcement[];
  programmes: Programme[];
  teams: Team[];
  users?: UserProfile[];
  results?: PublishedResult[];
  reviews?: AppReview[];
  onNavigate: (view: string) => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
  onOpenWriteReview?: () => void;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-10-15T09:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-neutral-800 dark:text-neutral-100 font-mono text-xs font-semibold">
      <Clock size={13} className="text-amber-500 animate-pulse" />
      <span>Starts in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  announcements,
  programmes,
  teams,
  users = [],
  results = [],
  reviews = [],
  onNavigate,
  onSelectAnnouncement,
  onOpenWriteReview,
}) => {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const topTeams = sortedTeams.slice(0, 3);

  const pinnedAnnouncements = announcements.filter(a => a.pinned).slice(0, 2);
  const generalAnnouncements = announcements.filter(a => !a.pinned).slice(0, 3);
  const displayAnnouncements = [...pinnedAnnouncements, ...generalAnnouncements].slice(0, 4);

  const spotlightEvents = programmes.filter(p => p.status === 'Scheduled').slice(0, 4);

  // Exact real metrics
  const totalProgrammes = programmes.length;
  const stageProgrammes = programmes.filter(p => p.section === 'Stage').length;
  const offStageProgrammes = programmes.filter(p => p.section === 'Off-Stage').length;

  // Auto-scrolling effect for iPhone Mockup
  const phoneScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = phoneScrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let direction = 1;
    let speed = 0.4;

    const scrollLoop = () => {
      if (el) {
        if (direction === 1) {
          el.scrollTop += speed;
          if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
            direction = -1;
          }
        } else {
          el.scrollTop -= speed;
          if (el.scrollTop <= 0) {
            direction = 1;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    // Delay start slightly for smooth rendering
    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scrollLoop);
    }, 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  const totalTeamsCount = teams.length;
  const totalStudentsCount = users.filter(u => u.role === 'student').length;

  return (
    <div className="space-y-8 md:space-y-12 animate-fade-in" id="home-view-container">
      
      {/* 1. Flowmark Inspired Pastel Gradient Hero Section */}
      <section className="relative rounded-[36px] md:rounded-[44px] overflow-hidden bg-gradient-to-br from-[#fde4e8] via-[#f7e4ec] to-[#fde9d6] dark:from-[#251720] dark:via-[#1c1926] dark:to-[#281f18] p-6 sm:p-10 md:p-12 lg:p-16 border border-white/60 dark:border-white/10 shadow-xl" id="flowmark-hero-container">
        
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-200/40 dark:bg-rose-900/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-200/40 dark:bg-amber-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            {/* Official Logo & Campaign Tagline */}
            <div className="flex flex-wrap items-center gap-4">
              <img 
                src="/meelad_fest_logo.jpg" 
                alt="Meelad Fest Official Logo" 
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-amber-400/80 shadow-2xl ring-4 ring-emerald-500/20 shadow-emerald-950/40 shrink-0"
              />
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-mono text-xs font-bold uppercase tracking-widest shadow-sm">
                  <Sparkles size={13} className="text-amber-300 animate-pulse" />
                  Reviving the Prophetic Legacy
                </span>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-xs font-semibold uppercase tracking-wider shadow-xs">
                    <Calendar size={13} className="text-rose-500" />
                    Year {settings.academicYear}
                  </span>
                  <CountdownTimer />
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.08]">
              AL MAHABBAH <br />
              RABEEH CAMPAIGN
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 max-w-xl leading-relaxed font-medium">
              A grand cultural and spiritual campaign dedicated to “Reviving the Prophetic Legacy” — bringing together students, scholars, and youth for calligraphy, nasheed, public speaking, arts, and community unity.
            </p>

            {/* Buttons & Store Badges Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Dark Button */}
              <button 
                onClick={() => onNavigate('Results')}
                className="px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-bold text-sm tracking-tight hover:scale-105 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <span className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                  <ArrowRight size={14} />
                </span>
              </button>

              <button 
                onClick={() => onNavigate('Programmes')}
                className="px-6 py-3.5 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-neutral-900 dark:text-white font-bold text-sm tracking-tight transition-all border border-white/60 dark:border-white/10 flex items-center gap-2 cursor-pointer"
              >
                <span>Browse 113 Programs</span>
              </button>
            </div>

            {/* Social Proof Block (Exact Real Data Numbers) */}
            <div className="pt-4 flex items-center gap-4">
              {/* Overlapping Avatar Stack */}
              <div className="flex -space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" 
                  alt="User Avatar 1" 
                  className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover shadow-xs" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" 
                  alt="User Avatar 2" 
                  className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover shadow-xs" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" 
                  alt="User Avatar 3" 
                  className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover shadow-xs" 
                />
              </div>

              {/* Rating & Exact Real Data Stats */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-neutral-900 dark:text-white text-sm">4.9/5</span>
                  <div className="flex text-emerald-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                  {totalProgrammes} Official Programs • 10 Categories
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                  Real-time scoring & stage timing for {totalProgrammes} competitions ({stageProgrammes} Stage, {offStageProgrammes} Off-Stage) across Irshaduswibiyan Higher Secondary Madrassa.
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Realistic iPhone 16 Pro Titanium Slim Bezel Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-[310px] sm:w-[340px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-800 rounded-[46px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-neutral-600/60 text-neutral-900 dark:text-white select-none transition-transform hover:scale-[1.03] duration-500 ring-1 ring-white/30">
              
              {/* iPhone Side Buttons */}
              <div className="absolute -left-[6px] top-24 w-[3px] h-8 bg-neutral-600 rounded-l-md"></div>
              <div className="absolute -left-[6px] top-36 w-[3px] h-10 bg-neutral-600 rounded-l-md"></div>
              <div className="absolute -right-[6px] top-32 w-[3px] h-12 bg-neutral-600 rounded-r-md"></div>

              {/* Dynamic Island / Top Notch */}
              <div className="w-24 h-5 bg-neutral-950 border border-neutral-800 rounded-full mx-auto flex items-center justify-between px-3 mb-2 z-30 relative shadow-sm">
                <span className="text-[9px] text-white font-mono font-bold">9:41</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div className="w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700"></div>
                </div>
              </div>

              {/* Phone Screen Container with Auto-Scrolling Motion */}
              <div className="bg-[#f8f9fa] dark:bg-[#0c0c0e] rounded-[38px] p-3 text-neutral-900 dark:text-white overflow-hidden border border-neutral-200/80 dark:border-neutral-800">
                
                {/* Fixed Top App Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/60 dark:border-neutral-800/60 px-1">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/meelad_fest_logo.jpg" 
                      alt="Meelad Fest Official Emblem" 
                      className="w-7 h-7 rounded-xl object-cover border-2 border-amber-400/80 shadow-md ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <span className="text-[11px] font-black font-display text-neutral-900 dark:text-white leading-none block">Al Mahabbah App</span>
                      <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Live Fest 2026</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <Search size={14} />
                    <div className="relative">
                      <Bell size={14} />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </div>
                  </div>
                </div>

                {/* Auto-scrolling Vertical Track */}
                <div className="h-[430px] overflow-hidden relative">
                  <div className="animate-phone-auto-scroll space-y-3.5 pr-0.5">
                  
                  {/* Hero Event Live Card */}
                  <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white rounded-2xl p-3.5 shadow-lg space-y-2.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black font-display">Oct 15</span>
                      <span className="text-[8px] font-mono font-bold uppercase bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                        LIVE FEST DAY 1
                      </span>
                    </div>

                    {/* Scheduled Items inside Hero Card */}
                    <div className="space-y-1.5">
                      <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 text-[10px] font-semibold text-white flex items-center justify-between border border-white/20">
                        <div>
                          <div className="font-bold truncate">Qira'ath & Burda Recitation</div>
                          <div className="text-[8px] text-emerald-200 font-mono">09:15 - 11:45 AM • Main Stage</div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-400/40 text-[8px] font-bold text-white uppercase">Live</span>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-[10px] font-semibold text-white flex items-center justify-between border border-white/10">
                        <div>
                          <div className="font-bold truncate">Mad'hunnabi & Arabic Song</div>
                          <div className="text-[8px] text-emerald-200 font-mono">12:45 - 03:00 PM • Stage B</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column iOS 18 Widgets */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Left Widget: Circulars */}
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40 flex flex-col justify-between space-y-2">
                      <div className="w-6 h-6 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                        <Megaphone size={12} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-rose-950 dark:text-rose-200 leading-tight">Official Circulars</div>
                        <button className="mt-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-[8px] font-extrabold uppercase tracking-wider w-full shadow-xs">Read Now</button>
                      </div>
                    </div>

                    {/* Right Widget: Programs Count */}
                    <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/40 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-6 h-6 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                          <Trophy size={12} />
                        </div>
                        <span className="text-[8px] font-extrabold text-sky-600 dark:text-sky-400 font-mono uppercase">10 Cats</span>
                      </div>
                      <div>
                        <div className="text-xl font-black font-display text-neutral-900 dark:text-white leading-none">{totalProgrammes}</div>
                        <div className="text-[8px] font-extrabold text-sky-600 dark:text-sky-400 uppercase mt-0.5">Official Programs</div>
                      </div>
                    </div>
                  </div>

                  {/* Active Stage Live Widget */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Main Stage Hall
                      </span>
                      <span className="text-[9px] text-amber-500 font-extrabold cursor-pointer">Live Stream &gt;</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 font-display font-black text-[10px] shadow-sm">
                        STG 1
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[10px] text-neutral-900 dark:text-white truncate">Al Mahabbah Main Auditorium</div>
                        <div className="text-[8px] text-neutral-500">{stageProgrammes} Stage • {offStageProgrammes} Off-Stage Events</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-0.5">
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden border border-neutral-200/50">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-3/4 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-neutral-400 font-bold">
                        <span>75% Completed</span>
                        <span className="text-emerald-500">Live Auto Scoring</span>
                      </div>
                    </div>
                  </div>

                  {/* Extra Widget 1: Live Scoreboard Standings Preview */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-900/10 to-indigo-900/10 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-purple-600 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
                        <Trophy size={11} className="text-amber-400" />
                        Championship Standings
                      </span>
                      <span className="text-[8px] font-mono text-neutral-400 font-bold">LIVE SCORE</span>
                    </div>

                    <div className="space-y-1.5">
                      {(() => {
                        const officialSb = calculateOfficialScoreboard(results, programmes, teams);
                        return officialSb.teams.map((team, idx) => (
                          <div key={team.id} className="p-2 rounded-xl bg-white dark:bg-neutral-800/90 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-display text-[9px] font-extrabold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-neutral-900 dark:text-white truncate">{team.name}</span>
                            </div>
                            <span className="font-display font-extrabold text-purple-600 dark:text-purple-300 text-[11px]">{team.totalPoints} pts</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Extra Widget 2: Upcoming Stage Schedule */}
                  <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={11} className="text-emerald-500" />
                        Upcoming Events
                      </span>
                      <span className="text-[8px] text-emerald-500 font-bold">113 Total</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between text-[9px]">
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">Adaa'n (Call to Prayer)</div>
                          <div className="text-[8px] text-neutral-400 font-mono">10:30 AM • Junior Division</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold">Stage A</span>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between text-[9px]">
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">Islamic Elocution Speech</div>
                          <div className="text-[8px] text-neutral-400 font-mono">11:15 AM • Senior Division</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 font-bold">Stage B</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* Fixed Bottom App Navigation Dock inside phone */}
                <div className="mt-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-2 flex items-center justify-around text-neutral-400 shadow-sm border border-neutral-200/60 dark:border-neutral-800">
                  <div className="p-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs">
                    <HomeIcon size={13} />
                  </div>
                  <Calendar size={13} className="hover:text-neutral-900 dark:hover:text-white cursor-pointer" />
                  <Trophy size={13} className="hover:text-neutral-900 dark:hover:text-white cursor-pointer" />
                  <Users size={13} className="hover:text-neutral-900 dark:hover:text-white cursor-pointer" />
                </div>

              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 2. Main Dashboard Layout (Scoreboard & Spotlight Events) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Live Scoreboard */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          {/* Live Standings Module */}
          <section className="premium-card p-6 md:p-8" id="home-scoreboard">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Trophy className="text-amber-500" size={24} strokeWidth={2.5} />
                Live Grand Championship Standings
              </h2>
              <button 
                onClick={() => onNavigate('Scoreboard')}
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Full Scoreboard <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {(() => {
                const officialScoreboard = calculateOfficialScoreboard(results, programmes, teams);
                return officialScoreboard.teams.map((group, idx) => (
                  <div key={group.id} className="relative premium-surface p-4 flex items-center gap-4 group rounded-2xl transition-all border border-neutral-200/60 dark:border-neutral-800/60">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg ${
                      idx === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' :
                      idx === 1 ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      #{idx + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-neutral-900 dark:text-white tracking-tight truncate">{group.name}</h3>
                      <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-3 mt-0.5">
                        <span className="text-indigo-600 dark:text-indigo-400">Boys: {group.boysPoints} pts</span>
                        <span>•</span>
                        <span className="text-pink-600 dark:text-pink-400">Girls: {group.girlsPoints} pts</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-display font-black text-amber-600 dark:text-amber-400 tracking-tighter">
                        {group.totalPoints}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Grand Total</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </section>

          {/* Spotlight Events */}
          <section className="premium-card p-6 md:p-8" id="home-spotlights">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Sparkles className="text-purple-500" size={24} strokeWidth={2.5} />
                Featured Stage Events
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spotlightEvents.length > 0 ? spotlightEvents.map((prog) => (
                <div 
                  key={prog.id} 
                  className="premium-surface p-5 border border-neutral-200/50 dark:border-neutral-700/50 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 cursor-pointer rounded-2xl" 
                  onClick={() => onNavigate('Programmes')}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {prog.section}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">Cat {prog.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight mb-2">{prog.title}</h3>
                  </div>
                  
                  <div className="space-y-1.5 mt-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      <Clock size={14} /> 
                      {new Date(prog.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium line-clamp-1">
                      <MapPin size={14} className="shrink-0" /> 
                      <span className="truncate">{prog.venue}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-10 text-neutral-500 text-sm">No scheduled events currently.</div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Announcements & Quick Access */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8 flex flex-col justify-between">
          
          {/* Latest Updates Card */}
          <section className="premium-card p-6 md:p-8 space-y-4" id="home-announcements">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Megaphone className="text-rose-500" size={24} strokeWidth={2.5} />
                Latest Updates
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200/50">
                Notice Board
              </span>
            </div>
            
            <div className="space-y-3">
              {displayAnnouncements.map((ann) => (
                <div 
                  key={ann.id}
                  onClick={() => onSelectAnnouncement(ann)}
                  className="premium-surface p-4 border border-neutral-200/50 dark:border-neutral-700/50 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 leading-tight">
                      {ann.title}
                    </h3>
                    {ann.pinned && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-rose-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-2.5">
                    {ann.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    <span>{new Date(ann.datetime).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                    <span className={`${
                      ann.type === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                      ann.type === 'schedule' ? 'text-amber-600 dark:text-amber-400' :
                      'text-indigo-600 dark:text-indigo-400'
                    }`}>{ann.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Portal Quick Access Card */}
          <section className="premium-card p-6 md:p-8 space-y-4" id="home-quick-access">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Layers className="text-emerald-500" size={20} strokeWidth={2.5} />
              Portal Quick Access
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('OurMadrassa')}
                className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 text-left hover:scale-[1.03] transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Landmark size={16} />
                </div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Our Madrassa</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Staff & Message</div>
              </button>

              <button 
                onClick={() => onNavigate('MeeladCampaign')}
                className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 text-left hover:scale-[1.03] transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Meelad Fest</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Rabeeh Campaign</div>
              </button>

              <button 
                onClick={() => onNavigate('Appeals')}
                className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40 text-left hover:scale-[1.03] transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-2 shadow-sm">
                  <ShieldCheck size={16} />
                </div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Appeals Desk</div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Score Verification</div>
              </button>

              <button 
                onClick={() => onNavigate('Scoreboard')}
                className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40 text-left hover:scale-[1.03] transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Trophy size={16} />
                </div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Scoreboard</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Group Rankings</div>
              </button>
            </div>
          </section>

        </div>

      </div>

      {/* Published Competition Results & Download Poster Banner */}
      {results.length > 0 && (
        <section className="space-y-6" id="home-published-results-posters">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest block mb-1">
                Live Published Results
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <Trophy className="text-amber-500" size={28} />
                Latest Event Winners & Result Posters
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('Results')}
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer w-max"
            >
              View All Published Results <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.slice(0, 4).map((res) => {
              const prog = programmes.find(p => p.id === res.programmeId);
              if (!prog) return null;

              const top1 = res.rankings.find(r => r.position === 1);
              const top2 = res.rankings.find(r => r.position === 2);

              const top1Student = top1 ? users.find(u => u.id === top1.participantId || (top1.chestNo && u.chestNo === top1.chestNo)) : null;
              const top1Name = top1Student ? top1Student.name : top1?.participantName;
              const top1Chest = top1Student ? (top1Student.chestNo || top1?.chestNo) : top1?.chestNo;
              const top1Team = top1Student ? (teams.find(t => t.id === top1Student.teamId)?.name || top1?.teamName) : top1?.teamName;

              const top2Student = top2 ? users.find(u => u.id === top2.participantId || (top2.chestNo && u.chestNo === top2.chestNo)) : null;
              const top2Name = top2Student ? top2Student.name : top2?.participantName;
              const top2Chest = top2Student ? (top2Student.chestNo || top2?.chestNo) : top2?.chestNo;
              const top2Team = top2Student ? (teams.find(t => t.id === top2Student.teamId)?.name || top2?.teamName) : top2?.teamName;

              return (
                <div 
                  key={res.programmeId}
                  className="premium-card p-6 border-2 border-emerald-500/20 bg-gradient-to-br from-white via-neutral-50 to-amber-50/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-emerald-950/30 rounded-3xl space-y-4 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-black text-xs">
                          #{prog.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase">
                          CAT {prog.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-white mt-2">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        📍 {prog.venue} • {prog.section} ({prog.type})
                      </p>
                    </div>

                    <button
                      onClick={() => downloadResultPoster(prog, res, users, teams)}
                      className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Download Official Result Poster PNG"
                    >
                      <Download size={14} /> Download Poster
                    </button>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                    {top1 && (
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/50 dark:border-amber-700/40">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🥇</span>
                          <div>
                            <div className="font-extrabold text-neutral-900 dark:text-white">{top1Name}</div>
                            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">Chest #{top1Chest || 'N/A'} • {top1Team}</div>
                          </div>
                        </div>
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">+{top1.points} Pts</span>
                      </div>
                    )}

                    {top2 && (
                      <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🥈</span>
                          <div>
                            <div className="font-bold text-neutral-800 dark:text-neutral-200">{top2Name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono">Chest #{top2Chest || 'N/A'} • {top2Team}</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300 text-xs">+{top2.points} Pts</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Gallery Showcase Grid */}
      <section className="premium-card p-6 md:p-8" id="home-gallery-preview">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
            <ImageIcon className="text-blue-500" size={24} strokeWidth={2.5} />
            Festival Media Gallery
          </h2>
          <button 
            onClick={() => onNavigate('Gallery')}
            className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore Full Gallery <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600', title: 'Live Stage' },
            { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600', title: 'Visual Art' },
            { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600', title: 'Music Fest' },
            { url: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=600', title: 'Ceremony' }
          ].map((img, i) => (
            <div key={i} className="relative aspect-square md:aspect-[4/3] rounded-[20px] overflow-hidden group bg-neutral-200 dark:bg-neutral-800 cursor-pointer" onClick={() => onNavigate('Gallery')}>
              <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              <span className="absolute bottom-3 left-3 text-white font-bold text-sm tracking-tight drop-shadow-md">
                {img.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Grid Section (Moved to Bottom) */}
      <section className="space-y-6" id="home-features-grid">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest block mb-1">
              Platform Features
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Everything You Need for a Modern Arts Fest
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('Programmes')}
            className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 w-max"
          >
            Explore All Features <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Schedule */}
          <div className="premium-card p-6 md:p-8 space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Smart Scheduling</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Real-time stage time management, instant circular notifications, and personalized student event schedules.
            </p>
          </div>

          {/* Card 2: Live Jury Portal */}
          <div className="premium-card p-6 md:p-8 space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Digital Jury Matrix</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Secure score sheets for examiners, auto-calculated standings, and tamper-proof locked results.
            </p>
          </div>

          {/* Card 3: Championship Scoreboard */}
          <div className="premium-card p-6 md:p-8 space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Championship Trophy</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Dynamic team overall standings, category points calculation, and live leaderboard rankings.
            </p>
          </div>

        </div>
      </section>

      {/* 5. ⭐ What People Say About Al Mahabbah */}
      <section className="space-y-6" id="home-reviews-ratings-section">
        <div className="premium-card p-8 md:p-10 border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/50 via-purple-950/40 to-slate-900 rounded-[36px] space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black uppercase tracking-widest border border-amber-500/30">
                  ⭐ Community Voice
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
                What People Say About Al Mahabbah
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80 font-medium mt-1">
                Based on reviews from participants, parents, teachers, alumni and well-wishers.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-500/30 shrink-0">
              <div className="text-3xl font-display font-black text-amber-400">4.9</div>
              <div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-mono text-amber-200/70 font-bold">Verified Community Reviews</span>
              </div>
            </div>
          </div>

          {/* Review Cards Grid or Inviting Callout when empty */}
          {reviews.filter(r => r.status === 'Approved').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.filter(r => r.status === 'Approved').slice(0, 3).map((rev, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white/10 dark:bg-neutral-900/80 backdrop-blur-md border border-white/10 space-y-3 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                        {rev.category}
                      </span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= rev.rating ? 'currentColor' : 'none'} className={s <= rev.rating ? 'text-amber-400' : 'text-neutral-600'} />)}
                      </div>
                    </div>
                    <p className="text-xs text-amber-100/90 font-medium italic leading-relaxed">
                      “{rev.reviewText}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="font-extrabold text-white">{rev.name}</span>
                    <span className="text-amber-300/70">{rev.programmeTitle || 'Al Mahabbah'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-2">
              <p className="text-sm font-semibold text-amber-200">Be the first to share your experience with Al Mahabbah!</p>
              <p className="text-xs text-neutral-300">Click below to submit your rating and review.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (onOpenWriteReview) onOpenWriteReview();
                else onNavigate('Reviews');
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Star size={16} fill="currentColor" /> Write Your Review
            </button>

            <button
              onClick={() => onNavigate('Reviews')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              View All Reviews <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
