const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'setSettings(data.settings);',
  'setSettings(data.settings || db.settings);'
);
content = content.replace(
  'setSecurity(data.security);',
  'setSecurity(data.security || db.security);'
);
content = content.replace(
  'setProgrammes(data.programmes);',
  'setProgrammes(data.programmes || db.programmes);'
);
content = content.replace(
  'setTeams(data.teams);',
  'setTeams(data.teams || db.teams);'
);
content = content.replace(
  'setUsers(data.users);',
  'setUsers(data.users || db.users);'
);
content = content.replace(
  'setResults(data.results);',
  'setResults(data.results || db.results);'
);
content = content.replace(
  'setAppeals(data.appeals);',
  'setAppeals(data.appeals || db.appeals);'
);
content = content.replace(
  'setFeedback(data.feedback);',
  'setFeedback(data.feedback || db.feedback);'
);
content = content.replace(
  'setAnnouncements(data.announcements);',
  'setAnnouncements(data.announcements || db.announcements);'
);
content = content.replace(
  'setAuditLogs(data.auditLogs);',
  'setAuditLogs(data.auditLogs || db.auditLogs);'
);

fs.writeFileSync('src/App.tsx', content);
console.log('patched App.tsx');
