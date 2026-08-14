import { Programme } from '../types';

export interface OfficialScheduleEntry {
  code: string;
  title: string;
  categoryLevel: 'Kiddies' | 'Sub Junior' | 'Junior' | 'Senior' | 'Super Senior' | 'General';
  gender: 'Boys' | 'Girls' | 'Boys & Girls';
  scheduledDate: string;
  startTime: string;
  endTime: string;
  scheduleStatus: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'TBD';
}

export const OFFICIAL_OFFSTAGE_SCHEDULE: OfficialScheduleEntry[] = [
  // 2. KIDDIES — BOYS & GIRLS
  { code: '106', title: 'Coloring', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '11.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '107', title: 'Reading', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '12.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '108', title: 'Hand Writing', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '11.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '109', title: 'Chair and Song', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '13.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '110', title: 'Candy Collection', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '17.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '111', title: 'Balloon Bursting', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '18.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '101', title: 'Fathiha Recitation', categoryLevel: 'Kiddies', gender: 'Boys & Girls', scheduledDate: '19.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },

  // 3. SUB JUNIOR — BOYS
  { code: '207', title: 'Hifl', categoryLevel: 'Sub Junior', gender: 'Boys', scheduledDate: '13.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '208', title: 'Handwriting (Arabic/Malayalam)', categoryLevel: 'Sub Junior', gender: 'Boys', scheduledDate: '12.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '209', title: 'Memory Test', categoryLevel: 'Sub Junior', gender: 'Boys', scheduledDate: '12.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '210', title: 'Digital Quiz', categoryLevel: 'Sub Junior', gender: 'Boys', scheduledDate: '16.08.2026', startTime: '07:30', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '211', title: 'Handwriting (English)', categoryLevel: 'Sub Junior', gender: 'Boys', scheduledDate: '11.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '212', title: 'Pencil Drawing', categoryLevel: 'Sub Junior', gender: 'Boys', scheduledDate: '11.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },

  // 4. JUNIOR — BOYS
  { code: '308', title: 'Hifl', categoryLevel: 'Junior', gender: 'Boys', scheduledDate: '17.08.2026', startTime: '07:15', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '309', title: 'Arabic Handwriting', categoryLevel: 'Junior', gender: 'Boys', scheduledDate: '13.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '310', title: 'Painting (Water Color)', categoryLevel: 'Junior', gender: 'Boys', scheduledDate: '11.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '311', title: 'Test on Kurunnukal (Digital)', categoryLevel: 'Junior', gender: 'Boys', scheduledDate: '16.08.2026', startTime: '09:30', endTime: '10:30', scheduleStatus: 'UPCOMING' },
  { code: '312', title: 'Pencil Drawing', categoryLevel: 'Junior', gender: 'Boys', scheduledDate: '12.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '313', title: 'Caption Making', categoryLevel: 'Junior', gender: 'Boys', scheduledDate: '17.08.2026', startTime: '06:00', endTime: '06:30', scheduleStatus: 'UPCOMING' },

  // 5. SENIOR — BOYS
  { code: '409', title: 'Hifl', categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '17.08.2026', startTime: '07:15', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '410', title: "Adaa'n", categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '18.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '411', title: 'Arabic Calligraphy', categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '12.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '412', title: 'Pencil Drawing', categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '11.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '413', title: 'Story Making', categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '17.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '414', title: 'Essay Writing', categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '14.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '415', title: 'Digital Quiz', categoryLevel: 'Senior', gender: 'Boys', scheduledDate: '16.08.2026', startTime: '10:30', endTime: '11:30', scheduleStatus: 'UPCOMING' },

  // 6. SUPER SENIOR — BOYS
  { code: '509', title: 'Hifl', categoryLevel: 'Super Senior', gender: 'Boys', scheduledDate: '17.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '510', title: 'Arabic Calligraphy', categoryLevel: 'Super Senior', gender: 'Boys', scheduledDate: '11.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '511', title: 'Pencil Drawing', categoryLevel: 'Super Senior', gender: 'Boys', scheduledDate: '12.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '512', title: 'Story Making', categoryLevel: 'Super Senior', gender: 'Boys', scheduledDate: '13.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '513', title: 'Essay Writing', categoryLevel: 'Super Senior', gender: 'Boys', scheduledDate: '18.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '514', title: 'Digital Quiz', categoryLevel: 'Super Senior', gender: 'Boys', scheduledDate: '16.08.2026', startTime: '06:15', endTime: '07:15', scheduleStatus: 'UPCOMING' },

  // 7. SUB JUNIOR — GIRLS
  { code: '706', title: 'Hifl', categoryLevel: 'Sub Junior', gender: 'Girls', scheduledDate: '13.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '707', title: 'Handwriting (Arabic/Malayalam)', categoryLevel: 'Sub Junior', gender: 'Girls', scheduledDate: '12.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '708', title: 'Memory Test', categoryLevel: 'Sub Junior', gender: 'Girls', scheduledDate: '12.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },
  { code: '709', title: 'Digital Quiz', categoryLevel: 'Sub Junior', gender: 'Girls', scheduledDate: '16.08.2026', startTime: '07:30', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '710', title: 'Handwriting (English)', categoryLevel: 'Sub Junior', gender: 'Girls', scheduledDate: '11.08.2026', startTime: '08:00', endTime: '08:30', scheduleStatus: 'UPCOMING' },
  { code: '711', title: 'Pencil Drawing', categoryLevel: 'Sub Junior', gender: 'Girls', scheduledDate: '11.08.2026', startTime: '07:30', endTime: '08:00', scheduleStatus: 'UPCOMING' },

  // 8. JUNIOR — GIRLS
  { code: '807', title: 'Arabic Handwriting', categoryLevel: 'Junior', gender: 'Girls', scheduledDate: '13.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '808', title: 'Painting (Water Color)', categoryLevel: 'Junior', gender: 'Girls', scheduledDate: '11.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '809', title: 'Test on Kurunnukal (Digital)', categoryLevel: 'Junior', gender: 'Girls', scheduledDate: '16.08.2026', startTime: '09:30', endTime: '10:30', scheduleStatus: 'UPCOMING' },
  { code: '810', title: 'Pencil Drawing', categoryLevel: 'Junior', gender: 'Girls', scheduledDate: '12.08.2026', startTime: '06:00', endTime: '06:45', scheduleStatus: 'UPCOMING' },
  { code: '811', title: 'Caption Making', categoryLevel: 'Junior', gender: 'Girls', scheduledDate: '17.08.2026', startTime: '06:00', endTime: '06:30', scheduleStatus: 'UPCOMING' },

  // 9. SENIOR — GIRLS
  { code: '908', title: 'Arabic Word Fight', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '17.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '909', title: 'English Word Fight', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '16.08.2026', startTime: '07:00', endTime: '07:30', scheduleStatus: 'UPCOMING' },
  { code: '910', title: 'Arabic Calligraphy', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '11.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '911', title: 'Pencil Drawing', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '12.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '912', title: 'Story Making', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '13.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '913', title: 'Nano Literature', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '18.08.2026', startTime: '06:15', endTime: '07:00', scheduleStatus: 'UPCOMING' },
  { code: '914', title: 'Test on Santhushta Kudumbam', categoryLevel: 'Senior', gender: 'Girls', scheduledDate: '16.08.2026', startTime: '06:15', endTime: '07:15', scheduleStatus: 'UPCOMING' },

  // 10. GENERAL GIRLS
  { code: '1007', title: 'Crafting', categoryLevel: 'General', gender: 'Girls', scheduledDate: '20.08.2026', startTime: '07:00', endTime: '09:00', scheduleStatus: 'UPCOMING' },
  { code: '1005', title: 'News Paper Making', categoryLevel: 'General', gender: 'Girls', scheduledDate: 'TBD', startTime: 'TBD', endTime: 'TBD', scheduleStatus: 'TBD' },
  { code: '1006', title: 'MEGA QUIZ', categoryLevel: 'General', gender: 'Girls', scheduledDate: 'TBD', startTime: 'TBD', endTime: 'TBD', scheduleStatus: 'TBD' }
];

// Helper to enrich an array of Programme objects with official schedule metadata
export function enrichProgrammesWithSchedule(progs: Programme[]): Programme[] {
  if (!Array.isArray(progs)) return [];

  const copy = [...progs];

  // First, check for each official item if it's present by code
  OFFICIAL_OFFSTAGE_SCHEDULE.forEach(off => {
    let p = copy.find(item => item.code === off.code);
    if (p) {
      p.title = off.title;
      p.section = 'Off-Stage';
      p.stageType = 'Off-Stage';
      p.scheduledDate = off.scheduledDate;
      p.startTime = off.startTime;
      p.endTime = off.endTime;
      p.gender = off.gender;
      p.categoryLevel = off.categoryLevel;
      if (!p.scheduleStatus) p.scheduleStatus = off.scheduleStatus;
      if (!p.venue || p.venue === 'Main Stage' || p.venue === 'Main Stage (Al Mahabbah Hall)') {
        p.venue = 'Off-Stage Hall / Examination Room';
      }
      p.categoryGroup = `${off.categoryLevel} ${off.gender}`;
    } else {
      copy.push({
        id: `prog_${off.code}`,
        code: off.code,
        title: off.title,
        category: 'A',
        type: 'Individual',
        section: 'Off-Stage',
        stageType: 'Off-Stage',
        venue: 'Off-Stage Hall / Examination Room',
        datetime: off.scheduledDate !== 'TBD' ? `2026-08-${off.scheduledDate.split('.')[0]}T${off.startTime}` : 'TBD',
        scheduledDate: off.scheduledDate,
        startTime: off.startTime,
        endTime: off.endTime,
        gender: off.gender,
        categoryLevel: off.categoryLevel,
        maxParticipants: 1,
        minParticipants: 1,
        rules: `Official rules for ${off.title}.`,
        deadline: '2026-08-10T18:00',
        status: off.scheduleStatus === 'TBD' ? 'TBD' : 'Scheduled',
        judgeIds: ['judge_sarah'],
        resultPublished: false,
        categoryGroup: `${off.categoryLevel} ${off.gender}`,
        scheduleStatus: off.scheduleStatus
      });
    }
  });

  // Ensure default metadata for all other programs
  copy.forEach(p => {
    if (!p.section) p.section = 'Stage';
    if (!p.stageType) p.stageType = p.section === 'Off-Stage' ? 'Off-Stage' : 'On-Stage';
    if (!p.scheduledDate) p.scheduledDate = p.datetime ? p.datetime.substring(0, 10) : 'TBD';
    if (!p.startTime) p.startTime = p.datetime ? p.datetime.substring(11, 16) : '09:00';
    if (!p.endTime) p.endTime = '09:45';
    if (!p.scheduleStatus) p.scheduleStatus = p.status === 'Completed' ? 'COMPLETED' : (p.status === 'Live' ? 'LIVE' : (p.status === 'Cancelled' ? 'CANCELLED' : 'UPCOMING'));
    if (!p.gender) {
      const cg = (p.categoryGroup || '').toLowerCase();
      p.gender = cg.includes('girls') ? 'Girls' : (cg.includes('boys & girls') ? 'Boys & Girls' : 'Boys');
    }
    if (!p.categoryLevel) {
      const cg = (p.categoryGroup || '').toLowerCase();
      if (cg.includes('kiddies')) p.categoryLevel = 'Kiddies';
      else if (cg.includes('sub junior')) p.categoryLevel = 'Sub Junior';
      else if (cg.includes('super senior')) p.categoryLevel = 'Super Senior';
      else if (cg.includes('senior')) p.categoryLevel = 'Senior';
      else if (cg.includes('junior')) p.categoryLevel = 'Junior';
      else p.categoryLevel = 'General';
    }
  });

  return copy;
}
