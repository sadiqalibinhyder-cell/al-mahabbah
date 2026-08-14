import { Programme, PublishedResult, UserProfile, Team } from '../types';

export const downloadResultPoster = (prog: Programme, res: PublishedResult, users: UserProfile[] = [], teams: Team[] = []) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background Linear & Radial Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1500);
  bgGrad.addColorStop(0, '#0f172a'); // slate-900
  bgGrad.addColorStop(0.4, '#1e1b4b'); // indigo-950
  bgGrad.addColorStop(1, '#022c22'); // emerald-950
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1500);

  // Outer Gold Decorative Borders
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, 1140, 1440);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, 1108, 1408);

  // Decorative Corner Dots
  const drawCornerDot = (x: number, y: number) => {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCornerDot(55, 55);
  drawCornerDot(1145, 55);
  drawCornerDot(55, 1445);
  drawCornerDot(1145, 1445);

  // 2. Festival Title / Header Banner
  ctx.fillStyle = '#fbbf24'; // Amber gold
  ctx.font = 'black 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MAHABBA CULTURAL FESTIVAL 2026', 600, 115);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('OFFICIAL COMPETITION RESULT CERTIFICATE', 600, 152);

  // Gold Separator Line
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 175);
  ctx.lineTo(980, 175);
  ctx.stroke();

  // Category & Code Pill Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(320, 200, 560, 44, 22);
    ctx.fill();
  } else {
    ctx.fillRect(320, 200, 560, 44);
  }

  ctx.fillStyle = '#38bdf8'; // Sky blue accent
  ctx.font = 'black 19px monospace';
  ctx.fillText(`CODE #${prog.code}  |  CAT ${prog.category} (${prog.categoryGroup || 'General'})`, 600, 228);

  // Programme Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'black 50px sans-serif';
  ctx.fillText(prog.title, 600, 310);

  ctx.fillStyle = '#6ee7b7'; // Emerald accent
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`📍 ${prog.venue}  •  ${prog.section} (${prog.type})`, 600, 355);

  // 3. Winners Cards (1st, 2nd, 3rd)
  const topRankings = [1, 2, 3].map(pos => res.rankings.find(r => r.position === pos)).filter(Boolean);

  let startY = 410;

  topRankings.forEach((rank, idx) => {
    if (!rank) return;
    const isFirst = rank.position === 1;
    const isSecond = rank.position === 2;
    const isThird = rank.position === 3;

    const cardHeight = 230;
    const cardY = startY + (idx * 250);

    let cardGrad = ctx.createLinearGradient(120, cardY, 1080, cardY + cardHeight);
    let borderColor = '#f59e0b';
    let badgeText = '🥇 FIRST PLACE (GOLD)';
    let badgeBg = '#f59e0b';

    if (isFirst) {
      cardGrad.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
      cardGrad.addColorStop(1, 'rgba(120, 53, 15, 0.45)');
      borderColor = '#fbbf24';
      badgeText = '🥇 FIRST PLACE (GOLD)';
      badgeBg = '#f59e0b';
    } else if (isSecond) {
      cardGrad.addColorStop(0, 'rgba(148, 163, 184, 0.22)');
      cardGrad.addColorStop(1, 'rgba(30, 41, 59, 0.45)');
      borderColor = '#cbd5e1';
      badgeText = '🥈 SECOND PLACE (SILVER)';
      badgeBg = '#64748b';
    } else {
      cardGrad.addColorStop(0, 'rgba(217, 119, 6, 0.2)');
      cardGrad.addColorStop(1, 'rgba(69, 26, 3, 0.45)');
      borderColor = '#d97706';
      badgeText = '🥉 THIRD PLACE (BRONZE)';
      badgeBg = '#b45309';
    }

    ctx.fillStyle = cardGrad;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(120, cardY, 960, cardHeight, 20);
      ctx.fill();
    } else {
      ctx.fillRect(120, cardY, 960, cardHeight);
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isFirst ? 3 : 2;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(120, cardY, 960, cardHeight, 20);
      ctx.stroke();
    } else {
      ctx.strokeRect(120, cardY, 960, cardHeight);
    }

    // Badge Pill
    ctx.fillStyle = badgeBg;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(150, cardY + 22, 290, 42, 21);
      ctx.fill();
    } else {
      ctx.fillRect(150, cardY + 22, 290, 42);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, 295, cardY + 49);

    // Grade Tag if present
    if (rank.grade && rank.grade !== 'None') {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(460, cardY + 22, 130, 42, 10);
        ctx.fill();
      } else {
        ctx.fillRect(460, cardY + 22, 130, 42);
      }
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(460, cardY + 22, 130, 42, 10);
        ctx.stroke();
      }
      ctx.fillStyle = '#f3e8ff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`GRADE ${rank.grade}`, 525, cardY + 48);
    }

    // Dynamic candidate resolution
    const student = users.find(u => u.id === rank.participantId || (rank.chestNo && u.chestNo === rank.chestNo));
    const displayName = student ? student.name : rank.participantName;
    const displayChest = student ? (student.chestNo || rank.chestNo) : rank.chestNo;
    const displayTeam = student ? (teams.find(t => t.id === student.teamId)?.name || rank.teamName) : rank.teamName;

    // Winner Name
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 36px sans-serif';
    ctx.fillText(displayName, 150, cardY + 118);

    // Chest No & Team Name
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 22px sans-serif';
    const chestLabel = displayChest ? `Chest #${displayChest}` : '';
    const teamLabel = displayTeam || 'House Team';
    ctx.fillText(`${chestLabel ? chestLabel + '  •  ' : ''}${teamLabel}`, 150, cardY + 168);

    // Points Box on Right
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(870, cardY + 70, 180, 95, 18);
      ctx.fill();
    } else {
      ctx.fillRect(870, cardY + 70, 180, 95);
    }
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(870, cardY + 70, 180, 95, 18);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'black 38px monospace';
    ctx.fillText(`+${rank.points}`, 960, cardY + 124);
    ctx.font = 'bold 14px monospace';
    ctx.fillText('POINTS', 960, cardY + 150);
  });

  // 4. Footer & Verification Stamp
  const footerY = 1200;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, footerY);
  ctx.lineTo(1050, footerY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#34d399';
  ctx.font = 'extrabold 22px sans-serif';
  ctx.fillText('✓ OFFICIAL DIGITAL RESULT CERTIFICATE', 600, footerY + 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`Published: ${new Date(res.publishedAt).toLocaleDateString()}  •  Verified by Jury Panel Desk`, 600, footerY + 80);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px monospace';
  ctx.fillText('Mahabba Cultural Festival © 2026 • Official Digital Publication', 600, footerY + 120);

  // Trigger Download
  const link = document.createElement('a');
  const safeName = prog.title.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Result_Poster_${prog.code}_${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
