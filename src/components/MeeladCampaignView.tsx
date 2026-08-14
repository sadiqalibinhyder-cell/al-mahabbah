import React, { useState } from 'react';
import { 
  Heart, BookOpen, Star, Sparkles, Flame, Home, Mail, Flag, Megaphone, 
  Compass, Users, Mic, GraduationCap, Landmark, Search, ShieldCheck, CheckCircle2, 
  Award, X, ArrowRight, Layers, Bookmark, Zap, Radio, Globe, Calendar, Info
} from 'lucide-react';

interface InitiativeItem {
  num: string;
  title: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  badgeClass: string;
  borderClass: string;
  category: 'Spiritual' | 'Community' | 'Literary & Youth' | 'Legacy';
  desc: string;
  highlights: string[];
  audience: string;
}

const initiativesData: InitiativeItem[] = [
  {
    num: '01',
    title: 'MEELAD FEST',
    icon: Sparkles,
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/30 hover:border-amber-400',
    category: 'Spiritual',
    desc: 'Meelad Fest is a vibrant celebration designed to nurture love for Prophet Muhammad ﷺ among students and young generations. Through a variety of artistic, literary, cultural and knowledge-based activities, the fest provides a platform for participants to express their creativity while discovering and celebrating the Prophetic legacy.',
    highlights: ['Cultural Competitions', 'Artistic Expressions', 'Prophetic Seerah Quiz', 'Youth Showcase'],
    audience: 'Students, Youth & Madrassa Cadets'
  },
  {
    num: '02',
    title: 'SHE FEST',
    icon: Heart,
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    badgeClass: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30',
    borderClass: 'border-pink-500/30 hover:border-pink-400',
    category: 'Community',
    desc: 'She Fest is a special Meelad initiative dedicated to women and girls, creating a space for learning, inspiration, creativity and meaningful participation. The programme highlights the role of women in nurturing faith, values, families and communities through the teachings and example of Prophet Muhammad ﷺ.',
    highlights: ['Women Guidance Sessions', 'Mother & Daughter Circles', 'Islamic Moral Arts', 'Community Empowerment'],
    audience: 'Women & Young Girls'
  },
  {
    num: '03',
    title: 'AL MAVADDAH FAMILY VISITING',
    icon: Home,
    gradient: 'from-blue-500 via-indigo-500 to-cyan-600',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    borderClass: 'border-blue-500/30 hover:border-blue-400',
    category: 'Community',
    desc: 'Al Mavaddah Family Visiting aims to strengthen family and community relationships through personal visits and heartfelt interactions. By bringing people closer together in the spirit of love and brotherhood, the programme seeks to revive the Prophetic values of compassion, hospitality, care and social responsibility.',
    highlights: ['Door-to-door Goodwill Visits', 'Brotherhood & Harmony Gifts', 'Family Counseling', 'Community Care'],
    audience: 'Neighborhood Families & Community Homes'
  },
  {
    num: '04',
    title: 'SWOLATH CHALLENGE',
    icon: Flame,
    gradient: 'from-purple-500 via-indigo-600 to-violet-600',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    borderClass: 'border-purple-500/30 hover:border-purple-400',
    category: 'Spiritual',
    desc: 'The Swolath Challenge is a collective initiative encouraging participants to increase their daily Swolath upon Prophet Muhammad ﷺ. Beyond a challenge, it seeks to develop a lasting habit of remembrance and deepen the spiritual connection between believers and the beloved Prophet ﷺ.',
    highlights: ['Daily Swolath Tracker', 'Collective Recitation Milestones', 'Spiritual Habit Building', 'Group Majlis'],
    audience: 'All Believers, Students & Public'
  },
  {
    num: '05',
    title: 'MOULID MAJLIS',
    icon: BookOpen,
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    borderClass: 'border-emerald-500/30 hover:border-emerald-400',
    category: 'Spiritual',
    desc: 'Moulid Majlis brings people together to remember and celebrate the blessed birth, life, character and mission of Prophet Muhammad ﷺ. Through Moulid, Swolath, remembrance and reflections, these gatherings create an atmosphere of love, spirituality and appreciation for the Prophetic legacy.',
    highlights: ['Sacred Moulid Recitations', 'Prophetic Seerah Reflections', 'Atmosphere of Devotion', 'Tabarruk Distribution'],
    audience: 'General Public & Congregations'
  },
  {
    num: '06',
    title: 'LETTER TO MY PROPHET MUHAMMAD ﷺ',
    icon: Mail,
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/30 hover:border-amber-400',
    category: 'Literary & Youth',
    desc: 'Letter to My Prophet Muhammad ﷺ is a heartfelt platform for expressing personal love, gratitude, hopes and reflections towards the beloved Prophet ﷺ. Participants are invited to communicate their feelings through meaningful letters, creating a deeply personal connection with the life and message of the Prophet.',
    highlights: ['Personal Emotional Expressions', 'Literary Writing Contest', 'Youth Reflections', 'Commemorative Book Publication'],
    audience: 'Children, Youth & Literary Writers'
  },
  {
    num: '07',
    title: 'MEELAD RALLY',
    icon: Flag,
    gradient: 'from-rose-500 via-red-500 to-orange-600',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    borderClass: 'border-rose-500/30 hover:border-rose-400',
    category: 'Community',
    desc: 'The Meelad Rally takes the message of Meelad beyond the gathering place and into the wider community. It is a vibrant expression of love for Prophet Muhammad ﷺ, bringing people together to celebrate his legacy and spread the values of peace, compassion, brotherhood and goodness.',
    highlights: ['Public Peace Procession', 'Duff & Cultural Performance', 'Goodwill Sweets Distribution', 'Civic Harmony Messages'],
    audience: 'Full Community & Public Spectators'
  },
  {
    num: '08',
    title: 'RABEEH SANDESHA RALLY',
    icon: Megaphone,
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    badgeClass: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    borderClass: 'border-cyan-500/30 hover:border-cyan-400',
    category: 'Community',
    desc: 'Rabeeh Sandesha Rally is a message-driven community initiative designed to share the teachings and values of Prophet Muhammad ﷺ with the public. Through an organised rally and meaningful messages, it seeks to inspire people to understand, appreciate and live according to the Prophetic example.',
    highlights: ['Message Placards & Banners', 'Prophetic Moral Pamphlets', 'Civic Awareness Campaigns', 'Public Inter-faith Respect'],
    audience: 'Wider Public & Local Citizens'
  },
  {
    num: '09',
    title: 'SUNNAH PROPAGATION',
    icon: Compass,
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    borderClass: 'border-emerald-500/30 hover:border-emerald-400',
    category: 'Spiritual',
    desc: 'Sunnah Propagation is an initiative dedicated to bringing the Sunnah of Prophet Muhammad ﷺ into everyday life. The programme encourages individuals, families and communities to learn, practise and share authentic Prophetic guidance so that the Sunnah becomes a living part of daily life.',
    highlights: ['Daily Sunnah Cards', 'Household Practice Guides', 'Ethical Living Workshops', 'Character Building'],
    audience: 'Families & Household Members'
  },
  {
    num: '10',
    title: 'ISHQ MAJLIS',
    icon: Star,
    gradient: 'from-violet-500 via-purple-500 to-indigo-600',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    badgeClass: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
    borderClass: 'border-violet-500/30 hover:border-violet-400',
    category: 'Spiritual',
    desc: 'Ishq Majlis is a gathering centred on love for Prophet Muhammad ﷺ. Through Swolath, stories from his blessed life, reflections and expressions of devotion, the majlis seeks to awaken hearts and strengthen the spiritual bond between the Ummah and its beloved Prophet ﷺ.',
    highlights: ['Heart-touching Eulogies', 'Seerah Storytelling', 'Deep Devotional Atmosphere', 'Midnight Remembrances'],
    audience: 'Seekers of Devotion & Spiritual Aspirants'
  },
  {
    num: '11',
    title: 'QATHMUL QURAN',
    icon: BookOpen,
    gradient: 'from-teal-500 via-emerald-500 to-cyan-600',
    glowColor: 'rgba(20, 184, 166, 0.25)',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    borderClass: 'border-teal-500/30 hover:border-teal-400',
    category: 'Spiritual',
    desc: 'Qathmul Quran is a collective Qur\'an completion programme organised as part of the Al Mahabbah campaign. It encourages participants to engage with the Qur\'an through recitation and reflection, nurturing spiritual discipline and seeking blessings through collective devotion.',
    highlights: ['Collective Juz Assignments', 'Complete Recitation Milestones', 'Khatam Prayers', 'Barakah Gatherings'],
    audience: 'Qur\'an Reciters & General Faithful'
  },
  {
    num: '12',
    title: 'MUTHA\'LLIM SANGAMAM',
    icon: Users,
    gradient: 'from-indigo-500 via-blue-500 to-sky-600',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    borderClass: 'border-indigo-500/30 hover:border-indigo-400',
    category: 'Legacy',
    desc: 'Mutha\'llim Sangamam is a special gathering of Muallims and teachers connected with the Madrassa community. It provides an opportunity to meet, reconnect, share experiences and reflect on the responsibility of educating future generations in the light of Islamic values and the Prophetic tradition.',
    highlights: ['Muallim Networking', 'Pedagogical Sharing', 'Honoring Educators', 'Moral Leadership Circles'],
    audience: 'Madrasa Teachers & Educators'
  },
  {
    num: '13',
    title: 'MEELAD SPEECH',
    icon: Mic,
    gradient: 'from-orange-500 via-amber-500 to-red-500',
    glowColor: 'rgba(249, 115, 22, 0.25)',
    badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    borderClass: 'border-orange-500/30 hover:border-orange-400',
    category: 'Literary & Youth',
    desc: 'Meelad Speech provides a platform for participants to explore and present different aspects of the life, character, teachings and legacy of Prophet Muhammad ﷺ. Through thoughtful speeches and presentations, the programme encourages knowledge, confidence, reflection and a deeper understanding of the Prophetic message.',
    highlights: ['Elocution Contest', 'Multi-lingual Seerah Speeches', 'Confidence Building', 'Public Oratory Showcase'],
    audience: 'Student Speakers & Orators'
  },
  {
    num: '14',
    title: 'ALUMNI FEST',
    icon: GraduationCap,
    gradient: 'from-sky-500 via-indigo-500 to-purple-600',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    borderClass: 'border-sky-500/30 hover:border-sky-400',
    category: 'Legacy',
    desc: 'Alumni Fest brings together former students of Irshaduswibiyan Madrassa to celebrate their shared journey and enduring connection with the institution. It provides an opportunity to reconnect with old friends, revisit memories, strengthen alumni relationships and contribute to the continuing legacy of the Madrassa.',
    highlights: ['Old Friends Reconnect', 'Nostalgia & Memories', 'Institutional Support', 'Alumni Excellence Awards'],
    audience: 'Former Students & Alumni Members'
  },
  {
    num: '15',
    title: 'IRSHADUSWIBIYAN LEGACY REUNION',
    icon: Landmark,
    gradient: 'from-amber-500 via-yellow-500 to-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/30 hover:border-amber-400',
    category: 'Legacy',
    desc: 'Irshaduswibiyan Legacy Reunion is a special gathering that brings together generations of former students and committee members of Irshaduswibiyan Madrassa. The reunion celebrates their shared history, memories, service and contributions to the institution, while creating an opportunity for different generations to reconnect and honour the legacy they helped build.',
    highlights: ['Multi-generational Convergence', 'Honoring Founders & Leaders', 'Heritage Video Showcase', 'Grand Feast & Unity'],
    audience: 'Generations of Alumni & Committee Leaders'
  }
];

export const MeeladCampaignView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeItem | null>(null);

  const filteredInitiatives = initiativesData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.num.includes(searchQuery);
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 animate-fade-in pb-28 relative" id="meelad-campaign-view">
      
      {/* 1. HERO BANNER WITH AMBIENT GLOW AND DECORATIVE ACCENTS */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-2xl border-2 border-purple-500/40">
        {/* Floating animated background aura lights */}
        <div className="absolute -right-20 -top-20 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-rose-600/30 animate-pulse">
              <Sparkles size={14} className="text-amber-300" />
              Rabeeh Season 2026-27
            </span>
            <span className="px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              Prophetic Legacy
            </span>
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
              <CheckCircle2 size={13} /> 15 Campaign Pillars
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-[1.15]">
            AL MAHABBAH RABEEH CAMPAIGN <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
              “Reviving the Prophetic Legacy”
            </span>
          </h1>

          <p className="text-sm sm:text-base text-purple-200/90 font-medium leading-relaxed max-w-3xl">
            A nationwide cultural and spiritual movement aimed at expressing love for the Holy Prophet Muhammad (ﷺ) through sacred Quranic recitations, Madh songs, Islamic public speaking, calligraphy, community visits, and moral arts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-amber-200 font-bold">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <Zap size={15} className="text-amber-400" />
              <span>Uniting Generations</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <Heart size={15} className="text-rose-400" />
              <span>Reviving Devotional Love</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Prophetic Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS DISPLAY STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="campaign-stats-strip">
        {[
          { label: 'Campaign Pillars', val: '15', sub: 'Active Initiatives', color: 'text-amber-500', bg: 'from-amber-500/10 to-orange-500/5 border-amber-500/20' },
          { label: 'Target Audience', val: '10,000+', sub: 'Students & Families', color: 'text-purple-500', bg: 'from-purple-500/10 to-indigo-500/5 border-purple-500/20' },
          { label: 'Community Visits', val: 'Al Mavaddah', sub: 'Door-to-door Harmony', color: 'text-blue-500', bg: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20' },
          { label: 'Swolath Target', val: '1,000,000+', sub: 'Recitations Goal', color: 'text-emerald-500', bg: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' }
        ].map((st, i) => (
          <div key={i} className={`p-5 rounded-3xl bg-gradient-to-br ${st.bg} border backdrop-blur-md space-y-1 hover:scale-[1.02] transition-transform`}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              {st.label}
            </span>
            <div className={`text-xl sm:text-2xl font-display font-black ${st.color}`}>
              {st.val}
            </div>
            <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 block">
              {st.sub}
            </span>
          </div>
        ))}
      </div>

      {/* 3. CORE PILLARS QUAD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div className="premium-card p-6 space-y-3 border border-purple-500/20 text-center hover:scale-[1.02] transition-transform duration-300 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20">
            <BookOpen size={24} />
          </div>
          <h3 className="font-display font-black text-base text-neutral-900 dark:text-white">Tilawath & Tajweed</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">Perfecting Quranic recitation according to classical tajweed rules.</p>
        </div>

        <div className="premium-card p-6 space-y-3 border border-rose-500/20 text-center hover:scale-[1.02] transition-transform duration-300 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Heart size={24} />
          </div>
          <h3 className="font-display font-black text-base text-neutral-900 dark:text-white">Mad'hunnabi Songs</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">Expressing devotion through Arabic, Malayalam, and Urdu eulogies.</p>
        </div>

        <div className="premium-card p-6 space-y-3 border border-amber-500/20 text-center hover:scale-[1.02] transition-transform duration-300 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Flame size={24} />
          </div>
          <h3 className="font-display font-black text-base text-neutral-900 dark:text-white">Elocution & Oratory</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">Inspiring speeches on the Seerah, character, and mercy of the Prophet (ﷺ).</p>
        </div>

        <div className="premium-card p-6 space-y-3 border border-emerald-500/20 text-center hover:scale-[1.02] transition-transform duration-300 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles size={24} />
          </div>
          <h3 className="font-display font-black text-base text-neutral-900 dark:text-white">Calligraphy & Arts</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">Exquisite Arabic calligraphy, painting, and digital quiz challenges.</p>
        </div>
      </div>

      {/* 4. INITIATIVES FILTER & HEADER BAR */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block mb-1">
              Campaign Roadmap
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="text-amber-500" size={28} />
              15 Key Rabeeh Campaign Initiatives
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              Explore the complete lineup of spiritual gatherings, community rallies, literary competitions, and legacy events.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={17} />
            <input
              type="text"
              placeholder="Search by title, keyword, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-md transition-all"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {['All', 'Spiritual', 'Community', 'Literary & Youth', 'Legacy'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/25 scale-105'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white shadow-xs'
              }`}
            >
              {cat === 'All' ? '🌟 All 15 Initiatives' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. THE 15 INITIATIVES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="initiatives-cards-grid">
        {filteredInitiatives.length > 0 ? (
          filteredInitiatives.map((item) => {
            const IconComp = item.icon;
            return (
              <div 
                key={item.num}
                onClick={() => setSelectedInitiative(item)}
                className={`premium-card p-6 sm:p-7 space-y-4 border ${item.borderClass} bg-white dark:bg-neutral-900 rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
              >
                {/* Background Subtle Accent Glow */}
                <div 
                  className={`absolute -right-14 -top-14 w-40 h-40 bg-gradient-to-br ${item.gradient} opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
                ></div>

                <div className="space-y-3.5 relative z-10">
                  {/* Top Bar: Number Badge & Category */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-mono font-black text-base flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {item.num}
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-black uppercase border ${item.badgeClass}`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                      <IconComp size={20} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-lg sm:text-xl text-neutral-900 dark:text-white tracking-tight leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed line-clamp-4">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Tag & Quick Action */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono font-bold text-neutral-400 relative z-10">
                  <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                    <Bookmark size={12} className="text-amber-500" /> Key Initiative
                  </span>
                  <span className="text-amber-500 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full premium-card p-12 text-center text-neutral-400 space-y-3">
            <Search size={36} className="mx-auto text-neutral-500" />
            <p className="font-medium text-sm">No campaign initiatives match your search query.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 6. EXPANDABLE INITIATIVE MODAL DETAILED DRAWER */}
      {selectedInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 border-2 border-purple-500/40 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedInitiative(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedInitiative.gradient} text-white font-mono font-black text-xl flex items-center justify-center shadow-xl`}>
                {selectedInitiative.num}
              </div>
              <div>
                <span className={`px-3 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase border ${selectedInitiative.badgeClass}`}>
                  {selectedInitiative.category}
                </span>
                <h3 className="text-2xl font-display font-black text-neutral-900 dark:text-white mt-1">
                  {selectedInitiative.title}
                </h3>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700/50">
              <span className="text-[10px] font-mono font-extrabold text-amber-500 uppercase tracking-widest block">
                Initiative Overview
              </span>
              <p className="text-sm text-neutral-700 dark:text-neutral-200 font-medium leading-relaxed">
                {selectedInitiative.desc}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-extrabold text-purple-500 uppercase tracking-widest block">
                Program Highlights & Objectives
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedInitiative.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-xs font-bold text-purple-900 dark:text-purple-200">
                    <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono">
              <span className="text-neutral-600 dark:text-neutral-400 font-bold">Target Audience:</span>
              <span className="text-amber-600 dark:text-amber-300 font-extrabold">{selectedInitiative.audience}</span>
            </div>

            <button
              onClick={() => setSelectedInitiative(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
            >
              Close Initiative Window
            </button>
          </div>
        </div>
      )}

      {/* 7. SLOGAN FOOTER BANNER WITH GOLDEN GLOW */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-8 sm:p-10 text-center text-white shadow-2xl border-2 border-amber-300/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-100 font-mono text-[11px] font-black uppercase tracking-widest border border-white/20">
            <Sparkles size={13} className="text-amber-300" /> Al Mahabbah Campaign Motto
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight drop-shadow-lg text-white">
            Uniting Generations • Reviving Love • Honouring the Prophetic Legacy
          </h2>

          <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-2xl mx-auto pt-1 leading-relaxed">
            Expressing unconditional devotion to Prophet Muhammad ﷺ through knowledge, art, service, community outreach, and unity.
          </p>
        </div>
      </div>

    </div>
  );
};
