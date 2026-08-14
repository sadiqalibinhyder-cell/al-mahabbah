import React, { useState } from 'react';
import { Programme } from '../types';
import { 
  Calendar, Clock, MapPin, Search, Plus, Edit, Trash2, Copy, 
  AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Filter, RefreshCw, 
  Layers, Lock, Unlock, Eye, Check, HelpCircle, Flame
} from 'lucide-react';
import { saveToStorage } from '../data';

interface OffStageScheduleTabProps {
  programmes: Programme[];
  onUpdateProgrammes: (newProgs: Programme[]) => void;
}

export const OffStageScheduleTab: React.FC<OffStageScheduleTabProps> = ({
  programmes,
  onUpdateProgrammes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [stageTypeFilter, setStageTypeFilter] = useState<'All' | 'Off-Stage' | 'On-Stage'>('Off-Stage');

  // Modal / Form state for Add/Edit
  const [editingProg, setEditingProg] = useState<Programme | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formSuccessMsg, setFormSuccessMsg] = useState('');
  const [formErrorMsg, setFormErrorMsg] = useState('');

  // Form Fields
  const [fCode, setFCode] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fCategoryLevel, setFCategoryLevel] = useState<'Kiddies' | 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' | 'General'>('Sub Junior');
  const [fGender, setFGender] = useState<'Boys' | 'Girls' | 'Boys & Girls'>('Boys');
  const [fStageType, setFStageType] = useState<'Off-Stage' | 'On-Stage'>('Off-Stage');
  const [fDate, setFDate] = useState('11.08.2026');
  const [fStartTime, setFStartTime] = useState('07:30');
  const [fEndTime, setFEndTime] = useState('08:00');
  const [fVenue, setFVenue] = useState('Examination Hall');
  const [fStatus, setFStatus] = useState<'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'TBD'>('UPCOMING');
  const [fType, setFType] = useState<'Individual' | 'Group'>('Individual');

  const openAddForm = () => {
    setEditingProg(null);
    setIsAdding(true);
    setFCode('');
    setFTitle('');
    setFCategoryLevel('Sub Junior');
    setFGender('Boys');
    setFStageType('Off-Stage');
    setFDate('11.08.2026');
    setFStartTime('07:30');
    setFEndTime('08:00');
    setFVenue('Examination Hall');
    setFStatus('UPCOMING');
    setFType('Individual');
    setFormSuccessMsg('');
    setFormErrorMsg('');
  };

  const openEditForm = (p: Programme) => {
    setEditingProg(p);
    setIsAdding(false);
    setFCode(p.code);
    setFTitle(p.title);
    setFCategoryLevel(p.categoryLevel || 'Sub Junior');
    setFGender(p.gender || 'Boys');
    setFStageType(p.stageType || (p.section === 'Off-Stage' ? 'Off-Stage' : 'On-Stage'));
    setFDate(p.scheduledDate || '11.08.2026');
    setFStartTime(p.startTime || '07:30');
    setFEndTime(p.endTime || '08:00');
    setFVenue(p.venue || 'Examination Hall');
    setFStatus(p.scheduleStatus || 'UPCOMING');
    setFType(p.type || 'Individual');
    setFormSuccessMsg('');
    setFormErrorMsg('');
  };

  // Convert "HH:MM" to minutes from midnight
  const toMin = (t?: string) => {
    if (!t || t === 'TBD') return 0;
    const parts = t.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };

  // Check venue/time conflict
  const checkVenueConflict = (prog: Programme) => {
    if (!prog.scheduledDate || prog.scheduledDate === 'TBD' || !prog.venue) return null;
    const pStart = toMin(prog.startTime);
    const pEnd = toMin(prog.endTime || prog.startTime);
    if (pStart === 0 && pEnd === 0) return null;

    for (const other of programmes) {
      if (other.id === prog.id) continue;
      if (!other.scheduledDate || other.scheduledDate === 'TBD' || !other.venue) continue;
      if (other.venue.toLowerCase().trim() === prog.venue.toLowerCase().trim() && other.scheduledDate === prog.scheduledDate) {
        const oStart = toMin(other.startTime);
        const oEnd = toMin(other.endTime || other.startTime);
        if (oStart === 0 && oEnd === 0) continue;
        if (Math.max(pStart, oStart) < Math.min(pEnd, oEnd)) {
          return other;
        }
      }
    }
    return null;
  };

  // Save Add/Edit
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fCode.trim() || !fTitle.trim()) {
      setFormErrorMsg('Program Code and Program Title are required.');
      return;
    }

    const updatedList = [...programmes];

    if (isAdding) {
      const existing = updatedList.find(p => p.code === fCode.trim());
      if (existing) {
        setFormErrorMsg(`Program Code ${fCode.trim()} already exists in the system.`);
        return;
      }

      const newProg: Programme = {
        id: `prog_${fCode.trim()}`,
        code: fCode.trim(),
        title: fTitle.trim(),
        category: 'A',
        type: fType,
        section: fStageType,
        stageType: fStageType,
        venue: fVenue.trim(),
        datetime: fDate !== 'TBD' ? `2026-08-${fDate.split('.')[0]}T${fStartTime}` : 'TBD',
        scheduledDate: fDate,
        startTime: fStartTime,
        endTime: fEndTime,
        gender: fGender,
        categoryLevel: fCategoryLevel,
        scheduleStatus: fStatus,
        maxParticipants: 1,
        minParticipants: 1,
        rules: `Official rules for ${fTitle.trim()}.`,
        deadline: '2026-08-10T18:00',
        status: fStatus === 'TBD' ? 'TBD' : 'Scheduled',
        judgeIds: ['judge_sarah'],
        resultPublished: false,
        categoryGroup: `${fCategoryLevel} ${fGender}`
      };

      updatedList.push(newProg);
      setFormSuccessMsg(`Successfully added program schedule [${fCode.trim()}] ${fTitle.trim()}`);
    } else if (editingProg) {
      const idx = updatedList.findIndex(p => p.id === editingProg.id);
      if (idx !== -1) {
        updatedList[idx] = {
          ...updatedList[idx],
          code: fCode.trim(),
          title: fTitle.trim(),
          type: fType,
          section: fStageType,
          stageType: fStageType,
          venue: fVenue.trim(),
          scheduledDate: fDate,
          startTime: fStartTime,
          endTime: fEndTime,
          gender: fGender,
          categoryLevel: fCategoryLevel,
          scheduleStatus: fStatus,
          status: fStatus === 'TBD' ? 'TBD' : 'Scheduled',
          categoryGroup: `${fCategoryLevel} ${fGender}`
        };
        setFormSuccessMsg(`Updated program schedule [${fCode.trim()}] ${fTitle.trim()}`);
      }
    }

    saveToStorage('programmes', updatedList);
    onUpdateProgrammes(updatedList);
    setEditingProg(null);
    setIsAdding(false);
  };

  // Delete Schedule item
  const handleDeleteSchedule = (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete program schedule #${code}?`)) return;
    const updated = programmes.filter(p => p.id !== id);
    saveToStorage('programmes', updated);
    onUpdateProgrammes(updated);
  };

  // Filter List
  const filtered = programmes.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (!p.title.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q) && !(p.venue || '').toLowerCase().includes(q)) return false;
    }

    if (stageTypeFilter !== 'All') {
      const isOff = p.section === 'Off-Stage' || p.stageType === 'Off-Stage';
      if (stageTypeFilter === 'Off-Stage' && !isOff) return false;
      if (stageTypeFilter === 'On-Stage' && isOff) return false;
    }

    if (genderFilter !== 'All') {
      const g = p.gender || (p.categoryGroup?.toLowerCase().includes('girls') ? 'Girls' : 'Boys');
      if (genderFilter === 'Boys' && g !== 'Boys' && g !== 'Boys & Girls') return false;
      if (genderFilter === 'Girls' && g !== 'Girls' && g !== 'Boys & Girls') return false;
      if (genderFilter === 'Boys & Girls' && g !== 'Boys & Girls') return false;
    }

    if (categoryFilter !== 'All') {
      const cat = (p.categoryLevel || p.categoryGroup || '').toLowerCase();
      if (!cat.includes(categoryFilter.toLowerCase())) return false;
    }

    if (dateFilter !== 'All') {
      if (dateFilter === 'TBD') {
        if (p.scheduledDate && p.scheduledDate !== 'TBD') return false;
      } else {
        const dStr = p.scheduledDate || '';
        const dayPart = dateFilter.split(' ')[0];
        if (!dStr.startsWith(dayPart)) return false;
      }
    }

    return true;
  });

  const totalOffStageCount = programmes.filter(p => p.section === 'Off-Stage' || p.stageType === 'Off-Stage').length;

  return (
    <div className="space-y-6 animate-fade-in" id="admin-offstage-schedule">
      
      {/* Header Banner */}
      <div className="premium-card p-6 md:p-8 space-y-4 border-2 border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
              ADMIN CONTROL CENTER
            </span>
            <h2 className="text-2xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2 mt-1">
              <Calendar size={24} className="text-amber-500" />
              Off-Stage & Master Schedule Management
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Official schedule database ({totalOffStageCount} Off-Stage Competitions). Filter, edit timings, assign venues, and resolve conflicts.
            </p>
          </div>

          <button 
            onClick={openAddForm}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Add Schedule Record
          </button>
        </div>

        {/* Success Alert */}
        {formSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{formSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {(isAdding || editingProg) && (
        <div className="premium-card p-6 md:p-8 space-y-6 border-2 border-emerald-500/40 bg-emerald-950/10 dark:bg-emerald-950/20 shadow-xl" id="schedule-edit-form">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
            <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <Edit className="text-emerald-500" size={22} />
              {isAdding ? 'Create New Schedule Record' : `Edit Schedule: #${editingProg?.code} ${editingProg?.title}`}
            </h3>
            <button 
              onClick={() => { setEditingProg(null); setIsAdding(false); }}
              className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {formErrorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{formErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Program Code *
              </label>
              <input 
                type="text" 
                value={fCode} 
                onChange={e => setFCode(e.target.value)}
                placeholder="e.g. 106, 207, 308"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Program Title *
              </label>
              <input 
                type="text" 
                value={fTitle} 
                onChange={e => setFTitle(e.target.value)}
                placeholder="e.g. Coloring, Hifl, Calligraphy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Category Level *
              </label>
              <select 
                value={fCategoryLevel} 
                onChange={e => setFCategoryLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-bold"
              >
                <option value="Kiddies">Kiddies</option>
                <option value="Sub Junior">Sub Junior</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Super Senior">Super Senior</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Gender Classification *
              </label>
              <select 
                value={fGender} 
                onChange={e => setFGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-bold"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Boys & Girls">Boys & Girls</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Stage Type *
              </label>
              <select 
                value={fStageType} 
                onChange={e => setFStageType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-bold"
              >
                <option value="Off-Stage">Off-Stage</option>
                <option value="On-Stage">On-Stage</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Scheduled Date (DD.MM.YYYY or TBD) *
              </label>
              <input 
                type="text" 
                value={fDate} 
                onChange={e => setFDate(e.target.value)}
                placeholder="11.08.2026 or TBD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Start Time (HH:MM) *
              </label>
              <input 
                type="text" 
                value={fStartTime} 
                onChange={e => setFStartTime(e.target.value)}
                placeholder="07:30 or TBD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                End Time (HH:MM) *
              </label>
              <input 
                type="text" 
                value={fEndTime} 
                onChange={e => setFEndTime(e.target.value)}
                placeholder="08:00 or TBD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Venue Allocation
              </label>
              <input 
                type="text" 
                value={fVenue} 
                onChange={e => setFVenue(e.target.value)}
                placeholder="e.g. Examination Room, Off-Stage Hall"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Schedule Status
              </label>
              <select 
                value={fStatus} 
                onChange={e => setFStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-bold"
              >
                <option value="UPCOMING">UPCOMING</option>
                <option value="LIVE">LIVE NOW 🔴</option>
                <option value="COMPLETED">COMPLETED ✓</option>
                <option value="POSTPONED">POSTPONED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="TBD">TBD / UNSCHEDULED</option>
              </select>
            </div>

            <div className="col-span-full pt-4 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
              <button 
                type="button" 
                onClick={() => { setEditingProg(null); setIsAdding(false); }}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Save Schedule Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="premium-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
          
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-3 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search code #, title, or venue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold outline-none"
            />
          </div>

          {/* Stage Filter */}
          <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1 text-xs font-extrabold border border-neutral-200 dark:border-neutral-800">
            {(['All', 'Off-Stage', 'On-Stage'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStageTypeFilter(st)}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  stageTypeFilter === st ? 'bg-amber-500 text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select 
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-extrabold outline-none"
            >
              <option value="All">ALL DATES</option>
              <option value="11 AUG">11 AUG 2026</option>
              <option value="12 AUG">12 AUG 2026</option>
              <option value="13 AUG">13 AUG 2026</option>
              <option value="14 AUG">14 AUG 2026</option>
              <option value="16 AUG">16 AUG 2026</option>
              <option value="17 AUG">17 AUG 2026</option>
              <option value="18 AUG">18 AUG 2026</option>
              <option value="19 AUG">19 AUG 2026</option>
              <option value="20 AUG">20 AUG 2026</option>
              <option value="TBD">TBD / UNSCHEDULED</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-extrabold outline-none"
            >
              <option value="All">ALL CATEGORIES</option>
              <option value="Kiddies">Kiddies</option>
              <option value="Sub Junior">Sub Junior</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Super Senior">Super Senior</option>
              <option value="General">General</option>
            </select>
          </div>

        </div>
      </div>

      {/* Schedule Management Table */}
      <div className="premium-card p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3 px-3">Code</th>
              <th className="py-3 px-3">Program Title</th>
              <th className="py-3 px-3">Category & Gender</th>
              <th className="py-3 px-3">Stage Type</th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Venue</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-semibold">
            {filtered.length > 0 ? (
              filtered.map(prog => {
                const venueConflict = checkVenueConflict(prog);

                return (
                  <tr key={prog.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-black text-neutral-900 dark:text-white">
                      #{prog.code}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900 dark:text-white">{prog.title}</div>
                      {venueConflict && (
                        <span className="text-[9px] font-mono font-extrabold text-rose-600 dark:text-rose-400 block mt-0.5 flex items-center gap-1">
                          <AlertCircle size={10} /> ⚠️ VENUE CONFLICT: Overlaps with #{venueConflict.code} ({venueConflict.title})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono font-bold text-[10px]">
                        {prog.categoryLevel || 'Sub Junior'} ({prog.gender || 'Boys'})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        prog.section === 'Off-Stage' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {prog.section || 'Off-Stage'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      {prog.scheduledDate || 'TBD'} | {prog.startTime && prog.endTime ? `${prog.startTime}–${prog.endTime}` : (prog.startTime || 'TBD')}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300 font-medium">
                      {prog.venue || 'Examination Hall'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        prog.scheduleStatus === 'LIVE' ? 'bg-rose-600 text-white animate-pulse' :
                        prog.scheduleStatus === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' :
                        prog.scheduleStatus === 'CANCELLED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600' :
                        'bg-sky-100 dark:bg-sky-950 text-sky-600'
                      }`}>
                        {prog.scheduleStatus || 'UPCOMING'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openEditForm(prog)}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                          title="Edit Schedule Entry"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSchedule(prog.id, prog.code)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                          title="Delete Schedule Entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-neutral-400 italic">
                  No program schedules match your search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
