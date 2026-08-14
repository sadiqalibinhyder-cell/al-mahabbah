import React, { useState } from 'react';
import { Feedback } from '../types';
import { Star, MessageSquare, Check, User, Heart, Smile, Info, TrendingUp } from 'lucide-react';

interface FeedbackViewProps {
  feedback: Feedback[];
  onSubmitFeedback: (rating: number, category: Feedback['category'], comments: string, name: string, isAnonymous: boolean) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedback,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<Feedback['category']>('Overall');
  const [comments, setComments] = useState('');
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate aggregated stats
  const totalFeedbackCount = feedback.length;
  const avgRating = totalFeedbackCount > 0 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedbackCount).toFixed(1) 
    : '5.0';

  // Category counts
  const getCategoryAverage = (cat: Feedback['category']) => {
    const catItems = feedback.filter(f => f.category === cat);
    if (catItems.length === 0) return '5.0';
    return (catItems.reduce((sum, item) => sum + item.rating, 0) / catItems.length).toFixed(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please write down your feedback comments first.');
      return;
    }

    onSubmitFeedback(rating, category, comments, name, isAnonymous);
    
    // reset states
    setRating(5);
    setComments('');
    setName('');
    setIsAnonymous(false);
    setSuccessMsg('Thank you for sharing your valuable review. Your response contributes directly to subsequent organizational excellence.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="feedback-page-wrapper">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-800 dark:text-neutral-100 tracking-tight">Community Feedback Panel</h2>
          <p className="text-sm text-neutral-500">Your voice matters. Rate different coordination aspects of our arts festival to guide future improvements.</p>
        </div>
      </div>

      {/* AGGREGATED FEEDBACK METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="feedback-stats-matrix">
        <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-5 shadow-xs text-center flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Aggregated rating</span>
          <div className="text-4xl font-bold text-neutral-800 dark:text-white mt-1.5 font-mono flex items-center justify-center gap-1.5">
            <Star className="text-amber-500 fill-amber-500" size={32} />
            {avgRating}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1">Based on {totalFeedbackCount} submissions</span>
        </div>

        {[
          { label: 'Programmes Quality', cat: 'Programmes' as const },
          { label: 'Venues & Space', cat: 'Venues' as const },
          { label: 'Scheduling & Pace', cat: 'Scheduling' as const },
        ].map((item) => (
          <div key={item.cat} className="rounded-2xl premium-card p-3 sm:p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">{item.label}</span>
            <div className="flex items-center justify-between mt-3">
              <span className="text-2xl font-bold font-mono text-neutral-800 dark:text-white">
                {getCategoryAverage(item.cat)} <span className="text-xs text-neutral-400">/ 5</span>
              </span>
              <div className="flex text-amber-500">
                <Star size={16} className="fill-current" />
              </div>
            </div>
            <div className="w-full h-1 bg-neutral-200/30 dark:bg-white/10 rounded-full mt-2 overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full bg-indigo-500" 
                style={{ width: `${(parseFloat(getCategoryAverage(item.cat)) / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* FEEDBACK split: entry form vs. testimonials timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="feedback-split-layout">
        
        {/* Entry feedback form */}
        <div className="lg:col-span-2 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-sm h-fit space-y-4" id="submit-feedback-card">
          <div>
            <h3 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
              <Smile size={18} className="text-indigo-500" />
              Share Your Review
            </h3>
            <p className="text-xs text-neutral-400">Choose rating stars and specify optional name details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 5-star component */}
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-400 block">Overall Satisfaction Rating</label>
              <div className="flex gap-2" id="star-rating-row">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = hoverRating !== null ? star <= hoverRating : star <= rating;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star 
                        size={28} 
                        className={`transition-colors ${
                          active 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-neutral-300 dark:text-neutral-750'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-400 block">Review Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-xs text-neutral-800 dark:text-neutral-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold"
              >
                <option value="Overall" className="bg-neutral-100 dark:bg-white/5">Overall coordination</option>
                <option value="Programmes" className="bg-neutral-100 dark:bg-white/5">Programmes selection & flow</option>
                <option value="Venues" className="bg-neutral-100 dark:bg-white/5">Venue locations & acoustics</option>
                <option value="Scheduling" className="bg-neutral-100 dark:bg-white/5">Schedules, delays or deadlines</option>
                <option value="Hospitality" className="bg-neutral-100 dark:bg-white/5">Host food or safety precautions</option>
                <option value="Technical" className="bg-neutral-100 dark:bg-white/5">Website speed & online portal</option>
              </select>
            </div>

            {/* comments statement */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-400 block">Detailed Suggestions / Comments</label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write your constructive critique here..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-xs text-neutral-800 dark:text-neutral-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* identity choices */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-400">Anonymous Submission</span>
                <input 
                  type="checkbox" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 dark:border-white/10 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {!isAnonymous && (
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-400 block">Your Name (Optional)</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alisha Vance"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-xs text-neutral-800 dark:text-neutral-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200/50 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                <Check size={14} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:shadow-sm cursor-pointer"
            >
              <MessageSquare size={14} /> Submit Anonymous/Public Review
            </button>
          </form>
        </div>

        {/* Public feedback Testimonials timeline */}
        <div className="lg:col-span-3 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-sm space-y-4" id="feedbacks-ledger-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-100">Live Testimonials</h3>
            <span className="text-[10px] text-neutral-400 font-mono">Real-time submissions</span>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1" id="feedbacks-scroller-list">
            {feedback.map((feed) => (
              <div 
                key={feed.id}
                className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 shrink-0">
                      <User size={12} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-neutral-800 dark:text-neutral-100">
                        {feed.isAnonymous ? 'Anonymous Visitor' : feed.name || 'Visitor'}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 block">
                        Category: {feed.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={12} 
                        className={idx < feed.rating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                  &ldquo;{feed.comments}&rdquo;
                </p>

                <span className="text-[9px] font-mono text-neutral-400 block pt-1 text-right">
                  {new Date(feed.datetime).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
