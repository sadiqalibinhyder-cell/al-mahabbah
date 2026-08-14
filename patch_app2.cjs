const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "localStorage.setItem('artsportal_settings', JSON.stringify(data.settings));",
  "localStorage.setItem('artsportal_settings', JSON.stringify(data.settings || db.settings));"
);
content = content.replace(
  "localStorage.setItem('artsportal_security', JSON.stringify(data.security));",
  "localStorage.setItem('artsportal_security', JSON.stringify(data.security || db.security));"
);
content = content.replace(
  "localStorage.setItem('artsportal_programmes', JSON.stringify(data.programmes));",
  "localStorage.setItem('artsportal_programmes', JSON.stringify(data.programmes || db.programmes));"
);
content = content.replace(
  "localStorage.setItem('artsportal_teams', JSON.stringify(data.teams));",
  "localStorage.setItem('artsportal_teams', JSON.stringify(data.teams || db.teams));"
);
content = content.replace(
  "localStorage.setItem('artsportal_users', JSON.stringify(data.users));",
  "localStorage.setItem('artsportal_users', JSON.stringify(data.users || db.users));"
);
content = content.replace(
  "localStorage.setItem('artsportal_results', JSON.stringify(data.results));",
  "localStorage.setItem('artsportal_results', JSON.stringify(data.results || db.results));"
);
content = content.replace(
  "localStorage.setItem('artsportal_appeals', JSON.stringify(data.appeals));",
  "localStorage.setItem('artsportal_appeals', JSON.stringify(data.appeals || db.appeals));"
);
content = content.replace(
  "localStorage.setItem('artsportal_feedback', JSON.stringify(data.feedback));",
  "localStorage.setItem('artsportal_feedback', JSON.stringify(data.feedback || db.feedback));"
);
content = content.replace(
  "localStorage.setItem('artsportal_announcements', JSON.stringify(data.announcements));",
  "localStorage.setItem('artsportal_announcements', JSON.stringify(data.announcements || db.announcements));"
);
content = content.replace(
  "localStorage.setItem('artsportal_auditLogs', JSON.stringify(data.auditLogs));",
  "localStorage.setItem('artsportal_auditLogs', JSON.stringify(data.auditLogs || db.auditLogs));"
);

fs.writeFileSync('src/App.tsx', content);
console.log('patched App.tsx 2');
