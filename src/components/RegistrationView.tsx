import React, { useState, useEffect } from 'react';
import { UserProfile, Programme, Team, PublishedResult, Appeal } from '../types';
import { 
  Check, AlertCircle, User, Users, LogIn, Sparkles, Trash2, Plus, 
  UserPlus, Trophy, Edit3, CheckCircle2, AlertTriangle, FileText, HelpCircle, 
  ArrowRight, Lock, ShieldCheck, Search, Filter, Calendar, X, ChevronRight, Layers, Bookmark, Clock, MapPin
} from 'lucide-react';
import { getCategoryFromClassAndGender, validateProgramAssignment } from '../utils/studentUtils';

interface RegistrationViewProps {
  currentUser: UserProfile | null;
  onLogin: (identifier: string, role: 'student' | 'judge' | 'admin', password?: string) => boolean;
  onLogout: () => void;
  programmes: Programme[];
  teams: Team[];
  onRegisterEvent: (programmeId: string) => void;
  onDeregisterEvent: (programmeId: string) => void;
  users: UserProfile[];
  onUpdateTeams: (teams: Team[]) => void;
  onUpdateUsers: (users: UserProfile[]) => void;
  results: PublishedResult[];
  appeals: Appeal[];
  onSubmitAppeal: (programmeId: string, reason: string, file: string) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  programmes,
  teams,
  users,
  onUpdateTeams,
  onUpdateUsers,
  results,
  appeals,
  onSubmitAppeal,
}) => {
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Leader Tab: 'roster' (Default), 'schedule', or 'appeals'
  const [activeLeaderTab, setActiveLeaderTab] = useState<'roster' | 'schedule' | 'appeals'>('roster');

  // Category filter state inside Leader Roster
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [rosterSearch, setRosterSearch] = useState('');

  // Modal Visibility Flags (For Card Click Popups)
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Student Edit Modal states (Leader Editing Allowed Fields ONLY)
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editGuardian, setEditGuardian] = useState('');
  const [editClass, setEditClass] = useState('5');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Program Assignment Modal states
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState<UserProfile | null>(null);
  const [assignSearch, setAssignSearch] = useState('');
  const [assignTypeFilter, setAssignTypeFilter] = useState<'All' | 'Individual' | 'Group'>('All');
  const [assignErrorMsg, setAssignErrorMsg] = useState('');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState('');

  // Appeal Form States
  const [appealProgId, setAppealProgId] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [appealFile, setAppealFile] = useState('');
  const [appealSuccessMsg, setAppealSuccessMsg] = useState('');
  const [appealErrorMsg, setAppealErrorMsg] = useState('');

  // Identify Leader's Team Division details
  const activeTeamId = currentUser?.teamId || 'diraya_boys';
  const studentTeam = teams.find(t => t.id === activeTeamId) || teams[0];
  const isLeaderLoggedIn = !!currentUser && (currentUser.role === 'student' || currentUser.role === 'team_leader' || currentUser.role === 'admin');

  // Determine Leader Division Group and Gender
  const leaderGroup: 'DIRAYA' | 'FUROOHA' | 'SWARAHA' = (studentTeam?.groupName as any) || 
    (activeTeamId.includes('diraya') ? 'DIRAYA' : activeTeamId.includes('furooha') ? 'FUROOHA' : 'SWARAHA');

  const leaderGender: 'Boys' | 'Girls' = studentTeam?.gender || 
    (activeTeamId.includes('girls') ? 'Girls' : 'Boys');

  // Requirement #3: Filter students belonging STRICTLY to Leader's own Group + Gender division
  const divisionStudents = users.filter(u => {
    if (u.role !== 'student') return false;
    // Exclude leader credentials
    if (u.leaderId && u.id.startsWith('leader_')) return false;

    const uGroup = u.group || (u.teamId?.includes('diraya') ? 'DIRAYA' : u.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
    const uGender = u.gender || (u.teamId?.includes('girls') ? 'Girls' : 'Boys');

    return uGroup === leaderGroup && uGender === leaderGender;
  });

  // Filtered division students by Category tab and search
  const filteredDivisionStudents = divisionStudents.filter(s => {
    const sCat = s.category || getCategoryFromClassAndGender(s.studentClass || '5', leaderGender);
    if (selectedCategoryTab !== 'All' && sCat !== selectedCategoryTab) return false;

    if (rosterSearch.trim()) {
      const q = rosterSearch.toLowerCase().trim();
      const mName = s.name.toLowerCase().includes(q);
      const mChest = (s.chestNo || '').toLowerCase().includes(q);
      const mGuardian = (s.guardianName || '').toLowerCase().includes(q);
      return mName || mChest || mGuardian;
    }
    return true;
  });

  // Handle Leader Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setLoginError('Please enter your Division Leader ID or Email.');
      return;
    }
    if (!password.trim()) {
      setLoginError('Please enter your Access Password.');
      return;
    }
    const success = onLogin(email.trim(), 'student', password.trim());
    if (success) {
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Access denied. Please enter a valid Leader ID and Password.');
    }
  };

  // Open Student Edit Modal (Leader permitted details ONLY)
  const handleOpenEditStudent = (student: UserProfile) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditGuardian(student.guardianName || '');
    setEditClass(student.studentClass || '5');
    setEditSuccessMsg('');
  };

  // Save Student Allowed Details
  const handleSaveStudentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editName.trim()) return;

    const updatedCategory = getCategoryFromClassAndGender(editClass, leaderGender);

    const updated = users.map(u => {
      if (u.id === editingStudent.id) {
        return {
          ...u,
          name: editName.trim(),
          guardianName: editGuardian.trim(),
          studentClass: editClass,
          category: updatedCategory,
          // Chest Number, Group, Gender remain UNCHANGED and PROTECTED
        };
      }
      return u;
    });

    onUpdateUsers(updated);
    setEditSuccessMsg(`Student profile updated! Class ${editClass} -> Category: ${updatedCategory}`);
    setTimeout(() => {
      setEditingStudent(null);
      setEditSuccessMsg('');
    }, 1200);
  };

  // Assign Program to Student
  const handleAssignProgramToStudent = (programme: Programme) => {
    if (!selectedStudentForAssign) return;

    setAssignErrorMsg('');
    setAssignSuccessMsg('');

    // Requirement #12: Validate Assignment Rules
    const validation = validateProgramAssignment(
      selectedStudentForAssign,
      programme,
      programmes,
      users,
      currentUser?.teamId
    );

    if (!validation.valid) {
      setAssignErrorMsg(validation.reason || 'Assignment restriction violated.');
      return;
    }

    // Perform Assignment
    const updatedUsers = users.map(u => {
      if (u.id === selectedStudentForAssign.id) {
        return {
          ...u,
          registeredProgrammeIds: [...(u.registeredProgrammeIds || []), programme.id]
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    
    // Update active selected student object
    setSelectedStudentForAssign({
      ...selectedStudentForAssign,
      registeredProgrammeIds: [...(selectedStudentForAssign.registeredProgrammeIds || []), programme.id]
    });

    setAssignSuccessMsg(`Successfully assigned "${programme.title}" to ${selectedStudentForAssign.name}!`);
    setTimeout(() => setAssignSuccessMsg(''), 3000);
  };

  // Unassign Program from Student
  const handleUnassignProgramFromStudent = (studentId: string, programmeId: string) => {
    const student = users.find(u => u.id === studentId);
    if (!student) return;

    const updatedUsers = users.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          registeredProgrammeIds: (u.registeredProgrammeIds || []).filter(id => id !== programmeId)
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);

    if (selectedStudentForAssign && selectedStudentForAssign.id === studentId) {
      setSelectedStudentForAssign({
        ...selectedStudentForAssign,
        registeredProgrammeIds: (selectedStudentForAssign.registeredProgrammeIds || []).filter(id => id !== programmeId)
      });
    }
  };

  // Handle Appeal Submission
  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppealErrorMsg('');
    setAppealSuccessMsg('');

    if (!appealProgId) {
      setAppealErrorMsg('Please select a completed event for appeal.');
      return;
    }
    if (!appealReason.trim()) {
      setAppealErrorMsg('Please enter detailed reasons for appeal.');
      return;
    }

    onSubmitAppeal(appealProgId, appealReason.trim(), appealFile.trim());
    setAppealSuccessMsg('Official appeal statement submitted to Jury Committee.');
    setAppealProgId('');
    setAppealReason('');
    setAppealFile('');
    setTimeout(() => setAppealSuccessMsg(''), 4000);
  };

  // IF NOT LOGGED IN AS LEADER: Render Leader Portal Login Screen
  if (!isLeaderLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 animate-fade-in" id="leader-login-view">
        {/* Banner Header */}
        <div className="premium-card p-8 text-center space-y-4 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-neutral-900 to-neutral-950 text-white shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 ring-4 ring-emerald-500/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <span className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-widest block">
              OFFICIAL LEADERS WORKSPACE
            </span>
            <h1 className="text-3xl font-display font-black tracking-tight text-white mt-1">
              Team Leader Control Portal
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium max-w-md mx-auto mt-2">
              Sign in as a Group & Gender Division Leader (DIRAYA, FUROOHA, SWARAHA) to manage student profiles and event assignments.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <LogIn size={20} className="text-emerald-500" />
            Division Leader Sign-In
          </h2>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Leader Login ID / Email *
              </label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. diraya_boys@artsportal.edu or leader_diraya_boys"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none text-neutral-900 dark:text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Access Password *
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter leader access password"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none text-neutral-900 dark:text-white"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Authenticate & Open Leader Desk</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN AS LEADER: Render Full Leader Portal
  return (
    <div className="space-y-8 animate-fade-in pb-16" id="leader-portal-view">
      
      {/* HUD Header Banner */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-neutral-950 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 ring-4 ring-emerald-500/20 shrink-0">
            <Trophy size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider">
                ACTIVE DIVISION LEADER
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase tracking-wider">
                {leaderGroup} {leaderGender.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
              {currentUser.name}
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium">
              Managing {divisionStudents.length} Students in <span className="font-bold text-white">{leaderGroup} {leaderGender}</span> Division
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/20"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Requirement #13: Leader Dashboard Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-5 border border-emerald-500/20 text-center space-y-1">
          <div className="text-2xl font-display font-black text-neutral-900 dark:text-white">{divisionStudents.length}</div>
          <div className="text-[10px] font-sans font-extrabold text-neutral-400 uppercase tracking-wider">Total Division Students</div>
        </div>

        <div className="premium-card p-5 border border-purple-500/20 text-center space-y-1">
          <div className="text-2xl font-display font-black text-purple-600 dark:text-purple-400">
            {divisionStudents.filter(s => (s.registeredProgrammeIds || []).length > 0).length}
          </div>
          <div className="text-[10px] font-sans font-extrabold text-neutral-400 uppercase tracking-wider">Assigned to Events</div>
        </div>

        <div className="premium-card p-5 border border-amber-500/20 text-center space-y-1">
          <div className="text-2xl font-display font-black text-amber-600 dark:text-amber-400">
            {divisionStudents.filter(s => (s.registeredProgrammeIds || []).length === 0).length}
          </div>
          <div className="text-[10px] font-sans font-extrabold text-neutral-400 uppercase tracking-wider">Unassigned Students</div>
        </div>

        <div className="premium-card p-5 border border-teal-500/20 text-center space-y-1">
          <div className="text-2xl font-display font-black text-teal-600 dark:text-teal-400">
            {programmes.filter(p => p.type === 'Individual').length} / {programmes.filter(p => p.type === 'Group').length}
          </div>
          <div className="text-[10px] font-sans font-extrabold text-neutral-400 uppercase tracking-wider">Individual / Group Items</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar inside Leader Portal */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-6 flex-wrap">
        <button
          onClick={() => setActiveLeaderTab('roster')}
          className={`pb-3 text-sm font-display font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
            activeLeaderTab === 'roster' 
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Users size={18} />
          Student Roster ({divisionStudents.length})
        </button>

        <button
          onClick={() => setActiveLeaderTab('schedule')}
          className={`pb-3 text-sm font-display font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
            activeLeaderTab === 'schedule' 
              ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Calendar size={18} />
          Team Schedule & Off-Stage Timetable
        </button>

        <button
          onClick={() => setActiveLeaderTab('appeals')}
          className={`pb-3 text-sm font-display font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
            activeLeaderTab === 'appeals' 
              ? 'border-rose-500 text-rose-600 dark:text-rose-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <ShieldCheck size={18} />
          Official Appeals Desk
        </button>
      </div>

      {/* TAB 1: STUDENT ROSTER & ASSIGNMENTS */}
      {activeLeaderTab === 'roster' && (
        <div className="space-y-6" id="leader-student-roster">
          
          {/* Category Filter Pills & Search */}
          <div className="premium-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 mr-1 uppercase tracking-wider">Category:</span>
              {['All', 'Sub Junior', 'Junior', 'Senior', ...(leaderGender === 'Boys' ? ['Super Senior'] : [])].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategoryTab === cat 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {cat} ({
                    cat === 'All' 
                      ? divisionStudents.length 
                      : divisionStudents.filter(s => (s.category || getCategoryFromClassAndGender(s.studentClass || '5', leaderGender)) === cat).length
                  })
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={15} />
              <input 
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search Chest No or Name..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold outline-none text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          {/* INLINE EMBEDDED WORKSPACE 1: EDIT STUDENT PROFILE */}
          {editingStudent && (
            <div className="premium-card p-6 md:p-8 space-y-6 border-2 border-amber-500/40 bg-amber-950/10 dark:bg-amber-950/20 shadow-xl animate-fade-in" id="inline-edit-student-panel">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                    ACTIVE EDIT WORKSPACE
                  </span>
                  <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <Edit3 className="text-amber-500" size={22} />
                    Edit Profile: {editingStudent.name} (Chest No: {editingStudent.chestNo || 'N/A'})
                  </h3>
                </div>
                <button 
                  onClick={() => setEditingStudent(null)} 
                  className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-rose-600 hover:text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X size={16} /> Close Edit Panel
                </button>
              </div>

              {editSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveStudentDetails} className="space-y-4 text-xs font-semibold">
                
                {/* PROTECTED CHEST NUMBER 🔒 */}
                <div>
                  <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Lock size={12} /> Chest Number (LOCKED BY ADMIN 🔒)
                  </label>
                  <input 
                    type="text" 
                    value={editingStudent.chestNo || 'N/A'}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-mono font-black opacity-80 cursor-not-allowed"
                  />
                  <span className="text-[9px] text-neutral-400 mt-1 block italic">
                    * Requirement #2: Team Leader cannot edit Chest Numbers. Contact Admin for updates.
                  </span>
                </div>

                {/* EDITABLE STUDENT NAME */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Student Full Name *
                  </label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                    required
                  />
                </div>

                {/* EDITABLE GUARDIAN NAME */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Parent / Guardian Name
                  </label>
                  <input 
                    type="text" 
                    value={editGuardian}
                    onChange={(e) => setEditGuardian(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
                  />
                </div>

                {/* EDITABLE CLASS (3 to 12) */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Academic Class (3 to 12) *
                  </label>
                  <select 
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-mono font-bold"
                  >
                    {[3,4,5,6,7,8,9,10,11,12].map(c => (
                      <option key={c} value={String(c)}>Class {c}</option>
                    ))}
                  </select>
                </div>

                {/* Calculated Category */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span>Calculated Category:</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-mono uppercase">
                    {getCategoryFromClassAndGender(editClass, leaderGender)}
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                  <button 
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition-all cursor-pointer"
                  >
                    Save Student Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* INLINE EMBEDDED WORKSPACE 2: ASSIGN PROGRAM ITEMS */}
          {selectedStudentForAssign && (
            <div className="premium-card p-6 md:p-8 space-y-6 border-2 border-emerald-500/40 bg-emerald-950/10 dark:bg-emerald-950/20 shadow-xl animate-fade-in" id="inline-assign-items-panel">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest block">
                    EVENT ASSIGNMENT WORKSPACE
                  </span>
                  <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <Plus className="text-emerald-500" size={22} />
                    Assign Items: {selectedStudentForAssign.name} (Chest No: {selectedStudentForAssign.chestNo || 'N/A'})
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedStudentForAssign(null)} 
                  className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-rose-600 hover:text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X size={16} /> Close Assign Panel
                </button>
              </div>

              {/* Live Student Limits Summary */}
              {(() => {
                const indCount = (selectedStudentForAssign.registeredProgrammeIds || []).reduce((acc, pId) => {
                  const p = programmes.find(item => item.id === pId);
                  return p && p.type === 'Individual' ? acc + 1 : acc;
                }, 0);

                const grpCount = (selectedStudentForAssign.registeredProgrammeIds || []).reduce((acc, pId) => {
                  const p = programmes.find(item => item.id === pId);
                  return p && p.type === 'Group' ? acc + 1 : acc;
                }, 0);

                return (
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-bold">Individual Program Counter:</span>
                      <span className={`font-mono font-black text-sm ${indCount >= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {indCount} / 5 {indCount >= 5 ? '🔒 (Limit Reached)' : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-bold">Group Program Counter:</span>
                      <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                        {grpCount} Items (Unlimited)
                      </span>
                    </div>
                  </div>
                );
              })()}

              {assignErrorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{assignErrorMsg}</span>
                </div>
              )}

              {assignSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{assignSuccessMsg}</span>
                </div>
              )}

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-2.5 text-neutral-400" size={15} />
                  <input 
                    type="text"
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                    placeholder="Search program title or code..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold outline-none text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(['All', 'Individual', 'Group'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setAssignTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        assignTypeFilter === t 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Programmes Catalogue List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto hide-scrollbar pr-1">
                {programmes.filter(p => {
                  if (assignTypeFilter !== 'All' && p.type !== assignTypeFilter) return false;
                  if (assignSearch.trim()) {
                    const q = assignSearch.toLowerCase().trim();
                    return p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
                  }
                  return true;
                }).map(prog => {
                  const isAssigned = (selectedStudentForAssign.registeredProgrammeIds || []).includes(prog.id);

                  const divisionCountInProg = users.filter(u => 
                    u.role === 'student' && 
                    u.teamId === currentUser?.teamId && 
                    (u.registeredProgrammeIds || []).includes(prog.id)
                  ).length;

                  const isDivisionFull = divisionCountInProg >= 4;

                  const indCount = (selectedStudentForAssign.registeredProgrammeIds || []).reduce((acc, pId) => {
                    const p = programmes.find(item => item.id === pId);
                    return p && p.type === 'Individual' ? acc + 1 : acc;
                  }, 0);

                  const isIndLimitReached = prog.type === 'Individual' && indCount >= 5;

                  return (
                    <div 
                      key={prog.id} 
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300">
                            [{prog.code}]
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            prog.type === 'Individual' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          }`}>
                            {prog.type}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">
                            {prog.section}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {prog.title}
                        </h4>

                        <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-medium">
                          <span>Venue: {prog.venue}</span>
                          <span>•</span>
                          <span className={`font-mono font-bold ${isDivisionFull ? 'text-rose-600' : 'text-emerald-600'}`}>
                            Division Seats: {divisionCountInProg} / 4 {isDivisionFull ? '(Full)' : ''}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isAssigned ? (
                          <button 
                            onClick={() => handleUnassignProgramFromStudent(selectedStudentForAssign.id, prog.id)}
                            className="px-3.5 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <X size={13} />
                            Unassign Item
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAssignProgramToStudent(prog)}
                            disabled={isIndLimitReached || isDivisionFull}
                            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all ${
                              isIndLimitReached || isDivisionFull
                                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer'
                            }`}
                          >
                            <Plus size={14} />
                            {isIndLimitReached ? '5/5 Limit Full' : isDivisionFull ? '4/4 Division Full' : 'Assign Item'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDivisionStudents.length > 0 ? (
              filteredDivisionStudents.map((student) => {
                const studentCategory = student.category || getCategoryFromClassAndGender(student.studentClass || '5', leaderGender);
                
                const individualCount = (student.registeredProgrammeIds || []).reduce((count, pId) => {
                  const p = programmes.find(item => item.id === pId);
                  return (p && p.type === 'Individual') ? count + 1 : count;
                }, 0);

                const groupCount = (student.registeredProgrammeIds || []).reduce((count, pId) => {
                  const p = programmes.find(item => item.id === pId);
                  return (p && p.type === 'Group') ? count + 1 : count;
                }, 0);

                const isIndLimitReached = individualCount >= 5;

                return (
                  <div 
                    key={student.id} 
                    className="premium-card p-6 space-y-4 border border-emerald-500/20 hover:scale-[1.02] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      {/* Header: Chest No (Read Only 🔒) & Category */}
                      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono font-black text-xs border border-amber-400/50 shadow-xs" title="Chest Number is Read-Only for Leaders">
                          <Lock size={12} className="text-amber-600" />
                          Chest No: {student.chestNo || 'N/A'} 🔒
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-sans text-[10px] font-extrabold uppercase tracking-wider">
                          {studentCategory}
                        </span>
                      </div>

                      {/* Name & Class */}
                      <div>
                        <h3 className="text-lg font-display font-black text-neutral-900 dark:text-white leading-tight">
                          {student.name}
                        </h3>
                        <div className="text-xs text-neutral-500 font-medium mt-0.5 flex items-center justify-between">
                          <span>Class {student.studentClass || '5'}</span>
                          <span>Guardian: {student.guardianName || '—'}</span>
                        </div>
                      </div>

                      {/* Requirement #8 & #9: Individual & Group Item Badges */}
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1.5 text-xs font-semibold">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Individual Programs:</span>
                          <span className={`font-mono font-black ${isIndLimitReached ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {individualCount} / 5 {isIndLimitReached ? '(Limit Reached 🔒)' : ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Group Programs:</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {groupCount} Items (Unlimited)
                          </span>
                        </div>
                      </div>

                      {/* Assigned Items List */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                          Assigned Items ({(student.registeredProgrammeIds || []).length}):
                        </span>

                        {(student.registeredProgrammeIds || []).length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {(student.registeredProgrammeIds || []).map(pId => {
                              const prog = programmes.find(p => p.id === pId);
                              if (!prog) return null;
                              return (
                                <div 
                                  key={prog.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold"
                                >
                                  <span>{prog.title} ({prog.type[0]})</span>
                                  <button 
                                    onClick={() => handleUnassignProgramFromStudent(student.id, prog.id)}
                                    className="hover:text-rose-600 text-neutral-400"
                                    title="Unassign Item"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 italic block">No items assigned yet.</span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <button 
                        onClick={() => {
                          handleOpenEditStudent(student);
                          setSelectedStudentForAssign(null);
                          setTimeout(() => {
                            const panel = document.getElementById('inline-edit-student-panel');
                            if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 50);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title="Edit Student Name, Guardian, Class"
                      >
                        <Edit3 size={14} />
                        Edit Info
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedStudentForAssign(student);
                          setEditingStudent(null);
                          setAssignErrorMsg('');
                          setAssignSuccessMsg('');
                          setTimeout(() => {
                            const panel = document.getElementById('inline-assign-items-panel');
                            if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 50);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={15} />
                        Assign Items
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12 premium-card text-neutral-500 text-sm">
                No students found in this category or search criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIVISION SCHEDULE WORKSPACE */}
      {activeLeaderTab === 'schedule' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-fade-in" id="leader-schedule-tab">
          <div className="premium-card p-6 md:p-8 space-y-6">
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                TEAM DIVISION MASTER TIMETABLE
              </span>
              <h2 className="text-2xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2 mt-1">
                <Calendar size={24} className="text-amber-500" />
                {leaderGroup} {leaderGender} — Off-Stage & Master Schedule
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Showing scheduled competitions relevant to <span className="font-bold text-neutral-800 dark:text-neutral-200">{leaderGroup} {leaderGender}</span> division along with assigned team participants.
              </p>
            </div>

            {/* Division Schedule Table / List */}
            <div className="space-y-4">
              {(() => {
                const teamProgs = programmes.filter(p => {
                  const g = p.gender || (p.categoryGroup?.toLowerCase().includes('girls') ? 'Girls' : 'Boys');
                  if (leaderGender === 'Boys' && g === 'Girls') return false;
                  if (leaderGender === 'Girls' && g === 'Boys') return false;
                  return true;
                });

                if (teamProgs.length === 0) {
                  return (
                    <div className="text-center py-12 text-neutral-400 text-xs italic">
                      No scheduled competitions found for your division.
                    </div>
                  );
                }

                return teamProgs.map(prog => {
                  const assignedDivisionStudents = users.filter(u => 
                    u.role === 'student' && 
                    u.teamId === currentUser?.teamId && 
                    (u.registeredProgrammeIds || []).includes(prog.id)
                  );

                  return (
                    <div 
                      key={prog.id} 
                      className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 dark:text-amber-400 font-mono font-black text-xs">
                            #{prog.code}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            prog.section === 'Off-Stage' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {prog.section || 'Off-Stage'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-black uppercase">
                            {prog.categoryLevel || 'Sub Junior'} {prog.gender || 'Boys'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> {prog.scheduledDate || 'TBD'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {prog.startTime && prog.endTime ? `${prog.startTime}–${prog.endTime}` : (prog.startTime || 'TBD')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                        <div>
                          <h4 className="font-display font-black text-base text-neutral-900 dark:text-white">
                            {prog.title}
                          </h4>
                          <span className="text-xs text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin size={13} className="text-rose-500" /> Venue: <strong className="text-neutral-800 dark:text-neutral-200">{prog.venue || 'Examination Hall'}</strong>
                          </span>
                        </div>

                        {/* Assigned Participants List */}
                        <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1 min-w-[240px]">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                            Assigned Division Participants ({assignedDivisionStudents.length} / 4):
                          </span>
                          {assignedDivisionStudents.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {assignedDivisionStudents.map(st => (
                                <span key={st.id} className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px]">
                                  [{st.chestNo || 'N/A'}] {st.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-400 italic block">No participants assigned yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL APPEALS DESK */}
      {activeLeaderTab === 'appeals' && (
        <div className="space-y-6 max-w-4xl mx-auto" id="leader-appeals-tab">
          <div className="premium-card p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={24} className="text-rose-500" />
              Official Re-evaluation Appeals Desk
            </h2>

            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Submit formal re-evaluation statements for completed competitions on behalf of <span className="font-bold text-neutral-900 dark:text-white">{leaderGroup} {leaderGender}</span> students.
            </p>

            {appealSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{appealSuccessMsg}</span>
              </div>
            )}

            {appealErrorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{appealErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAppealSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Select Completed Competition *
                </label>
                <select 
                  value={appealProgId}
                  onChange={(e) => setAppealProgId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none text-neutral-900 dark:text-white font-bold"
                >
                  <option value="">-- Choose Completed Event --</option>
                  {programmes.filter(p => p.resultPublished).map(p => (
                    <option key={p.id} value={p.id}>[{p.code}] {p.title} ({p.categoryGroup || 'General'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Detailed Appeal Statement *
                </label>
                <textarea 
                  rows={4}
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Specify the exact evaluation or technical concern for jury review..."
                  className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none text-neutral-900 dark:text-white"
                />
              </div>

              <button 
                type="submit"
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md transition-all cursor-pointer"
              >
                Submit Official Appeal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: STUDENT PROFILE EDIT MODAL (Chest Number READ-ONLY 🔒) */}
      {editingStudent && showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <Edit3 className="text-amber-500" size={22} />
                Edit Student Profile
              </h3>
              <button 
                onClick={() => {
                  setEditingStudent(null);
                  setShowEditModal(false);
                }} 
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => {
              handleSaveStudentDetails(e);
              setShowEditModal(false);
            }} className="space-y-4 text-xs font-semibold">
              
              {/* PROTECTED READ-ONLY CHEST NUMBER 🔒 */}
              <div>
                <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Lock size={12} /> Chest Number (LOCKED BY ADMIN) 🔒
                </label>
                <input 
                  type="text" 
                  value={editingStudent.chestNo || 'N/A'}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-mono font-black opacity-80 cursor-not-allowed"
                />
                <span className="text-[9px] text-neutral-400 mt-1 block italic">
                  * Requirement #2: Team Leader cannot change or edit Chest Numbers. Contact Admin for chest number updates.
                </span>
              </div>

              {/* PROTECTED READ-ONLY GROUP & GENDER */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Group (Locked)
                  </label>
                  <input 
                    type="text" 
                    value={leaderGroup}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-bold opacity-80 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Gender (Locked)
                  </label>
                  <input 
                    type="text" 
                    value={leaderGender}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-bold opacity-80 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* PERMITTED EDITABLE STUDENT NAME */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Student Full Name *
                </label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                  required
                />
              </div>

              {/* PERMITTED EDITABLE GUARDIAN NAME */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Parent / Guardian Name
                </label>
                <input 
                  type="text" 
                  value={editGuardian}
                  onChange={(e) => setEditGuardian(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
                />
              </div>

              {/* PERMITTED EDITABLE CLASS (3 to 12) */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Academic Class (3 to 12) *
                </label>
                <select 
                  value={editClass}
                  onChange={(e) => setEditClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-mono font-bold"
                >
                  {[3,4,5,6,7,8,9,10,11,12].map(c => (
                    <option key={c} value={String(c)}>Class {c}</option>
                  ))}
                </select>
              </div>

              {/* Calculated Category Badge */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>Calculated Category:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono uppercase">
                  {getCategoryFromClassAndGender(editClass, leaderGender)}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button 
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition-all cursor-pointer"
                >
                  Save Allowed Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PROGRAM ASSIGNMENT MODAL (Strict Rules Validation) */}
      {selectedStudentForAssign && showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <Plus className="text-emerald-500" size={24} />
                  Assign Program Items
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Assigning items for <span className="font-bold text-neutral-900 dark:text-white">{selectedStudentForAssign.name}</span> (Chest No: {selectedStudentForAssign.chestNo || 'N/A'})
                </p>
              </div>
              <button 
                onClick={() => {
                  setSelectedStudentForAssign(null);
                  setShowAssignModal(false);
                }} 
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Live Student Limits Summary */}
            {(() => {
              const indCount = (selectedStudentForAssign.registeredProgrammeIds || []).reduce((acc, pId) => {
                const p = programmes.find(item => item.id === pId);
                return p && p.type === 'Individual' ? acc + 1 : acc;
              }, 0);

              const grpCount = (selectedStudentForAssign.registeredProgrammeIds || []).reduce((acc, pId) => {
                const p = programmes.find(item => item.id === pId);
                return p && p.type === 'Group' ? acc + 1 : acc;
              }, 0);

              return (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-bold">Individual Program Counter:</span>
                    <span className={`font-mono font-black text-sm ${indCount >= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {indCount} / 5 {indCount >= 5 ? '🔒 (Limit Reached)' : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-bold">Group Program Counter:</span>
                    <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                      {grpCount} Items (Unlimited)
                    </span>
                  </div>
                </div>
              );
            })()}

            {assignErrorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{assignErrorMsg}</span>
              </div>
            )}

            {assignSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{assignSuccessMsg}</span>
              </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 text-neutral-400" size={15} />
                <input 
                  type="text"
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  placeholder="Search program title or code..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold outline-none text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                {(['All', 'Individual', 'Group'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setAssignTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      assignTypeFilter === t 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Programmes Catalogue List */}
            <div className="overflow-y-auto hide-scrollbar space-y-3 flex-1 pr-1">
              {programmes.filter(p => {
                if (assignTypeFilter !== 'All' && p.type !== assignTypeFilter) return false;
                if (assignSearch.trim()) {
                  const q = assignSearch.toLowerCase().trim();
                  return p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
                }
                return true;
              }).map(prog => {
                const isAssigned = (selectedStudentForAssign.registeredProgrammeIds || []).includes(prog.id);

                // Calculate division participants count for this program
                const divisionCountInProg = users.filter(u => 
                  u.role === 'student' && 
                  u.teamId === currentUser?.teamId && 
                  (u.registeredProgrammeIds || []).includes(prog.id)
                ).length;

                const isDivisionFull = divisionCountInProg >= 4;

                const indCount = (selectedStudentForAssign.registeredProgrammeIds || []).reduce((acc, pId) => {
                  const p = programmes.find(item => item.id === pId);
                  return p && p.type === 'Individual' ? acc + 1 : acc;
                }, 0);

                const isIndLimitReached = prog.type === 'Individual' && indCount >= 5;

                return (
                  <div 
                    key={prog.id} 
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300">
                          [{prog.code}]
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          prog.type === 'Individual' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {prog.type}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">
                          {prog.section}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {prog.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-medium">
                        <span>Venue: {prog.venue}</span>
                        <span>•</span>
                        <span className={`font-mono font-bold ${isDivisionFull ? 'text-rose-600' : 'text-emerald-600'}`}>
                          Division Seats: {divisionCountInProg} / 4 {isDivisionFull ? '(Full)' : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isAssigned ? (
                        <button 
                          onClick={() => handleUnassignProgramFromStudent(selectedStudentForAssign.id, prog.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X size={13} />
                          Unassign
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAssignProgramToStudent(prog)}
                          disabled={isIndLimitReached || isDivisionFull}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all ${
                            isIndLimitReached || isDivisionFull
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer'
                          }`}
                        >
                          <Plus size={14} />
                          {isIndLimitReached ? '5/5 Limit Full' : isDivisionFull ? '4/4 Division Full' : 'Assign Item'}
                        </button>
                      )}
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
