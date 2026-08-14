const fs = require('fs');
let content = fs.readFileSync('src/components/ProgrammesView.tsx', 'utf8');

// Replace state names
content = content.replace(/searchTerm/g, 'searchQuery');
content = content.replace(/setSearchTerm/g, 'setSearchQuery');
content = content.replace(/categoryFilter/g, 'filterCategory');
content = content.replace(/setCategoryFilter/g, 'setFilterCategory');
content = content.replace(/sectionFilter/g, 'filterSection');
content = content.replace(/setSectionFilter/g, 'setFilterSection');
content = content.replace(/typeFilter/g, 'filterType');
content = content.replace(/setTypeFilter/g, 'setFilterType');
content = content.replace(/expandedProgId/g, 'expandedId');
content = content.replace(/setExpandedProgId/g, 'setExpandedId');

fs.writeFileSync('src/components/ProgrammesView.tsx', content);
console.log('patched prog2');
