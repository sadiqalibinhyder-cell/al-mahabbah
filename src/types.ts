export interface Programme {
  id: string;
  code: string;
  title: string;
  category: 'A' | 'B';
  type: 'Individual' | 'Group';
  section: 'Stage' | 'Off-Stage';
  venue: string;
  datetime: string;
  maxParticipants: number;
  minParticipants: number;
  rules: string;
  deadline: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled' | 'Postponed' | 'TBD' | 'Upcoming';
  judgeIds: string[];
  resultPublished: boolean;
  categoryGroup?: string;
  locked?: boolean;

  // Master Schedule System Extensions
  scheduledDate?: string; // e.g. "11.08.2026"
  startTime?: string; // e.g. "07:30"
  endTime?: string; // e.g. "08:00"
  gender?: 'Boys' | 'Girls' | 'Boys & Girls';
  scheduleStatus?: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'TBD';
  stageType?: 'On-Stage' | 'Off-Stage';
  notes?: string;
  categoryLevel?: 'Kiddies' | 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' | 'General';
}

export interface Team {
  id: string;
  name: string;
  points: number;
  color: string;
  gradient: string;
  leaderUserId?: string; // Reference to leader's student user profile ID
  groupId?: string; // 'diraya' | 'furooha' | 'swaraha'
  groupName?: string; // 'DIRAYA' | 'FUROOHA' | 'SWARAHA'
  gender?: 'Boys' | 'Girls';
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  username?: string;
  role: 'student' | 'judge' | 'admin' | 'team_leader';
  teamId?: string; // For students (e.g., 'diraya_boys', 'diraya_girls')
  registeredProgrammeIds: string[]; // Assigned program IDs for students
  rollNo?: string;
  department?: string;
  chestNo?: string; // Unique Chest Number (read-only for leaders, managed by admin)
  categoryGroup?: string; // Category selection
  assignedProgrammeIds?: string[]; // For judges
  password?: string; // Access password for leaders, judges, and admins
  leaderId?: string; // Custom Leader ID used for student leader portal logins
  avatar?: string;
  phone?: string;
  
  // Student Management Extensions
  studentClass?: string; // Class '3' to '12'
  needsClassVerification?: boolean; // Flagged for Admin class verification
  gender?: 'Boys' | 'Girls';
  group?: 'DIRAYA' | 'FUROOHA' | 'SWARAHA';
  category?: 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior';
  guardianName?: string;
}

export interface Evaluation {
  id?: string;
  programmeId: string;
  participantId?: string; // User ID
  participantName?: string;
  teamId?: string;
  scores?: {
    creativity: number;
    technical: number;
    presentation: number;
    originality: number;
  };
  totalScore?: number;
  remarks?: string;
  status?: 'Draft' | 'Locked';
  judgeId?: string;
  grade?: 'A' | 'B' | 'C' | 'None';
  rankings?: RankingDetail[];
}

export interface RankingDetail {
  position: number; // 1, 2, 3
  participantId: string;
  participantName: string;
  chestNo?: string;
  teamId: string;
  teamName: string;
  grade: 'A' | 'B' | 'C' | 'None';
  points: number;
  remarks?: string;
}

export interface PublishedResult {
  programmeId: string;
  publishedAt: string;
  rankings: RankingDetail[];
  locked?: boolean; // admin lock/unlock configuration
}

export interface Appeal {
  id: string;
  programmeId: string;
  programmeTitle: string;
  studentId: string;
  studentName: string;
  teamId: string;
  reason: string;
  attachedDoc?: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Completed';
  adminNotes?: string;
  datetime: string;
}

export interface Feedback {
  id: string;
  rating: number;
  category: 'Programmes' | 'Venues' | 'Scheduling' | 'Hospitality' | 'Technical' | 'Overall';
  comments: string;
  name?: string;
  isAnonymous: boolean;
  datetime: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'critical' | 'general' | 'schedule';
  datetime: string;
  pinned: boolean;
}

export interface ScoringRule {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
}

export interface ProgramScoresConfig {
  categoryA: {
    individual: ScoringRule;
    group: ScoringRule;
  };
  categoryB: {
    individual: ScoringRule;
    group: ScoringRule;
  };
}

export interface SystemSettings {
  festivalName: string;
  theme: 'Standard' | 'Sunset' | 'Emerald' | 'Orchid' | 'Ocean';
  academicYear: string;
  logoText: string;
  logoBanner: string;
  contactEmail: string;
  contactPhone: string;
  about: string;
  faqList: { question: string; answer: string }[];
  sponsorList: { name: string; tier: 'Title' | 'Platinum' | 'Gold' | 'Silver'; logoColor: string }[];
  privacyPolicy: string;
  termsAndConditions: string;
  programScoresConfig?: ProgramScoresConfig;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  ip: string;
  browser: string;
  timestamp: string;
  location: string;
}

export interface SecurityConfig {
  enable2FA: boolean;
  sessionTimeoutMin: number;
  rateLimitAttempts: number;
  lockoutDurationMin: number;
  restrictDevices?: boolean;
  trustedLocations?: string;
}

export interface Muallim {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  qualification: string;
  experience: string;
  phone?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  phone?: string;
}

export interface AppReview {
  id: string;
  name: string;
  category: 'Student' | 'Parent' | 'Teacher' | 'Alumni' | 'Committee' | 'Visitor' | 'Other';
  programmeTitle?: string;
  rating: number; // 1 to 5
  reviewText: string;
  photoUrl?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  featured?: boolean;
}
