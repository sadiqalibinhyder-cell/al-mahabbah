const fs = require('fs');
let content = fs.readFileSync('src/components/ScoreboardView.tsx', 'utf8');

// The file has imports, functions like getTeamBreakdown, and the component itself.
// Let's replace the return statement and some hooks, but keep the original logic.

const startString = `return (`;
const idx = content.indexOf(startString);

if (idx !== -1) {
  const replacement = `return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20" id="scoreboard-view-container">
      {/* Premium Header */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} strokeWidth={2.5} />
            Overall Scoreboard
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Live ranking and statistics for all participating clubs</p>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-10">
        {/* We place 2nd, 1st, 3rd for standard podium layout on desktop, or normal order on mobile */}
        {sortedTeams.slice(0, 3).map((team, idx) => {
           const breakdown = getTeamBreakdown(team.id);
           // Logic to reorder for desktop podium
           const desktopOrder = idx === 0 ? 'md:order-2 md:-mt-8' : idx === 1 ? 'md:order-1' : 'md:order-3 md:mt-4';
           const podiumColors = 
              idx === 0 ? 'from-yellow-200/50 to-yellow-50 dark:from-yellow-500/20 dark:to-yellow-900/10 border-yellow-200/50' :
              idx === 1 ? 'from-neutral-200/50 to-neutral-50 dark:from-neutral-400/20 dark:to-neutral-800/10 border-neutral-200/50' :
              'from-orange-200/50 to-orange-50 dark:from-orange-500/20 dark:to-orange-900/10 border-orange-200/50';
              
           const medalIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
           
           return (
             <div key={team.id} className={\`premium-card p-6 flex flex-col items-center text-center \${desktopOrder} bg-gradient-to-b \${podiumColors} relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]\`}>
               
               <div className="text-4xl mb-2 filter drop-shadow-md">{medalIcon}</div>
               <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white tracking-tight leading-tight">{team.name}</h3>
               <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest mt-1 mb-4">{team.studentsCount} Students</div>
               
               <div className="text-4xl md:text-5xl font-display font-black text-neutral-900 dark:text-white tracking-tighter tabular-nums">
                 {team.points}
               </div>
               <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Total Points</span>
               
               <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                 <div className="flex flex-col items-center">
                   <span className="text-[10px] font-bold text-neutral-400 uppercase">1st</span>
                   <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{breakdown.goldCount}</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <span className="text-[10px] font-bold text-neutral-400 uppercase">2nd</span>
                   <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">{breakdown.silverCount}</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <span className="text-[10px] font-bold text-neutral-400 uppercase">3rd</span>
                   <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{breakdown.bronzeCount}</span>
                 </div>
               </div>
             </div>
           );
        })}
      </div>

      {/* Bar Chart Visualization */}
      <div className="premium-card p-6 md:p-8">
        <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-6">Visual Standings</h3>
        <div className="space-y-5">
          {sortedTeams.map((team, idx) => {
            const percentage = Math.max(8, (team.points / highestScore) * 100);
            return (
              <div key={team.id} className="relative group">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-500">
                      {idx + 1}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-semibold">{team.name}</span>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white">{team.points} <span className="text-neutral-400">pts</span></span>
                </div>
                <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={\`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r \${team.gradient}\`}
                    style={{ width: \`\${percentage}%\` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Matrix */}
      <div className="premium-card p-6 md:p-8 overflow-hidden">
        <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-6">Detailed Breakdown</h3>
        <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="py-3 px-2 text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Team</th>
                <th className="py-3 px-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Stage</th>
                <th className="py-3 px-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Off-Stage</th>
                <th className="py-3 px-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Cat A</th>
                <th className="py-3 px-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Cat B</th>
                <th className="py-3 px-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Individual</th>
                <th className="py-3 px-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Group</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, idx) => {
                const breakdown = getTeamBreakdown(team.id);
                return (
                  <tr key={team.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-semibold text-sm text-neutral-900 dark:text-white">{team.name}</div>
                    </td>
                    <td className="py-4 px-2 text-center font-mono font-medium text-sm text-neutral-700 dark:text-neutral-300">{breakdown.stagePoints}</td>
                    <td className="py-4 px-2 text-center font-mono font-medium text-sm text-neutral-700 dark:text-neutral-300">{breakdown.offStagePoints}</td>
                    <td className="py-4 px-2 text-center font-mono font-medium text-sm text-neutral-700 dark:text-neutral-300">{breakdown.catAPoints}</td>
                    <td className="py-4 px-2 text-center font-mono font-medium text-sm text-neutral-700 dark:text-neutral-300">{breakdown.catBPoints}</td>
                    <td className="py-4 px-2 text-center font-mono font-medium text-sm text-neutral-700 dark:text-neutral-300">{breakdown.individualPoints}</td>
                    <td className="py-4 px-2 text-center font-mono font-medium text-sm text-neutral-700 dark:text-neutral-300">{breakdown.groupPoints}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
`;
  
  content = content.substring(0, idx) + replacement;
  fs.writeFileSync('src/components/ScoreboardView.tsx', content);
  console.log('patched ScoreboardView');
}
