import React, { useState, useEffect } from 'react';
import { UserProfile, Programme, Evaluation, PublishedResult, Team, SystemSettings } from '../types';
import { Search, Sliders, Check, Save, Lock, Unlock, AlertTriangle, LogIn, Award, Shield, User, Star, Clock, ListChecks, HelpCircle, Sparkles } from 'lucide-react';
import { loadFromStorage, saveToStorage } from '../data';
import { getCategoryFromClassAndGender } from '../utils/studentUtils';

interface JudgePortalProps {
  currentUser: UserProfile | null;
  onLogin: (email: string, role: 'student' | 'judge' | 'admin', password?: string) => boolean;
  onLogout: () => void;
  programmes: Programme[];
  users: UserProfile[];
  teams: Team[];
  onLockResults: (programmeId: string, rankings: any[]) => void;
  results: PublishedResult[];
  settings: SystemSettings;
  evaluations: Evaluation[];
  onUpdateEvaluations: (newEvals: Evaluation[]) => void;
}

export const JudgePortal: React.FC<JudgePortalProps> = ({
  currentUser,
  onLogin,
  onLogout,
  programmes,
  users,
  teams,
  onLockResults,
  results,
  settings,
  evaluations,
  onUpdateEvaluations,
}) => {
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Selected program for active evaluation
  const [selectedProgId, setSelectedProgId] = useState<string | null>(null);
  const [progSearch, setProgSearch] = useState('');

  // Local feedback message
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1st, 2nd, and 3rd place student IDs (By Chest Numbers)
  const [firstPlaceId, setFirstPlaceId] = useState<string>('');
  const [secondPlaceId, setSecondPlaceId] = useState<string>('');
  const [thirdPlaceId, setThirdPlaceId] = useState<string>('');
  const [workspaceTab, setWorkspaceTab] = useState<'matrix' | 'sliders'>('matrix');

  // Auto-unlock evaluations if the result or programme is unlocked by administrators
  useEffect(() => {
    const activeRes = results.find(r => r.programmeId === selectedProgId);
    const activeProg = programmes.find(p => p.id === selectedProgId);
    const isUnlockedByAdmin = (activeRes && activeRes.locked === false) || (activeProg && activeProg.locked === false);
    
    if (selectedProgId && currentUser && isUnlockedByAdmin) {
      let changed = false;
      const unlockedEvals = evaluations.map(ev => {
        if (ev.programmeId === selectedProgId && ev.judgeId === currentUser.id && ev.status === 'Locked') {
          changed = true;
          return { ...ev, status: 'Draft' as const };
        }
        return ev;
      });
      if (changed) {
        onUpdateEvaluations(unlockedEvals);
      }
    }
  }, [selectedProgId, results, programmes, currentUser]);

  // Auto-analyze and calculate 1st, 2nd, and 3rd place winners from current evaluation marks out of 100
  const autoCalculatePodium = (evList: Evaluation[]) => {
    if (!selectedProgId || !currentUser) return;
    
    // Check if result is locked by admin
    const activeResult = results.find(r => r.programmeId === selectedProgId);
    if (activeResult) {
      const p1 = activeResult.rankings.find(rk => rk.position === 1)?.participantId || '';
      const p2 = activeResult.rankings.find(rk => rk.position === 2)?.participantId || '';
      const p3 = activeResult.rankings.find(rk => rk.position === 3)?.participantId || '';
      setFirstPlaceId(p1);
      setSecondPlaceId(p2);
      setThirdPlaceId(p3);
      return;
    }

    const currentProgEvals = evList.filter(ev => 
      ev.programmeId === selectedProgId && (ev.judgeId === currentUser.id || !ev.judgeId) && ev.totalScore > 0
    );

    if (currentProgEvals.length === 0) return;

    // Sort by totalScore descending
    const sorted = [...currentProgEvals].sort((a, b) => b.totalScore - a.totalScore);
    
    const p1 = sorted[0]?.participantId || '';
    const p2 = sorted[1]?.participantId || '';
    const p3 = sorted[2]?.participantId || '';

    setFirstPlaceId(p1);
    setSecondPlaceId(p2);
    setThirdPlaceId(p3);

    localStorage.setItem(
      `jury_winners_${selectedProgId}_${currentUser.id}`,
      JSON.stringify({ firstPlaceId: p1, secondPlaceId: p2, thirdPlaceId: p3 })
    );
  };

  // Synchronize 1st, 2nd, and 3rd place winners from results or evaluations
  useEffect(() => {
    if (!selectedProgId || !currentUser) {
      setFirstPlaceId('');
      setSecondPlaceId('');
      setThirdPlaceId('');
      return;
    }

    const activeResult = results.find(r => r.programmeId === selectedProgId);
    if (activeResult) {
      const p1 = activeResult.rankings.find(rk => rk.position === 1)?.participantId || '';
      const p2 = activeResult.rankings.find(rk => rk.position === 2)?.participantId || '';
      const p3 = activeResult.rankings.find(rk => rk.position === 3)?.participantId || '';
      setFirstPlaceId(p1);
      setSecondPlaceId(p2);
      setThirdPlaceId(p3);
    } else {
      autoCalculatePodium(evaluations);
    }
  }, [selectedProgId, currentUser?.id, results, evaluations]);

  const handleSelectWinner = (place: 1 | 2 | 3, participantId: string) => {
    let newP1 = firstPlaceId;
    let newP2 = secondPlaceId;
    let newP3 = thirdPlaceId;

    if (place === 1) {
      newP1 = participantId;
      setFirstPlaceId(participantId);
    } else if (place === 2) {
      newP2 = participantId;
      setSecondPlaceId(participantId);
    } else if (place === 3) {
      newP3 = participantId;
      setThirdPlaceId(participantId);
    }

    if (currentUser && selectedProgId) {
      localStorage.setItem(
        `jury_winners_${selectedProgId}_${currentUser.id}`,
        JSON.stringify({ firstPlaceId: newP1, secondPlaceId: newP2, thirdPlaceId: newP3 })
      );
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLoginError('Please enter your Jury ID or Email');
      return;
    }
    const success = onLogin(email.trim(), 'judge', password);
    if (success) {
      setLoginError('');
      setSelectedProgId(null);
    } else {
      setLoginError('Invalid Jury ID or Password.');
    }
  };

  // Get assigned programmes (or all 113 programmes if none explicitly assigned)
  const assignedProgrammes = (currentUser?.assignedProgrammeIds && currentUser.assignedProgrammeIds.length > 0)
    ? programmes.filter(p => currentUser.assignedProgrammeIds?.includes(p.id))
    : programmes;

  const filteredAssigned = assignedProgrammes.filter(p => 
    p.title.toLowerCase().includes(progSearch.toLowerCase()) || 
    p.code.toLowerCase().includes(progSearch.toLowerCase()) ||
    (p.categoryGroup && p.categoryGroup.toLowerCase().includes(progSearch.toLowerCase()))
  );

  // Active programme details
  const activeProgramme = programmes.find(p => p.id === selectedProgId);

  // Contender Search filter state
  const [contenderSearch, setContenderSearch] = useState('');

  // Get enrolled participants strictly filtered by Category & Gender for active programme
  const activeParticipants = React.useMemo(() => {
    const students = users.filter(u => u.role === 'student');
    if (!activeProgramme) return students;

    const registered = students.filter(u => (u.registeredProgrammeIds || []).includes(activeProgramme.id));

    const progGroupStr = (activeProgramme.categoryGroup || `${activeProgramme.categoryLevel || ''} ${activeProgramme.category || ''} ${activeProgramme.gender || ''}`).toLowerCase();
    
    const isGirlsProg = progGroupStr.includes('girls') || (activeProgramme.gender && activeProgramme.gender.toLowerCase() === 'girls');
    const isBoysProg = progGroupStr.includes('boys') || (activeProgramme.gender && activeProgramme.gender.toLowerCase() === 'boys');
    
    // Target Category Keyword
    const targetCat = progGroupStr.includes('sub junior') ? 'Sub Junior' :
                      progGroupStr.includes('super senior') ? 'Super Senior' :
                      progGroupStr.includes('junior') ? 'Junior' :
                      progGroupStr.includes('senior') ? 'Senior' :
                      progGroupStr.includes('kiddies') ? 'Kiddies' : 
                      (activeProgramme.categoryLevel || (activeProgramme.category && activeProgramme.category.length > 1 ? activeProgramme.category : null));

    const matchesCategoryAndGender = (s: UserProfile) => {
      const sGender = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
      if (isGirlsProg && sGender !== 'Girls') return false;
      if (isBoysProg && sGender !== 'Boys') return false;

      if (targetCat) {
        const sCat = s.category || getCategoryFromClassAndGender(s.studentClass || '5', sGender);
        if (sCat.toLowerCase() !== targetCat.toLowerCase()) return false;
      }
      return true;
    };

    const categoryRegistered = registered.filter(matchesCategoryAndGender);
    if (categoryRegistered.length > 0) return categoryRegistered;

    const categoryStudents = students.filter(matchesCategoryAndGender);
    if (categoryStudents.length > 0) return categoryStudents;

    return registered.length > 0 ? registered : students;
  }, [users, activeProgramme]);

  // Apply candidate search query (Name or Chest No or Roll No)
  const searchedParticipants = React.useMemo(() => {
    if (!contenderSearch.trim()) return activeParticipants;
    const q = contenderSearch.toLowerCase().trim();
    return activeParticipants.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.chestNo || '').toLowerCase().includes(q) ||
      (p.rollNo || '').toLowerCase().includes(q)
    );
  }, [activeParticipants, contenderSearch]);

  const activeResult = results.find(r => r.programmeId === selectedProgId);
  const isSheetLocked = activeProgramme 
    ? (
        activeResult 
          ? activeResult.locked !== false 
          : (activeProgramme.locked === true || (
              evaluations.filter(ev => ev.programmeId === selectedProgId && ev.judgeId === currentUser?.id).length > 0 &&
              evaluations.filter(ev => ev.programmeId === selectedProgId && ev.judgeId === currentUser?.id).every(ev => ev.status === 'Locked')
            ))
      )
    : false;

  // Initialize/get evaluation score details for a participant
  const getParticipantScores = (participantId: string) => {
    const existing = evaluations.find(ev => 
      ev.programmeId === selectedProgId && ev.participantId === participantId && (ev.judgeId === currentUser?.id || !ev.judgeId || !currentUser?.id)
    );

    if (existing) return existing;

    // Default template
    return {
      programmeId: selectedProgId || '',
      participantId: participantId,
      participantName: users.find(u => u.id === participantId)?.name || 'Unknown',
      teamId: users.find(u => u.id === participantId)?.teamId || '',
      scores: { creativity: 0, technical: 0, presentation: 0, originality: 0 },
      totalScore: 0,
      remarks: '',
      status: 'Draft' as const,
      judgeId: currentUser?.id || '',
    };
  };

  // Update specific score item
  const updateScoreValue = (
    participantId: string, 
    field: 'creativity' | 'technical' | 'presentation' | 'originality', 
    value: number
  ) => {
    const item = getParticipantScores(participantId);
    const updatedScores = { ...item.scores, [field]: value };
    const total = updatedScores.creativity + updatedScores.technical + updatedScores.presentation + updatedScores.originality;
    
    const updatedEval: Evaluation = {
      ...item,
      scores: updatedScores,
      totalScore: total
    };

    // Replace in list
    const filtered = evaluations.filter(ev => 
      !(ev.programmeId === selectedProgId && ev.participantId === participantId && ev.judgeId === currentUser?.id)
    );
    
    const newList = [...filtered, updatedEval];
    onUpdateEvaluations(newList);
    autoCalculatePodium(newList);
  };

  // Update remarks
  const updateRemarksValue = (participantId: string, value: string) => {
    const item = getParticipantScores(participantId);
    const updatedEval: Evaluation = {
      ...item,
      remarks: value
    };

    const filtered = evaluations.filter(ev => 
      !(ev.programmeId === selectedProgId && ev.participantId === participantId && ev.judgeId === currentUser?.id)
    );
    
    const newList = [...filtered, updatedEval];
    onUpdateEvaluations(newList);
  };

  const updateDirectTotalScore = (participantId: string, value: number) => {
    const item = getParticipantScores(participantId);
    const cappedValue = Math.min(100, Math.max(0, value));
    
    // Distribute score proportionally to the 4 sliders for consistency
    const each = Math.floor(cappedValue / 4);
    const updatedScores = {
      creativity: each,
      technical: each,
      presentation: each,
      originality: cappedValue - (each * 3)
    };

    const updatedEval: Evaluation = {
      ...item,
      scores: updatedScores,
      totalScore: cappedValue
    };

    const filtered = evaluations.filter(ev => 
      !(ev.programmeId === selectedProgId && ev.participantId === participantId && ev.judgeId === currentUser?.id)
    );
    
    const newList = [...filtered, updatedEval];
    onUpdateEvaluations(newList);
    autoCalculatePodium(newList);
  };

  const updateGradeValue = (participantId: string, value: 'A' | 'B' | 'C' | 'None') => {
    const item = getParticipantScores(participantId);
    const updatedEval: Evaluation = {
      ...item,
      grade: value
    };

    const filtered = evaluations.filter(ev => 
      !(ev.programmeId === selectedProgId && ev.participantId === participantId && ev.judgeId === currentUser?.id)
    );
    
    const newList = [...filtered, updatedEval];
    onUpdateEvaluations(newList);
  };

  // Save current sheets as Draft
  const handleSaveDraft = () => {
    if (!selectedProgId || !currentUser) return;

    let updatedEvals = [...evaluations];
    activeParticipants.forEach(part => {
      const existingIdx = updatedEvals.findIndex(ev => 
        ev.programmeId === selectedProgId && ev.participantId === part.id && ev.judgeId === currentUser.id
      );
      
      const scoresObj = getParticipantScores(part.id);
      
      if (existingIdx !== -1) {
        // Update existing record's status to Draft
        updatedEvals[existingIdx] = {
          ...updatedEvals[existingIdx],
          status: 'Draft' as const
        };
      } else {
        // Add new record as Draft
        updatedEvals.push({
          ...scoresObj,
          status: 'Draft' as const
        });
      }
    });

    onUpdateEvaluations(updatedEvals);

    setSuccessMsg('Evaluation sheets saved as drafts. You can modify these anytime before locking.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Lock and submit evaluation sheets to Admin Control Center
  const handleLockEvaluation = () => {
    if (!selectedProgId || !currentUser) return;

    // Check if at least one candidate has marks or winners designated
    const evaluatedParticipants = activeParticipants.filter(p => {
      const item = getParticipantScores(p.id);
      return item.totalScore > 0 || p.id === firstPlaceId || p.id === secondPlaceId || p.id === thirdPlaceId;
    });

    if (evaluatedParticipants.length === 0 && activeParticipants.length > 0) {
      setErrorMsg('Please enter marks out of 100 or select winners before locking the evaluation sheet.');
      setTimeout(() => setErrorMsg(''), 4500);
      return;
    }

    // Set all evaluations for this program to 'Locked'
    const updatedEvals = evaluations.map(ev => {
      if (ev.programmeId === selectedProgId && ev.judgeId === currentUser.id) {
        return { ...ev, status: 'Locked' as const };
      }
      return ev;
    });

    onUpdateEvaluations(updatedEvals);

    // Calculate dynamic ranks and trigger lock action
    const currentProgEvals = updatedEvals.filter(ev => 
      ev.programmeId === selectedProgId && ev.judgeId === currentUser.id
    );

    // Auto-calculate top 1st, 2nd, and 3rd place candidate IDs by score descending if not explicitly set
    const candidatesByScore = [...activeParticipants].sort((a, b) => {
      const scoreA = getParticipantScores(a.id).totalScore;
      const scoreB = getParticipantScores(b.id).totalScore;
      return scoreB - scoreA;
    });

    const targetFirstId = firstPlaceId || candidatesByScore[0]?.id || '';
    const targetSecondId = secondPlaceId || candidatesByScore[1]?.id || '';
    const targetThirdId = thirdPlaceId || candidatesByScore[2]?.id || '';

    // Formulate published results positions: 1st, 2nd, 3rd places with fallback to score-sorted
    const rankings = activeParticipants.map(part => {
      const item = getParticipantScores(part.id);
      
      let pos = 4;
      if (targetFirstId && part.id === targetFirstId) {
        pos = 1;
      } else if (targetSecondId && part.id === targetSecondId) {
        pos = 2;
      } else if (targetThirdId && part.id === targetThirdId) {
        pos = 3;
      } else {
        // If not explicit, index them based on score descending among remaining
        const remaining = activeParticipants
          .filter(p => p.id !== targetFirstId && p.id !== targetSecondId && p.id !== targetThirdId)
          .map(p => getParticipantScores(p.id))
          .sort((a, b) => b.totalScore - a.totalScore);
        const idx = remaining.findIndex(r => r.participantId === part.id);
        pos = idx !== -1 ? idx + 4 : 4;
      }

      // Auto-assign Grade A for 1st place, Grade B for 2nd place, Grade C for 3rd place if unspecified
      const defaultGrByPos = pos === 1 ? 'A' : pos === 2 ? 'B' : pos === 3 ? 'C' : 'None';
      const gr = (item.grade && item.grade !== 'None') ? item.grade : (item.totalScore >= 75 ? 'A' : item.totalScore >= 60 ? 'B' : item.totalScore >= 45 ? 'C' : defaultGrByPos);
      
      // Points distribution dynamically configured by administrators
      const progInfo = programmes.find(p => p.id === selectedProgId);
      const isGroup = progInfo?.type === 'Group';
      const isCatA = progInfo?.category === 'A';

      const config = settings.programScoresConfig || {
        categoryA: {
          individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 },
          group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 },
        },
        categoryB: {
          individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 },
          group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 },
        }
      };
      const catRules = isCatA ? config.categoryA : config.categoryB;
      const rule = isGroup ? catRules.group : catRules.individual;

      let pts = 0;
      if (pos === 1) pts = rule.firstPlace;
      else if (pos === 2) pts = rule.secondPlace;
      else if (pos === 3) pts = rule.thirdPlace;

      return {
        position: pos,
        participantId: part.id,
        participantName: part.name,
        teamId: part.teamId || '',
        teamName: teams.find(t => t.id === part.teamId)?.name || 'Unknown',
        grade: gr,
        points: pts,
        totalScore: item.totalScore,
        remarks: item.remarks
      };
    });

    // Ensure rankings are sorted by position ascending (1st place at index 0, 2nd at index 1, 3rd at index 2)
    rankings.sort((a, b) => a.position - b.position);

    onLockResults(selectedProgId, rankings);
    setSuccessMsg('Digital Score Sheet LOCKED successfully! Digital signature registered and forwarded to Admin Control Center.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="judge-portal-wrapper">
      {/* 1. NOT LOGGED IN: Secure Examiner Login */}
      {!currentUser || currentUser.role !== 'judge' ? (
        <div className="max-w-md mx-auto rounded-3xl premium-card p-8 shadow-2xl space-y-6" id="auth-box-judge">
          <div className="text-center space-y-3">
            <img 
              src="/meelad_fest_logo.jpg" 
              alt="Meelad Fest Logo" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg mx-auto ring-2 ring-purple-500/20"
            />
            <h2 className="text-2xl font-display font-bold text-neutral-800 dark:text-neutral-100">Jury Assessment Portal</h2>
            <p className="text-xs text-neutral-500">Authorized evaluators only. Secure digital scoresheets logging system.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4" id="judge-login-form">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 block">Jury ID / Academic Email</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. judge_sarah or jenkins@artsportal.edu"
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 block">Encrypted Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-100"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/30 border border-rose-200/50 text-rose-800 dark:text-rose-300 text-xs">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={16} />
              Open Scoresheets
            </button>
          </form>
        </div>
      ) : (
        /* 2. LOGGED IN: Evaluation Desk - Ultra Modern Redesign */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="judge-evaluation-split">
          
          {/* Left Sidebar: Juror Profile & Event Selector Card */}
          <div className="lg:col-span-1 rounded-3xl premium-card p-4 sm:p-5 space-y-6 h-fit border border-purple-500/20 shadow-xl">
            
            {/* Juror Profile Header */}
            <div className="space-y-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg font-mono shadow-md shrink-0">
                  {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Jury Examiner
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-base text-neutral-900 dark:text-white truncate mt-0.5">{currentUser.name}</h2>
                  <p className="text-[11px] text-neutral-500 font-mono truncate">{currentUser.department || 'Islamic & Arabic Arts'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Session Active
                </span>
                <button 
                  onClick={onLogout}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Events Search & Assigned List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                  <ListChecks size={15} className="text-purple-500" />
                  Assigned Events ({assignedProgrammes.length})
                </h3>
              </div>

              {/* Event Filter Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
                <input 
                  type="text"
                  value={progSearch}
                  onChange={(e) => setProgSearch(e.target.value)}
                  placeholder="Search code or title..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-xs font-medium text-neutral-900 dark:text-white border-0 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 hide-scrollbar">
                {filteredAssigned.map((p) => {
                  const isSelected = selectedProgId === p.id;
                  
                  const progEvals = evaluations.filter(ev => ev.programmeId === p.id && ev.judgeId === currentUser.id);
                  const isLocked = progEvals.length > 0 && progEvals.every(ev => ev.status === 'Locked');
                  
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProgId(p.id);
                        setSuccessMsg('');
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-500/20 scale-[1.01]' 
                          : 'bg-white/40 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-neutral-800 dark:text-neutral-100'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-[10px] font-mono font-bold tracking-wider ${isSelected ? 'text-purple-200' : 'text-neutral-400'}`}>
                          #{p.code}
                        </span>
                        {isLocked ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'}`}>
                            🔒 Locked
                          </span>
                        ) : p.resultPublished ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'}`}>
                            ✨ Published
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'}`}>
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs mt-1.5 truncate">{p.title}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/10 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'}`}>
                          Cat {p.category} • {p.section}
                        </span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-purple-200' : 'text-neutral-400'}`}>
                          {p.categoryGroup || 'All'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Main Content: Active Evaluation Workspace */}
          <div className="lg:col-span-3 space-y-6" id="judge-evaluation-workspace">
            {activeProgramme ? (
              <div className="space-y-6">
                
                {/* Hero Header Card for Selected Event */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-2xl border border-purple-500/30">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-purple-500/30 backdrop-blur-md border border-purple-400/30 text-purple-200 font-mono text-xs font-bold uppercase tracking-wider">
                          Event #{activeProgramme.code}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-mono text-xs font-semibold">
                          Category {activeProgramme.category} • {activeProgramme.section}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold">
                          {activeProgramme.categoryGroup || 'All'}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center gap-3">
                        <Star size={28} className="text-amber-400 fill-amber-400 animate-pulse shrink-0" />
                        {activeProgramme.title}
                      </h2>

                      <p className="text-xs text-purple-200 font-medium max-w-xl">
                        Venue: <span className="font-bold text-white">{activeProgramme.venue}</span> • {activeParticipants.length} Registered Contenders
                      </p>
                    </div>

                    {/* Quick Lock / Save Actions Banner */}
                    <div className="flex items-center gap-3 shrink-0">
                      {!isSheetLocked ? (
                        <>
                          <button 
                            onClick={handleSaveDraft}
                            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                          >
                            <Save size={14} /> Draft
                          </button>
                          <button 
                            onClick={handleLockEvaluation}
                            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Lock size={14} /> Lock & Publish
                          </button>
                        </>
                      ) : (
                        <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                          <Lock size={14} /> Official Results Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score sheets workspace card */}
                {activeParticipants.length > 0 ? (
                  <div className="rounded-3xl premium-card p-6 space-y-6 shadow-xl" id="scoring-participants-panel">
                    
                    {/* View Mode Tabs Selector */}
                    <div className="flex border-b border-neutral-200 dark:border-neutral-800 pb-2 gap-3">
                      <button
                        onClick={() => setWorkspaceTab('matrix')}
                        className={`px-5 py-2.5 text-xs font-extrabold rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
                          workspaceTab === 'matrix'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <ListChecks size={15} />
                        Direct Score Matrix Table
                      </button>
                      <button
                        onClick={() => setWorkspaceTab('sliders')}
                        className={`px-5 py-2.5 text-xs font-extrabold rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
                          workspaceTab === 'sliders'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <Sliders size={15} />
                        Detailed Criteria Sliders
                      </button>
                    </div>

                    {/* ALWAYS SHOW: 🏆 Winners & Honors Podium Declaration Board */}
                    <div className="p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-display font-black text-sm text-neutral-900 dark:text-amber-300 flex items-center gap-2">
                            <Award size={18} className="text-amber-500 fill-amber-500 animate-pulse" />
                            Honors Placement & Winners Board
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            Directly designate the 1st, 2nd, and 3rd place winners using candidate chest numbers.
                          </p>
                        </div>
                        {isSheetLocked && (
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            🔒 Locked
                          </span>
                        )}
                      </div>

                      {/* Search Candidate Option by Name or Chest Number */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3.5 top-3 text-neutral-400" />
                        <input 
                          type="text"
                          value={contenderSearch}
                          onChange={(e) => setContenderSearch(e.target.value)}
                          placeholder="🔍 Search candidate by Student Name or Chest No (e.g. B101 or Hisan)..."
                          className="w-full pl-9 pr-20 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-400/50 text-xs font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none shadow-xs placeholder:font-medium"
                        />
                        {contenderSearch ? (
                          <button 
                            onClick={() => setContenderSearch('')}
                            className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-bold cursor-pointer bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full"
                          >
                            ✕ Clear
                          </button>
                        ) : (
                          <span className="absolute right-3 top-2.5 text-[10px] font-mono text-neutral-400 font-bold">
                            {activeParticipants.length} Contenders
                          </span>
                        )}
                      </div>

                      {/* 3 Medal Podium Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* 🥇 1st Place Gold Podium */}
                        <div className="p-4 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent space-y-2.5 shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              🥇 First Place (Gold)
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">
                              +10 Pts
                            </span>
                          </div>
                          <select
                            disabled={isSheetLocked}
                            value={firstPlaceId}
                            onChange={(e) => handleSelectWinner(1, e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-amber-400/50 text-xs font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                          >
                            <option value="">-- Choose 1st Chest No --</option>
                            {searchedParticipants.map(p => (
                              <option key={p.id} value={p.id}>
                                #{p.chestNo || 'No Chest'} - {p.name} ({teams.find(t => t.id === p.teamId)?.name || 'No House'})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 🥈 2nd Place Silver Podium */}
                        <div className="p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-gradient-to-b from-slate-400/15 via-slate-400/5 to-transparent space-y-2.5 shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              🥈 Second Place (Silver)
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-slate-400 text-black px-2 py-0.5 rounded-full">
                              +8 Pts
                            </span>
                          </div>
                          <select
                            disabled={isSheetLocked}
                            value={secondPlaceId}
                            onChange={(e) => handleSelectWinner(2, e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-slate-600 text-xs font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-slate-400 outline-none cursor-pointer"
                          >
                            <option value="">-- Choose 2nd Chest No --</option>
                            {searchedParticipants.map(p => (
                              <option key={p.id} value={p.id}>
                                #{p.chestNo || 'No Chest'} - {p.name} ({teams.find(t => t.id === p.teamId)?.name || 'No House'})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 🥉 3rd Place Bronze Podium */}
                        <div className="p-4 rounded-2xl border-2 border-amber-800/60 dark:border-amber-700/60 bg-gradient-to-b from-amber-800/15 via-amber-800/5 to-transparent space-y-2.5 shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                              🥉 Third Place (Bronze)
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-amber-700 text-white px-2 py-0.5 rounded-full">
                              +5 Pts
                            </span>
                          </div>
                          <select
                            disabled={isSheetLocked}
                            value={thirdPlaceId}
                            onChange={(e) => handleSelectWinner(3, e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-amber-800/40 text-xs font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 outline-none cursor-pointer"
                          >
                            <option value="">-- Choose 3rd Chest No --</option>
                            {searchedParticipants.map(p => (
                              <option key={p.id} value={p.id}>
                                #{p.chestNo || 'No Chest'} - {p.name} ({teams.find(t => t.id === p.teamId)?.name || 'No House'})
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>
                    </div>

                    {workspaceTab === 'matrix' ? (
                      /* TAB 1: DIRECT ENTRY MATRIX TABLE */
                      <div className="overflow-x-auto rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 shadow-xs" id="score-matrix-table-card">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                              <th className="p-4 w-32">Chest Number</th>
                              <th className="p-4">Contender & House</th>
                              <th className="p-4 w-36 text-center">Score (0-100)</th>
                              <th className="p-4 w-36">Grade</th>
                              <th className="p-4">Jury Comments</th>
                              <th className="p-4 w-32 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                            {searchedParticipants.map((part) => {
                              const item = getParticipantScores(part.id);
                              
                              let honorBadge = null;
                              if (part.id === firstPlaceId) {
                                honorBadge = <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold shadow-xs">🥇 1st Place</span>;
                              } else if (part.id === secondPlaceId) {
                                honorBadge = <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-extrabold shadow-xs">🥈 2nd Place</span>;
                              } else if (part.id === thirdPlaceId) {
                                honorBadge = <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-900/20 text-amber-800 dark:text-amber-400 text-[10px] font-extrabold shadow-xs">🥉 3rd Place</span>;
                              } else {
                                const calculatedGrade = item.grade || (item.totalScore >= 75 ? 'A' : item.totalScore >= 60 ? 'B' : item.totalScore >= 45 ? 'C' : 'None');
                                if (calculatedGrade !== 'None') {
                                  honorBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold font-mono">Grade {calculatedGrade}</span>;
                                }
                              }

                              const isTopScore = item.totalScore >= 75;

                              return (
                                <tr 
                                  key={part.id} 
                                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors ${
                                    isSheetLocked ? 'opacity-80' : ''
                                  }`}
                                >
                                  {/* Chest number pill */}
                                  <td className="p-4">
                                    <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/50 text-purple-700 dark:text-purple-300 font-mono font-black text-xs inline-block">
                                      #{part.chestNo || 'N/A'}
                                    </span>
                                  </td>

                                  {/* Contender details */}
                                  <td className="p-4">
                                    <div className="font-extrabold text-neutral-900 dark:text-white text-sm">{part.name}</div>
                                    <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-2">
                                      <span>ID: {part.rollNo || 'N/A'}</span>
                                      <span>•</span>
                                      <span 
                                        className="font-bold px-2 py-0.5 rounded-md text-[9px] bg-neutral-100 dark:bg-neutral-800" 
                                        style={{ color: teams.find(t => t.id === part.teamId)?.color || '#9f7aec' }}
                                      >
                                        {teams.find(t => t.id === part.teamId)?.name || 'No House'}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Total Marks Input */}
                                  <td className="p-4 text-center">
                                    <div className="inline-flex items-center gap-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        disabled={isSheetLocked}
                                        value={item.totalScore}
                                        onChange={(e) => updateDirectTotalScore(part.id, parseInt(e.target.value) || 0)}
                                        className={`w-16 px-2.5 py-1.5 text-center font-mono font-black rounded-xl border text-sm outline-none transition-all ${
                                          isTopScore 
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20' 
                                            : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white'
                                        }`}
                                      />
                                      <span className="text-[10px] text-neutral-400 font-mono">/100</span>
                                    </div>
                                  </td>

                                  {/* Grade Choice */}
                                  <td className="p-4">
                                    <select
                                      disabled={isSheetLocked}
                                      value={item.grade || (item.totalScore >= 75 ? 'A' : item.totalScore >= 60 ? 'B' : item.totalScore >= 45 ? 'C' : 'None')}
                                      onChange={(e) => updateGradeValue(part.id, e.target.value as any)}
                                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                                    >
                                      <option value="A">Grade A (High)</option>
                                      <option value="B">Grade B (Good)</option>
                                      <option value="C">Grade C (Pass)</option>
                                      <option value="None">No Grade</option>
                                    </select>
                                  </td>

                                  {/* Remarks Input */}
                                  <td className="p-4">
                                    <input 
                                      type="text"
                                      disabled={isSheetLocked}
                                      value={item.remarks}
                                      onChange={(e) => updateRemarksValue(part.id, e.target.value)}
                                      placeholder="Jury evaluation comments..."
                                      className="w-full px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                  </td>

                                  {/* Place Designation badge */}
                                  <td className="p-4 text-center">
                                    {honorBadge || <span className="text-neutral-400 italic text-[10px]">Contender</span>}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* TAB 2: DETAILED SLIDERS SCORING */
                      <div className="space-y-6" id="score-sliders-card">
                        {activeParticipants.map((part) => {
                          const item = getParticipantScores(part.id);
                          const calculatedGrade = item.grade || (item.totalScore >= 75 ? 'A' : item.totalScore >= 60 ? 'B' : item.totalScore >= 45 ? 'C' : 'None');

                          return (
                            <div 
                              key={part.id}
                              className={`p-6 rounded-3xl border transition-all ${
                                isSheetLocked 
                                  ? 'bg-neutral-100 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 opacity-80' 
                                  : 'bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-md'
                              }`}
                            >
                              {/* Student identity header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4">
                                <div>
                                  <span className="text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-400">Chest #{part.chestNo || 'N/A'}</span>
                                  <div className="font-extrabold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                                    {part.name}
                                    {part.id === firstPlaceId && <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">🥇 1st Place</span>}
                                    {part.id === secondPlaceId && <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold">🥈 2nd Place</span>}
                                    {part.id === thirdPlaceId && <span className="px-2.5 py-0.5 rounded-full bg-amber-900/20 text-amber-800 text-[10px] font-extrabold">🥉 3rd Place</span>}
                                  </div>
                                  <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                                    Roll No: {part.rollNo || 'N/A'} | House: {teams.find(t => t.id === part.teamId)?.name || 'No House'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs">
                                  <div>
                                    <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">Grade</span>
                                    <select
                                      disabled={isSheetLocked}
                                      value={calculatedGrade}
                                      onChange={(e) => updateGradeValue(part.id, e.target.value as any)}
                                      className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-purple-600 dark:text-purple-400 focus:outline-none"
                                    >
                                      <option value="A">Grade A</option>
                                      <option value="B">Grade B</option>
                                      <option value="C">Grade C</option>
                                      <option value="None">No Grade</option>
                                    </select>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">Direct Total</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      disabled={isSheetLocked}
                                      value={item.totalScore}
                                      onChange={(e) => updateDirectTotalScore(part.id, parseInt(e.target.value) || 0)}
                                      className="w-20 px-2.5 py-1.5 text-center font-mono font-black text-purple-600 dark:text-purple-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm focus:outline-none"
                                    />
                                  </div>

                                  <div className="text-right">
                                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Aggregate</span>
                                    <div className="text-xl font-mono font-black text-purple-600 dark:text-purple-400">
                                      {item.totalScore} <span className="text-[10px] text-neutral-400 font-normal">/ 100</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Criterion Sliders Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                                {[
                                  { key: 'creativity', label: 'Creativity & Nuance', desc: 'Aesthetic originality and expression' },
                                  { key: 'technical', label: 'Technical Execution & Tajweed', desc: 'Precision, pronunciation and scale control' },
                                  { key: 'presentation', label: 'Stage Presence & Poise', desc: 'Confidence, posture and audience connection' },
                                  { key: 'originality', label: 'Rhythm, Pace & Timing', desc: 'Time limit compliance and pace consistency' },
                                ].map((crit) => (
                                  <div key={crit.key} className="space-y-1.5">
                                    <div className="flex justify-between font-medium">
                                      <div>
                                        <span className="text-neutral-900 dark:text-white block font-bold">{crit.label}</span>
                                        <span className="text-[10px] text-neutral-400 block">{crit.desc}</span>
                                      </div>
                                      <span className="font-mono font-extrabold text-purple-600 dark:text-purple-400 text-sm">
                                        {item.scores[crit.key as keyof typeof item.scores]} <span className="text-[10px] text-neutral-400">/ 25</span>
                                      </span>
                                    </div>

                                    <input 
                                      type="range"
                                      min="0"
                                      max="25"
                                      disabled={isSheetLocked}
                                      value={item.scores[crit.key as keyof typeof item.scores]}
                                      onChange={(e) => updateScoreValue(part.id, crit.key as any, parseInt(e.target.value))}
                                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-700 accent-purple-600"
                                    />
                                  </div>
                                ))}
                              </div>

                              {/* Remarks */}
                              <div className="mt-4 space-y-1">
                                <label className="text-[10px] font-bold uppercase text-neutral-400">Jury Remarks & Performance Notes</label>
                                <input 
                                  type="text"
                                  disabled={isSheetLocked}
                                  value={item.remarks}
                                  onChange={(e) => updateRemarksValue(part.id, e.target.value)}
                                  placeholder="e.g. Masterful vocal delivery, excellent stage coverage..."
                                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Operational Actions Footer */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-3" id="evals-controls">
                      {/* Notifications banner */}
                      {successMsg && (
                        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                          <Check size={16} className="shrink-0" />
                          <span>{successMsg}</span>
                        </div>
                      )}
                      {errorMsg && (
                        <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                          <AlertTriangle size={16} className="shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {/* Check if already locked */}
                      {isSheetLocked ? (
                        <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                          <Lock size={16} className="shrink-0 text-emerald-500" />
                          <span>Official Digital Evaluation Sheet is SUBMITTED to Admin Control Center. Scores and rankings have been handed over for Admin review and official publishing.</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-3">
                          <button 
                            id="save-draft-btn"
                            onClick={handleSaveDraft}
                            className="px-6 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-white hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Save size={15} /> Save Draft
                          </button>
                          
                          <button 
                            id="lock-eval-btn"
                            onClick={handleLockEvaluation}
                            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Lock size={15} /> Handover & Submit to Admin Control Center
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-400 text-sm font-semibold border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 rounded-3xl">
                    No participants have registered for this programme yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl premium-card p-12 text-center text-neutral-400 space-y-4 shadow-xl h-full flex flex-col items-center justify-center">
                <Sliders size={48} className="text-purple-500 animate-pulse" />
                <div>
                  <h3 className="font-display font-extrabold text-neutral-900 dark:text-white text-lg">No Programme Selected</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 font-medium">
                    Select an assigned event from the left sidebar to manage chest numbers and evaluate scores.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
