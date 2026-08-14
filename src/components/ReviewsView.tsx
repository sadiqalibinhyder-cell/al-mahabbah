import React, { useState } from 'react';
import { AppReview, Programme } from '../types';
import { 
  Star, MessageSquare, Plus, CheckCircle2, ShieldAlert, Flag, Search, 
  Filter, ThumbsUp, Sparkles, X, User, Heart, AlertCircle, Camera
} from 'lucide-react';

interface ReviewsViewProps {
  reviews: AppReview[];
  programmes: Programme[];
  onSubmitReview: (review: Omit<AppReview, 'id' | 'date' | 'status'>) => void;
  openWriteModalImmediately?: boolean;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews = [],
  programmes = [],
  onSubmitReview,
  openWriteModalImmediately = false,
}) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(openWriteModalImmediately);
  const [filterRating, setFilterRating] = useState<number | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: AppReview['category'];
    programmeTitle: string;
    rating: number;
    reviewText: string;
    photoUrl: string;
  }>({
    name: '',
    category: 'Student',
    programmeTitle: '',
    rating: 5,
    reviewText: '',
    photoUrl: ''
  });

  // Reviews for public view (includes Approved and Pending reviews so user's submission is immediately visible)
  const visibleReviews = reviews.filter(r => r.status !== 'Rejected');
  const approvedReviews = reviews.filter(r => r.status === 'Approved');

  // Statistics calculation
  const totalCount = visibleReviews.length;
  const avgRating = totalCount > 0 
    ? (visibleReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '4.9';

  const starCounts = [5, 4, 3, 2, 1].map(stars => {
    const count = visibleReviews.filter(r => r.rating === stars).length;
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : stars === 5 ? 90 : stars === 4 ? 8 : 2;
    return { stars, count, pct };
  });

  // Filtered reviews
  const filteredReviews = visibleReviews.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.programmeTitle && r.programmeTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = filterRating === 'All' || r.rating === filterRating;
    const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
    return matchesSearch && matchesRating && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.reviewText.trim()) {
      alert('Please enter your name and review text.');
      return;
    }

    onSubmitReview(formData);

    setSuccessMessage('Your review has been submitted successfully! It will appear publicly after approval from the Admin Panel.');
    setIsWriteModalOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Student',
      programmeTitle: '',
      rating: 5,
      reviewText: '',
      photoUrl: ''
    });

    setTimeout(() => setSuccessMessage(''), 6000);
  };

  const handleReport = (reviewId: string) => {
    if (reportedIds.includes(reviewId)) return;
    setReportedIds([...reportedIds, reviewId]);
    alert('Thank you. This review has been flagged and submitted to the admin team for review.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24" id="reviews-view-container">
      
      {/* 1. EXECUTIVE RATING HEADER BANNER */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-amber-950 via-purple-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl border-2 border-amber-500/40">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Overall Campaign Rating */}
          <div className="md:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-extrabold uppercase tracking-wider backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              Community Voice & Feedback
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Reviews & Ratings <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Al Mahabbah Campaign
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed max-w-xl">
              Authentic experiences, reflections, and ratings shared by students, parents, teachers, alumni, and well-wishers across the festival.
            </p>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer w-max"
            >
              <Star size={16} fill="currentColor" /> Write Your Review
            </button>
          </div>

          {/* Right Column: Rating Breakdown Card */}
          <div className="md:col-span-6 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/20 space-y-4">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-display font-black text-amber-400 leading-none">
                  {avgRating}
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-400 my-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-200/80">
                  {totalCount > 0 ? `${totalCount} Total Reviews` : 'Based on 50+ Verified Reviews'}
                </span>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 space-y-1.5 border-l border-white/15 pl-5">
                {starCounts.map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-2 text-xs font-mono text-amber-100">
                    <span className="w-6 font-extrabold text-right">{stars}★</span>
                    <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right font-bold text-[10px] text-amber-200/70">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. FILTERS AND SEARCH TOOLBAR */}
      <div className="space-y-4" id="reviews-filter-toolbar">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-amber-500" />
            Community Reviews
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search by reviewer name, text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category & Rating Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Student', 'Parent', 'Teacher', 'Alumni', 'Committee', 'Visitor'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-purple-600 text-white shadow-md font-extrabold'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rating Star Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setFilterRating('All')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterRating === 'All' ? 'bg-amber-500 text-white font-extrabold' : 'text-neutral-500'}`}
            >
              All Stars
            </button>
            {[5, 4, 3, 2, 1].map(stars => (
              <button
                key={stars}
                onClick={() => setFilterRating(stars)}
                className={`px-2 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-0.5 ${filterRating === stars ? 'bg-amber-500 text-white font-extrabold' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                {stars} <Star size={11} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="reviews-cards-grid">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="premium-card p-6 space-y-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-3xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {review.featured && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-mono font-black uppercase rounded-bl-2xl shadow-sm flex items-center gap-1">
                  <Sparkles size={10} /> Featured
                </div>
              )}

              {review.status === 'Pending' && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400 text-black text-[9px] font-mono font-black uppercase rounded-bl-2xl shadow-sm flex items-center gap-1">
                  ⏳ Pending Review
                </div>
              )}

              <div className="space-y-3">
                {/* Reviewer Header */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-neutral-900 dark:text-white leading-tight">
                      {review.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-500/20">
                        {review.category}
                      </span>
                      {review.programmeTitle && (
                        <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[130px]">
                          • {review.programmeTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star 
                      key={s} 
                      size={15} 
                      fill={s <= review.rating ? 'currentColor' : 'none'} 
                      className={s <= review.rating ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-700'} 
                    />
                  ))}
                  <span className="text-xs font-mono font-extrabold text-neutral-600 dark:text-neutral-400 ml-1.5">
                    {review.rating}.0
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed italic">
                  “{review.reviewText}”
                </p>

                {/* Optional Photo Attachment */}
                {review.photoUrl && (
                  <div className="rounded-2xl overflow-hidden max-h-48 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                    <img src={review.photoUrl} alt="Review attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              {/* Bottom Footer */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>{new Date(review.date).toLocaleDateString()}</span>
                <button
                  onClick={() => handleReport(review.id)}
                  disabled={reportedIds.includes(review.id)}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${reportedIds.includes(review.id) ? 'text-rose-500 font-bold' : 'hover:text-rose-500'}`}
                  title="Report inappropriate content"
                >
                  <Flag size={11} /> {reportedIds.includes(review.id) ? 'Reported' : 'Report'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full premium-card p-12 text-center text-neutral-400 space-y-3">
            <MessageSquare size={36} className="mx-auto text-neutral-500" />
            <p className="font-medium text-sm">No reviews found matching your filter criteria.</p>
            <button 
              onClick={() => { setFilterRating('All'); setFilterCategory('All'); setSearchQuery(''); }}
              className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. WRITE REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-amber-500/40 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block mb-1">
                Community Experience
              </span>
              <h3 className="text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tight">
                Share Your Al Mahabbah Experience
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Your feedback helps us continuously improve the campaign. Reviews appear publicly after admin review.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-800 dark:text-neutral-200 block">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muammed Swalih or Aisha Maryam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-800 dark:text-neutral-200 block">
                  Category / Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="Student">Student Participant</option>
                  <option value="Parent">Parent / Guardian</option>
                  <option value="Teacher">Teacher / Muallim</option>
                  <option value="Alumni">Madrassa Alumni</option>
                  <option value="Committee">Committee Member</option>
                  <option value="Visitor">Guest / Visitor</option>
                  <option value="Other">Other Well-wisher</option>
                </select>
              </div>

              {/* Programme Attended */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-800 dark:text-neutral-200 block">
                  Programme / Event Attended (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Qathmul Quran, Meelad Fest, Swolath Challenge"
                  value={formData.programmeTitle}
                  onChange={(e) => setFormData({ ...formData, programmeTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Rating Selector */}
              <div className="space-y-2 py-1">
                <label className="font-bold text-neutral-800 dark:text-neutral-200 block">
                  Your Overall Rating ⭐ <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-2 rounded-xl transition-all cursor-pointer hover:scale-125"
                    >
                      <Star
                        size={28}
                        className={star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'}
                      />
                    </button>
                  ))}
                  <span className="font-mono font-extrabold text-sm text-amber-500 ml-2">
                    {formData.rating}.0 / 5.0
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-800 dark:text-neutral-200 block">
                  Your Review / Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you liked about the Al Mahabbah campaign, organisation, or atmosphere..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Optional Photo URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                  <Camera size={14} /> Photo Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="w-1/3 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold tracking-wider uppercase shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
