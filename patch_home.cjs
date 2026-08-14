const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { Announcement, Programme, Team, SystemSettings } from '../types';
import { Calendar, MapPin, Clock, ArrowRight, Award, Megaphone, Sparkles, Image as ImageIcon, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  settings: SystemSettings;
  announcements: Announcement[];
  programmes: Programme[];
  teams: Team[];
  onNavigate: (view: string) => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  announcements,
  programmes,
  teams,
  onNavigate,
  onSelectAnnouncement,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-07-21T09:00:00-07:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const topTeams = sortedTeams.slice(0, 3);

  const pinnedAnnouncements = announcements.filter(a => a.pinned).slice(0, 2);
  const generalAnnouncements = announcements.filter(a => !a.pinned).slice(0, 3);
  const displayAnnouncements = [...pinnedAnnouncements, ...generalAnnouncements].slice(0, 4);

  const spotlightEvents = programmes.filter(p => p.status === 'Scheduled').slice(0, 4);

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in" id="home-view-container">
      {/* 1. Cinematic Premium Hero */}
      <section className="relative rounded-[32px] overflow-hidden bg-neutral-900 shadow-2xl mb-8 border border-black/5 dark:border-white/5" style={{ minHeight: '500px' }}>
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.logoBanner} 
            alt="Festival Cover" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end min-h-[500px]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white w-max mb-6">
            <Calendar size={14} />
            <span className="text-xs font-semibold tracking-wide uppercase font-mono">Academic Year {settings.academicYear}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight mb-4 leading-tight">
            {settings.festivalName}
          </h1>
          
          <p className="text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed mb-8 font-medium">
            {settings.about}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => onNavigate('Results')}
              className="px-6 py-3.5 rounded-full bg-white text-black font-semibold tracking-tight hover:scale-105 transition-all shadow-lg shadow-white/20 flex items-center gap-2"
            >
              Explore Results <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('Programmes')}
              className="px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold tracking-tight hover:bg-white/20 transition-all flex items-center gap-2"
            >
              View Events
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Scoreboard & Spotlights */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          {/* Quick Scoreboard Module */}
          <section className="premium-card p-6 md:p-8" id="home-scoreboard">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Trophy className="text-yellow-500" size={24} strokeWidth={2.5} />
                Live Standings
              </h2>
              <button 
                onClick={() => onNavigate('Scoreboard')}
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                Full Leaderboard <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {topTeams.map((team, idx) => (
                <div key={team.id} className="relative premium-surface p-4 flex items-center gap-4 group">
                  <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg \${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                    idx === 1 ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300' :
                    idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-neutral-100 text-neutral-500'
                  }\`}>
                    #{idx + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{team.name}</h3>
                    <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
                      {team.studentsCount} Students • Base: {team.color}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tighter">
                      {team.points}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Points</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Spotlight Events (Horizontal Scroll on Mobile) */}
          <section className="premium-card p-6 md:p-8" id="home-spotlights">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Sparkles className="text-purple-500" size={24} strokeWidth={2.5} />
                Featured Events
              </h2>
            </div>
            
            <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 gap-4 snap-x hide-scrollbar">
              {spotlightEvents.length > 0 ? spotlightEvents.map((prog) => (
                <div key={prog.id} className="snap-start min-w-[280px] md:min-w-0 premium-surface p-5 border border-neutral-200/50 dark:border-neutral-700/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 cursor-pointer" onClick={() => onNavigate('Programmes')}>
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
                <div className="col-span-2 text-center py-10 text-neutral-500 text-sm">No featured events currently.</div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Announcements */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <section className="premium-card p-6 md:p-8 h-full" id="home-announcements">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Megaphone className="text-rose-500" size={24} strokeWidth={2.5} />
                Updates
              </h2>
            </div>
            
            <div className="space-y-3">
              {displayAnnouncements.map((ann) => (
                <div 
                  key={ann.id}
                  onClick={() => onSelectAnnouncement(ann)}
                  className="premium-surface p-4 border border-neutral-200/50 dark:border-neutral-700/50 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 leading-tight">
                      {ann.title}
                    </h3>
                    {ann.pinned && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-rose-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {ann.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    <span>{new Date(ann.datetime).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                    <span className={\`\${
                      ann.type === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                      ann.type === 'schedule' ? 'text-amber-600 dark:text-amber-400' :
                      'text-indigo-600 dark:text-indigo-400'
                    }\`}>{ann.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Gallery Preview */}
      <section className="premium-card p-6 md:p-8" id="home-gallery-preview">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2 tracking-tight">
            <ImageIcon className="text-blue-500" size={24} strokeWidth={2.5} />
            Gallery
          </h2>
          <button 
            onClick={() => onNavigate('Gallery')}
            className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            Explore <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600', title: 'Performances' },
            { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600', title: 'Art' },
            { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600', title: 'Music' },
            { url: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=600', title: 'Moments' }
          ].map((img, i) => (
            <div key={i} className="relative aspect-square md:aspect-[4/3] rounded-[20px] overflow-hidden group bg-neutral-200 dark:bg-neutral-800">
              <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              <span className="absolute bottom-3 left-3 text-white font-bold text-sm tracking-tight drop-shadow-md">
                {img.title}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
`
fs.writeFileSync('src/components/HomeView.tsx', content);
console.log('patched HomeView');
