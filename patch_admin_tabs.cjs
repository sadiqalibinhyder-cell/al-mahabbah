const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const target = `          {/* Dashboard Header Bar */}
          <div className="rounded-2xl premium-card p-3 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs" id="admin-hud">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                <Settings size={20} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-indigo-500 font-bold">Secure Root Dashboard</div>
                <h2 className="text-base font-display font-bold text-neutral-800 dark:text-neutral-100">{currentUser.name} (Lead)</h2>
              </div>
            </div>

            {/* Navigation Tabs for Admin panels */}
            <div className="flex overflow-x-auto hide-scrollbar gap-1 pb-2 sm:pb-0 sm:flex-wrap" id="admin-tabs-row">
              {[
                { key: 'Analytics', label: 'Overview' },
                { key: 'Programmes', label: 'Programmes Catalog' },
                { key: 'TeamManagement', label: 'Teams & Leaders' },
                { key: 'JudgeControl', label: 'Judge Control' },
                { key: 'ResultPublishing', label: 'Result Publishing' },
                { key: 'ScoringConfig', label: 'Scoring Point Rules' },
                { key: 'LeadersActivity', label: 'Leaders Desk Activity' },
                { key: 'Appeals', label: \`Appeals (\${appeals.filter(a => a.status !== 'Completed').length})\` },
                { key: 'CMS', label: 'CMS Editor' },
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
                  className={\`whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer \${
                    activeTab === tab.key 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'hover:bg-white/20 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-200'
                  }\`}
                >
                  {tab.label}
                </button>
              ))}
              
              <button 
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>`;

const replacement = `          {/* Dashboard Header Bar */}
          <div className="rounded-2xl premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs" id="admin-hud">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                <Settings size={24} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-indigo-500 font-bold mb-1">Secure Root Dashboard</div>
                <h2 className="text-xl font-display font-bold text-neutral-800 dark:text-neutral-100">{currentUser.name} (Lead)</h2>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-full text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs for Admin panels */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 px-1" id="admin-tabs-row">
            {[
              { key: 'Analytics', label: 'Overview' },
              { key: 'Programmes', label: 'Programmes Catalog' },
              { key: 'TeamManagement', label: 'Teams & Leaders' },
              { key: 'JudgeControl', label: 'Judge Control' },
              { key: 'ResultPublishing', label: 'Result Publishing' },
              { key: 'ScoringConfig', label: 'Scoring Point Rules' },
              { key: 'LeadersActivity', label: 'Leaders Desk Activity' },
              { key: 'Appeals', label: \`Appeals (\${appeals.filter(a => a.status !== 'Completed').length})\` },
              { key: 'CMS', label: 'CMS Editor' },
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
                className={\`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 \${
                  activeTab === tab.key 
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md' 
                    : 'premium-surface text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }\`}
              >
                {tab.label}
              </button>
            ))}
          </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/AdminPanel.tsx', content);
  console.log("Patched tabs layout successfully");
} else {
  console.log("Target not found!");
}
