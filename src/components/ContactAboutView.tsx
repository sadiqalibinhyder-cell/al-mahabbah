import React, { useState } from 'react';
import { SystemSettings } from '../types';
import { Mail, Phone, MapPin, Globe, HelpCircle, ChevronDown, ChevronUp, FileText, Heart, Shield, Info } from 'lucide-react';

interface ContactAboutViewProps {
  settings: SystemSettings;
}

export const ContactAboutView: React.FC<ContactAboutViewProps> = ({ settings }) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("FAQ");

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const coordinationTeam = [
    { name: 'Dr. Elizabeth Vance', role: 'Chief Culture Coordinator & Principal', email: 'vance.elizabeth@college.edu', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150' },
    { name: 'Prof. Alisha Vance', role: 'Stage Management Lead', email: 'alisha.vance@college.edu', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150' },
    { name: 'Tyler Durden', role: 'Student Union President', email: 'president@union.edu', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 max-w-4xl mx-auto" id="contact-about-view">
      
      {/* Hero Banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-neutral-900 shadow-xl" style={{ minHeight: '300px' }}>
        <img 
          src={settings.logoBanner} 
          alt="Festival Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end min-h-[300px]">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-2">
            {settings.festivalName}
          </h1>
          <p className="text-white/70 font-medium max-w-xl leading-relaxed">
            Academic Year {settings.academicYear} Official Management Portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* About Card */}
        <div className="premium-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Info className="text-indigo-500" size={24} /> About Us
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
            {settings.about}
          </p>
          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex gap-4">
            <button onClick={() => setActiveTab('FAQ')} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Read FAQ</button>
            <button onClick={() => setActiveTab('Terms')} className="text-sm font-bold text-neutral-500 hover:underline">Terms & Conditions</button>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="premium-card p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Mail className="text-rose-500" size={24} /> Contact
          </h2>
          
          <div className="space-y-4">
            <a href={`mailto:${settings.contactEmail}`} className="premium-surface p-4 rounded-[16px] flex items-center gap-4 hover:-translate-y-1 transition-transform group">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-sm">
                <Mail size={18} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Email Support</span>
                <span className="font-semibold text-neutral-900 dark:text-white text-sm">{settings.contactEmail}</span>
              </div>
            </a>
            
            <a href={`tel:${settings.contactPhone}`} className="premium-surface p-4 rounded-[16px] flex items-center gap-4 hover:-translate-y-1 transition-transform group">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Phone Hotline</span>
                <span className="font-semibold text-neutral-900 dark:text-white text-sm">{settings.contactPhone}</span>
              </div>
            </a>
          </div>
        </div>

      </div>

      {/* Tabs area for FAQ/Terms/Privacy */}
      <div className="premium-card p-6 md:p-8 min-h-[400px]">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-black/5 dark:border-white/5 pb-4">
          {['FAQ', 'Terms', 'Privacy'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab === 'FAQ' ? 'Frequently Asked Questions' : tab === 'Terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </button>
          ))}
        </div>

        <div className="animate-fade-in text-sm text-neutral-700 dark:text-neutral-300">
          {activeTab === 'FAQ' && (
            <div className="space-y-4">
              {settings.faqList.map((faq, idx) => (
                <div key={idx} className="premium-surface p-5 rounded-[20px] border border-black/5 dark:border-white/5">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base mb-2">{faq.question}</h4>
                  <p className="leading-relaxed opacity-90">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Privacy' && (
            <div className="bg-white/50 dark:bg-neutral-900/50 p-6 rounded-[24px] whitespace-pre-line leading-relaxed font-medium">
              {settings.privacyPolicy}
            </div>
          )}
          {activeTab === 'Terms' && (
            <div className="bg-white/50 dark:bg-neutral-900/50 p-6 rounded-[24px] whitespace-pre-line leading-relaxed font-medium">
              {settings.termsAndConditions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
