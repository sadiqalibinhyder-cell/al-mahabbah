import React from 'react';
import { Muallim, CommitteeMember } from '../types';
import { Landmark, GraduationCap, MapPin, Heart, ShieldCheck, Sparkles, Users, CheckCircle2, Calendar, FileText, Phone, Quote, Crown, Star, Sparkle, User } from 'lucide-react';

interface OurMadrassaViewProps {
  muallims?: Muallim[];
  committee?: CommitteeMember[];
}

export const OurMadrassaView: React.FC<OurMadrassaViewProps> = ({
  muallims = [],
  committee = []
}) => {
  // Dynamically look up Swadar Muallim from the muallims array (matched by designation or name)
  const swadarMuallim = muallims.find(m => 
    m.designation.toLowerCase().includes('swadar') || 
    m.designation.toLowerCase().includes('principal') || 
    m.name.toLowerCase().includes('sadiq ali jalali')
  ) || muallims[0];

  const swadarName = swadarMuallim ? swadarMuallim.name : 'Sadiq Ali Jalali';
  const swadarDesignation = swadarMuallim ? swadarMuallim.designation : 'Swadar Muallim & Head of Institution';
  const swadarPhoto = swadarMuallim ? swadarMuallim.photoUrl : '';

  return (
    <div className="space-y-10 animate-fade-in pb-20 font-sans" id="our-madrassa-view">
      
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 p-8 sm:p-12 text-white shadow-2xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-4xl">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-sans text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Landmark size={14} />
              Established 1958
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white font-sans text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-amber-400" />
              SKIMVB Reg. No. 2093
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white font-sans text-xs font-semibold flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              Ekkaparamba, Kerala
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-sans text-emerald-300 uppercase font-extrabold tracking-widest block">
              ABOUT IRSHADUSWIBIYAN HIGHER SECONDARY MADRASSA
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Irshaduswibiyan Higher Secondary Madrassa, <br />
              <span className="text-amber-400">Ekkaparamba</span>
            </h1>
          </div>

          {/* Intro Description */}
          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed max-w-3xl">
            <span className="font-extrabold text-white">Established in 1958</span>, Irshaduswibiyan Higher Secondary Madrassa, Ekkaparamba, is a premier educational centre dedicated to imparting quality Islamic education and nurturing students with sound knowledge, discipline, moral values, and a strong connection to the Prophetic tradition.
          </p>

          <p className="text-xs sm:text-sm text-emerald-200/90 font-medium leading-relaxed max-w-3xl">
            The Madrassa functions under the <span className="font-bold text-white">Samastha Kerala Islam Matha Vidyabhyasa Board (SKIMVB)</span> and is registered under <span className="font-bold text-amber-300">Registration No. 2093</span>.
          </p>
        </div>
      </div>

      {/* Key Numbers & Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="premium-card p-6 border border-emerald-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Calendar size={24} />
          </div>
          <div className="text-3xl font-display font-extrabold text-neutral-900 dark:text-white">1958</div>
          <div className="text-xs font-sans text-neutral-500 uppercase font-bold tracking-wider">Established Year</div>
        </div>

        <div className="premium-card p-6 border border-amber-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Users size={24} />
          </div>
          <div className="text-3xl font-display font-extrabold text-neutral-900 dark:text-white">371</div>
          <div className="text-xs font-sans text-neutral-500 uppercase font-bold tracking-wider">Enrolled Students</div>
        </div>

        <div className="premium-card p-6 border border-purple-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
            <GraduationCap size={24} />
          </div>
          <div className="text-3xl font-display font-extrabold text-neutral-900 dark:text-white">{muallims.length || 8}</div>
          <div className="text-xs font-sans text-neutral-500 uppercase font-bold tracking-wider">Teaching Faculty</div>
        </div>

        <div className="premium-card p-6 border border-teal-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-md">
            <FileText size={24} />
          </div>
          <div className="text-3xl font-display font-extrabold text-neutral-900 dark:text-white">2093</div>
          <div className="text-xs font-sans text-neutral-500 uppercase font-bold tracking-wider">SKIMVB Reg. No.</div>
        </div>
      </div>

      {/* SWADAR USTHAD EXECUTIVE LUXURY MESSAGE CARD & OUR COMMITMENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="swadar-usthad-message-section">
        
        {/* Swadar Usthad's Premium Executive Message Card */}
        <div className="md:col-span-6 rounded-[32px] p-6 sm:p-8 space-y-6 border-2 border-amber-400/70 bg-gradient-to-br from-neutral-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden shadow-2xl group hover:-translate-y-1 hover:border-amber-400 hover:shadow-[0_20px_50px_rgba(245,158,11,0.25)] transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500"></div>

          {/* Header Title with Gold Crown */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/20 shrink-0">
              <Crown size={28} className="fill-neutral-950 animate-pulse" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-sans text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkle size={12} className="fill-amber-300" />
                INSTITUTION HEAD • PRINCIPAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-1">Swadar Usthad's Message</h2>
            </div>
          </div>

          {/* Swadar Profile Highlight Box */}
          <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-amber-400/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative shrink-0">
              {swadarPhoto && !swadarPhoto.includes('unsplash.com') ? (
                <img 
                  src={swadarPhoto} 
                  alt={swadarName} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400 ring-4 ring-emerald-500/50 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-500/30 via-amber-400/20 to-yellow-600/30 border-2 border-amber-400 ring-4 ring-amber-400/30 flex items-center justify-center text-amber-300 shadow-2xl">
                  <GraduationCap size={52} className="text-amber-400 drop-shadow-md" />
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black p-1.5 rounded-xl shadow-lg border border-black/20" title="Swadar Muallim">
                <Crown size={14} className="fill-black" />
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/30 text-emerald-300 font-sans text-xs font-extrabold uppercase tracking-wider inline-block border border-emerald-400/40">
                SWADAR MUALLIM
              </span>
              <h3 className="text-2xl font-display font-black text-white leading-tight">{swadarName}</h3>
              <p className="text-xs font-sans text-amber-300 font-extrabold">{swadarDesignation}</p>
            </div>
          </div>

          {/* Message Text Quote */}
          <div className="relative text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans font-medium italic space-y-3 bg-neutral-900/90 backdrop-blur-md p-5 rounded-2xl border-l-4 border-amber-400 border border-white/10 shadow-xl">
            <Quote size={24} className="text-amber-400 fill-amber-400/20 shrink-0" />
            <p className="leading-relaxed">
              “In the name of Allah, the Most Gracious, the Most Merciful. Our sacred mission at Irshaduswibiyan Higher Secondary Madrassa is to impart authentic Islamic knowledge, Quranic wisdom, and moral discipline to our 371 students. Through our annual Meelad Arts Fest, we aim to inspire excellence, unity, and deep love for the Holy Prophet Muhammad ﷺ.”
            </p>
          </div>
        </div>

        {/* Our Commitment Card */}
        <div className="md:col-span-6 premium-card p-6 sm:p-8 space-y-6 border border-emerald-500/30 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shrink-0">
                <Heart size={28} />
              </div>
              <div>
                <span className="text-xs font-sans font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Core Mission</span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 dark:text-white">Our Commitment</h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
              We are dedicated to building a disciplined, inspiring, and Quranic learning environment for all 371 students:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                'Providing systematic Islamic education',
                'Developing strong moral and ethical character',
                'Nurturing love and respect for Prophet Muhammad ﷺ',
                'Encouraging discipline, responsibility, and good manners',
                'Preserving Islamic values and traditions',
                'Preparing students to become responsible members of society'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-emerald-500/40 transition-colors">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 8 Muallims / Teaching Faculty Section (Swadar Usthad Prominently Highlighted) */}
      <div className="space-y-6" id="madrassa-faculty-muallims">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-sans font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
              QUALIFIED SCHOLARS & EDUCATORS
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-3 mt-1">
              <GraduationCap className="text-emerald-500" size={32} />
              Madrassa Teaching Faculty ({muallims.length} Muallims)
            </h2>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider self-start sm:self-center">
            {muallims.length} Teaching Staff Members
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {muallims.map((m) => {
            const isSwadar = m.id === swadarMuallim?.id || 
              m.designation.toLowerCase().includes('swadar') || 
              m.designation.toLowerCase().includes('principal') || 
              m.name.toLowerCase().includes('sadiq ali jalali');

            return (
              <div 
                key={m.id} 
                className={`premium-card p-6 text-center space-y-4 transition-all duration-300 flex flex-col justify-between ${
                  isSwadar 
                    ? 'border-2 border-amber-400 shadow-2xl bg-gradient-to-b from-amber-500/10 via-emerald-500/10 to-transparent ring-4 ring-amber-500/20 sm:col-span-2 lg:col-span-1 ring-offset-2 dark:ring-offset-neutral-950 scale-[1.03]' 
                    : 'border border-emerald-500/20 hover:scale-[1.02] shadow-md'
                }`}
              >
                <div className="space-y-3">
                  {/* Swadar Crown Badge */}
                  {isSwadar && (
                    <div className="flex justify-center -mt-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-display font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Crown size={13} className="fill-black" />
                        SWADAR MUALLIM • PRINCIPAL
                      </span>
                    </div>
                  )}

                  <div className="relative inline-block">
                    {m.photoUrl && !m.photoUrl.includes('unsplash.com') ? (
                      <img 
                        src={m.photoUrl} 
                        alt={m.name} 
                        className={`w-24 h-24 rounded-2xl object-cover mx-auto border-2 ${
                          isSwadar ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-2xl' : 'border-emerald-500/40 ring-4 ring-emerald-500/10 shadow-lg'
                        }`}
                      />
                    ) : (
                      <div className={`w-24 h-24 rounded-2xl mx-auto flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                        isSwadar 
                          ? 'bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-yellow-600/20 border-amber-400 text-amber-500 ring-4 ring-amber-400/30' 
                          : 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-600/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/10'
                      }`}>
                        {isSwadar ? (
                          <GraduationCap size={44} className="text-amber-500 drop-shadow-md" />
                        ) : (
                          <User size={40} className="text-emerald-600 dark:text-emerald-400 drop-shadow-md" />
                        )}
                      </div>
                    )}
                    {isSwadar && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-1 rounded-full shadow-lg" title="Swadar Muallim">
                        <Star size={12} className="fill-black" />
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
                      isSwadar 
                        ? 'bg-amber-500 text-black font-black' 
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {m.designation}
                    </span>
                    <h3 className={`font-display font-extrabold text-base ${isSwadar ? 'text-amber-500 dark:text-amber-300 font-black text-lg' : 'text-neutral-900 dark:text-white'}`}>
                      {m.name}
                    </h3>
                  </div>

                  <div className="text-xs text-neutral-500 space-y-1">
                    <p className="font-medium">{m.qualification}</p>
                    <p className="text-[11px] font-extrabold text-amber-500 uppercase tracking-wider">{m.experience}</p>
                  </div>
                </div>

                {m.phone && (
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1.5">
                    <Phone size={12} className="text-emerald-500" />
                    <span>{m.phone}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive Committee Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-sans font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
              MADRASSA MANAGEMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-3 mt-1">
              <ShieldCheck className="text-amber-500" size={32} />
              Executive Committee Members ({committee.length})
            </h2>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider self-start sm:self-center">
            Management Board
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {committee.filter(c => c.id !== 'comm_4' && c.id !== 'comm_5' && c.id !== 'comm_6' && !['Vice President', 'Joint Secretary', 'Executive Member'].includes(c.designation)).map((c) => (
            <div key={c.id} className="premium-card p-6 text-center space-y-4 border border-amber-500/20 hover:scale-[1.02] transition-all shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                {c.photoUrl && !c.photoUrl.includes('unsplash.com') ? (
                  <img 
                    src={c.photoUrl} 
                    alt={c.name} 
                    className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-amber-500/40 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-yellow-600/20 border-2 border-amber-500/40 text-amber-500 shadow-md">
                    <ShieldCheck size={38} className="text-amber-500 drop-shadow-md" />
                  </div>
                )}

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    {c.designation}
                  </span>
                  <h3 className="font-display font-extrabold text-base text-neutral-900 dark:text-white">{c.name}</h3>
                </div>
              </div>

              {c.phone && (
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1.5">
                  <Phone size={12} className="text-amber-500" />
                  <span>{c.phone}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official Fact Sheet Card */}
      <div className="premium-card p-6 md:p-8 space-y-6 border border-purple-500/20">
        <h2 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2">
          <Sparkles size={22} className="text-amber-500" />
          Official Institutional Fact Sheet
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider block">Established</span>
            <span className="text-sm font-display font-extrabold text-neutral-900 dark:text-white">1958</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider block">Board Affiliation</span>
            <span className="text-sm font-display font-extrabold text-neutral-900 dark:text-white">Samastha Kerala Islam Matha Vidyabhyasa Board (SKIMVB)</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider block">Registration Number</span>
            <span className="text-sm font-display font-extrabold text-emerald-600 dark:text-emerald-400">Reg. No. 2093</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider block">Student Strength</span>
            <span className="text-sm font-display font-extrabold text-neutral-900 dark:text-white">371 Enrolled Students</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider block">Teaching Faculty</span>
            <span className="text-sm font-display font-extrabold text-neutral-900 dark:text-white">{muallims.length} Qualified Scholars</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-400/60 space-y-1">
            <span className="text-[10px] font-sans text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Crown size={12} className="fill-amber-500" /> Swadar Muallim
            </span>
            <span className="text-sm font-display font-black text-amber-600 dark:text-amber-300">{swadarName}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
