import { UserCredentialsTable } from "./UserCredentialsTable";
import { StudentManagementTab } from "./StudentManagementTab";
import { OffStageScheduleTab } from "./OffStageScheduleTab";
import React, { useState, useEffect } from 'react';
import { 
  UserProfile, Programme, Team, PublishedResult, Appeal, 
  Feedback, Announcement, SystemSettings, AuditLog, SecurityConfig, Muallim, CommitteeMember, AppReview 
} from '../types';
import { 
  BarChart2, Plus, Edit, Trash2, Shield, Settings, FileText, 
  AlertCircle, Check, Users, ShieldAlert, Award, RefreshCw, RotateCcw, Undo,
  Sliders, MessageSquare, Database, MapPin, AppWindow, Globe, Clock, Copy, PlusCircle,
  Lock, Unlock, UserCheck, Save, Sparkles, GraduationCap, Phone, ShieldCheck, Upload, Star, X, User
} from 'lucide-react';
import { saveToStorage } from '../data';

interface AdminPanelProps {
  currentUser: UserProfile | null;
  onLogin: (email: string, role: 'student' | 'judge' | 'admin') => boolean;
  onLogout: () => void;
  programmes: Programme[];
  teams: Team[];
  users: UserProfile[];
  results: PublishedResult[];
  appeals: Appeal[];
  feedback: Feedback[];
  settings: SystemSettings;
  security: SecurityConfig;
  auditLogs: AuditLog[];
  evaluations?: any[];
  muallims?: Muallim[];
  committee?: CommitteeMember[];
  reviews?: AppReview[];
  
  // Callback actions to sync state
  onUpdateProgrammes: (newProgs: Programme[]) => void;
  onUpdateAppeals: (newAppeals: Appeal[]) => void;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onUpdateSecurity: (newSec: SecurityConfig) => void;
  onTriggerBackup: () => void;
  onRestoreBackup: () => void;
  onUpdateResults: (newResults: PublishedResult[]) => void;
  onUpdateTeams: (newTeams: Team[]) => void;
  onUpdateUsers: (newUsers: UserProfile[]) => void;
  onUpdateEvaluations?: (newEvals: any[]) => void;
  onUpdateMuallims?: (updated: Muallim[]) => void;
  onUpdateCommittee?: (updated: CommitteeMember[]) => void;
  onUpdateReviews?: (updated: AppReview[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onLogin,
  onLogout,
  programmes,
  teams,
  users,
  results,
  appeals,
  feedback,
  settings,
  security,
  auditLogs,
  evaluations: propsEvaluations = [],
  muallims = [],
  committee = [],
  reviews = [],
  onUpdateProgrammes,
  onUpdateAppeals,
  onUpdateSettings,
  onUpdateSecurity,
  onTriggerBackup,
  onRestoreBackup,
  onUpdateResults,
  onUpdateTeams,
  onUpdateUsers,
  onUpdateMuallims,
  onUpdateCommittee,
  onUpdateReviews
}) => {
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab within Control Panel
  const [activeTab, setActiveTab] = useState<'Analytics' | 'StudentManagement' | 'Programmes' | 'OffStageSchedule' | 'Appeals' | 'CMS' | 'Security' | 'PrivacySecurity' | 'Feedback' | 'LeadersActivity' | 'ResultPublishing' | 'ScoringConfig' | 'TeamManagement' | 'JudgeControl' | 'MadrassaStaff' | 'ReviewsManagement'>('Analytics');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>('All');

  // Muallims & Committee Edit Form states
  const [editingMuallimId, setEditingMuallimId] = useState<string | null>(null);
  const [mName, setMName] = useState('');
  const [mDesig, setMDesig] = useState('');
  const [mPhoto, setMPhoto] = useState('');
  const [mQual, setMQual] = useState('');
  const [mExp, setMExp] = useState('');
  const [mPhone, setMPhone] = useState('');

  const [editingCommId, setEditingCommId] = useState<string | null>(null);
  const [cName, setCName] = useState('');
  const [cDesig, setCDesig] = useState('');
  const [cPhoto, setCPhoto] = useState('');
  const [cPhone, setCPhone] = useState('');

  const handleFileUploadForMuallim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setMPhoto(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUploadForCommittee = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setCPhoto(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMuallim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim()) return;

    let updated: Muallim[];
    if (editingMuallimId) {
      updated = muallims.map(m => m.id === editingMuallimId ? {
        ...m,
        name: mName.trim(),
        designation: mDesig.trim(),
        photoUrl: mPhoto.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
        qualification: mQual.trim(),
        experience: mExp.trim(),
        phone: mPhone.trim()
      } : m);
      setEditingMuallimId(null);
      setPanelSuccessMsg(`Muallim "${mName}" updated successfully.`);
    } else {
      const newM: Muallim = {
        id: `muallim_${Date.now()}`,
        name: mName.trim(),
        designation: mDesig.trim() || 'Muallim',
        photoUrl: mPhoto.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
        qualification: mQual.trim() || 'Islamic Scholar',
        experience: mExp.trim() || 'Experienced Scholar',
        phone: mPhone.trim()
      };
      updated = [...muallims, newM];
      setPanelSuccessMsg(`New Muallim "${mName}" added to faculty.`);
    }
    saveToStorage('muallims', updated);
    if (onUpdateMuallims) onUpdateMuallims(updated);
    setMName(''); setMDesig(''); setMPhoto(''); setMQual(''); setMExp(''); setMPhone('');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleDeleteMuallim = (id: string) => {
    const updated = muallims.filter(m => m.id !== id);
    saveToStorage('muallims', updated);
    if (onUpdateMuallims) onUpdateMuallims(updated);
    setPanelSuccessMsg('Muallim removed successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleSaveCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;

    let updated: CommitteeMember[];
    if (editingCommId) {
      updated = committee.map(c => c.id === editingCommId ? {
        ...c,
        name: cName.trim(),
        designation: cDesig.trim(),
        photoUrl: cPhoto.trim() || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300',
        phone: cPhone.trim()
      } : c);
      setEditingCommId(null);
      setPanelSuccessMsg(`Committee member "${cName}" updated.`);
    } else {
      const newC: CommitteeMember = {
        id: `comm_${Date.now()}`,
        name: cName.trim(),
        designation: cDesig.trim() || 'Executive Member',
        photoUrl: cPhoto.trim() || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300',
        phone: cPhone.trim()
      };
      updated = [...committee, newC];
      setPanelSuccessMsg(`New Committee member "${cName}" added.`);
    }
    saveToStorage('committee', updated);
    if (onUpdateCommittee) onUpdateCommittee(updated);
    setCName(''); setCDesig(''); setCPhoto(''); setCPhone('');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleDeleteCommittee = (id: string) => {
    const updated = committee.filter(c => c.id !== id);
    saveToStorage('committee', updated);
    if (onUpdateCommittee) onUpdateCommittee(updated);
    setPanelSuccessMsg('Committee member removed.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Programmes Category Tab state
  const [adminProgrammeCategory, setAdminProgrammeCategory] = useState<string>('All');

  // Judge Control panel states
  const [editingJudgeId, setEditingJudgeId] = useState<string | null>(null);
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgePassword, setJudgePassword] = useState('judge123');
  const [judgeDept, setJudgeDept] = useState('');
  const [judgeSelectedProgs, setJudgeSelectedProgs] = useState<string[]>([]);
  const [searchJudgeQuery, setSearchJudgeQuery] = useState('');

  // Result Publishing direct editing states
  const [editingResultProgId, setEditingResultProgId] = useState<string | null>(null);
  const [editedRankings, setEditedRankings] = useState<any[]>([]);
  const [resultPublishSearch, setResultPublishSearch] = useState('');

  // Scoring Configuration state - init from settings
  const [scoreAInd1, setScoreAInd1] = useState(settings.programScoresConfig?.categoryA?.individual?.firstPlace ?? 10);
  const [scoreAInd2, setScoreAInd2] = useState(settings.programScoresConfig?.categoryA?.individual?.secondPlace ?? 8);
  const [scoreAInd3, setScoreAInd3] = useState(settings.programScoresConfig?.categoryA?.individual?.thirdPlace ?? 5);
  const [scoreAGrp1, setScoreAGrp1] = useState(settings.programScoresConfig?.categoryA?.group?.firstPlace ?? 15);
  const [scoreAGrp2, setScoreAGrp2] = useState(settings.programScoresConfig?.categoryA?.group?.secondPlace ?? 10);
  const [scoreAGrp3, setScoreAGrp3] = useState(settings.programScoresConfig?.categoryA?.group?.thirdPlace ?? 6);

  const [scoreBInd1, setScoreBInd1] = useState(settings.programScoresConfig?.categoryB?.individual?.firstPlace ?? 10);
  const [scoreBInd2, setScoreBInd2] = useState(settings.programScoresConfig?.categoryB?.individual?.secondPlace ?? 8);
  const [scoreBInd3, setScoreBInd3] = useState(settings.programScoresConfig?.categoryB?.individual?.thirdPlace ?? 5);
  const [scoreBGrp1, setScoreBGrp1] = useState(settings.programScoresConfig?.categoryB?.group?.firstPlace ?? 15);
  const [scoreBGrp2, setScoreBGrp2] = useState(settings.programScoresConfig?.categoryB?.group?.secondPlace ?? 10);
  const [scoreBGrp3, setScoreBGrp3] = useState(settings.programScoresConfig?.categoryB?.group?.thirdPlace ?? 6);

  // Team Management form states
  const [newTeamId, setNewTeamId] = useState('');
  const [newTeamTitle, setNewTeamTitle] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('bg-yellow-500');
  
  // Assign leader form states
  const [selectedLeaderTeamToConfig, setSelectedLeaderTeamToConfig] = useState<string | null>(null);
  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [teamLeaderLoginId, setTeamLeaderLoginId] = useState('');
  const [teamLeaderPassword, setTeamLeaderPassword] = useState('');

  // Custom iframe-safe Confirmations
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState<string>('');
  const [editingTeamColor, setEditingTeamColor] = useState<string>('');
  const [progToDeleteId, setProgToDeleteId] = useState<string | null>(null);
  const [teamToDeleteId, setTeamToDeleteId] = useState<string | null>(null);
  const [judgeToDeleteId, setJudgeToDeleteId] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<boolean>(false);

  // Leaders Activity Panel state
  const [selectedLeaderTeamId, setSelectedLeaderTeamId] = useState<string>('team_red');
  const [leaderLogSearch, setLeaderLogSearch] = useState<string>('');

  // Success / Failure alerts
  const [panelSuccessMsg, setPanelSuccessMsg] = useState('');
  const [panelErrorMsg, setPanelErrorMsg] = useState('');

  // Programmes CRUD form states
  const [showProgForm, setShowProgForm] = useState(false);
  const [editingProgId, setEditingProgId] = useState<string | null>(null);
  
  // Form variables
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'A' | 'B'>('A');
  const [type, setType] = useState<'Individual' | 'Group'>('Individual');
  const [section, setSection] = useState<'Stage' | 'Off-Stage'>('Stage');
  const [venue, setVenue] = useState('');
  const [datetime, setDatetime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(15);
  const [minParticipants, setMinParticipants] = useState(3);
  const [rules, setRules] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedJudges, setSelectedJudges] = useState<string[]>([]);
  const [categoryGroup, setCategoryGroup] = useState<'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' | 'General' | 'All' | string[]>('All');

  // CMS forms
  const [cmsHeroBanner, setCmsHeroBanner] = useState(settings.logoBanner);
  const [cmsHeroTitle, setCmsHeroTitle] = useState(settings.festivalName);
  const [cmsAboutText, setCmsAboutText] = useState(settings.about);
  const [cmsContactEmail, setCmsContactEmail] = useState(settings.contactEmail);
  const [cmsContactPhone, setCmsContactPhone] = useState(settings.contactPhone);

  // Security toggles
  const [sec2FA, setSec2FA] = useState(security.enable2FA);
  const [secTimeout, setSecTimeout] = useState(security.sessionTimeoutMin);
  const [secLimit, setSecLimit] = useState(security.rateLimitAttempts);
  const [secRestrictDevices, setSecRestrictDevices] = useState(security.restrictDevices || false);
  const [secTrustedLocations, setSecTrustedLocations] = useState(security.trustedLocations || '');

  // Admin credentials state
  const adminUser = currentUser?.role === 'admin' ? currentUser : users.find(u => u.role === 'admin');
  const [adminCredEmail, setAdminCredEmail] = useState(adminUser?.email || '');
  const [adminCredPassword, setAdminCredPassword] = useState(adminUser?.password || '');

  const [newSubAdminEmail, setNewSubAdminEmail] = useState('');
  const [newSubAdminPassword, setNewSubAdminPassword] = useState('');

  // Logged devices state
  const getCurrentDeviceName = () => {
    if (typeof navigator === 'undefined') return 'Unknown Device';
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    
    let os = "Unknown OS";
    if (ua.includes("Win")) os = "Windows PC";
    else if (ua.includes("Mac")) os = "Mac";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("like Mac")) os = "iOS";

    return `${os} (${browser})`;
  };

  const [activeDevices, setActiveDevices] = useState([
    { id: 'dev1', name: getCurrentDeviceName(), location: 'Active Connection', ip: '127.0.0.1', current: true }
  ]);

  const handleRevokeDevice = (id: string) => {
    setActiveDevices(prev => prev.filter(d => d.id !== id));
    setPanelSuccessMsg('Device access revoked successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Active Appeal resolution form state
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [appealResolutionText, setAppealResolutionText] = useState('');
  const [appealStatusUpdate, setAppealStatusUpdate] = useState<'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Completed'>('Under Review');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLoginError('Specify academic email ID');
      return;
    }
    const success = onLogin(email.trim().toLowerCase(), 'admin', password);
    if (success) {
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Security Keys.');
    }
  };

  // Trigger Programme Form for Add
  const triggerAddProg = () => {
    setEditingProgId(null);
    setCode(`PROG-${Math.floor(100 + Math.random() * 900)}`);
    setTitle('');
    setCategory('A');
    setType('Individual');
    setSection('Stage');
    setVenue('Main Seminar Hall C');
    setDatetime('2026-07-22T09:00');
    setMaxParticipants(15);
    setMinParticipants(3);
    setRules('1. Standard timings: 5 mins.\n2. Overrun results in a 10% penalty score.\n3. Bring necessary accessories.');
    setDeadline('2026-07-21T18:00');
    setSelectedJudges([]);
    setCategoryGroup(adminProgrammeCategory === 'All' ? 'All' : [adminProgrammeCategory]);
    setShowProgForm(true);
  };

  // Trigger Programme Form for Edit
  const triggerEditProg = (prog: Programme) => {
    setEditingProgId(prog.id);
    setCode(prog.code);
    setTitle(prog.title);
    setCategory(prog.category);
    setType(prog.type);
    setSection(prog.section);
    setVenue(prog.venue);
    setDatetime(prog.datetime);
    setMaxParticipants(prog.maxParticipants);
    setMinParticipants(prog.minParticipants);
    setRules(prog.rules);
    setDeadline(prog.deadline);
    setSelectedJudges(prog.judgeIds);
    setCategoryGroup(prog.categoryGroup || 'All');
    setShowProgForm(true);
  };

  // Duplicate Programme
  const handleDuplicateProg = (prog: Programme) => {
    const dup: Programme = {
      ...prog,
      id: `prog_dup_${Math.floor(1000 + Math.random() * 9000)}`,
      code: `${prog.code}-DUP`,
      title: `${prog.title} (Duplicate)`,
      resultPublished: false,
      status: 'Scheduled'
    };
    const newList = [...programmes, dup];
    onUpdateProgrammes(newList);
    setPanelSuccessMsg('Programme duplicated successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Submit Programme Form (Add / Edit)
  const handleProgFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Event title cannot be blank.');
      return;
    }

    if (editingProgId) {
      // Edit
      const updated = programmes.map(p => {
        if (p.id === editingProgId) {
          return {
            ...p,
            code,
            title,
            category,
            type,
            section,
            venue,
            datetime,
            maxParticipants,
            minParticipants,
            rules,
            deadline,
            judgeIds: selectedJudges,
            categoryGroup,
          };
        }
        return p;
      });
      onUpdateProgrammes(updated);
      setPanelSuccessMsg('Programme configurations updated successfully.');
    } else {
      // Add
      const newProg: Programme = {
        id: `prog_${Math.floor(1000 + Math.random() * 9000)}`,
        code,
        title,
        category,
        type,
        section,
        venue,
        datetime,
        maxParticipants,
        minParticipants,
        rules,
        deadline,
        status: 'Scheduled',
        judgeIds: selectedJudges,
        resultPublished: false,
        categoryGroup,
      };
      onUpdateProgrammes([...programmes, newProg]);
      setPanelSuccessMsg('New official competition added to schedule catalogue.');
    }

    setShowProgForm(false);
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Delete event trigger
  const handleDeleteProg = (id: string) => {
    setProgToDeleteId(id);
  };

  // Actual execution of delete after custom modal confirmation
  const executeDeleteProg = (id: string) => {
    const filtered = programmes.filter(p => p.id !== id);
    onUpdateProgrammes(filtered);
    setProgToDeleteId(null);
    setPanelSuccessMsg('Programme deleted from database successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Submit CMS changes
  const handleCmsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      ...settings,
      festivalName: cmsHeroTitle,
      logoBanner: cmsHeroBanner,
      about: cmsAboutText,
      contactEmail: cmsContactEmail,
      contactPhone: cmsContactPhone,
    };
    onUpdateSettings(updated);
    setPanelSuccessMsg('CMS modifications published instantly to homepage views!');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Submit Security changes
  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SecurityConfig = {
      enable2FA: sec2FA,
      sessionTimeoutMin: Number(secTimeout),
      rateLimitAttempts: Number(secLimit),
      lockoutDurationMin: 10,
      restrictDevices: secRestrictDevices,
      trustedLocations: secTrustedLocations
    };
    onUpdateSecurity(updated);
    setPanelSuccessMsg('Advanced RBAC security levels updated.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleAdminCredSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    const updatedUsers = users.map(u => {
      if (u.id === adminUser.id) {
        return {
          ...u,
          email: adminCredEmail,
          password: adminCredPassword
        };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
    setPanelSuccessMsg('Administrator credentials updated successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleAddSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubAdminEmail || !newSubAdminPassword) return;
    const newAdmin: UserProfile = {
      id: `admin_${Date.now()}`,
      name: `Sub Admin (${newSubAdminEmail.split('@')[0] || newSubAdminEmail})`,
      email: newSubAdminEmail,
      password: newSubAdminPassword,
      role: 'admin',
      registeredProgrammeIds: []
    };
    onUpdateUsers([...users, newAdmin]);
    setNewSubAdminEmail('');
    setNewSubAdminPassword('');
    setPanelSuccessMsg('Sub Administrator added successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleRemoveSubAdmin = (id: string) => {
    if (id === adminUser?.id) return;
    onUpdateUsers(users.filter(u => u.id !== id));
    setPanelSuccessMsg('Sub Administrator removed.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Resolve active appeal
  const handleResolveAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppealId) return;

    const updated = appeals.map(app => {
      if (app.id === selectedAppealId) {
        return {
          ...app,
          status: appealStatusUpdate,
          adminNotes: appealResolutionText
        };
      }
      return app;
    });

    onUpdateAppeals(updated);
    setSelectedAppealId(null);
    setAppealResolutionText('');
    setPanelSuccessMsg('Appeal resolution logged. Student has been notified live via timeline.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  // Backups simulation
  const handleBackup = () => {
    onTriggerBackup();
    setPanelSuccessMsg('Automated daily snapshot created successfully. Saved inside encrypted cold storage blocks.');
    setTimeout(() => setPanelSuccessMsg(''), 5000);
  };

  const handleRestore = () => {
    setShowRestoreConfirm(true);
  };

  const executeRestore = () => {
    onRestoreBackup();
    setShowRestoreConfirm(false);
    setPanelSuccessMsg('Database state RESTORED from standard daily snapshot.');
    setTimeout(() => setPanelSuccessMsg(''), 5000);
  };

  const handleToggleResultLock = (programmeId: string) => {
    let targetNewLockState = false;
    const updatedResults = results.map(r => {
      if (r.programmeId === programmeId) {
        targetNewLockState = !r.locked;
        return { ...r, locked: targetNewLockState };
      }
      return r;
    });
    onUpdateResults(updatedResults);

    // Synchronize the corresponding programme's lock status
    const updatedProgs = programmes.map(p => {
      if (p.id === programmeId) {
        return { ...p, locked: targetNewLockState, resultPublished: targetNewLockState };
      }
      return p;
    });
    onUpdateProgrammes(updatedProgs);

    setPanelSuccessMsg('Result lock status updated successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleDeleteResultEntry = (programmeId: string) => {
    const prog = programmes.find(p => p.id === programmeId);
    const progName = prog ? `${prog.code} (${prog.title})` : programmeId;
    if (confirm(`Are you sure you want to remove the result entry for "${progName}"? This will delete its published rankings and reset its scoreboard contribution.`)) {
      const updatedResults = results.filter(r => r.programmeId !== programmeId);
      onUpdateResults(updatedResults);

      const updatedProgs = programmes.map(p => {
        if (p.id === programmeId) {
          return { ...p, resultPublished: false, status: 'Scheduled' as const };
        }
        return p;
      });
      onUpdateProgrammes(updatedProgs);

      setPanelSuccessMsg(`Result entry for "${progName}" removed successfully.`);
      setTimeout(() => setPanelSuccessMsg(''), 4000);
    }
  };

  const handleRecallResult = (programmeId: string) => {
    const prog = programmes.find(p => p.id === programmeId);
    const progName = prog ? `${prog.code} (${prog.title})` : programmeId;
    if (confirm(`Are you sure you want to RECALL the published result for "${progName}"?\n\nThis will temporarily withdraw the result from the public scoreboard and Results view while you make edits or corrections.`)) {
      // Set resultPublished = false to withdraw from public view & scoreboard
      const updatedProgs = programmes.map(p => {
        if (p.id === programmeId) {
          return { ...p, resultPublished: false, status: 'Scheduled' as const };
        }
        return p;
      });
      onUpdateProgrammes(updatedProgs);

      // Unlock result for editing
      const updatedResults = results.map(r => {
        if (r.programmeId === programmeId) {
          return { ...r, locked: false };
        }
        return r;
      });
      onUpdateResults(updatedResults);

      setPanelSuccessMsg(`Result for "${progName}" has been RECALLED to draft mode for editing.`);
      setTimeout(() => setPanelSuccessMsg(''), 5000);
    }
  };

  const handleClearAllResults = () => {
    if (confirm('⚠️ WARNING: Are you sure you want to REMOVE ALL RESULT ENTRIES? This will delete all published event results and reset all team scoreboards to 0.')) {
      onUpdateResults([]);

      const updatedProgs = programmes.map(p => ({
        ...p,
        resultPublished: false,
        status: 'Scheduled' as const
      }));
      onUpdateProgrammes(updatedProgs);

      setPanelSuccessMsg('All result entries have been removed. Scoreboards reset to 0.');
      setTimeout(() => setPanelSuccessMsg(''), 5000);
    }
  };

  const handleUpdateReviewStatus = (id: string, status: AppReview['status']) => {
    if (!onUpdateReviews) return;
    const updated = reviews.map(r => r.id === id ? { ...r, status } : r);
    onUpdateReviews(updated);
    setPanelSuccessMsg(`Review status updated to ${status}.`);
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleToggleFeatureReview = (id: string) => {
    if (!onUpdateReviews) return;
    const updated = reviews.map(r => r.id === id ? { ...r, featured: !r.featured } : r);
    onUpdateReviews(updated);
    setPanelSuccessMsg('Featured status updated for homepage display.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleDeleteReview = (id: string) => {
    if (!onUpdateReviews) return;
    if (confirm('Are you sure you want to delete this review?')) {
      const updated = reviews.filter(r => r.id !== id);
      onUpdateReviews(updated);
      setPanelSuccessMsg('Review deleted.');
      setTimeout(() => setPanelSuccessMsg(''), 4000);
    }
  };

  const filteredAdminReviews = reviews.filter(r => {
    if (reviewStatusFilter === 'All') return true;
    if (reviewStatusFilter === 'Featured') return r.featured;
    return r.status === reviewStatusFilter;
  });

  const [localEvaluations, setLocalEvaluations] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('artsportal_evaluations') || localStorage.getItem('evaluations');
    if (stored) {
      try {
        setLocalEvaluations(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  const evaluations = propsEvaluations.length > 0 ? propsEvaluations : localEvaluations;

  const handleSaveJudge = () => {
    if (!judgeName || !judgeEmail) {
      setPanelErrorMsg('Please enter both Juror Name and Jury ID / Email.');
      setTimeout(() => setPanelErrorMsg(''), 4000);
      return;
    }

    if (editingJudgeId) {
      // Edit mode
      const updated = users.map(u => {
        if (u.id === editingJudgeId) {
          return {
            ...u,
            name: judgeName,
            email: judgeEmail,
            password: judgePassword,
            department: judgeDept,
            assignedProgrammeIds: judgeSelectedProgs,
          };
        }
        return u;
      });
      // Also update programmes
      const updatedProgs = programmes.map(p => {
        const shouldHave = judgeSelectedProgs.includes(p.id);
        const alreadyHas = p.judgeIds?.includes(editingJudgeId) ?? false;
        if (shouldHave && !alreadyHas) {
          return { ...p, judgeIds: [...(p.judgeIds || []), editingJudgeId] };
        } else if (!shouldHave && alreadyHas) {
          return { ...p, judgeIds: (p.judgeIds || []).filter(id => id !== editingJudgeId) };
        }
        return p;
      });
      onUpdateUsers(updated);
      onUpdateProgrammes(updatedProgs);
      setEditingJudgeId(null);
      setPanelSuccessMsg(`Juror credentials for "${judgeName}" updated successfully.`);
    } else {
      // Add mode
      const newId = `judge_${Math.floor(1000 + Math.random() * 9000)}`;
      const newJudge = {
        id: newId,
        name: judgeName,
        email: judgeEmail,
        role: 'judge' as const,
        password: judgePassword,
        department: judgeDept,
        assignedProgrammeIds: judgeSelectedProgs,
        registeredProgrammeIds: [],
      };
      // Also update programmes
      const updatedProgs = programmes.map(p => {
        if (judgeSelectedProgs.includes(p.id)) {
          return { ...p, judgeIds: [...(p.judgeIds || []), newId] };
        }
        return p;
      });
      onUpdateUsers([...users, newJudge]);
      onUpdateProgrammes(updatedProgs);
      setPanelSuccessMsg(`New Juror/Judge "${judgeName}" added to registry successfully.`);
    }

    // Reset form
    setJudgeName('');
    setJudgeEmail('');
    setJudgePassword('judge123');
    setJudgeDept('');
    setJudgeSelectedProgs([]);
    setTimeout(() => setPanelSuccessMsg(''), 5000);
  };

  const handleDeleteJudge = (judgeId: string) => {
    setJudgeToDeleteId(judgeId);
  };

  const executeDeleteJudge = (judgeId: string) => {
    const judgeToDelete = users.find(u => u.id === judgeId);
    if (!judgeToDelete) return;

    const updated = users.filter(u => u.id !== judgeId);
    // Also remove from programmes
    const updatedProgs = programmes.map(p => ({
      ...p,
      judgeIds: (p.judgeIds || []).filter(id => id !== judgeId)
    }));
    onUpdateUsers(updated);
    onUpdateProgrammes(updatedProgs);
    setJudgeToDeleteId(null);
    setPanelSuccessMsg(`Juror "${judgeToDelete.name}" removed from registry successfully.`);
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const triggerEditJudge = (jg: any) => {
    setEditingJudgeId(jg.id);
    setJudgeName(jg.name);
    setJudgeEmail(jg.email);
    setJudgePassword(jg.password || 'judge123');
    setJudgeDept(jg.department || '');
    setJudgeSelectedProgs(jg.assignedProgrammeIds || []);
    setTimeout(() => {
      document.getElementById('judge-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleToggleProgLock = (progId: string) => {
    const updated = programmes.map(p => {
      if (p.id === progId) {
        const isCurrentlyLocked = p.locked === true;
        return { ...p, locked: !isCurrentlyLocked };
      }
      return p;
    });
    onUpdateProgrammes(updated);
    
    // Also update any results corresponding to this program
    const updatedResults = results.map(r => {
      if (r.programmeId === progId) {
        return { ...r, locked: !r.locked };
      }
      return r;
    });
    onUpdateResults(updatedResults);

    setPanelSuccessMsg('Programme scoring lock status updated successfully.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleOpenEditRankings = (progId: string, currentResult?: PublishedResult) => {
    setEditingResultProgId(progId);
    
    const progInfo = programmes.find(p => p.id === progId);
    const isGroup = progInfo?.type === 'Group';
    const isCatA = progInfo?.category === 'A';
    const config = settings.programScoresConfig || {
      categoryA: { individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 }, group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 } },
      categoryB: { individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 }, group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 } }
    };
    const catRules = isCatA ? config.categoryA : config.categoryB;
    const rule = isGroup ? catRules.group : catRules.individual;

    let sourceRankings: any[] | null = null;

    if (currentResult && currentResult.rankings && currentResult.rankings.length > 0) {
      sourceRankings = currentResult.rankings;
    } else {
      const juryEval = evaluations.find(ev => (ev.id === `jury_submitted_${progId}` || ev.programmeId === progId) && ev.rankings && Array.isArray(ev.rankings));
      if (juryEval && juryEval.rankings && Array.isArray(juryEval.rankings)) {
        sourceRankings = juryEval.rankings;
      }
    }

    if (!sourceRankings || !sourceRankings.some(r => r.participantId || r.participantName)) {
      const progEvals = evaluations.filter(ev => ev.programmeId === progId && !ev.id?.startsWith('jury_submitted_'));
      if (progEvals.length > 0 && progEvals.some(ev => ev.totalScore > 0)) {
        const sortedEvals = [...progEvals].sort((a, b) => b.totalScore - a.totalScore);
        sourceRankings = [1, 2, 3].map(pos => {
          const ev = sortedEvals[pos - 1];
          if (!ev) return { position: pos, participantId: '', participantName: '', teamId: '', teamName: '', grade: pos === 1 ? 'A' : pos === 2 ? 'B' : 'C', points: pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : rule.thirdPlace };
          const student = users.find(u => u.id === ev.participantId);
          const t = teams.find(team => team.id === (ev.teamId || student?.teamId));
          return {
            position: pos,
            participantId: ev.participantId,
            participantName: student ? student.name : ev.participantName || '',
            teamId: ev.teamId || student?.teamId || '',
            teamName: t ? t.name : '',
            grade: ev.grade || (pos === 1 ? 'A' : pos === 2 ? 'B' : 'C'),
            points: pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : pos === 3 ? rule.thirdPlace : 0,
            totalScore: ev.totalScore
          };
        });
      } else {
        const progGroupStr = (progInfo?.categoryGroup || `${progInfo?.categoryLevel || ''} ${progInfo?.category || ''} ${progInfo?.gender || ''}`).toLowerCase();
        const isGirlsProg = progGroupStr.includes('girls') || (progInfo?.gender && progInfo.gender.toLowerCase() === 'girls');
        const isBoysProg = progGroupStr.includes('boys') || (progInfo?.gender && progInfo.gender.toLowerCase() === 'boys');
        const targetCat = progGroupStr.includes('sub junior') ? 'Sub Junior' :
                          progGroupStr.includes('super senior') ? 'Super Senior' :
                          progGroupStr.includes('junior') ? 'Junior' :
                          progGroupStr.includes('senior') ? 'Senior' :
                          progGroupStr.includes('kiddies') ? 'Kiddies' : null;

        const matchesCatGen = (s: UserProfile) => {
          const sGender = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
          if (isGirlsProg && sGender !== 'Girls') return false;
          if (isBoysProg && sGender !== 'Boys') return false;
          if (targetCat) {
            const sCat = s.category || (s.studentClass ? (parseInt(s.studentClass) <= 4 ? 'Sub Junior' : parseInt(s.studentClass) <= 6 ? 'Junior' : parseInt(s.studentClass) <= 8 ? 'Senior' : 'Super Senior') : null);
            if (sCat && sCat.toLowerCase() !== targetCat.toLowerCase()) return false;
          }
          return true;
        };

        const registered = users.filter(u => u.role === 'student' && u.registeredProgrammeIds?.includes(progId));
        const filteredCatReg = registered.filter(matchesCatGen);
        const filteredCatAll = users.filter(u => u.role === 'student' && matchesCatGen(u));
        const enrolled = filteredCatReg.length > 0 ? filteredCatReg : (filteredCatAll.length > 0 ? filteredCatAll : (registered.length > 0 ? registered : users.filter(u => u.role === 'student')));

        sourceRankings = [1, 2, 3].map(pos => {
          const s = enrolled[pos - 1];
          if (!s) return { position: pos, participantId: '', participantName: '', teamId: '', teamName: '', grade: pos === 1 ? 'A' : pos === 2 ? 'B' : 'C', points: pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : rule.thirdPlace };
          const t = teams.find(team => team.id === s.teamId);
          return {
            position: pos,
            participantId: s.id,
            participantName: s.name,
            teamId: s.teamId || '',
            teamName: t ? t.name : '',
            grade: pos === 1 ? 'A' : pos === 2 ? 'B' : pos === 3 ? 'C' : 'None',
            points: pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : pos === 3 ? rule.thirdPlace : 0
          };
        });
      }
    }

    if (sourceRankings && sourceRankings.length > 0) {
      const hasPos1 = sourceRankings.some(r => r.position === 1 && (r.participantId || r.participantName));
      if (!hasPos1) {
        const sortedByScore = [...sourceRankings].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        sortedByScore.forEach((r, idx) => {
          if (idx === 0) r.position = 1;
          else if (idx === 1) r.position = 2;
          else if (idx === 2) r.position = 3;
          else r.position = idx + 1;
        });
      }

      const sortedRanks = [...sourceRankings].sort((a, b) => a.position - b.position);
      const top3Ranks = [1, 2, 3].map(pos => {
        const found = sortedRanks.find(r => r.position === pos);
        if (found) {
          const student = users.find(u => u.id === found.participantId);
          const t = teams.find(team => team.id === (found.teamId || student?.teamId));
          const defaultPts = pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : rule.thirdPlace;
          const defaultGr = (found.grade && found.grade !== 'None') ? found.grade : (pos === 1 ? 'A' : pos === 2 ? 'B' : 'C');

          return {
            ...found,
            participantId: found.participantId || student?.id || '',
            participantName: found.participantName || student?.name || '',
            teamId: found.teamId || student?.teamId || '',
            teamName: found.teamName || t?.name || '',
            grade: defaultGr,
            points: found.points > 0 ? found.points : defaultPts
          };
        }
        return {
          position: pos,
          participantId: '',
          participantName: '',
          teamId: '',
          teamName: '',
          grade: pos === 1 ? 'A' : pos === 2 ? 'B' : 'C',
          points: pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : rule.thirdPlace
        };
      });

      setEditedRankings(top3Ranks);
    } else {
      setEditedRankings([
        { position: 1, participantId: '', participantName: '', teamId: '', teamName: '', grade: 'A', points: rule.firstPlace },
        { position: 2, participantId: '', participantName: '', teamId: '', teamName: '', grade: 'B', points: rule.secondPlace },
        { position: 3, participantId: '', participantName: '', teamId: '', teamName: '', grade: 'C', points: rule.thirdPlace },
      ]);
    }
  };

  const handleSaveRankingsDirectly = (publishNow = true) => {
    if (!editingResultProgId) return;

    const currentProg = programmes.find(p => p.id === editingResultProgId);
    if (!currentProg) return;

    const cleanRankings = editedRankings.filter(r => r.participantName.trim() !== '');

    const newResult: PublishedResult = {
      programmeId: editingResultProgId,
      publishedAt: new Date().toISOString(),
      rankings: cleanRankings,
      locked: publishNow
    };

    const otherResults = results.filter(r => r.programmeId !== editingResultProgId);
    const updatedResults = [...otherResults, newResult];

    onUpdateResults(updatedResults);

    const updatedProgs = programmes.map(p => {
      if (p.id === editingResultProgId) {
        return { 
          ...p, 
          status: publishNow ? ('Completed' as const) : ('Scheduled' as const), 
          resultPublished: publishNow 
        };
      }
      return p;
    });
    onUpdateProgrammes(updatedProgs);

    setEditingResultProgId(null);
    setPanelSuccessMsg(publishNow ? 'Official rankings published and live scoreboard recalculated.' : 'Result saved as draft/recalled state.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleSaveScoringRules = () => {
    const updatedConfig = {
      categoryA: {
        individual: { firstPlace: Number(scoreAInd1), secondPlace: Number(scoreAInd2), thirdPlace: Number(scoreAInd3) },
        group: { firstPlace: Number(scoreAGrp1), secondPlace: Number(scoreAGrp2), thirdPlace: Number(scoreAGrp3) }
      },
      categoryB: {
        individual: { firstPlace: Number(scoreBInd1), secondPlace: Number(scoreBInd2), thirdPlace: Number(scoreBInd3) },
        group: { firstPlace: Number(scoreBGrp1), secondPlace: Number(scoreBGrp2), thirdPlace: Number(scoreBGrp3) }
      }
    };

    const updatedSettings: SystemSettings = {
      ...settings,
      programScoresConfig: updatedConfig
    };

    onUpdateSettings(updatedSettings);
    setPanelSuccessMsg('Score point configurations updated successfully. Overall standing scores recalculated.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleCreateNewTeam = () => {
    if (!newTeamId.trim() || !newTeamTitle.trim()) {
      setPanelErrorMsg('Please fill in all team fields.');
      return;
    }
    const normId = newTeamId.trim().toLowerCase().replace(/\s+/g, '_');
    if (teams.some(t => t.id === normId)) {
      setPanelErrorMsg('A team with this ID already exists.');
      return;
    }

    const colors = ['from-red-500 to-pink-500', 'from-blue-500 to-indigo-500', 'from-emerald-500 to-teal-500', 'from-purple-500 to-indigo-500', 'from-amber-500 to-orange-500'];
    const gradient = colors[teams.length % colors.length];

    const newTeam: Team = {
      id: normId,
      name: newTeamTitle.trim(),
      points: 0,
      color: newTeamColor,
      gradient
    };

    onUpdateTeams([...teams, newTeam]);
    setNewTeamId('');
    setNewTeamTitle('');
    setPanelSuccessMsg('New house team created successfully!');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleOpenLeaderConfig = (team: Team) => {
    setSelectedLeaderTeamToConfig(team.id);
    const existingLeader = users.find(u => u.role === 'student' && u.teamId === team.id && u.leaderId);
    if (existingLeader) {
      setTeamLeaderName(existingLeader.name);
      setTeamLeaderLoginId(existingLeader.leaderId || '');
      setTeamLeaderPassword(existingLeader.password || '');
    } else {
      setTeamLeaderName('');
      setTeamLeaderLoginId(`leader_${team.id.replace('team_', '')}`);
      setTeamLeaderPassword('student123');
    }
  };

  const handleSaveTeamLeaderConfig = () => {
    if (!selectedLeaderTeamToConfig) return;
    if (!teamLeaderName.trim() || !teamLeaderLoginId.trim() || !teamLeaderPassword.trim()) {
      alert('All team leader fields are required.');
      return;
    }

    const teamId = selectedLeaderTeamToConfig;
    const existingLeader = users.find(u => u.role === 'student' && u.teamId === teamId && u.leaderId);
    const leaderUserId = existingLeader ? existingLeader.id : `leader_user_${teamId}`;

    const leaderProfile: UserProfile = {
      id: leaderUserId,
      name: teamLeaderName.trim(),
      email: existingLeader?.email || `leader_${teamId.replace('team_', '')}@artsportal.edu`,
      role: 'student',
      teamId: teamId,
      registeredProgrammeIds: existingLeader?.registeredProgrammeIds || [],
      rollNo: existingLeader?.rollNo || `LDR-${teamId.replace('team_', '').toUpperCase()}`,
      chestNo: existingLeader?.chestNo || `L-${teamId.replace('team_', '').toUpperCase()}`,
      categoryGroup: 'Senior',
      password: teamLeaderPassword.trim(),
      leaderId: teamLeaderLoginId.trim(),
    };

    let updatedUsers: UserProfile[];
    if (existingLeader) {
      updatedUsers = users.map(u => u.id === existingLeader.id ? leaderProfile : u);
    } else {
      updatedUsers = [...users, leaderProfile];
    }

    onUpdateUsers(updatedUsers);

    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        return { ...t, leaderUserId };
      }
      return t;
    });
    onUpdateTeams(updatedTeams);

    setSelectedLeaderTeamToConfig(null);
    setPanelSuccessMsg('Team leader credentials provisioned. Leader ID and Password ready to access Leaders Portal.');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeamToDeleteId(teamId);
  };

  const executeDeleteTeam = (teamId: string) => {
    const teamToDelete = teams.find(t => t.id === teamId);
    if (!teamToDelete) return;
    
    const updatedTeams = teams.filter(t => t.id !== teamId);
    onUpdateTeams(updatedTeams);
    
    const updatedUsers = users.filter(u => {
      if (u.id === `leader_user_${teamId}` || (u.teamId === teamId && u.leaderId)) {
        return false;
      }
      return true;
    }).map(u => {
      if (u.teamId === teamId) {
        const { teamId: _, ...rest } = u;
        return rest;
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
    
    setTeamToDeleteId(null);
    setPanelSuccessMsg(`House team "${teamToDelete.name}" deleted successfully.`);
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  const handleStartEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setEditingTeamName(team.name);
    setEditingTeamColor(team.color);
  };

  const handleSaveEditedTeam = () => {
    if (!editingTeamId) return;
    if (!editingTeamName.trim()) {
      setPanelErrorMsg('Team name cannot be empty.');
      setTimeout(() => setPanelErrorMsg(''), 4000);
      return;
    }

    const updatedTeams = teams.map(t => {
      if (t.id === editingTeamId) {
        return {
          ...t,
          name: editingTeamName.trim(),
          color: editingTeamColor
        };
      }
      return t;
    });

    onUpdateTeams(updatedTeams);
    setEditingTeamId(null);
    setEditingTeamName('');
    setPanelSuccessMsg('Team details updated successfully!');
    setTimeout(() => setPanelSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-control-center">
      {/* 1. NOT LOGGED IN: Administrator Access Key Entry */}
      {!currentUser || currentUser.role !== 'admin' ? (
        <div className="max-w-md mx-auto rounded-3xl premium-card p-8 shadow-2xl space-y-6" id="auth-box-admin">
          <div className="text-center space-y-3">
            <img 
              src="/meelad_fest_logo.jpg" 
              alt="Meelad Fest Official Logo" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg mx-auto ring-2 ring-purple-500/20"
            />
            <h2 className="text-2xl font-display font-bold text-neutral-800 dark:text-neutral-100">Admin Control Center</h2>
            <p className="text-xs text-neutral-500">Restricted system administration & master management suite.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4" id="admin-login-form">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 block">System Administrator ID</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Administrator ID or Email"
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-100"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 block">Security Encrypted Pin</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Security Pin"
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-100"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/30 border border-rose-200/50 text-rose-800 dark:text-rose-300 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield size={16} />
              Open Control Center
            </button>
          </form>
        </div>
      ) : (
        /* 2. LOGGED IN: Administrative Dashboard Grid */
        <div className="space-y-6" id="admin-workbench">
          {/* Dashboard Header Bar */}
          <div className="rounded-2xl premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs" id="admin-hud">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                <Settings size={24} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-indigo-600 dark:text-indigo-400 font-extrabold mb-1">Secure Root Dashboard</div>
                <h2 className="text-xl font-display font-black text-neutral-900 dark:text-white">{currentUser.name} (Lead)</h2>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors border border-rose-200 dark:border-rose-800"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs for Admin panels */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 px-1" id="admin-tabs-row">
            {[
              { key: 'Analytics', label: 'Overview' },
              { key: 'StudentManagement', label: 'Student Roster & Import' },
              { key: 'Programmes', label: 'Programmes Catalog' },
              { key: 'OffStageSchedule', label: 'Off-Stage & Master Schedule' },
              { key: 'MadrassaStaff', label: 'Muallims & Committee' },
              { key: 'TeamManagement', label: 'Teams & Leaders' },
              { key: 'JudgeControl', label: 'Judge Control' },
              { key: 'ResultPublishing', label: 'Result Publishing' },
              { key: 'ScoringConfig', label: 'Scoring Point Rules' },
              { key: 'LeadersActivity', label: 'Leaders Desk Activity' },
              { key: 'Appeals', label: `Appeals (${appeals.filter(a => a.status !== 'Completed').length})` },
              { key: 'CMS', label: 'CMS Editor' },
              { key: 'ReviewsManagement', label: `Reviews & Ratings (${reviews.filter(r => r.status === 'Pending').length})` },
              { key: 'Feedback', label: 'Feedback Logs' },
              { key: 'PrivacySecurity', label: 'Access & Credentials' },
              { key: 'Security', label: 'Audits & Backups' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setPanelSuccessMsg('');
                }}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === tab.key 
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-black shadow-md' 
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Local notification panel alerts */}
          {panelSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-bold">
              <Check size={14} className="shrink-0" />
              <span>{panelSuccessMsg}</span>
            </div>
          )}

          {/* TAB: Student Management & Chest Roster */}
          {activeTab === 'StudentManagement' && (
            <StudentManagementTab 
              users={users}
              teams={teams}
              programmes={programmes}
              onUpdateUsers={onUpdateUsers}
            />
          )}

          {/* TAB: Off-Stage & Master Schedule Management */}
          {activeTab === 'OffStageSchedule' && (
            <OffStageScheduleTab 
              programmes={programmes}
              onUpdateProgrammes={onUpdateProgrammes}
            />
          )}

          {/* TAB: Madrassa Staff & Committee Editor */}
          {activeTab === 'MadrassaStaff' && (
            <div className="space-y-8 animate-fade-in" id="madrassa-staff-editor">
              {/* Muallims Management Block */}
              <div className="premium-card p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                      <GraduationCap className="text-emerald-500" size={24} />
                      Madrassa Faculty Editor (8 Muallims)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage teaching staff members, qualifications, photos, and designations</p>
                  </div>
                </div>

                {/* Form to Add / Edit Muallim */}
                <form onSubmit={handleSaveMuallim} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                    {editingMuallimId ? 'Edit Muallim Profile' : 'Add New Muallim Member'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        value={mName}
                        onChange={(e) => setMName(e.target.value)}
                        placeholder="e.g. Sadiq Ali Jalali"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Designation / Role</label>
                      <input 
                        type="text" 
                        value={mDesig}
                        onChange={(e) => setMDesig(e.target.value)}
                        placeholder="e.g. Swadar Muallim (Principal)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Photo Image (URL or Device Upload)</label>
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={mPhoto}
                          onChange={(e) => setMPhoto(e.target.value)}
                          placeholder="https://... or upload photo from device"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                        />
                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] cursor-pointer hover:bg-emerald-100 transition-colors">
                          <Upload size={13} />
                          <span>Choose Photo File from Device</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUploadForMuallim} 
                            className="hidden" 
                          />
                        </label>
                        {mPhoto && (
                          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                            <img src={mPhoto} alt="Selected Photo Preview" className="w-12 h-12 rounded-xl object-cover border border-emerald-500/50 shrink-0 shadow-md" />
                            <div className="text-[11px] overflow-hidden">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Photo Selected & Ready</span>
                              <span className="text-neutral-400 font-mono truncate block text-[10px]">{mPhoto.startsWith('data:') ? 'Local Image File Loaded' : mPhoto}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Qualification</label>
                      <input 
                        type="text" 
                        value={mQual}
                        onChange={(e) => setMQual(e.target.value)}
                        placeholder="e.g. M.A. Islamic Studies"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Experience</label>
                      <input 
                        type="text" 
                        value={mExp}
                        onChange={(e) => setMExp(e.target.value)}
                        placeholder="e.g. 18 Years Experience"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={mPhone}
                        onChange={(e) => setMPhone(e.target.value)}
                        placeholder="e.g. +91 98470 12341"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Save size={14} />
                      {editingMuallimId ? 'Update Muallim' : 'Add Muallim Member'}
                    </button>
                    {editingMuallimId && (
                      <button type="button" onClick={() => { setEditingMuallimId(null); setMName(''); setMDesig(''); setMPhoto(''); setMQual(''); setMExp(''); setMPhone(''); }} className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List of Muallims */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {muallims.map((m) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2 text-center">
                        {m.photoUrl && !m.photoUrl.includes('unsplash.com') ? (
                          <img src={m.photoUrl} alt={m.name} className="w-16 h-16 rounded-2xl object-cover mx-auto border border-emerald-500/40" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
                            {m.designation.toLowerCase().includes('swadar') ? (
                              <GraduationCap size={30} className="text-amber-500" />
                            ) : (
                              <User size={28} className="text-emerald-500" />
                            )}
                          </div>
                        )}
                        <div>
                          <h5 className="font-extrabold text-sm text-neutral-900 dark:text-white">{m.name}</h5>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">{m.designation}</span>
                          <span className="text-[10px] text-neutral-400 block">{m.qualification}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <button 
                          onClick={() => {
                            setEditingMuallimId(m.id);
                            setMName(m.name);
                            setMDesig(m.designation);
                            setMPhoto(m.photoUrl);
                            setMQual(m.qualification);
                            setMExp(m.experience);
                            setMPhone(m.phone || '');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-100"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteMuallim(m.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center hover:bg-rose-100"
                          title="Delete Muallim"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Members Block */}
              <div className="premium-card p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="text-amber-500" size={24} />
                      Executive Committee Editor ({committee.length} Members)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage Madrassa President, General Secretary, Treasurer, and Executive Board</p>
                  </div>
                </div>

                {/* Form to Add / Edit Committee Member */}
                <form onSubmit={handleSaveCommittee} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4" id="committee-editor-form">
                  <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                    {editingCommId ? 'Edit Committee Member' : 'Add New Committee Member'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        placeholder="e.g. K. M. Koya Master"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Designation</label>
                      <input 
                        type="text" 
                        value={cDesig}
                        onChange={(e) => setCDesig(e.target.value)}
                        placeholder="e.g. Madrassa President"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Photo Image (URL or Device Upload)</label>
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={cPhoto}
                          onChange={(e) => setCPhoto(e.target.value)}
                          placeholder="https://... or upload photo from device"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                        />
                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-bold text-[11px] cursor-pointer hover:bg-amber-100 transition-colors">
                          <Upload size={13} />
                          <span>Choose Photo File from Device</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUploadForCommittee} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={cPhone}
                        onChange={(e) => setCPhone(e.target.value)}
                        placeholder="e.g. +91 98471 00001"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Save size={14} />
                      {editingCommId ? 'Update Member' : 'Add Member'}
                    </button>
                    {editingCommId && (
                      <button type="button" onClick={() => { setEditingCommId(null); setCName(''); setCDesig(''); setCPhoto(''); setCPhone(''); }} className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs cursor-pointer">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List of Committee Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {committee.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2 text-center">
                        <img src={c.photoUrl} alt={c.name} className="w-16 h-16 rounded-2xl object-cover mx-auto border border-amber-500/40" />
                        <div>
                          <h5 className="font-extrabold text-sm text-neutral-900 dark:text-white">{c.name}</h5>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">{c.designation}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <button 
                          onClick={() => {
                            setEditingCommId(c.id);
                            setCName(c.name);
                            setCDesig(c.designation);
                            setCPhoto(c.photoUrl);
                            setCPhone(c.phone || '');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-100"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCommittee(c.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center hover:bg-rose-100"
                          title="Delete Member"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Analytics Bento Grid */}
          {activeTab === 'Analytics' && (
            <div className="space-y-6 animate-fade-in" id="admin-panel-analytics">
              {/* Bento cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="analytics-grid">
                {[
                  { label: 'Total Registrations', val: users.filter(u => u.role === 'student').reduce((sum, s) => sum + s.registeredProgrammeIds.length, 0), desc: 'Enrolled Competition Slots', icon: <Users className="text-cyan-600 dark:text-cyan-400" size={18} /> },
                  { label: 'Completed Programmes', val: `${programmes.filter(p => p.status === 'Completed').length} / ${programmes.length}`, desc: 'Scoresheet completions', icon: <Award className="text-amber-500 animate-pulse" size={18} /> },
                  { label: 'Unresolved Appeals', val: appeals.filter(a => a.status !== 'Completed').length, desc: 'Awaiting coordination review', icon: <ShieldAlert className="text-rose-600 dark:text-rose-400" size={18} /> },
                  { label: 'Feedback Average', val: `${(feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)} / 5`, desc: `Based on ${feedback.length} submissions`, icon: <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={18} /> },
                ].map((card, cIdx) => (
                  <div key={cIdx} className="rounded-2xl premium-card p-4 sm:p-5 shadow-xs space-y-2 flex flex-col justify-between border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 font-extrabold">{card.label}</span>
                      {card.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-black font-mono text-neutral-900 dark:text-white leading-none">
                        {card.val}
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-1">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid split: Live scoring compliance & Quick notices manager */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="overview-compliance-grid">
                {/* Scoring compliance status list */}
                <div className="rounded-2xl premium-card p-4 sm:p-6 shadow-xs space-y-4 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <h3 className="font-display font-extrabold text-base text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <BarChart2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Jury Scoring & Publishing Matrix
                  </h3>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {programmes.map((p) => {
                      const isPublished = p.resultPublished;
                      
                      return (
                        <div 
                          key={p.id}
                          className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 block">{p.code}</span>
                            <span className="font-bold text-neutral-900 dark:text-white">{p.title}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPublished ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-black border border-emerald-300 dark:border-emerald-700">
                                Published
                              </span>
                            ) : p.status === 'Completed' ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-black border border-amber-300 dark:border-amber-700">
                                Evaluation Pending Approval
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-mono font-bold border border-neutral-300 dark:border-neutral-700">
                                Scheduled
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated backups quick tools card */}
                <div className="rounded-2xl premium-card p-4 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900" id="quick-backups-panel">
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-base text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Database size={18} className="text-indigo-600 dark:text-indigo-400" />
                      Dynamic Database Backups
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-semibold">
                      ArtsPortal utilizes client-side memory mirroring synced with an optional SQL container. You can trigger rolling backups or perform state recovery on demand.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3" id="quick-backup-buttons">
                    <button
                      onClick={handleBackup}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-extrabold flex flex-col items-center gap-2 text-neutral-900 dark:text-white transition-all cursor-pointer shadow-xs"
                    >
                      <Database size={20} className="text-indigo-600 dark:text-indigo-400" />
                      Create Backup
                    </button>
                    <button
                      onClick={handleRestore}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-extrabold flex flex-col items-center gap-2 text-neutral-900 dark:text-white transition-all cursor-pointer shadow-xs"
                    >
                      <RefreshCw size={20} className="text-emerald-600 dark:text-emerald-400" />
                      Rollback State
                    </button>
                  </div>

                  <div className="text-[10px] text-neutral-700 dark:text-neutral-300 text-center font-mono font-black uppercase bg-neutral-100 dark:bg-neutral-800/80 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    Backup State: 100% HEALTHY • 0 penalties
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Programmes CRUD Management */}
          {activeTab === 'Programmes' && (
            <div className="space-y-4 animate-fade-in" id="admin-programmes-crud">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center premium-card p-3 rounded-xl shadow-xs gap-3" id="crud-controls-bar">
                <div className="flex flex-wrap gap-2">
                  {['All', 'Sub Junior', 'Junior', 'Senior', 'Super Senior', 'General'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAdminProgrammeCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${adminProgrammeCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                  
                <button 
                  onClick={triggerAddProg}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <PlusCircle size={14} /> Add Programme
                </button>
              </div>

              {/* Programme Form (Add / Edit Modal overlay) */}
              {showProgForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="programme-form-modal">
                  <div className="bg-white/95 dark:bg-white/5/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full border border-white/20 dark:border-neutral-850 shadow-2xl overflow-hidden relative my-4 sm:my-8 animate-scale-up">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-3 sm:p-4 text-white flex items-center justify-between">
                      <h3 className="font-display font-bold text-base">
                        {editingProgId ? 'Configure Programme Settings' : 'Add New Competition'}
                      </h3>
                      <button 
                        onClick={() => setShowProgForm(false)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 text-sm font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleProgFormSubmit} className="p-4 sm:p-5 space-y-3 text-xs text-neutral-800 dark:text-neutral-100 max-h-[75vh] overflow-y-auto hide-scrollbar">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Programme Code</label>
                          <input 
                            type="text" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Competition Title</label>
                          <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Clay Modeling"
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Category</label>
                          <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                          >
                            <option value="A">A (High)</option>
                            <option value="B">B (Std)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Section</label>
                          <select 
                            value={section} 
                            onChange={(e) => setSection(e.target.value as any)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                          >
                            <option value="Stage">Stage</option>
                            <option value="Off-Stage">Off-Stage</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Participation</label>
                          <select 
                            value={type} 
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                          >
                            <option value="Individual">Individual</option>
                            <option value="Group">Group</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-600 dark:text-neutral-300 block mb-1 text-xs">Eligibility Category Group</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['All', 'Sub Junior', 'Junior', 'Senior', 'Super Senior', 'General'].map(opt => {
                              const isSelected = Array.isArray(categoryGroup) ? categoryGroup.includes(opt) : categoryGroup === opt;
                              return (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() => {
                                    let newSelection = Array.isArray(categoryGroup) ? [...categoryGroup] : [categoryGroup];
                                    if (isSelected) {
                                      newSelection = newSelection.filter(item => item !== opt);
                                    } else {
                                      if (opt === 'All') {
                                        newSelection = ['All'];
                                      } else {
                                        newSelection = newSelection.filter(item => item !== 'All');
                                        newSelection.push(opt);
                                      }
                                    }
                                    if (newSelection.length === 0) newSelection = ['All'];
                                    setCategoryGroup(newSelection as any);
                                  }}
                                  className={`relative flex items-center justify-between p-1.5 sm:p-2 rounded-lg border-2 text-[10px] sm:text-xs font-semibold transition-all group ${
                                    isSelected
                                      ? 'bg-indigo-50/80 border-indigo-500 text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:border-indigo-500 dark:text-indigo-300'
                                      : 'bg-white/60 border-transparent text-neutral-600 hover:bg-white hover:border-indigo-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:border-neutral-600'
                                  }`}
                                >
                                  <span>{opt === 'All' ? 'All Participants' : opt}</span>
                                  {isSelected && (
                                    <div className="flex-shrink-0 ml-2">
                                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={3} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Assigned Venue</label>
                          <input 
                            type="text" 
                            value={venue} 
                            onChange={(e) => setVenue(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5">Date & Timing</label>
                          <input 
                            type="datetime-local" 
                            value={datetime} 
                            onChange={(e) => setDatetime(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden">Max Part.</label>
                          <input 
                            type="number" 
                            value={maxParticipants} 
                            onChange={(e) => setMaxParticipants(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Max allowed per house team"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden">Min Part.</label>
                          <input 
                            type="number" 
                            value={minParticipants} 
                            onChange={(e) => setMinParticipants(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Min required per house team"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-400 block mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden">Deadline</label>
                          <input 
                            type="datetime-local" 
                            value={deadline} 
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                      </div>

                      {/* Appointed jury members selection */}
                      <div>
                        <label className="font-semibold text-neutral-400 block mb-0.5">Appointed Juror Panel</label>
                        <div className="grid grid-cols-3 gap-2">
                          {users.filter(u => u.role === 'judge').map(judge => {
                            const active = selectedJudges.includes(judge.id);
                            return (
                              <button
                                type="button"
                                key={judge.id}
                                onClick={() => {
                                  if (active) {
                                    setSelectedJudges(selectedJudges.filter(id => id !== judge.id));
                                  } else {
                                    setSelectedJudges([...selectedJudges, judge.id]);
                                  }
                                }}
                                className={`p-1.5 sm:p-2 rounded-lg border text-left transition-colors truncate font-semibold text-[10px] cursor-pointer ${
                                  active 
                                    ? 'bg-indigo-50 dark:bg-indigo-950/45 border-indigo-300 text-indigo-700 dark:text-indigo-300' 
                                    : 'border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 text-neutral-700 dark:text-neutral-200'
                                }`}
                              >
                                {judge.name.split(' ').slice(1).join(' ')}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-400 block mb-0.5">Official Rules Description</label>
                        <textarea 
                          rows={3}
                          value={rules} 
                          onChange={(e) => setRules(e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowProgForm(false)}
                          className="px-4 py-2 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 text-neutral-700 dark:text-neutral-200 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-semibold cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Administrative programmes inventory table */}
              <div className="rounded-2xl premium-card shadow-xs overflow-x-auto" id="crud-table-wrapper">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/20 dark:border-white/10 text-neutral-400 font-mono">
                      <th className="py-3.5 px-4">Code / event</th>
                      <th className="py-3.5 px-2">Type / category</th>
                      <th className="py-3.5 px-2">Scheduled Venue</th>
                      <th className="py-3.5 px-2">Scoring Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programmes
                      .filter((p) => {
                        if (adminProgrammeCategory === 'All') return true;
                        if (!p.categoryGroup) return false;
                        if (Array.isArray(p.categoryGroup)) {
                          return p.categoryGroup.includes(adminProgrammeCategory);
                        }
                        return p.categoryGroup === adminProgrammeCategory;
                      })
                      .map((p) => (
                      <tr 
                        key={p.id}
                        className="border-b border-white/10 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/10"
                      >
                        <td className="py-4 px-4">
                          <div className="font-bold text-indigo-600 dark:text-indigo-400">{p.code}</div>
                          <div className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">{p.title}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div>
                            {p.section} • Cat {p.category}
                            {p.categoryGroup && (
                              <span className="ml-2 px-1.5 py-0.25 rounded text-[8px] font-mono font-bold uppercase bg-neutral-500/10 text-neutral-600 dark:text-neutral-300">
                                {Array.isArray(p.categoryGroup) ? p.categoryGroup.join(', ') : p.categoryGroup}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">{p.type}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-semibold">{p.venue.split('(')[0]}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{new Date(p.datetime).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-2">
                          {p.resultPublished ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-150 text-emerald-800 dark:text-emerald-300 text-[9px] font-mono font-bold">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-300 text-[9px] font-mono">
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => triggerEditProg(p)}
                              className="p-1.5 rounded bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 hover:bg-white/30 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                              title="Edit event"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDuplicateProg(p)}
                              className="p-1.5 rounded bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 hover:bg-white/30 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                              title="Duplicate event"
                            >
                              <Copy size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProg(p.id)}
                              className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/20 cursor-pointer"
                              title="Delete event"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Appeals & Resolutions review board */}
          {activeTab === 'Appeals' && (
            <div className="space-y-4 animate-fade-in" id="admin-appeals-center">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Appeals list ledger */}
                <div className="lg:col-span-3 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4 h-fit">
                  <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Pending Appeals Pipeline</h3>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1" id="admin-appeals-list">
                    {appeals.map((app) => (
                      <div 
                        key={app.id}
                        onClick={() => {
                          setSelectedAppealId(app.id);
                          setAppealResolutionText(app.adminNotes || '');
                          setAppealStatusUpdate(app.status);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAppealId === app.id 
                            ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950/10' 
                            : 'bg-white/20 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/35'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">{app.id}</span>
                            <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-100 mt-0.5">{app.programmeTitle}</h4>
                            <span className="text-[10px] text-neutral-400 block">Submitted by {app.studentName} ({app.teamId})</span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                            app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-neutral-500 mt-2 line-clamp-1">&ldquo;{app.reason}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Appeal Resolution sheet */}
                <div className="lg:col-span-2 space-y-4" id="appeal-resolution-sheet">
                  {selectedAppealId ? (
                    <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                      <div className="border-b border-white/20 dark:border-white/10 pb-3">
                        <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">Committee review desk</span>
                        <h4 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 mt-0.5">
                          Resolve Case {selectedAppealId}
                        </h4>
                      </div>

                      <div className="text-xs text-neutral-500 space-y-2">
                        <div>
                          <span className="text-neutral-400 block font-bold uppercase text-[9px]">Grievant statement</span>
                          <p className="text-neutral-700 dark:text-neutral-200 italic bg-white/20 dark:bg-white/5 p-3 rounded-lg border border-white/20 dark:border-white/10">
                            &ldquo;{appeals.find(a => a.id === selectedAppealId)?.reason}&rdquo;
                          </p>
                        </div>

                        <div>
                          <span className="text-neutral-400 block font-bold uppercase text-[9px]">Video/Documents Verification</span>
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold block mt-0.5">
                            📎 {appeals.find(a => a.id === selectedAppealId)?.attachedDoc || 'No file attached'}
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleResolveAppeal} className="space-y-4 pt-2 text-xs">
                        <div className="space-y-1">
                          <label className="font-semibold text-neutral-400 block">Status Decision</label>
                          <select
                            value={appealStatusUpdate}
                            onChange={(e) => setAppealStatusUpdate(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                          >
                            <option value="Submitted">Submitted (Initial)</option>
                            <option value="Under Review">Under Review (Committee Review)</option>
                            <option value="Accepted">Accepted (Recalculate Standings)</option>
                            <option value="Rejected">Rejected (Unchanged Scores)</option>
                            <option value="Completed">Completed (Final Resolution Locked)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-neutral-400 block">Administrative Note / Resolution Details</label>
                          <textarea
                            rows={4}
                            value={appealResolutionText}
                            onChange={(e) => setAppealResolutionText(e.target.value)}
                            placeholder="Write down the decision outcomes clearly for the student..."
                            className="w-full px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-850 dark:text-neutral-100 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all cursor-pointer"
                        >
                          Save Committee Resolution
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="rounded-2xl premium-card p-12 text-center text-neutral-400 space-y-3 shadow-xs flex flex-col items-center justify-center h-full">
                      <Sliders size={36} className="text-indigo-500 animate-pulse" />
                      <div>
                        <h4 className="font-display font-bold text-neutral-800 dark:text-neutral-100">No appeal selected</h4>
                        <p className="text-[10px] text-neutral-450 max-w-xs mx-auto mt-0.5">
                          Select any participant appeal from the left list block to resolve the case.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: CMS Content Editor */}
          {activeTab === 'CMS' && (
            <div className="space-y-4 animate-fade-in" id="admin-cms-desk">
              <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Code-free CMS Engine</h3>
                  <p className="text-xs text-neutral-400">Instantly update homepage text, theme headers, logo, contact credentials, and FAQs lists.</p>
                </div>

                <form onSubmit={handleCmsSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-800 dark:text-neutral-100">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-400 block">Festival Theme Heading</label>
                      <input 
                        type="text" 
                        value={cmsHeroTitle} 
                        onChange={(e) => setCmsHeroTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-400 block">Hero Banner Image URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={cmsHeroBanner} 
                          onChange={(e) => setCmsHeroBanner(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://..."
                        />
                        <label className="cursor-pointer bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center transition-colors whitespace-nowrap">
                          <span>Upload</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCmsHeroBanner(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-400 block">About Festival Paragraph</label>
                      <textarea 
                        rows={4}
                        value={cmsAboutText} 
                        onChange={(e) => setCmsAboutText(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-400 block">Coordinator Contact Email</label>
                      <input 
                        type="email" 
                        value={cmsContactEmail} 
                        onChange={(e) => setCmsContactEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-400 block">Coordinator Contact Phone</label>
                      <input 
                        type="text" 
                        value={cmsContactPhone} 
                        onChange={(e) => setCmsContactPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 space-y-1">
                      <h4 className="font-bold text-[10px] text-neutral-400 uppercase">CMS Roster Standings</h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                        CMS modules are deployed dynamically. The standard FAQ roster is linked dynamically inside footer terms. All modifications reflect in 0ms on visitors dashboard.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all mt-6 shadow-sm cursor-pointer"
                    >
                      Publish CMS Content Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: Feedback Inspector */}
          {activeTab === 'Feedback' && (
            <div className="space-y-4 animate-fade-in" id="admin-feedback-inspector">
              <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Student & Visitor Review Registry</h3>
                  <p className="text-xs text-neutral-400">Perform analytical inspection on submitted user reviews.</p>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {feedback.map((feed) => (
                    <div 
                      key={feed.id}
                      className="p-3.5 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 flex justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                          {feed.isAnonymous ? 'Anonymous Contributor' : feed.name || 'Visitor'}
                        </div>
                        <p className="text-neutral-500 mt-1">&ldquo;{feed.comments}&rdquo;</p>
                        <span className="text-[9px] font-mono text-neutral-400 block mt-1">Category: {feed.category}</span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold font-mono text-amber-500">{feed.rating} ★</span>
                        <span className="text-[9px] font-mono text-neutral-400 block mt-1">{new Date(feed.datetime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Reviews & Ratings Management */}
          {activeTab === 'ReviewsManagement' && (
            <div className="space-y-6 animate-fade-in" id="admin-reviews-management">
              <div className="rounded-3xl premium-card p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                      <Star className="text-amber-500" size={24} fill="currentColor" />
                      Reviews & Ratings Control Desk
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                      Moderate, approve, reject, or feature community reviews on the public homepage.
                    </p>
                  </div>

                  {/* Summary Counters */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 font-extrabold border border-amber-500/20">
                      Pending: {reviews.filter(r => r.status === 'Pending').length}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-extrabold border border-emerald-500/20">
                      Approved: {reviews.filter(r => r.status === 'Approved').length}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 font-extrabold border border-purple-500/20">
                      Featured: {reviews.filter(r => r.featured).length}
                    </span>
                  </div>
                </div>

                {/* Filter Sub-Tabs & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Pending', 'Approved', 'Rejected', 'Featured'].map(st => (
                      <button
                        key={st}
                        onClick={() => setReviewStatusFilter(st)}
                        className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                          reviewStatusFilter === st
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {filteredAdminReviews.length > 0 ? (
                    filteredAdminReviews.map(rev => (
                      <div key={rev.id} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center">
                              {rev.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                                {rev.name}
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-bold">
                                  {rev.category}
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {rev.programmeTitle ? `Programme: ${rev.programmeTitle} • ` : ''}Submitted on {new Date(rev.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase ${
                              rev.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                              rev.status === 'Pending' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse' :
                              'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            }`}>
                              {rev.status}
                            </span>
                            {rev.featured && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase flex items-center gap-1">
                                <Sparkles size={10} /> Featured
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rating & Review */}
                        <div className="space-y-1 bg-white dark:bg-neutral-800/60 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
                          <div className="flex text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={13} fill={s <= rev.rating ? 'currentColor' : 'none'} className={s <= rev.rating ? 'text-amber-400' : 'text-neutral-400'} />
                            ))}
                            <span className="text-xs font-mono font-bold text-neutral-500 ml-1">{rev.rating}.0</span>
                          </div>
                          <p className="text-xs text-neutral-700 dark:text-neutral-200 font-medium italic">“{rev.reviewText}”</p>
                        </div>

                        {/* Admin Actions */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                          {rev.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateReviewStatus(rev.id, 'Approved')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={14} /> Approve
                            </button>
                          )}

                          {rev.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateReviewStatus(rev.id, 'Rejected')}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <X size={14} /> Reject
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleFeatureReview(rev.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                              rev.featured ? 'bg-amber-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            <Sparkles size={13} /> {rev.featured ? 'Unfeature' : 'Feature on Home'}
                          </button>

                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-rose-500 hover:bg-rose-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-neutral-400 font-medium text-xs">
                      No reviews found under this status.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB: Privacy & Security */}
          {activeTab === 'PrivacySecurity' && (
            <div className="space-y-6 animate-fade-in" id="admin-privacy-security">
              <UserCredentialsTable users={users} onUpdateUsers={onUpdateUsers} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Admin ID panel */}
                  <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4 h-fit">
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <Lock size={18} className="text-indigo-500" />
                      My Administrator Profile
                    </h3>
                      
                    <form onSubmit={handleAdminCredSave} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 block">System Administrator ID</label>
                        <input 
                          type="text"
                          value={adminCredEmail}
                          onChange={(e) => setAdminCredEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 block">Security Encrypted Pin</label>
                        <input 
                          type="password"
                          value={adminCredPassword}
                          onChange={(e) => setAdminCredPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        Change Credentials
                      </button>
                    </form>
                  </div>

                  {/* Sub Administrators Panel */}
                  <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4 h-fit">
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <Users size={18} className="text-indigo-500" />
                      Sub Administrators
                    </h3>
                    
                    <div className="space-y-3">
                      {users.filter(u => u.role === 'admin' && u.id !== currentUser?.id).map(subAdmin => (
                        <div key={subAdmin.id} className="p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                              {subAdmin.email}
                            </div>
                            <div className="text-[10px] text-neutral-450 mt-1">
                              Pass: {subAdmin.password}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveSubAdmin(subAdmin.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove Sub Administrator"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {users.filter(u => u.role === 'admin' && u.id !== currentUser?.id).length === 0 && (
                        <div className="text-xs text-neutral-500 italic p-2 text-center">No sub-administrators configured</div>
                      )}
                    </div>

                    <form onSubmit={handleAddSubAdmin} className="mt-4 pt-4 border-t border-white/20 dark:border-white/10 space-y-3 text-xs">
                      <h4 className="font-semibold text-neutral-700 dark:text-neutral-200">Add Sub Admin</h4>
                      <input 
                        type="text"
                        placeholder="Admin ID (e.g. subadmin1)"
                        value={newSubAdminEmail}
                        onChange={(e) => setNewSubAdminEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                        required
                      />
                      <input 
                        type="password"
                        placeholder="Password/Pin"
                        value={newSubAdminPassword}
                        onChange={(e) => setNewSubAdminPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        Create Account
                      </button>
                    </form>
                  </div>
                </div>

                {/* Logged Devices panel */}
                <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4 h-fit">
                  <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                    <Shield size={18} className="text-indigo-500" />
                    Logged Devices
                  </h3>
                  
                  <form onSubmit={handleSecuritySave} className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5">
                      <div>
                        <span className="font-semibold block text-neutral-700 dark:text-neutral-200">Restrict Devices</span>
                        <span className="text-[9px] text-neutral-450">Only allow trusted IP subnets and designated devices</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={secRestrictDevices}
                        onChange={(e) => setSecRestrictDevices(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    {secRestrictDevices && (
                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 block">Trusted Access Coordinates (IP/Locations)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 192.168.1.*, New York Data Center"
                          value={secTrustedLocations}
                          onChange={(e) => setSecTrustedLocations(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none placeholder:text-neutral-500"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-sm cursor-pointer"
                    >
                      Update Access Control
                    </button>
                  </form>

                  <div className="space-y-2 mt-4 pt-4 border-t border-white/20 dark:border-white/10">
                    <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Active Sessions</h4>
                    {activeDevices.map(device => (
                      <div key={device.id} className="p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                            {device.name}
                            {device.current && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-indigo-500 text-white">Current</span>}
                          </div>
                          <div className="text-[9px] text-neutral-450 flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-0.5"><MapPin size={8} /> {device.location}</span>
                            <span className="flex items-center gap-0.5"><Globe size={8} /> {device.ip}</span>
                          </div>
                        </div>
                        {!device.current && (
                          <button 
                            onClick={() => handleRevokeDevice(device.id)}
                            className="text-[9px] font-bold px-2 py-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-md transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: Security Telemetry, Logs & backups */}
          {activeTab === 'Security' && (
            <div className="space-y-6 animate-fade-in" id="admin-security-logs">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                  {/* Advanced security settings panel */}
                  <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4 h-fit">
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <Shield size={18} className="text-indigo-500" />
                      Security Enforcement
                    </h3>

                    <form onSubmit={handleSecuritySave} className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5">
                        <div>
                          <span className="font-semibold block text-neutral-700 dark:text-neutral-200">Enforce Mock 2FA</span>
                          <span className="text-[9px] text-neutral-450">Require digital email pin verification</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={sec2FA}
                          onChange={(e) => setSec2FA(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 block">Session Timeout Limit (Minutes)</label>
                        <input 
                          type="number"
                          value={secTimeout}
                          onChange={(e) => setSecTimeout(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 block">Rate-Limit Lockout (Failed Attempts)</label>
                        <input 
                          type="number"
                          value={secLimit}
                          onChange={(e) => setSecLimit(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        Update Compliance Levels
                      </button>
                    </form>
                  </div>
                </div>

                {/* Secure telemetry logs */}
                <div className="lg:col-span-3 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <AppWindow size={18} className="text-indigo-500" />
                      Live Device Telemetry Logs
                    </h3>
                    <span className="text-[9px] font-mono text-green-500 uppercase font-bold animate-pulse">
                      ● active monitors
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1" id="telemetry-logs-list">
                    {auditLogs.map((log) => (
                      <div 
                        key={log.id}
                        className="p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 space-y-2 text-[10px]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-neutral-800 dark:text-neutral-100 text-xs block">{log.action}</span>
                            <span className="text-neutral-450 font-semibold">{log.user}</span>
                          </div>
                          <span className="font-mono text-neutral-450">{log.timestamp.split('T')[1].split('-')[0]}</span>
                        </div>

                        {/* Device breakdown tags */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[8px] font-mono text-neutral-450 uppercase pt-2 border-t border-white/20 dark:border-white/10">
                          <span className="flex items-center gap-1"><Globe size={8} /> IP: {log.ip}</span>
                          <span className="flex items-center gap-1 line-clamp-1"><AppWindow size={8} className="shrink-0" /> {log.browser.split('(')[0]}</span>
                          <span className="flex items-center gap-1 line-clamp-1"><MapPin size={8} className="shrink-0" /> {log.location.split('(')[0]}</span>
                          <span className="text-green-500">✔ Encrypted</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: Leaders Desk Activity */}
          {activeTab === 'LeadersActivity' && (
            <div className="space-y-6 animate-fade-in" id="admin-leaders-desk">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Team Roster & Desk View */}
                <div className="lg:col-span-3 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <Users size={18} className="text-indigo-500" />
                      Team Roster Directories & Event Sign-ups
                    </h3>
                    <p className="text-xs text-neutral-450">Inspect customized team configurations, active member portfolios, and live event enrollments managed by leaders.</p>
                  </div>

                  {/* Team Grid Selector Tabs */}
                  <div className="grid grid-cols-5 gap-2" id="leader-team-selector">
                    {teams.map((t) => {
                      const teamMembers = users.filter(u => u.role === 'student' && u.teamId === t.id);
                      const isSelected = selectedLeaderTeamId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedLeaderTeamId(t.id)}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between h-20 ${
                            isSelected 
                              ? 'bg-white/20 dark:bg-white/10 shadow-md border-indigo-500/50' 
                              : 'bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 border-white/10 dark:border-white/10'
                          }`}
                        >
                          {/* Top-right color dot */}
                          <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${t.color}`} />
                          
                          <div className="min-w-0 pr-2">
                            <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold font-mono">
                              {t.id.replace('team_', '')}
                            </span>
                            <span className="block font-bold text-[10px] text-neutral-850 dark:text-neutral-100 truncate mt-0.5">
                              {t.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-1 text-[9px] font-mono text-neutral-400">
                            <span>{teamMembers.length} mbrs</span>
                            <span className="font-bold text-indigo-500">{t.points} pts</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Team Detail View */}
                  {(() => {
                    const activeTeamObj = teams.find(t => t.id === selectedLeaderTeamId);
                    if (!activeTeamObj) return null;
                    const activeTeamMembers = users.filter(u => u.role === 'student' && u.teamId === activeTeamObj.id);
                    return (
                      <div className="space-y-4 pt-2">
                        {/* Team Banner */}
                        <div className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeTeamObj.gradient} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                              {activeTeamObj.name[0]}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                                {activeTeamObj.name}
                                <span className={`text-[9px] px-2 py-0.25 rounded-full font-mono ${activeTeamObj.color} text-white font-bold`}>
                                  {activeTeamObj.points} Points
                                </span>
                              </h4>
                              <p className="text-[10px] text-neutral-450 mt-0.5">Customized by designated student leader. Enrolled members are listed below.</p>
                            </div>
                          </div>
                        </div>

                        {/* Roster Table */}
                        <div className="overflow-x-auto rounded-xl border border-white/10 dark:border-white/10">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-white/10 dark:bg-white/5 border-b border-white/20 dark:border-white/10 text-neutral-400 font-mono text-[9px]">
                                <th className="py-2 px-3">Chest No</th>
                                <th className="py-2 px-3">Member Details</th>
                                <th className="py-2 px-3">Group</th>
                                <th className="py-2 px-3">Enrolled Events</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeTeamMembers.length > 0 ? (
                                activeTeamMembers.map((member) => {
                                  const enrolledProgs = programmes.filter(p => (member.registeredProgrammeIds || []).includes(p.id));
                                  return (
                                    <tr 
                                      key={member.id}
                                      className="border-b border-white/10 dark:border-white/10 hover:bg-white/5 dark:hover:bg-white/10"
                                    >
                                      <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                        #{member.chestNo || 'N/A'}
                                      </td>
                                      <td className="py-3 px-3">
                                        <div className="font-semibold text-neutral-800 dark:text-neutral-100">{member.name}</div>
                                        <div className="text-[9px] text-neutral-450 font-mono mt-0.5">{member.rollNo || member.email}</div>
                                      </td>
                                      <td className="py-3 px-3">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-neutral-150 text-neutral-850 dark:bg-white/5/40 dark:text-neutral-200">
                                          {member.categoryGroup || 'N/A'}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                          {enrolledProgs.length > 0 ? (
                                            enrolledProgs.map((prog) => (
                                              <span 
                                                key={prog.id}
                                                className="px-1.5 py-0.5 rounded bg-white/40 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 text-[8px] font-mono font-semibold border border-white/30 dark:border-white/10 hover:bg-indigo-500 hover:text-white transition-colors cursor-help"
                                                title={`${prog.code}: ${prog.title}`}
                                              >
                                                {prog.code}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-[9px] text-neutral-450 italic">None enrolled</span>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan={4} className="py-8 text-center text-neutral-400 italic">
                                    No team members registered. Leaders can add members in the Leaders Portal.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Leader Activity Audit Log List */}
                <div className="lg:col-span-2 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <Clock size={18} className="text-indigo-500" />
                      Leader Actions Trail
                    </h3>
                    <span className="text-[9px] font-mono text-indigo-500 uppercase font-bold animate-pulse">
                      ● Live Audit
                    </span>
                  </div>

                  <p className="text-xs text-neutral-450">Chronological history of all configurations and enrollment modifications executed by student leaders.</p>

                  {/* Log search */}
                  <input 
                    type="text"
                    value={leaderLogSearch}
                    onChange={(e) => setLeaderLogSearch(e.target.value)}
                    placeholder="Search by action or leader name..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none animate-fade-in"
                  />

                  {/* Render filtered leader logs */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1" id="leaders-logs-trail">
                    {(() => {
                      const leaderLogs = auditLogs.filter(log => {
                        const matchesRole = log.user.toLowerCase().includes('leader') || log.user.toLowerCase().includes('student') || log.location.toLowerCase().includes('leaders');
                        const matchesSearch = log.user.toLowerCase().includes(leaderLogSearch.toLowerCase()) || log.action.toLowerCase().includes(leaderLogSearch.toLowerCase());
                        return matchesRole && matchesSearch;
                      });

                      if (leaderLogs.length === 0) {
                        return (
                          <div className="text-center py-12 text-neutral-450 italic text-xs">
                            No matching leader action records found.
                          </div>
                        );
                      }

                      return leaderLogs.map((log) => (
                        <div 
                          key={log.id}
                          className="p-3 rounded-xl border border-white/25 dark:border-white/10 bg-white/30 dark:bg-white/5 space-y-2 text-[10px] hover:border-indigo-500/20 transition-all"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-bold text-neutral-800 dark:text-neutral-150 text-xs block leading-tight">{log.action}</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold block mt-1">{log.user}</span>
                            </div>
                            <span className="font-mono text-neutral-450 shrink-0">{log.timestamp.split('T')[1]?.split('-')[0] || log.timestamp}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[8px] font-mono text-neutral-400 pt-1.5 border-t border-white/20 dark:border-white/10">
                            <span>PORTAL: Leaders</span>
                            <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: Result Publishing */}
          {activeTab === 'ResultPublishing' && (
            <div className="space-y-6 animate-fade-in" id="admin-result-publishing">
              {editingResultProgId ? (
                (() => {
                  const prog = programmes.find(p => p.id === editingResultProgId);
                  if (!prog) return null;
                  
                  // Get students registered/enrolled for this programme (strictly filtered by Category & Gender)
                  const registered = users.filter(u => u.role === 'student' && u.registeredProgrammeIds?.includes(editingResultProgId));
                  const progGroupStr = (prog.categoryGroup || `${prog.categoryLevel || ''} ${prog.category || ''} ${prog.gender || ''}`).toLowerCase();
                  const isGirlsProg = progGroupStr.includes('girls') || (prog.gender && prog.gender.toLowerCase() === 'girls');
                  const isBoysProg = progGroupStr.includes('boys') || (prog.gender && prog.gender.toLowerCase() === 'boys');
                  const targetCat = progGroupStr.includes('sub junior') ? 'Sub Junior' :
                                    progGroupStr.includes('super senior') ? 'Super Senior' :
                                    progGroupStr.includes('junior') ? 'Junior' :
                                    progGroupStr.includes('senior') ? 'Senior' :
                                    progGroupStr.includes('kiddies') ? 'Kiddies' : null;

                  const matchesCatGen = (s: UserProfile) => {
                    const sGender = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
                    if (isGirlsProg && sGender !== 'Girls') return false;
                    if (isBoysProg && sGender !== 'Boys') return false;
                    if (targetCat) {
                      const sCat = s.category || (s.studentClass ? (parseInt(s.studentClass) <= 4 ? 'Sub Junior' : parseInt(s.studentClass) <= 6 ? 'Junior' : parseInt(s.studentClass) <= 8 ? 'Senior' : 'Super Senior') : null);
                      if (sCat && sCat.toLowerCase() !== targetCat.toLowerCase()) return false;
                    }
                    return true;
                  };

                  const filteredCatReg = registered.filter(matchesCatGen);
                  const filteredCatAll = users.filter(u => u.role === 'student' && matchesCatGen(u));
                  const enrolledStudents = filteredCatReg.length > 0 ? filteredCatReg : (filteredCatAll.length > 0 ? filteredCatAll : (registered.length > 0 ? registered : users.filter(u => u.role === 'student')));

                  return (
                    <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-white/20 dark:border-white/10">
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-wider text-indigo-500 font-bold">
                            Direct Results Writer
                          </span>
                          <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">
                            {prog.code} - {prog.title} ({prog.category === 'A' ? 'Category A' : 'Category B'} | {prog.type})
                          </h3>
                        </div>
                        <button 
                          onClick={() => setEditingResultProgId(null)}
                          className="px-3 py-1 bg-white/20 dark:bg-white/10 text-neutral-600 dark:text-neutral-200 rounded-lg text-xs hover:bg-white/30 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="p-3 bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 rounded-xl text-xs flex items-center gap-2 border border-indigo-200/30">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>Publishing rankings from here overrides jury sheet entries and immediately awards points to the respective house teams.</span>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3].map((pos) => {
                          const idx = pos - 1;
                          const currentRank = editedRankings[idx] || {
                            position: pos,
                            participantId: '',
                            participantName: '',
                            teamId: '',
                            teamName: '',
                            grade: 'A',
                            points: 0
                          };

                          return (
                            <div 
                              key={pos}
                              className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 space-y-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                  pos === 1 ? 'bg-amber-500 text-white' : pos === 2 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700 text-white'
                                }`}>
                                  {pos}
                                </span>
                                <span className="font-bold text-xs text-neutral-700 dark:text-neutral-100">
                                  {pos === 1 ? 'First Place' : pos === 2 ? 'Second Place' : 'Third Place'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                {/* Student Selection */}
                                <div className="space-y-1 md:col-span-2">
                                  <label className="text-[10px] text-neutral-400 font-semibold block">Select Registered Participant</label>
                                  <select
                                    value={currentRank.participantId}
                                    onChange={(e) => {
                                      const studentId = e.target.value;
                                      const student = enrolledStudents.find(s => s.id === studentId);
                                      
                                      const newRanks = [...editedRankings];
                                      if (student) {
                                        const t = teams.find(team => team.id === student.teamId);
                                        const config = settings.programScoresConfig || {
                                          categoryA: { individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 }, group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 } },
                                          categoryB: { individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 }, group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 } }
                                        };
                                        const cat = prog.category === 'A' ? config.categoryA : config.categoryB;
                                        const rule = prog.type === 'Individual' ? cat.individual : cat.group;
                                        const defaultPts = pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : rule.thirdPlace;
                                        const defaultGr = (currentRank.grade && currentRank.grade !== 'None') ? currentRank.grade : (pos === 1 ? 'A' : pos === 2 ? 'B' : 'C');

                                        newRanks[idx] = {
                                          ...currentRank,
                                          participantId: student.id,
                                          participantName: student.name,
                                          teamId: student.teamId || '',
                                          teamName: t ? t.name : '',
                                          grade: defaultGr,
                                          points: currentRank.points > 0 ? currentRank.points : defaultPts
                                        };
                                      } else {
                                        newRanks[idx] = {
                                          ...currentRank,
                                          participantId: '',
                                          participantName: '',
                                          teamId: '',
                                          teamName: '',
                                        };
                                      }
                                      setEditedRankings(newRanks);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                                  >
                                    <option value="">-- Choose student (or type manual) --</option>
                                    {currentRank.participantId && !enrolledStudents.some(s => s.id === currentRank.participantId) && (
                                      <option value={currentRank.participantId}>
                                        {currentRank.participantName || 'Selected Participant'} ({currentRank.teamName || teams.find(t => t.id === currentRank.teamId)?.name || 'House Team'})
                                      </option>
                                    )}
                                    {enrolledStudents.map(s => (
                                      <option key={s.id} value={s.id}>
                                        #{s.chestNo || 'No Chest'} - {s.name} ({teams.find(t => t.id === s.teamId)?.name || 'No House'})
                                      </option>
                                    ))}
                                  </select>

                                  {/* Manual Text Fields if Student list is empty or manual entry needed */}
                                  <div className="flex gap-2 mt-2">
                                    <input 
                                      type="text"
                                      placeholder="Or enter participant name manually..."
                                      value={currentRank.participantName}
                                      onChange={(e) => {
                                        const newRanks = [...editedRankings];
                                        newRanks[idx] = {
                                          ...currentRank,
                                          participantName: e.target.value,
                                          participantId: currentRank.participantId || `manual_${Date.now()}`
                                        };
                                        setEditedRankings(newRanks);
                                      }}
                                      className="w-full px-2.5 py-1 rounded bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[11px] text-neutral-800 dark:text-neutral-100 focus:outline-none"
                                    />
                                    <select
                                      value={currentRank.teamId}
                                      onChange={(e) => {
                                        const tId = e.target.value;
                                        const t = teams.find(team => team.id === tId);
                                        const newRanks = [...editedRankings];
                                        newRanks[idx] = {
                                          ...currentRank,
                                          teamId: tId,
                                          teamName: t ? t.name : ''
                                        };
                                        setEditedRankings(newRanks);
                                      }}
                                      className="px-2 py-1 rounded bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[11px] text-neutral-800 dark:text-neutral-100 focus:outline-none"
                                    >
                                      <option value="">Select House Team</option>
                                      {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Grade Selection */}
                                <div className="space-y-1">
                                  <label className="text-[10px] text-neutral-400 font-semibold block">Performance Grade</label>
                                  <select
                                    value={currentRank.grade}
                                    onChange={(e) => {
                                      const grade = e.target.value as 'A' | 'B' | 'C' | 'None';
                                      const newRanks = [...editedRankings];
                                      
                                      // Get default points
                                      let pts = 0;
                                      if (grade !== 'None') {
                                        const config = settings.programScoresConfig || {
                                          categoryA: { individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 }, group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 } },
                                          categoryB: { individual: { firstPlace: 10, secondPlace: 8, thirdPlace: 5 }, group: { firstPlace: 15, secondPlace: 10, thirdPlace: 6 } }
                                        };
                                        const cat = prog.category === 'A' ? config.categoryA : config.categoryB;
                                        const rule = prog.type === 'Individual' ? cat.individual : cat.group;
                                        pts = pos === 1 ? rule.firstPlace : pos === 2 ? rule.secondPlace : rule.thirdPlace;
                                      }

                                      newRanks[idx] = {
                                        ...currentRank,
                                        grade,
                                        points: pts
                                      };
                                      setEditedRankings(newRanks);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                                  >
                                    <option value="A">Grade A</option>
                                    <option value="B">Grade B</option>
                                    <option value="C">Grade C</option>
                                    <option value="None">No Grade</option>
                                  </select>
                                </div>

                                {/* Custom Points Override */}
                                <div className="space-y-1">
                                  <label className="text-[10px] text-neutral-400 font-semibold block">Points Awarded</label>
                                  <input 
                                    type="number"
                                    value={currentRank.points}
                                    onChange={(e) => {
                                      const newRanks = [...editedRankings];
                                      newRanks[idx] = {
                                        ...currentRank,
                                        points: Number(e.target.value)
                                      };
                                      setEditedRankings(newRanks);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-end gap-2.5 pt-3">
                        <button
                          onClick={() => setEditingResultProgId(null)}
                          className="px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-neutral-600 dark:text-neutral-200 hover:bg-white/30 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveRankingsDirectly(false)}
                          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                          title="Save draft edits without publishing to live scoreboard"
                        >
                          <Save size={14} />
                          Save as Draft (Recalled)
                        </button>
                        <button
                          onClick={() => handleSaveRankingsDirectly(true)}
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check size={14} />
                          Save & Publish Official Results
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* PROGRAMMES RESULTS LIST (ALL PROGRAMMES VISIBLE) */
                <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                        <Award size={18} className="text-indigo-500" />
                        Result Publishing Center
                      </h3>
                      <p className="text-xs text-neutral-450">
                        View all active programmes, publish official jury rankings directly, or manage security locks on results.
                      </p>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <input 
                      type="text"
                      value={resultPublishSearch}
                      onChange={(e) => setResultPublishSearch(e.target.value)}
                      placeholder="Search programme by code or title..."
                      className="w-full sm:max-w-md px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-250 focus:outline-none"
                    />

                    {results.length > 0 && (
                      <button
                        onClick={handleClearAllResults}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Remove All Results ({results.length})
                      </button>
                    )}
                  </div>

                  {/* Programmes Grid Table */}
                  <div className="overflow-x-auto rounded-xl border border-white/10 dark:border-white/10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/20 dark:bg-white/10 text-neutral-500 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10 dark:border-white/10">
                          <th className="py-3 px-3">Programme</th>
                          <th className="py-3 px-3">Specs</th>
                          <th className="py-3 px-3">Venue & Schedule</th>
                          <th className="py-3 px-3">Result Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 dark:divide-white/5">
                        {(() => {
                          const filtered = programmes.filter(p => 
                            p.title.toLowerCase().includes(resultPublishSearch.toLowerCase()) || 
                            p.code.toLowerCase().includes(resultPublishSearch.toLowerCase())
                          );

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-neutral-450 italic">
                                  No programmes found matching search criteria.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((prog) => {
                            const res = results.find(r => r.programmeId === prog.id);
                            const isLocked = res?.locked;

                            return (
                              <tr 
                                key={prog.id}
                                className="hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                              >
                                <td className="py-3 px-3">
                                  <div className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                                    {prog.code}
                                  </div>
                                  <div className="font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">
                                    {prog.title}
                                  </div>
                                </td>
                                <td className="py-3 px-3 space-y-1">
                                  <div className="flex gap-1.5 flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded bg-white/45 dark:bg-white/10 text-[9px] font-mono font-bold text-neutral-700 dark:text-neutral-200 border border-white/30 dark:border-white/10">
                                      {prog.category === 'A' ? 'Cat A' : 'Cat B'}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/45 dark:bg-white/10 text-[9px] font-mono font-bold text-neutral-700 dark:text-neutral-200 border border-white/30 dark:border-white/10">
                                      {prog.type}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/45 dark:bg-white/10 text-[9px] font-mono font-bold text-neutral-700 dark:text-neutral-200 border border-white/30 dark:border-white/10">
                                      {prog.section}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-neutral-500 dark:text-neutral-300">
                                  <div className="font-semibold">{prog.venue}</div>
                                  <div className="text-[10px] mt-0.5">{prog.datetime}</div>
                                </td>
                                <td className="py-3 px-3">
                                  {res ? (
                                    prog.resultPublished ? (
                                      <div className="space-y-1">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] uppercase border border-emerald-500/20">
                                          <Check size={10} />
                                          Published
                                        </span>
                                        <div className="text-[9px] text-neutral-450 flex items-center gap-1 font-mono">
                                          {isLocked ? (
                                            <span className="text-rose-500 flex items-center gap-0.5 font-semibold"><Lock size={8} /> locked</span>
                                          ) : (
                                            <span className="text-amber-500 flex items-center gap-0.5 font-semibold"><Unlock size={8} /> editable</span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[9px] uppercase border border-amber-500/30">
                                          <RotateCcw size={10} />
                                          Recalled / Draft
                                        </span>
                                        <div className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold font-mono">
                                          Withdrawn from public view
                                        </div>
                                      </div>
                                    )
                                  ) : (() => {
                                    let submittedRanks: any[] | null = null;
                                    const juryEval = evaluations.find(ev => (ev.id === `jury_submitted_${prog.id}` || ev.programmeId === prog.id) && ev.rankings && Array.isArray(ev.rankings));
                                    if (juryEval && juryEval.rankings) {
                                      submittedRanks = juryEval.rankings;
                                    }

                                    const progEvals = evaluations.filter(ev => ev.programmeId === prog.id && !ev.id?.startsWith('jury_submitted_'));
                                    const isJuryHandedOver = (submittedRanks && submittedRanks.length > 0) || progEvals.length > 0 || prog.locked === true || prog.status === 'Evaluating' || evaluations.some(ev => ev.programmeId === prog.id);

                                    if (isJuryHandedOver) {
                                      const topWinner = (submittedRanks && submittedRanks.find((r: any) => r.position === 1)) || null;
                                      const topEval = progEvals.length > 0 ? [...progEvals].sort((a, b) => b.totalScore - a.totalScore)[0] : null;
                                      const topStudent = topEval ? users.find(u => u.id === topEval.participantId) : null;
                                      const winnerName = topWinner?.participantName || topStudent?.name || topEval?.participantName || 'Handed Over to Admin';

                                      return (
                                        <div className="space-y-1">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold text-[9px] uppercase border border-purple-500/30 animate-pulse">
                                            ⏳ Pending Admin Review
                                          </span>
                                          <div className="text-[9px] text-purple-600 dark:text-purple-400 font-bold">
                                            Jury 1st: {winnerName}
                                          </div>
                                        </div>
                                      );
                                    }

                                    return (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-[9px] uppercase border border-amber-500/20">
                                        No Results
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex justify-end items-center gap-1.5">
                                    {res && (
                                      <>
                                        <button
                                          onClick={() => handleDeleteResultEntry(prog.id)}
                                          className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer"
                                          title="Remove Result Entry"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                        {prog.resultPublished && (
                                          <button
                                            onClick={() => handleRecallResult(prog.id)}
                                            className="px-2 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-all cursor-pointer text-[11px] font-semibold flex items-center gap-1"
                                            title="Recall published result back to draft/review mode"
                                          >
                                            <RotateCcw size={12} />
                                            Recall
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleToggleResultLock(prog.id)}
                                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                            isLocked 
                                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border-rose-500/20' 
                                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/20'
                                          }`}
                                          title={isLocked ? "Unlock Results" : "Lock & Publish Results"}
                                        >
                                          {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                                        </button>
                                      </>
                                    )}
                                    {(() => {
                                      const isSubmitted = prog.locked === true || prog.status === 'Evaluating' || evaluations.some(ev => ev.programmeId === prog.id);
                                      const isRecalled = res && !prog.resultPublished;
                                      return (
                                        <button
                                          onClick={() => handleOpenEditRankings(prog.id, res)}
                                          className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-[11px] text-white shadow-xs ${
                                            res && prog.resultPublished
                                              ? 'bg-indigo-600 hover:bg-indigo-500' 
                                              : isRecalled
                                                ? 'bg-amber-600 hover:bg-amber-500'
                                                : isSubmitted
                                                  ? 'bg-purple-600 hover:bg-purple-500 animate-pulse'
                                                  : 'bg-indigo-600 hover:bg-indigo-500'
                                          }`}
                                        >
                                          {res && prog.resultPublished ? 'Edit Results' : isRecalled ? 'Edit & Re-Publish' : isSubmitted ? 'Review, Edit & Publish' : 'Direct Publish'}
                                        </button>
                                      );
                                    })()}
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Scoring Point Rules Configuration */}
          {activeTab === 'ScoringConfig' && (
            <div className="space-y-6 animate-fade-in" id="admin-scoring-config">
              <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                    <Sliders size={18} className="text-indigo-500" />
                    House Team Point Scoring Rules
                  </h3>
                  <p className="text-xs text-neutral-450">
                    Configure the exact championship points allocated to 1st, 2nd, and 3rd place winners across student categories.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-800 dark:text-neutral-100">
                  {/* Category A Scoring */}
                  <div className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 space-y-4">
                    <h4 className="font-bold text-indigo-500 text-xs uppercase tracking-wider">Category A Scoring Rules</h4>
                    
                    <div className="space-y-3">
                      <div className="font-semibold text-neutral-400 block border-b border-white/10 pb-1">Individual Events</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">1st Place</label>
                          <input type="number" value={scoreAInd1} onChange={(e) => setScoreAInd1(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">2nd Place</label>
                          <input type="number" value={scoreAInd2} onChange={(e) => setScoreAInd2(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">3rd Place</label>
                          <input type="number" value={scoreAInd3} onChange={(e) => setScoreAInd3(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-semibold text-neutral-400 block border-b border-white/10 pb-1">Group Events</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">1st Place</label>
                          <input type="number" value={scoreAGrp1} onChange={(e) => setScoreAGrp1(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">2nd Place</label>
                          <input type="number" value={scoreAGrp2} onChange={(e) => setScoreAGrp2(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">3rd Place</label>
                          <input type="number" value={scoreAGrp3} onChange={(e) => setScoreAGrp3(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category B Scoring */}
                  <div className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 space-y-4">
                    <h4 className="font-bold text-indigo-500 text-xs uppercase tracking-wider">Category B Scoring Rules</h4>
                    
                    <div className="space-y-3">
                      <div className="font-semibold text-neutral-400 block border-b border-white/10 pb-1">Individual Events</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">1st Place</label>
                          <input type="number" value={scoreBInd1} onChange={(e) => setScoreBInd1(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">2nd Place</label>
                          <input type="number" value={scoreBInd2} onChange={(e) => setScoreBInd2(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">3rd Place</label>
                          <input type="number" value={scoreBInd3} onChange={(e) => setScoreBInd3(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-semibold text-neutral-400 block border-b border-white/10 pb-1">Group Events</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">1st Place</label>
                          <input type="number" value={scoreBGrp1} onChange={(e) => setScoreBGrp1(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">2nd Place</label>
                          <input type="number" value={scoreBGrp2} onChange={(e) => setScoreBGrp2(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455">3rd Place</label>
                          <input type="number" value={scoreBGrp3} onChange={(e) => setScoreBGrp3(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white/30 dark:bg-white/10 focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleSaveScoringRules}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    <Check size={14} />
                    Recalculate & Save Scoring Config
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: House Teams & Leaders Portal Provisioning */}
          {activeTab === 'TeamManagement' && (
            <div className="space-y-6 animate-fade-in" id="admin-team-management">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* House Teams and Leaders Credentials */}
                <div className="lg:col-span-3 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                      <Users size={18} className="text-indigo-500" />
                      House Teams & Leaders Registry
                    </h3>
                    <p className="text-xs text-neutral-450">
                      Set up competition houses, manage scores, and distribute leader credentials to enable digital event enrollments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map((t) => {
                      const leader = users.find(u => u.role === 'student' && u.teamId === t.id && u.leaderId);
                      return (
                        <div 
                          key={t.id}
                          className="p-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/10 flex flex-col justify-between space-y-4"
                        >
                          {editingTeamId === t.id ? (
                            <div className="space-y-3 text-xs">
                              <div className="space-y-1">
                                <label className="text-[10px] text-neutral-400 font-semibold block">Edit Team Name</label>
                                <input
                                  type="text"
                                  value={editingTeamName}
                                  onChange={(e) => setEditingTeamName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-neutral-455 font-semibold block">Edit Color Identifier</label>
                                <select
                                  value={editingTeamColor}
                                  onChange={(e) => setEditingTeamColor(e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                                >
                                  <option value="bg-red-500">Red</option>
                                  <option value="bg-blue-500">Blue</option>
                                  <option value="bg-emerald-500">Emerald Green</option>
                                  <option value="bg-purple-500">Purple</option>
                                  <option value="bg-amber-500">Orange / Amber</option>
                                  <option value="bg-yellow-500">Yellow</option>
                                  <option value="bg-pink-500">Pink</option>
                                </select>
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  onClick={() => setEditingTeamId(null)}
                                  className="px-2.5 py-1 text-[10px] bg-white/25 dark:bg-white/10 text-neutral-600 dark:text-neutral-200 rounded-lg hover:bg-white/30 cursor-pointer font-semibold"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSaveEditedTeam}
                                  className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg cursor-pointer font-semibold"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                                    <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100">{t.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleStartEditTeam(t)}
                                      className="p-1 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                                      title={`Edit ${t.name}`}
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTeam(t.id)}
                                      className="p-1 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                      title={`Delete ${t.name}`}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-neutral-450 space-y-1">
                                  <p className="font-mono text-[10px]">ID: {t.id}</p>
                                  <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{t.points} Points</p>
                                  {leader ? (
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                      Leader: {leader.name} (ID: {leader.leaderId})
                                    </p>
                                  ) : (
                                    <p className="text-[10px] text-neutral-455 italic">No student leader provisioned</p>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => handleOpenLeaderConfig(t)}
                                className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <UserCheck size={12} />
                                Manage Leader Login
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right side: Add New Team and Manage Leaders Login Forms */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Provisioning Credentials Form */}
                  {selectedLeaderTeamToConfig && (
                    <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4 animate-scale-up">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <h4 className="font-bold text-xs text-indigo-500">
                          Leader Credentials: {teams.find(t => t.id === selectedLeaderTeamToConfig)?.name}
                        </h4>
                        <button 
                          onClick={() => setSelectedLeaderTeamToConfig(null)}
                          className="text-[10px] text-neutral-450 hover:text-neutral-200"
                        >
                          Close
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-semibold block">Student Leader Name</label>
                          <input 
                            type="text"
                            value={teamLeaderName}
                            onChange={(e) => setTeamLeaderName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-450 font-semibold block">Leader Portal Login ID</label>
                          <input 
                            type="text"
                            value={teamLeaderLoginId}
                            onChange={(e) => setTeamLeaderLoginId(e.target.value)}
                            placeholder="e.g. leader_blue"
                            className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-455 font-semibold block">Access Password</label>
                          <input 
                            type="password"
                            value={teamLeaderPassword}
                            onChange={(e) => setTeamLeaderPassword(e.target.value)}
                            placeholder="e.g. student123"
                            className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={handleSaveTeamLeaderConfig}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all cursor-pointer shadow-sm"
                        >
                          Save Leader Account
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Create New Team */}
                  <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
                    <h4 className="font-bold text-xs text-neutral-700 dark:text-neutral-100 flex items-center gap-1">
                      <PlusCircle size={14} className="text-indigo-500" />
                      Create New House Team
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 font-semibold block">Team ID (Unique lowercase)</label>
                        <input 
                          type="text"
                          value={newTeamId}
                          onChange={(e) => setNewTeamId(e.target.value)}
                          placeholder="e.g. team_emerald"
                          className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-455 font-semibold block">Team Title / Name</label>
                        <input 
                          type="text"
                          value={newTeamTitle}
                          onChange={(e) => setNewTeamTitle(e.target.value)}
                          placeholder="e.g. Emerald Green"
                          className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-455 font-semibold block">Color Identifier</label>
                        <select
                          value={newTeamColor}
                          onChange={(e) => setNewTeamColor(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none"
                        >
                          <option value="bg-red-500">Red</option>
                          <option value="bg-blue-500">Blue</option>
                          <option value="bg-emerald-500">Emerald Green</option>
                          <option value="bg-purple-500">Purple</option>
                          <option value="bg-amber-500">Orange / Amber</option>
                          <option value="bg-yellow-500">Yellow</option>
                          <option value="bg-pink-500">Pink</option>
                        </select>
                      </div>

                      <button
                        onClick={handleCreateNewTeam}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all cursor-pointer shadow-sm"
                      >
                        Create House Team
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'JudgeControl' && (
            <div className="space-y-6 animate-fade-in" id="admin-judge-control">
              {/* Header stats bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl premium-card p-3 sm:p-4 flex items-center justify-between shadow-xs border border-white/20 dark:border-white/10 bg-white/25 dark:bg-white/10">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold">Total Jury Members</span>
                    <div className="text-xl font-display font-bold text-neutral-800 dark:text-neutral-100 mt-0.5">
                      {users.filter(u => u.role === 'judge').length}
                    </div>
                  </div>
                  <UserCheck size={24} className="text-indigo-500" />
                </div>

                <div className="rounded-2xl premium-card p-3 sm:p-4 flex items-center justify-between shadow-xs border border-white/20 dark:border-white/10 bg-white/25 dark:bg-white/10">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold">Locked Programmes</span>
                    <div className="text-xl font-display font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {programmes.filter(p => p.locked).length} <span className="text-xs text-neutral-450 font-normal">/ {programmes.length}</span>
                    </div>
                  </div>
                  <Lock size={24} className="text-rose-500" />
                </div>

                <div className="rounded-2xl premium-card p-3 sm:p-4 flex items-center justify-between shadow-xs border border-white/20 dark:border-white/10 bg-white/25 dark:bg-white/10">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold">Open Evaluation Sheets</span>
                    <div className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {programmes.filter(p => !p.locked).length} <span className="text-xs text-neutral-450 font-normal">/ {programmes.length}</span>
                    </div>
                  </div>
                  <Unlock size={24} className="text-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* 1. Jury registry and assignment */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Juror creation/modification card */}
                  <div id="judge-form-card" className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs border border-white/20 dark:border-white/10 bg-white/25 dark:bg-white/10 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                        <PlusCircle size={16} className="text-indigo-500" />
                        {editingJudgeId ? 'Modify Juror Credentials' : 'Register New Juror'}
                      </h3>
                      <p className="text-[10px] text-neutral-450 mt-0.5">
                        Create Jury IDs, secure passwords, and assign specific competitions.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 font-semibold block">Juror Full Name</label>
                        <input 
                          type="text"
                          value={judgeName}
                          onChange={(e) => setJudgeName(e.target.value)}
                          placeholder="e.g. Prof. Sarah Jenkins"
                          className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-semibold block">Jury Login ID / Email</label>
                          <input 
                            type="text"
                            value={judgeEmail}
                            onChange={(e) => setJudgeEmail(e.target.value)}
                            placeholder="e.g. judge_sarah"
                            className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-semibold block">Access Key Password</label>
                          <input 
                            type="text"
                            value={judgePassword}
                            onChange={(e) => setJudgePassword(e.target.value)}
                            placeholder="e.g. judge123"
                            className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 font-semibold block">Department / Specialty</label>
                        <input 
                          type="text"
                          value={judgeDept}
                          onChange={(e) => setJudgeDept(e.target.value)}
                          placeholder="e.g. Fine Arts & Drama Department"
                          className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-semibold block">Assign Programmes ({judgeSelectedProgs.length})</label>
                        <div className="max-h-40 overflow-y-auto rounded-xl border border-white/40 dark:border-white/10 p-3 space-y-2 bg-white/10 dark:bg-white/5">
                          {programmes.map((p) => {
                            const isChecked = judgeSelectedProgs.includes(p.id);
                            return (
                              <label key={p.id} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-white/10 rounded px-1.5 transition-colors">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setJudgeSelectedProgs(judgeSelectedProgs.filter(id => id !== p.id));
                                    } else {
                                      setJudgeSelectedProgs([...judgeSelectedProgs, p.id]);
                                    }
                                  }}
                                  className="rounded accent-indigo-600"
                                />
                                <div className="text-[11px]">
                                  <span className="font-mono text-indigo-500 font-bold mr-1">[{p.code}]</span>
                                  <span className="text-neutral-800 dark:text-neutral-100">{p.title}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        {editingJudgeId && (
                          <button
                            onClick={() => {
                              setEditingJudgeId(null);
                              setJudgeName('');
                              setJudgeEmail('');
                              setJudgePassword('judge123');
                              setJudgeDept('');
                              setJudgeSelectedProgs([]);
                            }}
                            className="px-4 py-2 bg-white/20 dark:bg-white/10 hover:bg-white/30 text-neutral-700 dark:text-neutral-200 rounded-xl transition-all cursor-pointer font-bold"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={handleSaveJudge}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5"
                        >
                          <Save size={14} />
                          {editingJudgeId ? 'Save Juror' : 'Register Juror'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Registered Jurors Registry List */}
                  <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs border border-white/20 dark:border-white/10 bg-white/25 dark:bg-white/10 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                        <Users size={16} className="text-indigo-500" />
                        Jury Registry Database
                      </h3>
                      <input 
                        type="text"
                        value={searchJudgeQuery}
                        onChange={(e) => setSearchJudgeQuery(e.target.value)}
                        placeholder="Search jurors..."
                        className="px-2.5 py-1 text-[11px] rounded bg-white/40 dark:bg-white/5 border border-white/45 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-3">
                      {users
                        .filter(u => u.role === 'judge' && (
                          u.name.toLowerCase().includes(searchJudgeQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchJudgeQuery.toLowerCase()) ||
                          (u.department && u.department.toLowerCase().includes(searchJudgeQuery.toLowerCase()))
                        ))
                        .map((jg) => (
                          <div 
                            key={jg.id} 
                            className="p-3.5 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 space-y-2 text-xs hover:border-indigo-500/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">{jg.name}</div>
                                <span className="text-[10px] text-neutral-450 italic">{jg.department || 'No department listed'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => triggerEditJudge(jg)}
                                  className="p-1 rounded text-neutral-500 hover:text-indigo-500 hover:bg-indigo-500/10 cursor-pointer"
                                  title="Edit Juror"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteJudge(jg.id)}
                                  className="p-1 rounded text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                  title="Delete Juror"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 p-2 rounded bg-white/20 dark:bg-white/10 text-[10px] font-mono">
                              <div>
                                <span className="text-neutral-455">Jury ID:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{jg.id}</span>
                              </div>
                              <div>
                                <span className="text-neutral-455">Password:</span> <span className="font-bold text-neutral-700 dark:text-neutral-200">{jg.password || 'judge123'}</span>
                              </div>
                              <div className="col-span-2 truncate">
                                <span className="text-neutral-455">Email:</span> <span className="text-neutral-700 dark:text-neutral-200">{jg.email}</span>
                              </div>
                            </div>

                            <div>
                              <div className="text-[9px] font-bold uppercase text-neutral-455 mb-1">Assigned Competitions ({jg.assignedProgrammeIds?.length || 0})</div>
                              <div className="flex flex-wrap gap-1">
                                {(jg.assignedProgrammeIds || []).map(pid => {
                                  const pr = programmes.find(p => p.id === pid);
                                  return pr ? (
                                    <span key={pid} className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[9px] rounded border border-indigo-100/30 text-indigo-600 dark:text-indigo-400 font-mono">
                                      {pr.code}
                                    </span>
                                  ) : null;
                                })}
                                {(jg.assignedProgrammeIds?.length || 0) === 0 && (
                                  <span className="text-[10px] text-neutral-455 italic">No competitions assigned.</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

                {/* 2. Direct lock controls & live added results visual logs */}
                <div className="lg:col-span-3 space-y-6">
                  
                  <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs border border-white/20 dark:border-white/10 bg-white/25 dark:bg-white/10 space-y-6">
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                        <Lock size={16} className="text-indigo-500" />
                        Jury Evaluation Scorecards & Lock Control
                      </h3>
                      <p className="text-[10px] text-neutral-455 mt-0.5">
                        Lock programs to freeze jury scoring, or unlock to let judges add participation marks, grades, and comments.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {programmes.map((prog) => {
                        const progEvaluations = evaluations.filter(ev => ev.programmeId === prog.id && !ev.id?.startsWith('jury_submitted_'));
                        const isLocked = prog.locked === true;

                        return (
                          <div 
                            key={prog.id}
                            className="p-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 dark:border-white/10 pb-3">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 font-mono text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                                    {prog.code}
                                  </span>
                                  <span className="font-bold text-neutral-800 dark:text-neutral-100 text-xs">
                                    {prog.title}
                                  </span>
                                </div>
                                <div className="text-[10px] text-neutral-455 mt-0.5">
                                  Category: {prog.category} | Type: {prog.type} | Venue: {prog.venue}
                                </div>
                              </div>

                              <div>
                                <button
                                  onClick={() => handleToggleProgLock(prog.id)}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                    isLocked 
                                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border-rose-500/20' 
                                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/20'
                                  }`}
                                  title={isLocked ? "Click to unlock scoresheets" : "Click to lock scoresheets"}
                                >
                                  {isLocked ? (
                                    <>
                                      <Lock size={12} />
                                      Locked (No Edits)
                                    </>
                                  ) : (
                                    <>
                                      <Unlock size={12} />
                                      Unlocked (Jury Can Edit)
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Live added evaluations view */}
                            <div>
                              <div className="text-[9px] font-bold uppercase text-neutral-450 mb-2">Live Juror Added Results ({progEvaluations.length} logged)</div>
                              {progEvaluations.length > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-white/25 dark:border-white/10">
                                  <table className="w-full text-left text-[11px]">
                                    <thead>
                                      <tr className="bg-white/20 dark:bg-white/10 text-neutral-450 font-semibold font-mono text-[9px] border-b border-white/10 dark:border-white/10">
                                        <th className="py-2 px-3">Participant</th>
                                        <th className="py-2 px-3">Juror</th>
                                        <th className="py-2 px-3 text-center">Marks / 100</th>
                                        <th className="py-2 px-3 text-center">Grade</th>
                                        <th className="py-2 px-3">Remarks / Comments</th>
                                        <th className="py-2 px-3 text-right">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 dark:divide-white/5 text-neutral-700 dark:text-neutral-200">
                                      {progEvaluations.map((ev, index) => {
                                        const juror = users.find(u => u.id === ev.judgeId);
                                        return (
                                          <tr key={index} className="hover:bg-white/5">
                                            <td className="py-2 px-3 font-semibold text-neutral-800 dark:text-neutral-100">
                                              {ev.participantName}
                                            </td>
                                            <td className="py-2 px-3 text-neutral-500">
                                              {juror?.name || ev.judgeId}
                                            </td>
                                            <td className="py-2 px-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                              {ev.totalScore}
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold font-mono text-[9px]">
                                                {ev.grade || (ev.totalScore >= 75 ? 'A' : ev.totalScore >= 60 ? 'B' : ev.totalScore >= 45 ? 'C' : 'None')}
                                              </span>
                                            </td>
                                            <td className="py-2 px-3 italic max-w-xs truncate text-[10px]" title={ev.remarks}>
                                              {ev.remarks || <span className="text-neutral-400">No comments entered</span>}
                                            </td>
                                            <td className="py-2 px-3 text-right">
                                              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase font-mono ${
                                                ev.status === 'Locked' 
                                                  ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' 
                                                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                              }`}>
                                                {ev.status}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-6 border border-dashed border-white/20 dark:border-white/10 rounded-xl bg-white/5 text-neutral-450 italic text-[11px]">
                                  No evaluations or direct marks logged yet by assigned jury members.
                                </div>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* Custom Deletion Overlay Confirmation Modal */}
      {progToDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-white/5/95 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Confirm Competition Deletion</h3>
                <p className="text-[10px] text-neutral-450 mt-0.5">This action is irreversible and affects active rosters.</p>
              </div>
            </div>
            
            <p className="text-neutral-600 dark:text-neutral-200 leading-relaxed">
              Are you absolutely sure you want to delete <span className="font-bold text-neutral-800 dark:text-neutral-100">&ldquo;{programmes.find(p => p.id === progToDeleteId)?.title}&rdquo;</span>? All active student team enrollments and jury scorecards registered for this event will be discarded immediately.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setProgToDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-neutral-600 dark:text-neutral-200 hover:bg-white/30 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeleteProg(progToDeleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md cursor-pointer"
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Juror Deletion Overlay Confirmation Modal */}
      {judgeToDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-white/5/95 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Confirm Juror Removal</h3>
                <p className="text-[10px] text-neutral-450 mt-0.5">This action is irreversible and revokes jury access keys.</p>
              </div>
            </div>
            
            <p className="text-neutral-600 dark:text-neutral-200 leading-relaxed">
              Are you absolutely sure you want to remove juror <span className="font-bold text-neutral-800 dark:text-neutral-100">&ldquo;{users.find(u => u.id === judgeToDeleteId)?.name}&rdquo;</span>? This will revoke their access to the Judge Portal and clear them from any assigned competition categories.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setJudgeToDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-neutral-600 dark:text-neutral-200 hover:bg-white/30 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeleteJudge(judgeToDeleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md cursor-pointer"
              >
                Yes, Remove Juror
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Team Deletion Overlay Confirmation Modal */}
      {teamToDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-white/5/95 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Confirm House Team Deletion</h3>
                <p className="text-[10px] text-neutral-450 mt-0.5">This action is irreversible and affects team assignments.</p>
              </div>
            </div>
            
            <p className="text-neutral-600 dark:text-neutral-200 leading-relaxed">
              Are you absolutely sure you want to delete the house team <span className="font-bold text-neutral-800 dark:text-neutral-100">&ldquo;{teams.find(t => t.id === teamToDeleteId)?.name}&rdquo;</span>? This will also remove team affiliation from all member students, and revoke access for any provisioned leaders of this team.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setTeamToDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-neutral-600 dark:text-neutral-200 hover:bg-white/30 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeleteTeam(teamToDeleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md cursor-pointer"
              >
                Yes, Delete Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Database Rollback Confirmation Overlay */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-white/5/95 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100">Confirm Database Rollback</h3>
                <p className="text-[10px] text-neutral-450 mt-0.5">Standard Daily Snapshot Restoral</p>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-200 leading-relaxed">
              This will rollback the active memory tables to the latest secure daily snapshot. Unsaved registrations, student sign-ups, and changes from the current session may be permanently lost. Continue?
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-neutral-600 dark:text-neutral-200 hover:bg-white/30 font-semibold cursor-pointer"
              >
                Cancel Rollback
              </button>
              <button
                onClick={executeRestore}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md cursor-pointer"
              >
                Yes, Restore DB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
