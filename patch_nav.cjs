const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We will replace the entire header and mobile menu block.
let headerStart = content.indexOf('<header');
let mobileMenuEnd = content.indexOf('</header>') + 9;
// Wait, the mobile menu is outside the header
let mobileMenuStart = content.indexOf('{/* 2. Mobile Glass Menu Sheet Overlay */}');
let mobileMenuBlockEnd = content.indexOf('{/* 3. Global Banner - Active Session Badge */}');

const newNav = `
      {/* Top Nav bar Desktop (Floating Pill) & Mobile Top Bar */}
      <header className="fixed top-0 inset-x-0 z-40 px-4 pt-4 pb-2 md:py-4 pointer-events-none transition-all duration-300" id="main-navigation-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Logo Brand pairing */}
          <div 
            onClick={() => setActiveView('Home')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity select-none premium-surface px-4 py-2"
            id="brand-header-logo"
          >
            <div className="w-8 h-8 rounded-[10px] bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-extrabold text-sm shadow-md">
              A
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="font-display font-bold text-[15px] text-neutral-900 dark:text-white tracking-tight leading-none mb-0.5">
                {settings?.logoText || 'Aesthetica'}
              </span>
              <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 block tracking-wider leading-none uppercase font-semibold">
                Fest Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Responsive iOS styled pill) */}
          <nav className="hidden lg:flex items-center p-1.5 premium-surface border border-black/5 dark:border-white/10" id="desktop-nav-menu">
            {[
              { key: 'Home', label: 'Home' },
              { key: 'Scoreboard', label: 'Scoreboard' },
              { key: 'Programmes', label: 'Programmes' },
              { key: 'Registration', label: 'Leaders' },
              { key: 'Results', label: 'Results' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveView(item.key);
                  setMobileMenuOpen(false);
                }}
                className={\`px-4 py-2 rounded-[14px] flex items-center gap-1.5 transition-all duration-300 text-sm font-medium \${
                  activeView === item.key 
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md' 
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                }\`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
            
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="px-3 py-2 rounded-[14px] text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium flex items-center gap-1 transition-all"
            >
              More <Menu size={16}/>
            </button>
          </nav>

          {/* Right Header Controls: Dark mode, portals selector */}
          <div className="flex items-center gap-2 pointer-events-auto premium-surface p-1.5 border border-black/5 dark:border-white/10" id="header-controls">
            {/* Dark mode switcher */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
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
          { key: 'Registration', label: 'Teams', icon: <Star size={22} strokeWidth={2.5} /> },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={\`flex flex-col items-center gap-1 p-2 transition-all duration-300 \${
              activeView === item.key 
                ? 'text-neutral-900 dark:text-white scale-110' 
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600'
            }\`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 transition-all"
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
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <X size={18} />
              </button>
            </div>
            
            <div className="overflow-y-auto hide-scrollbar space-y-1">
              {[
                { key: 'Home', label: 'Home', icon: <Home size={18} /> },
                { key: 'Programmes', label: 'Programmes', icon: <ListChecks size={18} /> },
                { key: 'Registration', label: 'Leaders Portal', icon: <Star size={18} /> },
                { key: 'Results', label: 'Results Standings', icon: <Award size={18} /> },
                { key: 'Scoreboard', label: 'Overall Scoreboard', icon: <Trophy size={18} /> },
                { key: 'Gallery', label: 'Image Gallery', icon: <ImageIcon size={18} /> },
                { key: 'Appeals', label: 'Appeals Desk', icon: <ShieldAlert size={18} /> },
                { key: 'Feedback', label: 'Feedback Desk', icon: <MessageSquare size={18} /> },
                { key: 'AboutContact', label: 'About & Support FAQ', icon: <Info size={18} /> },
                { key: 'JudgePortal', label: 'Examiner Jury Desk', icon: <UserCheck size={18} /> },
                { key: 'AdminPanel', label: 'Admin Control Center', icon: <Shield size={18} /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveView(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={\`w-full p-4 rounded-[16px] flex items-center gap-3 transition-all \${
                    activeView === item.key 
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold shadow-sm' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium'
                  }\`}
                >
                  <span className={\`\${activeView === item.key ? 'text-white dark:text-black' : 'text-neutral-400 dark:text-neutral-500'}\`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
`;

content = content.substring(0, headerStart) + newNav + content.substring(mobileMenuBlockEnd);

// Add space at the top of the main container to account for floating nav, and bottom for mobile nav
let mainTagStart = content.indexOf('<main className="max-w-7xl');
content = content.replace('<main className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-8" id="primary-workspace">', 
'<main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-24 md:pb-8" id="primary-workspace">');

fs.writeFileSync('src/App.tsx', content);
console.log('patched App navigation');
