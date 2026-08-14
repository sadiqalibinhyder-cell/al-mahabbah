const fs = require('fs');
let content = fs.readFileSync('src/components/ResultsView.tsx', 'utf8');

// Replace state names
content = content.replace(/searchTerm/g, 'searchQuery');
content = content.replace(/setSearchTerm/g, 'setSearchQuery');
content = content.replace(/categoryFilter/g, 'filterCategory');
content = content.replace(/setCategoryFilter/g, 'setFilterCategory');
content = content.replace(/categoryGroupFilter/g, 'filterCategoryGroup');
content = content.replace(/setCategoryGroupFilter/g, 'setFilterCategoryGroup');

fs.writeFileSync('src/components/ResultsView.tsx', content);
console.log('patched res2');
