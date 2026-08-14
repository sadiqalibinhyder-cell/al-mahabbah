const fs = require('fs');
let content = fs.readFileSync('src/components/GalleryView.tsx', 'utf8');

const startString = `return (`;
const idx = content.indexOf(startString);

if (idx !== -1) {
  const replacement = `return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20" id="gallery-view-container">
      {/* Premium Header */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="text-blue-500" size={32} strokeWidth={2.5} />
            Visual Archive
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Explore memorable moments from the festival</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-1" id="gallery-filters">
        {['All Moments', 'Stage Performances', 'Fine Arts', 'Literary', 'Off-Stage'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 \${
              activeTab === tab 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                : 'premium-surface text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }\`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4" id="gallery-masonry">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedImage(photo.url)}
            className="relative rounded-[24px] overflow-hidden group cursor-pointer bg-neutral-200 dark:bg-neutral-800 break-inside-avoid transform hover:scale-[1.02] transition-transform duration-300"
          >
            <img 
              src={photo.url} 
              alt={photo.caption}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 mb-1">{photo.category}</span>
              <p className="text-white font-semibold text-sm leading-tight drop-shadow-md">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-fade-in"
        >
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md">
            <X size={24} />
          </button>
          <img 
            src={selectedImage}
            alt="Expanded view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-up"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
`;

  content = content.substring(0, idx) + replacement;
  fs.writeFileSync('src/components/GalleryView.tsx', content);
  console.log('patched GalleryView');
}
