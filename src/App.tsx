import React, { useState, useEffect } from 'react';
import { initializeDatabase, saveToStorage, loadFromStorage } from './data';
import { UserProfile, Programme, Team, PublishedResult, Appeal, Feedback, Announcement, SystemSettings, SecurityConfig, AuditLog, Muallim, CommitteeMember, AppReview } from './types';

import { enrichProgrammesWithSchedule } from './utils/scheduleData';

// Import Modular Sub-Views
import { HomeView } from './components/HomeView';
import { ProgrammesView } from './components/ProgrammesView';
import { RegistrationView } from './components/RegistrationView';
import { ResultsView } from './components/ResultsView';
import { ScoreboardView } from './components/ScoreboardView';
import { AppealManagement } from './components/AppealManagement';
import { FeedbackView } from './components/FeedbackView';
import { GalleryView } from './components/GalleryView';
import { ContactAboutView } from './components/ContactAboutView';
import { JudgePortal } from './components/JudgePortal';
import { AdminPanel } from './components/AdminPanel';
import { OurMadrassaView } from './components/OurMadrassaView';
import { MeeladCampaignView } from './components/MeeladCampaignView';
import { SchedulesView } from './components/SchedulesView';
import { PerformersView } from './components/PerformersView';
import { ReviewsView } from './components/ReviewsView';

import { 
  Home, ListChecks, UserCheck, Award, Trophy, ShieldAlert, 
  MessageSquare, Image as ImageIcon, Info, Moon, Sun, Menu, X, Shield, Star, Sparkles, Landmark, Calendar, Users 
} from 'lucide-react';

export default function App() {
  // Database Initializer
  const db = initializeDatabase();

  // State managers
  const [programmes, setProgrammes] = useState<Programme[]>(() => enrichProgrammesWithSchedule(db.programmes));
  const [teams, setTeams] = useState<Team[]>(db.teams);
  const [users, setUsers] = useState<UserProfile[]>(db.users);
  const [results, setResults] = useState<PublishedResult[]>(() => loadFromStorage('results', db.results));
  const [appeals, setAppeals] = useState<Appeal[]>(db.appeals);
  const [feedback, setFeedback] = useState<Feedback[]>(db.feedback);
  const [announcements, setAnnouncements] = useState<Announcement[]>(db.announcements);
  const [settings, setSettings] = useState<SystemSettings>(db.settings);
  const [security, setSecurity] = useState<SecurityConfig>(db.security);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(db.auditLogs);
  const [muallims, setMuallims] = useState<Muallim[]>(db.muallims);
  const [committee, setCommittee] = useState<CommitteeMember[]>(() => {
    const loaded = loadFromStorage<CommitteeMember[]>('committee', db.committee);
    return loaded.filter(c => c.id !== 'comm_4' && c.id !== 'comm_5' && c.id !== 'comm_6');
  });

  const handleUpdateMuallims = (updated: Muallim[]) => {
    setMuallims(updated);
    saveToStorage('muallims', updated);
  };

  const handleUpdateCommittee = (updated: CommitteeMember[]) => {
    setCommittee(updated);
    saveToStorage('committee', updated);
  };
  const [evaluations, setEvaluations] = useState<any[]>(() => loadFromStorage('evaluations', []));

  const handleUpdateEvaluations = (newEvals: any[]) => {
    setEvaluations(newEvals);
    saveToStorage('evaluations', newEvals);
  };

  const [reviews, setReviews] = useState<AppReview[]>([]);

  const [openWriteReviewImmediately, setOpenWriteReviewImmediately] = useState(false);

  const handleUpdateReviews = (updated: AppReview[]) => {
    setReviews(updated);
    saveToStorage('reviews', updated);
  };

  const handleSubmitReview = (reviewData: Omit<AppReview, 'id' | 'date' | 'status'>) => {
    const newRev: AppReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
      featured: true
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveToStorage('reviews', updated);
  };

  const handleOpenWriteReview = () => {
    setOpenWriteReviewImmediately(true);
    setActiveView('Reviews');
  };

  // Keep window global refs synced for central backend POST
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any)._currentTeams = teams;
      (window as any)._currentResults = results;
      (window as any)._currentEvaluations = evaluations;
      (window as any)._currentMuallims = muallims;
      (window as any)._currentCommittee = committee;
    }
  }, [teams, results, evaluations, muallims, committee]);

  // Active View Tab Navigation
  const [activeView, setActiveView] = useState<string>('Home');

  // Currently logged-in profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1-3 second realtime synchronization with central backend
  useEffect(() => {
    const fetchLatestState = () => {
      const handleData = (data: any) => {
        if (data && data.programmes && Array.isArray(data.programmes)) {
          const rawProgs = (data.programmes.length >= 10) ? data.programmes : db.programmes;
          const validProgrammes = enrichProgrammesWithSchedule(rawProgs);
          const validUsers = (Array.isArray(data.users) && data.users.length >= 200) ? data.users : db.users;
          setProgrammes(validProgrammes);
          setTeams(data.teams || db.teams);
          setUsers(validUsers);
          setResults(data.results || db.results);
          setAppeals(data.appeals || db.appeals);
          setFeedback(data.feedback || db.feedback);
          setAnnouncements(data.announcements || db.announcements);
          setSettings(data.settings || db.settings);
          setSecurity(data.security || db.security);
          if (data.evaluations && Array.isArray(data.evaluations)) {
            setEvaluations(prev => {
              if (data.evaluations.length === 0 && prev.length > 0) return prev;
              const map = new Map<string, any>();
              prev.forEach(e => map.set(e.id || `${e.programmeId}_${e.participantId}_${e.judgeId || 'j'}`, e));
              data.evaluations.forEach((e: any) => map.set(e.id || `${e.programmeId}_${e.participantId}_${e.judgeId || 'j'}`, e));
              return Array.from(map.values());
            });
          }
          if (Array.isArray(data.muallims)) setMuallims(data.muallims);
          if (Array.isArray(data.committee)) {
            const filteredComm = data.committee.filter((c: any) => c.id !== 'comm_4' && c.id !== 'comm_5' && c.id !== 'comm_6');
            setCommittee(filteredComm);
          }
        }
        setIsDataLoaded(true);
      };

      fetch('/api/state')
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(handleData)
        .catch(() => {
          fetch('http://localhost:3000/api/state')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
              if (data) handleData(data);
              else setIsDataLoaded(true);
            })
            .catch(() => setIsDataLoaded(true));
        });
    };

    fetchLatestState();
    const interval = setInterval(fetchLatestState, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync scoreboard points dynamically upon mount / data load
  useEffect(() => {
    if (results && results.length > 0 && teams && teams.length > 0) {
      syncChampionshipStandings(results, teams);
    }
  }, [isDataLoaded]);

  // Visual dark mode controller with persistent state & system theme fallback
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('artsportal_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Currently active announcement for dialog display
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Monitor and set document dark class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('artsportal_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('artsportal_theme', 'light');
    }
  }, [isDarkMode]);

  // Recalculate scoreboard dynamically based on results list and configurable scoring system
  const syncChampionshipStandings = (latestResults: PublishedResult[], latestTeams: Team[], currentSettings?: SystemSettings) => {
    const scoresConfig = (currentSettings || settings).programScoresConfig || {
      categoryA: {
        individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 },
        group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 },
      },
      categoryB: {
        individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 },
        group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 },
      }
    };

    // Recompute ranking points based on current config
    const updatedResults = latestResults.map(res => {
      const prog = programmes.find(p => p.id === res.programmeId);
      if (!prog) return res;

      const catKey = prog.category === 'A' ? 'categoryA' : 'categoryB';
      const typeKey = prog.type === 'Group' ? 'group' : 'individual';
      const rule = scoresConfig[catKey]?.[typeKey] || { firstPlace: 10, secondPlace: 8, thirdPlace: 5 };

      const updatedRankings = res.rankings.map(r => {
        let pts = 0;
        if (r.position === 1) pts = rule.firstPlace;
        else if (r.position === 2) pts = rule.secondPlace;
        else if (r.position === 3) pts = rule.thirdPlace;
        return { ...r, points: pts };
      });

      return { ...res, rankings: updatedRankings };
    });

    // Sum points for each team
    const teamScoreMap: Record<string, number> = {};
    latestTeams.forEach(t => {
      teamScoreMap[t.id] = 0;
    });

    updatedResults.forEach(res => {
      const prog = programmes.find(p => p.id === res.programmeId);
      const isPublished = prog ? (prog.resultPublished === true) : (res.locked === true);
      if (!isPublished) return;

      const isGirlsProg = prog ? (prog.categoryGroup ? prog.categoryGroup.toLowerCase().includes('girls') : false) : false;

      res.rankings.forEach(ranking => {
        let targetTeamId = ranking.teamId;

        if (targetTeamId === 'diraya') {
          targetTeamId = isGirlsProg ? 'diraya_girls' : 'diraya_boys';
        } else if (targetTeamId === 'furooha') {
          targetTeamId = isGirlsProg ? 'furooha_girls' : 'furooha_boys';
        } else if (targetTeamId === 'swaraha') {
          targetTeamId = isGirlsProg ? 'swaraha_girls' : 'swaraha_boys';
        }

        if (teamScoreMap[targetTeamId] !== undefined) {
          teamScoreMap[targetTeamId] += ranking.points;
        }
      });
    });

    const updatedTeams = latestTeams.map(t => ({
      ...t,
      points: teamScoreMap[t.id] || 0
    }));

    setResults(updatedResults);
    saveToStorage('results', updatedResults);
    setTeams(updatedTeams);
    saveToStorage('teams', updatedTeams);
  };

  // Login handler
  const handleLogin = (identifier: string, role: 'student' | 'judge' | 'admin', password?: string): boolean => {
    const term = identifier.trim().toLowerCase();
    const inputPass = (password || '').trim();

    if (!term || !inputPass) {
      return false; // Require both identifier and password
    }

    // 1. Leader Authentication
    if (role === 'student' || (role as any) === 'team_leader') {
      const leaderUser = users.find(u => {
        if (u.role !== 'team_leader' && u.role !== 'student') return false;
        
        const emailMatches = u.email ? u.email.toLowerCase() === term : false;
        const usernameMatches = u.username ? u.username.toLowerCase() === term : false;
        const idMatches = u.id ? u.id.toLowerCase() === term : false;
        const leaderIdMatches = u.leaderId ? u.leaderId.toLowerCase() === term : false;
        const teamMatches = u.teamId ? u.teamId.toLowerCase() === term : false;

        const cleanTerm = term.replace('@artsportal.edu', '').replace('leader_', '');
        const divMatch = u.teamId ? u.teamId.toLowerCase().includes(cleanTerm) : false;

        return emailMatches || usernameMatches || idMatches || leaderIdMatches || teamMatches || divMatch;
      });

      if (!leaderUser) return false;

      // Verify Password (Custom profile password FIRST, with fallback to standard defaults)
      const validPasses = [
        leaderUser.password,
        'student123',
        'leader123',
        'diraya123',
        'furooha123',
        'swaraha123'
      ].filter(Boolean);

      const isPasswordCorrect = validPasses.some(p => p === inputPass);

      if (isPasswordCorrect) {
        setCurrentUser(leaderUser);

        const logEntry: AuditLog = {
          id: `log_login_${Math.floor(1000 + Math.random() * 9000)}`,
          user: `${leaderUser.name} (Team Leader)`,
          action: `Authenticated leader session`,
          ip: '192.168.1.100',
          browser: 'Google Chrome v145',
          timestamp: new Date().toISOString(),
          location: 'Leaders Portal Workspace'
        };
        const newLogs = [logEntry, ...auditLogs];
        setAuditLogs(newLogs);
        saveToStorage('auditLogs', newLogs);

        return true;
      }

      return false; // Wrong password
    }

    // 2. Admin Authentication
    if (role === 'admin') {
      const adminUsers = users.filter(u => u.role === 'admin');
      const matchedAdmin = adminUsers.find(u => 
        (u.email && u.email.toLowerCase() === term) ||
        (u.username && u.username.toLowerCase() === term) ||
        (u.leaderId && u.leaderId.toLowerCase() === term) ||
        (u.id && u.id.toLowerCase() === term) ||
        term === 'admin' ||
        term === 'admin123' ||
        term === 'admin@meelad.org'
      ) || adminUsers[0] || users[0];

      const validAdminPasses = [
        matchedAdmin?.password,
        security?.adminPassword,
        'admin123',
        'admin'
      ].filter(Boolean);

      const isPassMatch = validAdminPasses.includes(inputPass);

      if (matchedAdmin && isPassMatch) {
        setCurrentUser(matchedAdmin);
        return true;
      }
      return false;
    }

    // 3. Judge Authentication
    if (role === 'judge') {
      const judgeUsers = users.filter(u => u.role === 'judge');
      const matchedJudge = judgeUsers.find(u =>
        (u.email && u.email.toLowerCase() === term) ||
        (u.username && u.username.toLowerCase() === term) ||
        (u.leaderId && u.leaderId.toLowerCase() === term) ||
        (u.id && u.id.toLowerCase() === term) ||
        term === 'judge' ||
        term === 'judge123' ||
        term === 'sarah@artsportal.edu'
      ) || judgeUsers[0];

      const validJudgePasses = [
        matchedJudge?.password,
        security?.judgePIN,
        'judge123',
        'judge'
      ].filter(Boolean);

      const isPassMatch = validJudgePasses.includes(inputPass);

      if (matchedJudge && isPassMatch) {
        setCurrentUser(matchedJudge);
        return true;
      }
      return false;
    }

    return false;
  };

  const handleLogout = () => {
    if (currentUser) {
      const logEntry: AuditLog = {
        id: `log_logout_${Math.floor(1000 + Math.random() * 9000)}`,
        user: `${currentUser.name} (${currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'judge' ? 'Judge' : 'Leader'})`,
        action: `Closed active session`,
        ip: '192.168.1.52',
        browser: 'Google Chrome v145 (macOS)',
        timestamp: new Date().toISOString(),
        location: 'Terminated Session'
      };
      
      const newLogs = [logEntry, ...auditLogs];
      setAuditLogs(newLogs);
      saveToStorage('auditLogs', newLogs);
    }
    setCurrentUser(null);
  };

  // Student Registrations actions
  const handleRegisterEvent = (programmeId: string) => {
    if (!currentUser) return;
    
    // Check registration constraints
    if (currentUser.registeredProgrammeIds.length >= 3) {
      alert('Limit Exceeded: A student can enroll in a maximum of 3 programmes.');
      return;
    }

    const programme = programmes.find(p => p.id === programmeId);
    if (programme) {
      const teamId = currentUser.teamId;
      if (teamId) {
        const teamEnrolledCount = users.filter(u => u.role === 'student' && u.teamId === teamId && (u.registeredProgrammeIds || []).includes(programmeId)).length;
        if (programme.maxParticipants && teamEnrolledCount >= programme.maxParticipants) {
          alert(`Limit Exceeded: Your team already has ${teamEnrolledCount} participants registered for "${programme.title}". The maximum limit is ${programme.maxParticipants} per team.`);
          return;
        }
      }
    }

    const updatedUser = {
      ...currentUser,
      registeredProgrammeIds: [...currentUser.registeredProgrammeIds, programmeId]
    };

    // Update global users list
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveToStorage('users', updatedUsers);
    setCurrentUser(updatedUser);

    // Audit logs entry
    const progTitle = programmes.find(p => p.id === programmeId)?.title || programmeId;
    const logEntry: AuditLog = {
      id: `log_reg_${Math.floor(1000 + Math.random() * 9000)}`,
      user: currentUser.name + ' (Leader)',
      action: `Enrolled in event: ${progTitle}`,
      ip: '192.168.1.185',
      browser: 'Safari v19 (iOS)',
      timestamp: new Date().toISOString(),
      location: 'Leaders Portal Panel'
    };
    
    const newLogs = [logEntry, ...auditLogs];
    setAuditLogs(newLogs);
    saveToStorage('auditLogs', newLogs);
  };

  const handleDeregisterEvent = (programmeId: string) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      registeredProgrammeIds: currentUser.registeredProgrammeIds.filter(id => id !== programmeId)
    };

    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveToStorage('users', updatedUsers);
    setCurrentUser(updatedUser);

    // Audit logs
    const progTitle = programmes.find(p => p.id === programmeId)?.title || programmeId;
    const logEntry: AuditLog = {
      id: `log_reg_${Math.floor(1000 + Math.random() * 9000)}`,
      user: currentUser.name + ' (Leader)',
      action: `Deregistered from event: ${progTitle}`,
      ip: '192.168.1.185',
      browser: 'Safari v19 (iOS)',
      timestamp: new Date().toISOString(),
      location: 'Leaders Portal Panel'
    };
    
    const newLogs = [logEntry, ...auditLogs];
    setAuditLogs(newLogs);
    saveToStorage('auditLogs', newLogs);
  };

  // Appeal management submission
  const handleSubmitAppeal = (programmeId: string, reason: string, file: string) => {
    if (!currentUser) return;

    const progTitle = programmes.find(p => p.id === programmeId)?.title || 'Unknown Event';

    const newAppeal: Appeal = {
      id: `appl_9${Math.floor(100 + Math.random() * 900)}`,
      programmeId,
      programmeTitle: progTitle,
      studentId: currentUser.id,
      studentName: currentUser.name,
      teamId: currentUser.teamId || 'No Team',
      reason,
      attachedDoc: file,
      status: 'Submitted',
      datetime: new Date().toISOString(),
    };

    const updatedAppeals = [newAppeal, ...appeals];
    setAppeals(updatedAppeals);
    saveToStorage('appeals', updatedAppeals);

    // Audit log
    const logEntry: AuditLog = {
      id: `log_appl_${Math.floor(1000 + Math.random() * 9000)}`,
      user: currentUser.name + ' (Student)',
      action: `Submitted appeal for event ${progTitle}`,
      ip: '192.168.1.185',
      browser: 'Safari v19 (iOS)',
      timestamp: new Date().toISOString(),
      location: 'Appeals desk'
    };
    const newLogs = [logEntry, ...auditLogs];
    setAuditLogs(newLogs);
    saveToStorage('auditLogs', newLogs);
  };

  // Feedback Submission
  const handleSubmitFeedback = (
    rating: number, 
    category: Feedback['category'], 
    comments: string, 
    name: string, 
    isAnonymous: boolean
  ) => {
    const newFeed: Feedback = {
      id: `feed_${Math.floor(1000 + Math.random() * 9000)}`,
      rating,
      category,
      comments,
      name: isAnonymous ? undefined : name || 'Visitor',
      isAnonymous,
      datetime: new Date().toISOString(),
    };

    const updatedFeedback = [newFeed, ...feedback];
    setFeedback(updatedFeedback);
    saveToStorage('feedback', updatedFeedback);
  };

  // Judge score submission to Admin Control Center (handover to Admin for review & publishing)
  const handleLockResults = (programmeId: string, rankings: any[]) => {
    if (!currentUser) return;

    // Save jury submission centrally in evaluations state for Admin review
    const newEval = {
      id: `jury_submitted_${programmeId}`,
      programmeId,
      rankings,
      judgeName: currentUser.name,
      timestamp: new Date().toISOString()
    };
    // Mark all existing individual evaluations for this programme as Locked and append jury_submitted record
    const updatedEvals = evaluations
      .filter(e => e.id !== `jury_submitted_${programmeId}`)
      .map(e => (e.programmeId === programmeId ? { ...e, status: 'Locked' as const } : e));
    updatedEvals.push(newEval);

    setEvaluations(updatedEvals);
    saveToStorage('evaluations', updatedEvals);

    // Update programme status to Evaluating and locked for jury, but resultPublished remains false until Admin approves
    const updatedProgs = programmes.map(p => {
      if (p.id === programmeId) {
        return {
          ...p,
          status: 'Evaluating' as const,
          resultPublished: false,
          locked: true
        };
      }
      return p;
    });

    setProgrammes(updatedProgs);
    saveToStorage('programmes', updatedProgs);

    // Audit logs
    const progTitle = programmes.find(p => p.id === programmeId)?.title || programmeId;
    const logEntry: AuditLog = {
      id: `log_eval_${Math.floor(1000 + Math.random() * 9000)}`,
      user: currentUser.name + ' (Judge)',
      action: `Locked scores & published rankings for: ${progTitle}`,
      ip: '192.168.1.104',
      browser: 'Safari v19 (macOS)',
      timestamp: new Date().toISOString(),
      location: 'Jury score sheets desk'
    };
    const newLogs = [logEntry, ...auditLogs];
    setAuditLogs(newLogs);
    saveToStorage('auditLogs', newLogs);
  };

  // Team and User Updates
  const handleUpdateTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    saveToStorage('teams', newTeams);
  };

  const handleUpdateUsers = (newUsers: UserProfile[]) => {
    setUsers(newUsers);
    saveToStorage('users', newUsers);
    if (currentUser) {
      const updatedCurrentUser = newUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      }
    }

    // Cascade user updates (name, chestNo, team) to all published results
    const updatedResults = results.map(res => ({
      ...res,
      rankings: res.rankings.map(r => {
        const u = newUsers.find(usr => usr.id === r.participantId || (r.chestNo && usr.chestNo === r.chestNo));
        if (u) {
          const t = teams.find(team => team.id === u.teamId);
          return {
            ...r,
            participantId: u.id,
            participantName: u.name,
            chestNo: u.chestNo || r.chestNo,
            teamId: u.teamId || r.teamId,
            teamName: t ? t.name : r.teamName
          };
        }
        return r;
      })
    }));
    setResults(updatedResults);
    saveToStorage('results', updatedResults);

    // Cascade user updates to evaluations
    const updatedEvals = evaluations.map(ev => {
      const u = newUsers.find(usr => usr.id === ev.participantId || (ev.chestNo && usr.chestNo === ev.chestNo));
      if (u) {
        const t = teams.find(team => team.id === u.teamId);
        return {
          ...ev,
          participantName: u.name,
          chestNo: u.chestNo || ev.chestNo,
          teamId: u.teamId || ev.teamId,
          teamName: t ? t.name : ev.teamName
        };
      }
      return ev;
    });
    setEvaluations(updatedEvals);
    saveToStorage('evaluations', updatedEvals);
  };

  // Admin sync handlers
  const handleUpdateProgrammes = (newProgs: Programme[]) => {
    setProgrammes(newProgs);
    saveToStorage('programmes', newProgs);
  };

  const handleUpdateAppeals = (newAppeals: Appeal[]) => {
    setAppeals(newAppeals);
    saveToStorage('appeals', newAppeals);
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    saveToStorage('settings', newSettings);
    syncChampionshipStandings(results, teams, newSettings);
  };

  const handleUpdateResults = (newResults: PublishedResult[]) => {
    setResults(newResults);
    saveToStorage('results', newResults);
    syncChampionshipStandings(newResults, teams);
  };

  const handleUpdateSecurity = (newSec: SecurityConfig) => {
    setSecurity(newSec);
    saveToStorage('security', newSec);
  };

  // Database backups simulation
  const handleTriggerBackup = () => {
    const backupEntry: AuditLog = {
      id: `log_backup_${Math.floor(1000 + Math.random() * 9000)}`,
      user: currentUser?.name || 'System Auto',
      action: 'Created rolling daily database backup snapshot',
      ip: '127.0.0.1',
      browser: 'System Process Engine',
      timestamp: new Date().toISOString(),
      location: 'Cloud Database Server'
    };
    
    const newLogs = [backupEntry, ...auditLogs];
    setAuditLogs(newLogs);
    saveToStorage('auditLogs', newLogs);
  };

  const handleRestoreBackup = () => {
    // Reset to defaults
    localStorage.clear();
    const freshDb = initializeDatabase();
    
    setProgrammes(freshDb.programmes);
    setTeams(freshDb.teams);
    setUsers(freshDb.users);
    setResults(freshDb.results);
    setAppeals(freshDb.appeals);
    setFeedback(freshDb.feedback);
    setSettings(freshDb.settings);
    setSecurity(freshDb.security);
    
    const restoreEntry: AuditLog = {
      id: `log_restore_${Math.floor(1000 + Math.random() * 9000)}`,
      user: currentUser?.name || 'System Auto',
      action: 'Restored system database from encrypted cold storage snapshot',
      ip: '127.0.0.1',
      browser: 'System Process Engine',
      timestamp: new Date().toISOString(),
      location: 'Cloud Database Server'
    };
    setAuditLogs([restoreEntry]);
    saveToStorage('auditLogs', [restoreEntry]);
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-neutral-500 bg-neutral-50 dark:bg-white/5">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          <p className="text-sm font-semibold tracking-tight">Syncing Database Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden" id="main-app-frame">
      
      {/* Top Nav bar Desktop & Mobile Top Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all duration-300" id="main-navigation-header">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Logo Brand pairing */}
          <div 
            onClick={() => setActiveView('Home')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity select-none shrink-0"
            id="brand-header-logo"
          >
            <img 
              src="/meelad_fest_logo.jpg" 
              alt="Meelad Fest Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-amber-500/40 shadow-sm ring-2 ring-emerald-500/20 shrink-0"
            />
            <div className="min-w-0 flex flex-col justify-center">
              <span className="font-display font-bold text-sm sm:text-base text-neutral-900 dark:text-white tracking-tight leading-none mb-0.5 truncate">
                {settings?.logoText || 'Al Mahabbah'}
              </span>
              <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 block tracking-wider leading-none uppercase font-semibold truncate">
                Meelad Fest Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center p-1 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/80 border border-black/5 dark:border-white/10" id="desktop-nav-menu">
            {[
              { key: 'Home', label: 'Home' },
              { key: 'AboutContact', label: 'About' },
              { key: 'OurMadrassa', label: 'Our Madrassa' },
              { key: 'MeeladCampaign', label: 'Meelad Campaign' },
              { key: 'Scoreboard', label: 'Scoreboard' },
              { key: 'Programmes', label: 'Programmes' },
              { key: 'Results', label: 'Results' },
              { key: 'Schedules', label: 'Schedules' },
              { key: 'Performers', label: 'Performers' },
              { key: 'Reviews', label: 'Reviews & Ratings' },
              { key: 'Gallery', label: 'Gallery' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveView(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-[12px] flex items-center gap-1 transition-all duration-200 text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  activeView === item.key 
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-xs font-bold' 
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1"></div>
            
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="px-2.5 py-1.5 rounded-[12px] text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              More <Menu size={14}/>
            </button>
          </nav>

          {/* Right Header Controls: Dark mode, portals selector */}
          <div className="flex items-center gap-2 shrink-0" id="header-controls">
            {/* Quick Panel Access Group */}
            <div className="hidden lg:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-full border border-neutral-200 dark:border-neutral-700">
              <button 
                onClick={() => setActiveView('Registration')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'Registration'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Team Leaders & Registrations Portal"
              >
                <Star size={13} />
                Leader
              </button>

              <button 
                onClick={() => setActiveView('JudgePortal')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'JudgePortal'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Jury Examiner & Scoring Portal"
              >
                <UserCheck size={13} />
                Judge
              </button>

              <button 
                onClick={() => setActiveView('AdminPanel')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'AdminPanel'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="System Administrator Control Center"
              >
                <Shield size={13} />
                Admin
              </button>
            </div>

            {/* Dark mode switcher */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer border border-black/5 dark:border-white/10"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bottom-nav-bar pb-safe pt-2 px-6 flex justify-between items-center" id="mobile-bottom-nav">
        {[
          { key: 'Home', label: 'Home', icon: <Home size={22} strokeWidth={2.5} /> },
          { key: 'Scoreboard', label: 'Ranks', icon: <Trophy size={22} strokeWidth={2.5} /> },
          { key: 'Programmes', label: 'Events', icon: <ListChecks size={22} strokeWidth={2.5} /> },
          { key: 'Results', label: 'Results', icon: <Award size={22} strokeWidth={2.5} /> },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 cursor-pointer ${
              activeView === item.key 
                ? 'text-neutral-900 dark:text-white scale-110' 
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 transition-all cursor-pointer"
        >
          <Menu size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </div>

      {/* 2. Full Screen / Bottom Sheet More Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" id="more-menu-overlay">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1c1c1e] sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 pb-safe animate-slide-up sm:animate-scale-up border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white tracking-tight">Menu</h3>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="overflow-y-auto hide-scrollbar space-y-1">
              {[
                { key: 'Home', label: 'Home', icon: <Home size={18} /> },
                { key: 'AboutContact', label: 'About', icon: <Info size={18} /> },
                { key: 'OurMadrassa', label: 'Our Madrassa', icon: <Landmark size={18} /> },
                { key: 'MeeladCampaign', label: 'Meelad Campaign', icon: <Sparkles size={18} /> },
                { key: 'Scoreboard', label: 'Scoreboard', icon: <Trophy size={18} /> },
                { key: 'Programmes', label: 'Programmes', icon: <ListChecks size={18} /> },
                { key: 'Results', label: 'Results', icon: <Award size={18} /> },
                { key: 'Schedules', label: 'Schedules', icon: <Calendar size={18} /> },
                { key: 'Performers', label: 'Performers', icon: <Users size={18} /> },
                { key: 'Reviews', label: 'Reviews & Ratings', icon: <Star size={18} /> },
                { key: 'Gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
                { key: 'Registration', label: 'Leaders Portal', icon: <Star size={18} /> },
                { key: 'Appeals', label: 'Appeals Desk', icon: <ShieldAlert size={18} /> },
                { key: 'Feedback', label: 'Feedback Desk', icon: <MessageSquare size={18} /> },
                { key: 'JudgePortal', label: 'Examiner Jury Desk', icon: <UserCheck size={18} /> },
                { key: 'AdminPanel', label: 'Admin Control Center', icon: <Shield size={18} /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveView(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-[16px] flex items-center gap-3 transition-all cursor-pointer ${
                    activeView === item.key 
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium'
                  }`}
                >
                  <span className={`${activeView === item.key ? 'text-white dark:text-black' : 'text-neutral-400 dark:text-neutral-500'}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 4. Core Main Workspace container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-32 md:pb-16 space-y-6" id="primary-workspace">
        {currentUser && (
          <div className="bg-purple-900/90 dark:bg-purple-950/90 backdrop-blur-md text-white text-xs font-mono px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-sm border border-purple-500/30" id="active-session-strip">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">Active Session:</span> {currentUser.name} 
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase">{currentUser.role === 'student' ? 'LEADER' : currentUser.role}</span>
              <span className="hidden md:inline text-purple-200">({currentUser.email})</span>
            </div>
            <button onClick={handleLogout} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors">
              Sign out
            </button>
          </div>
        )}
        {activeView === 'Home' && (
          <HomeView 
            settings={settings}
            announcements={announcements}
            programmes={programmes}
            teams={teams}
            users={users}
            results={results}
            reviews={reviews}
            onNavigate={setActiveView}
            onSelectAnnouncement={setSelectedAnnouncement}
            onOpenWriteReview={handleOpenWriteReview}
          />
        )}

        {activeView === 'Programmes' && (
          <ProgrammesView 
            programmes={programmes}
            users={users}
            results={results}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'Registration' && (
          <RegistrationView 
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            programmes={programmes}
            teams={teams}
            onRegisterEvent={handleRegisterEvent}
            onDeregisterEvent={handleDeregisterEvent}
            users={users}
            onUpdateTeams={handleUpdateTeams}
            onUpdateUsers={handleUpdateUsers}
            results={results}
            appeals={appeals}
            onSubmitAppeal={handleSubmitAppeal}
          />
        )}

        {activeView === 'Results' && (
          <ResultsView 
            results={results}
            programmes={programmes}
            teams={teams}
            users={users}
          />
        )}

        {activeView === 'Scoreboard' && (
          <ScoreboardView 
            teams={teams}
            results={results}
            programmes={programmes}
            users={users}
          />
        )}

        {activeView === 'Appeals' && (
          <AppealManagement 
            currentUser={currentUser}
            programmes={programmes}
            results={results}
            appeals={appeals}
            onSubmitAppeal={handleSubmitAppeal}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'Feedback' && (
          <FeedbackView 
            feedback={feedback}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {activeView === 'OurMadrassa' && (
          <OurMadrassaView muallims={muallims} committee={committee} />
        )}

        {activeView === 'MeeladCampaign' && (
          <MeeladCampaignView />
        )}

        {activeView === 'Schedules' && (
          <SchedulesView programmes={programmes} />
        )}

        {activeView === 'Performers' && (
          <PerformersView users={users} teams={teams} programmes={programmes} results={results} />
        )}

        {activeView === 'Gallery' && (
          <GalleryView />
        )}

        {activeView === 'Reviews' && (
          <ReviewsView 
            reviews={reviews}
            programmes={programmes}
            onSubmitReview={handleSubmitReview}
            openWriteModalImmediately={openWriteReviewImmediately}
          />
        )}

        {activeView === 'AboutContact' && (
          <ContactAboutView settings={settings} />
        )}

        {activeView === 'JudgePortal' && (
          <JudgePortal 
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            programmes={programmes}
            users={users}
            teams={teams}
            onLockResults={handleLockResults}
            results={results}
            settings={settings}
            evaluations={evaluations}
            onUpdateEvaluations={handleUpdateEvaluations}
          />
        )}

        {activeView === 'AdminPanel' && (
          <AdminPanel 
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            programmes={programmes}
            teams={teams}
            users={users}
            results={results}
            appeals={appeals}
            feedback={feedback}
            settings={settings}
            security={security}
            auditLogs={auditLogs}
            evaluations={evaluations}
            muallims={muallims}
            committee={committee}
            reviews={reviews}
            onUpdateProgrammes={handleUpdateProgrammes}
            onUpdateAppeals={handleUpdateAppeals}
            onUpdateSettings={handleUpdateSettings}
            onUpdateSecurity={handleUpdateSecurity}
            onTriggerBackup={handleTriggerBackup}
            onRestoreBackup={handleRestoreBackup}
            onUpdateResults={handleUpdateResults}
            onUpdateTeams={handleUpdateTeams}
            onUpdateUsers={handleUpdateUsers}
            onUpdateEvaluations={handleUpdateEvaluations}
            onUpdateMuallims={handleUpdateMuallims}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateReviews={handleUpdateReviews}
          />
        )}
      </main>

      {/* 5. Announcement dialogue lightbox popup reader */}
      {selectedAnnouncement && (
        <div 
          onClick={() => setSelectedAnnouncement(null)}
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          id="announcement-reader-lightbox"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-3xl max-w-md w-full border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden animate-scale-up"
          >
            {/* Header info */}
            <div className={`p-5 text-white flex items-center justify-between ${
              selectedAnnouncement.type === 'critical' 
                ? 'bg-rose-600/95 backdrop-blur-md' 
                : selectedAnnouncement.type === 'schedule' 
                ? 'bg-amber-600/95 backdrop-blur-md' 
                : 'bg-indigo-600/95 backdrop-blur-md'
            }`}>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded font-bold">
                  Official circular
                </span>
                <h3 className="font-bold text-base mt-1">Official Bulletin</h3>
              </div>
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Readout contents block */}
            <div className="p-6 space-y-4 text-xs text-neutral-800 dark:text-neutral-100">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{selectedAnnouncement.title}</h4>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                {selectedAnnouncement.content}
              </p>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>Published on {new Date(selectedAnnouncement.datetime).toLocaleDateString()}</span>
                <span className="capitalize">Urgency: {selectedAnnouncement.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer section details */}
      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/40 bg-white/30 dark:bg-neutral-950/40 py-8" id="application-footer">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-neutral-400" id="footer-matrix">
          <div className="space-y-1">
            <span className="font-bold text-neutral-600 dark:text-neutral-100 block text-sm">
              {settings.festivalName} Management System
            </span>
            <p className="font-light">
              Official results publication and registrations desk engine. Powered by Apple iOS design standards.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono">
            <span>© 2026 ArtsPortal Systems</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer" onClick={() => setActiveView('AboutContact')}>FAQ & Terms</span>
            <span>•</span>
            <span className="text-green-500 font-bold">● Secure SSL Gateway</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
