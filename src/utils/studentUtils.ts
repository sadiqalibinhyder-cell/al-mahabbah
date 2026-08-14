import { UserProfile, Programme, PublishedResult } from '../types';

/**
 * Requirement #5: Auto-determine Category from Class + Gender
 * BOYS:
 *  - Sub Junior: Classes 3, 4
 *  - Junior: Classes 5, 6
 *  - Senior: Classes 7, 8
 *  - Super Senior: Classes 9, 10, 11, 12
 * 
 * GIRLS:
 *  - Sub Junior: Classes 3, 4
 *  - Junior: Classes 5, 6, 7
 *  - Senior: Classes 8, 9, 10, 11, 12
 *  - (No Super Senior for Girls)
 */
export function getCategoryFromClassAndGender(
  clsStr: string | number,
  gender: 'Boys' | 'Girls'
): 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' {
  const cls = typeof clsStr === 'number' ? clsStr : parseInt(String(clsStr), 10) || 5;
  
  if (gender === 'Boys') {
    if (cls <= 4) return 'Sub Junior';
    if (cls <= 6) return 'Junior';
    if (cls <= 8) return 'Senior';
    return 'Super Senior';
  } else {
    if (cls <= 4) return 'Sub Junior';
    if (cls <= 7) return 'Junior';
    return 'Senior';
  }
}

/**
 * Requirement #14: Category Topper Award Titles
 * BOYS:
 *  - Sub Junior: EMERGING STAR
 *  - Junior: RISING STAR
 *  - Senior: SHINING STAR
 *  - Super Senior: ELITE STAR
 * 
 * GIRLS:
 *  - Sub Junior: EMERGING STAR
 *  - Junior: RISING STAR
 *  - Senior: ELITE STAR
 */
export function getTopperTitle(
  category: 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' | string,
  gender: 'Boys' | 'Girls'
): string {
  if (gender === 'Boys') {
    switch (category) {
      case 'Sub Junior': return 'EMERGING STAR';
      case 'Junior': return 'RISING STAR';
      case 'Senior': return 'SHINING STAR';
      case 'Super Senior': return 'ELITE STAR';
      default: return 'EMERGING STAR';
    }
  } else {
    switch (category) {
      case 'Sub Junior': return 'EMERGING STAR';
      case 'Junior': return 'RISING STAR';
      case 'Senior': return 'ELITE STAR';
      default: return 'EMERGING STAR';
    }
  }
}

/**
 * Requirement #14: Student Schedule Conflict Detection
 * Checks if target program timing overlaps with any existing program assigned to student
 */
export function checkStudentScheduleConflict(
  student: UserProfile,
  targetProg: Programme,
  allProgrammes: Programme[]
): { conflict: boolean; conflictingProgramme?: Programme } {
  if (!targetProg.scheduledDate || targetProg.scheduledDate === 'TBD') return { conflict: false };

  const toMin = (t?: string) => {
    if (!t || t === 'TBD') return 0;
    const parts = t.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };

  const targetStart = toMin(targetProg.startTime);
  const targetEnd = toMin(targetProg.endTime || targetProg.startTime);

  if (targetStart === 0 && targetEnd === 0) return { conflict: false };

  for (const pId of (student.registeredProgrammeIds || [])) {
    if (pId === targetProg.id) continue;
    const p = allProgrammes.find(item => item.id === pId);
    if (!p || !p.scheduledDate || p.scheduledDate === 'TBD') continue;

    if (p.scheduledDate === targetProg.scheduledDate) {
      const pStart = toMin(p.startTime);
      const pEnd = toMin(p.endTime || p.startTime);
      if (pStart === 0 && pEnd === 0) continue;

      if (Math.max(targetStart, pStart) < Math.min(targetEnd, pEnd)) {
        return { conflict: true, conflictingProgramme: p };
      }
    }
  }

  return { conflict: false };
}

/**
 * Requirement #8, 9, 10, 11, 12, 14: Program Assignment Validation System
 */
export function validateProgramAssignment(
  student: UserProfile,
  programme: Programme,
  allProgrammes: Programme[],
  allUsers: UserProfile[],
  divisionTeamId?: string
): { valid: boolean; reason?: string } {
  // 1. Check if student is already assigned to this program
  if (student.registeredProgrammeIds?.includes(programme.id)) {
    return { valid: false, reason: `Student ${student.name} (${student.chestNo || 'No Chest'}) is already assigned to "${programme.title}".` };
  }

  // 2. Requirement #8 & #9: Individual Program Limit (Maximum 5 per student). Group programs are UNLIMITED.
  if (programme.type === 'Individual') {
    const individualCount = (student.registeredProgrammeIds || []).reduce((count, pId) => {
      const p = allProgrammes.find(item => item.id === pId);
      return (p && p.type === 'Individual') ? count + 1 : count;
    }, 0);

    if (individualCount >= 5) {
      return { 
        valid: false, 
        reason: `Individual Program Limit Reached (5/5). Student ${student.name} is already registered in 5 individual programs.` 
      };
    }
  }

  // 3. Requirement #10 & #11: Maximum 4 students from the same Group/Gender division per program
  const targetTeamId = student.teamId || divisionTeamId;
  if (targetTeamId) {
    const divisionStudentsInProg = allUsers.filter(u => 
      u.role === 'student' && 
      u.teamId === targetTeamId && 
      (u.registeredProgrammeIds || []).includes(programme.id)
    );

    if (divisionStudentsInProg.length >= 4) {
      return { 
        valid: false, 
        reason: `Participant Limit Reached (4/4 Full). Your division already has 4 students assigned to "${programme.title}".` 
      };
    }
  }

  // 4. Requirement #14: Student Schedule Conflict Warning & Prevention
  const conflictCheck = checkStudentScheduleConflict(student, programme, allProgrammes);
  if (conflictCheck.conflict && conflictCheck.conflictingProgramme) {
    const cp = conflictCheck.conflictingProgramme;
    return {
      valid: false,
      reason: `⚠️ SCHEDULE CONFLICT DETECTED: Student ${student.name} is already assigned to "${cp.title}" [#${cp.code}] on ${programme.scheduledDate} (${cp.startTime}–${cp.endTime}), which overlaps with "${programme.title}" (${programme.startTime}–${programme.endTime}).`
    };
  }

  return { valid: true };
}

export interface TopperWinner {
  studentId: string;
  studentName: string;
  chestNo: string;
  teamId: string;
  gender: 'Boys' | 'Girls';
  category: 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior';
  title: string;
  points: number;
}

/**
 * Requirement #14 & #15: Topper Titles Calculation from Final Results
 * Automatically identifies #1 performing student in each Gender + Category division
 */
export function calculateToppersFromResults(
  users: UserProfile[],
  results: PublishedResult[],
  programmes: Programme[]
): TopperWinner[] {
  const studentPointsMap: Record<string, number> = {};

  results.forEach(res => {
    const prog = programmes.find(p => p.id === res.programmeId);
    const isPublished = prog ? (prog.resultPublished === true) : (res.locked === true);
    if (!isPublished) return;

    res.rankings.forEach(rank => {
      if (rank.participantId) {
        studentPointsMap[rank.participantId] = (studentPointsMap[rank.participantId] || 0) + (rank.points || 0);
      }
    });
  });

  const toppers: TopperWinner[] = [];

  const divisions: { gender: 'Boys' | 'Girls'; category: 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' }[] = [
    { gender: 'Boys', category: 'Sub Junior' },
    { gender: 'Boys', category: 'Junior' },
    { gender: 'Boys', category: 'Senior' },
    { gender: 'Boys', category: 'Super Senior' },
    { gender: 'Girls', category: 'Sub Junior' },
    { gender: 'Girls', category: 'Junior' },
    { gender: 'Girls', category: 'Senior' },
  ];

  divisions.forEach(div => {
    const eligibleStudents = users.filter(u => {
      if (u.role !== 'student') return false;
      const uGender = u.gender || (u.teamId?.includes('girls') ? 'Girls' : 'Boys');
      const uCat = u.category || (u.studentClass ? getCategoryFromClassAndGender(u.studentClass, uGender) : 'Junior');
      return uGender === div.gender && uCat === div.category;
    });

    let bestStudent: UserProfile | null = null;
    let maxPts = -1;

    eligibleStudents.forEach(stu => {
      const pts = studentPointsMap[stu.id] || 0;
      if (pts > maxPts && pts > 0) {
        maxPts = pts;
        bestStudent = stu;
      }
    });

    if (bestStudent) {
      const s = bestStudent as UserProfile;
      toppers.push({
        studentId: s.id,
        studentName: s.name,
        chestNo: s.chestNo || 'N/A',
        teamId: s.teamId || '',
        gender: div.gender,
        category: div.category,
        title: getTopperTitle(div.category, div.gender),
        points: maxPts
      });
    }
  });

  return toppers;
}

/**
 * OVERALL FESTIVAL TOPPER: MAHABBAH TALENT
 * Includes BOYS AND GIRLS across ALL CATEGORIES.
 * Identifies the single #1 top-scoring individual student of the entire Meelad Arts Fest.
 */
export function calculateOverallFestivalTopper(
  users: UserProfile[],
  results: PublishedResult[],
  programmes: Programme[]
): TopperWinner | null {
  const studentPointsMap: Record<string, number> = {};

  results.forEach(res => {
    const prog = programmes.find(p => p.id === res.programmeId);
    const isPublished = prog ? (prog.resultPublished === true) : (res.locked === true);
    if (!isPublished) return;

    res.rankings.forEach(rank => {
      if (rank.participantId) {
        studentPointsMap[rank.participantId] = (studentPointsMap[rank.participantId] || 0) + (rank.points || 0);
      }
    });
  });

  let bestStudent: UserProfile | null = null;
  let maxPts = -1;

  users.filter(u => u.role === 'student').forEach(stu => {
    const pts = studentPointsMap[stu.id] || 0;
    if (pts > maxPts && pts > 0) {
      maxPts = pts;
      bestStudent = stu;
    }
  });

  if (bestStudent) {
    const s = bestStudent as UserProfile;
    const sGender = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
    const sCat = s.category || getCategoryFromClassAndGender(s.studentClass || '5', sGender);
    return {
      studentId: s.id,
      studentName: s.name,
      chestNo: s.chestNo || 'N/A',
      teamId: s.teamId || '',
      gender: sGender,
      category: sCat,
      title: 'MAHABBAH TALENT',
      points: maxPts
    };
  }

  return null;
}

/**
 * OVERALL GENDER TOPPER: BOYS TOPPER / GIRLS TOPPER
 * Identifies the #1 overall top-scoring student for a specific gender division across all categories.
 */
export function calculateGenderOverallTopper(
  users: UserProfile[],
  results: PublishedResult[],
  programmes: Programme[],
  gender: 'Boys' | 'Girls'
): TopperWinner | null {
  const studentPointsMap: Record<string, number> = {};

  results.forEach(res => {
    const prog = programmes.find(p => p.id === res.programmeId);
    const isPublished = prog ? (prog.resultPublished === true) : (res.locked === true);
    if (!isPublished) return;

    res.rankings.forEach(rank => {
      if (rank.participantId) {
        studentPointsMap[rank.participantId] = (studentPointsMap[rank.participantId] || 0) + (rank.points || 0);
      }
    });
  });

  let bestStudent: UserProfile | null = null;
  let maxPts = -1;

  users.filter(u => {
    if (u.role !== 'student') return false;
    const uGender = u.gender || (u.teamId?.includes('girls') ? 'Girls' : 'Boys');
    return uGender === gender;
  }).forEach(stu => {
    const pts = studentPointsMap[stu.id] || 0;
    if (pts > maxPts && pts > 0) {
      maxPts = pts;
      bestStudent = stu;
    }
  });

  if (bestStudent) {
    const s = bestStudent as UserProfile;
    const sCat = s.category || getCategoryFromClassAndGender(s.studentClass || '5', gender);
    return {
      studentId: s.id,
      studentName: s.name,
      chestNo: s.chestNo || 'N/A',
      teamId: s.teamId || '',
      gender: gender,
      category: sCat,
      title: gender === 'Boys' ? 'BOYS STAR TOPPER' : 'GIRLS STAR TOPPER',
      points: maxPts
    };
  }

  return null;
}
