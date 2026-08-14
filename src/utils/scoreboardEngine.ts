import { PublishedResult, Programme, Team } from '../types';

export interface GroupScoreboardItem {
  id: string;
  name: string;
  boysPoints: number;
  girlsPoints: number;
  totalPoints: number;
}

export interface OfficialScoreboardResponse {
  teams: GroupScoreboardItem[];
  divisionTeams: Team[];
  lastCalculatedAt: string;
}

/**
 * SINGLE CENTRALIZED SCORE CALCULATION ENGINE
 * Evaluates points consistently across Computer, Mobile, and Tablet devices.
 */
export function calculateOfficialScoreboard(
  results: PublishedResult[],
  programmes: Programme[],
  teams: Team[]
): OfficialScoreboardResponse {
  // Score map for each division team ID (e.g. diraya_boys, diraya_girls, etc.)
  const divisionScores: Record<string, number> = {
    diraya_boys: 0,
    diraya_girls: 0,
    furooha_boys: 0,
    furooha_girls: 0,
    swaraha_boys: 0,
    swaraha_girls: 0
  };

  // Iterate over ONLY results whose corresponding programme has resultPublished === true
  results.forEach(res => {
    const prog = programmes.find(p => p.id === res.programmeId);
    
    // SCOREBOARD IS DERIVED STRICTLY FROM PUBLISHED RESULTS (prog.resultPublished === true)
    const isPublished = prog ? (prog.resultPublished === true) : (res.locked === true);
    if (!isPublished) return;

    if (!res.rankings || !Array.isArray(res.rankings)) return;

    const isGirlsProg = prog ? (prog.categoryGroup ? prog.categoryGroup.toLowerCase().includes('girls') : false) : false;

    res.rankings.forEach(ranking => {
      let targetTeamId = ranking.teamId;

      // Auto-route generic group IDs to specific division team IDs
      if (targetTeamId === 'diraya') {
        targetTeamId = isGirlsProg ? 'diraya_girls' : 'diraya_boys';
      } else if (targetTeamId === 'furooha') {
        targetTeamId = isGirlsProg ? 'furooha_girls' : 'furooha_boys';
      } else if (targetTeamId === 'swaraha') {
        targetTeamId = isGirlsProg ? 'swaraha_girls' : 'swaraha_boys';
      }

      if (divisionScores[targetTeamId] !== undefined) {
        divisionScores[targetTeamId] += (ranking.points || 0);
      } else {
        divisionScores[targetTeamId] = (ranking.points || 0);
      }
    });
  });

  // Calculate Group Totals for DIRAYA, FUROOHA, SWARAHA strictly from published results
  const groups = [
    { id: 'diraya', name: 'DIRAYA' },
    { id: 'furooha', name: 'FUROOHA' },
    { id: 'swaraha', name: 'SWARAHA' }
  ];

  const groupScoreboard: GroupScoreboardItem[] = groups.map(g => {
    const boysPoints = divisionScores[`${g.id}_boys`] || 0;
    const girlsPoints = divisionScores[`${g.id}_girls`] || 0;
    const totalPoints = boysPoints + girlsPoints;

    return {
      id: g.id,
      name: g.name,
      boysPoints,
      girlsPoints,
      totalPoints
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  // Update teams array with computed points strictly from published results
  const updatedDivisionTeams: Team[] = teams.map(t => ({
    ...t,
    points: divisionScores[t.id] ?? 0
  }));

  return {
    teams: groupScoreboard,
    divisionTeams: updatedDivisionTeams,
    lastCalculatedAt: new Date().toISOString()
  };
}
