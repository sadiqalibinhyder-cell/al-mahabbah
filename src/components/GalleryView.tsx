import React, { useState } from 'react';
import { ImageIcon, Camera, Film, Users, Sparkles, X } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Stage' | 'Off-Stage' | 'Crowd' | 'Ceremony'>('All');
  const [activeTab, setActiveTab] = useState("All Moments");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const filteredPhotos = [
    { id: 1, url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800", category: "Stage Performances", caption: "Classical Dance Performance" },
    { id: 2, url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800", category: "Fine Arts", caption: "Watercolor Painting Competition" },
    { id: 3, url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800", category: "Stage Performances", caption: "Group Song Finals" },
    { id: 4, url: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=800", category: "Off-Stage", caption: "Essay Writing" },
    { id: 5, url: "https://images.unsplash.com/photo-1481886756534-97af88ccb438?q=80&w=800", category: "Literary", caption: "Elocution Contest" },
    { id: 6, url: "https://images.unsplash.com/photo-1478147424044-2eeef2009210?q=80&w=800", category: "Stage Performances", caption: "Mime Act" },
  ].filter(p => activeTab === "All Moments" || p.category === activeTab);
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; desc: string } | null>(null);

  const galleryItems = [
    { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600', category: 'Stage', title: 'Bharatanatyam Solo Recital', desc: 'Capturing precise poses and facial expressiveness during classical dance evaluations.' },
    { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600', category: 'Off-Stage', title: 'Charcoal Painting Focus', desc: 'Students detailing abstract standard textures under on-the-spot themes.' },
    { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600', category: 'Stage', title: 'Western Vocal Solos', desc: 'Acoustic guitar support with deep classical vocal ranges in Seminar B.' },
    { url: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=600', category: 'Crowd', title: 'Gryphons Supporters Arena', desc: 'Dynamic student cheers during stage announcements at the Main Quadrangle.' },
    { url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600', category: 'Stage', title: 'Skit & One Act Mimicry', desc: 'Humorous performance regarding university life, and social critiques.' },
    { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600', category: 'Ceremony', title: 'Championship Trophy Unveiling', desc: 'Dr. Vance revealing the official rolling gold cup during the Inauguration.' },
    { url: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?q=80&w=600', category: 'Crowd', title: 'Creative Rally Flags', desc: 'Representatives from Blue Phoenix parade their banners in front of administrative offices.' },
    { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600', category: 'Ceremony', title: 'Spotlight Winners Cheer', desc: 'Alex Rivera receiving first-place accolades for western acoustics.' }
  ];

  const filteredItems = galleryItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
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
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                : 'premium-surface text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
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
