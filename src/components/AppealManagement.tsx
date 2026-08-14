import React, { useState } from 'react';
import { UserProfile, Programme, Appeal, PublishedResult } from '../types';
import { ShieldAlert, AlertCircle, Check, Send, Clock, FileUp, Info, HelpCircle, ArrowRight, UserCheck } from 'lucide-react';

interface AppealManagementProps {
  currentUser: UserProfile | null;
  programmes: Programme[];
  results: PublishedResult[];
  appeals: Appeal[];
  onSubmitAppeal: (programmeId: string, reason: string, file: string) => void;
  onNavigate: (view: string) => void;
}

export const AppealManagement: React.FC<AppealManagementProps> = ({
  currentUser,
  programmes,
  results,
  appeals,
  onSubmitAppeal,
  onNavigate,
}) => {
  const [selectedProgId, setSelectedProgId] = useState('');
  const [reason, setReason] = useState('');
  const [attachedFile, setAttachedFile] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);

  // Eligible programmes for appeals: 
  // 1. Registered by current student 
  // 2. Results published
  const eligibleProgrammes = programmes.filter(p => 
    (currentUser?.registeredProgrammeIds || []).includes(p.id) && p.resultPublished
  );

  // Filter appeals for current logged-in student
  const myAppeals = appeals.filter(app => app.studentId === currentUser?.id);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedFile(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgId) {
      setErrorMsg('Please select a completed programme.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please enter a detailed statement of your appeal concern.');
      return;
    }

    // Submit
    onSubmitAppeal(selectedProgId, reason, attachedFile || 'self_attestation_form.pdf');
    
    // Clear
    setSelectedProgId('');
    setReason('');
    setAttachedFile('');
    setErrorMsg('');
    setSuccessMsg('Your appeal concern has been filed successfully. Our committee will review it within 2 hours.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="appeal-page-wrapper">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-800 dark:text-neutral-100 tracking-tight">Appeal Management Desk</h2>
          <p className="text-sm text-neutral-500">Ensure absolute fairness. Submit digital evaluation recheck appeals within specified time limits.</p>
        </div>
      </div>

      {/* 1. NOT LOGGED IN: Redirect warning */}
      {!currentUser || currentUser.role !== 'student' ? (
        <div className="rounded-2xl premium-card p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm" id="appeal-unauthorized">
          <ShieldAlert size={48} className="text-rose-500 mx-auto animate-pulse" />
          <h3 className="text-lg font-display font-bold text-neutral-800 dark:text-neutral-100">Leader Sign-In Required</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            You must be signed in as a team leader to submit formal grievances, upload proof documents, and monitor review timeline states.
          </p>
          <button 
            id="redirect-login-btn"
            onClick={() => onNavigate('Registration')}
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            Go to Leaders Portal <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        /* 2. LOGGED IN: Appeals Console */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="appeals-split-console">
          
          {/* Left Column: Submit Appeal Form */}
          <div className="lg:col-span-2 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-sm h-fit space-y-4" id="submit-appeal-form-box">
            <div>
              <h3 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-100">Submit New Grievance</h3>
              <p className="text-xs text-neutral-400">File a complaint based on technical errors, sound glitches, or operator anomalies.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs items-stretch">
              {/* Event selection */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-neutral-400 block">Select Programme</label>
                <select
                  value={selectedProgId}
                  onChange={(e) => setSelectedProgId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 font-semibold outline-none appearance-none"
                >
                  <option value="" className="bg-neutral-100 dark:bg-white/5">-- Choose Completed Programme --</option>
                  {eligibleProgrammes.map((p) => (
                    <option key={p.id} value={p.id} className="bg-neutral-100 dark:bg-white/5">
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
                {eligibleProgrammes.length === 0 && (
                  <span className="text-[10px] text-rose-500 italic block mt-1 font-semibold">
                    No completed programmes with published results found in your enrollment list.
                  </span>
                )}
              </div>

              {/* Grievance Statement */}
              <div className="space-y-1.5 md:col-span-1 flex flex-col h-full">
                <label className="font-semibold text-neutral-400 block">Statement of Concern</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Please specify details such as lighting breakdowns, karaoke tracks stopped mid-performance, or stage crew interruption..."
                  className="w-full flex-1 min-h-[140px] px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Drag and drop file upload */}
              <div className="space-y-1.5 md:col-span-1 flex flex-col h-full">
                <label className="font-semibold text-neutral-400 block">Supporting Attachment (Optional)</label>
                
                <div 
                  id="drop-zone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 min-h-[140px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : attachedFile 
                      ? 'border-emerald-400 bg-emerald-500/5' 
                      : 'border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5'
                  }`}
                >
                  <input 
                    type="file" 
                    id="file-upload-input"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block w-full">
                    <FileUp size={24} className="mx-auto text-neutral-400" />
                    {attachedFile ? (
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{attachedFile}</div>
                    ) : (
                      <div className="text-neutral-400 text-sm">
                        Drag & Drop or <span className="text-indigo-600 dark:text-indigo-400 underline font-semibold">Browse proof video/docs</span>
                      </div>
                    )}
                    <span className="text-[10px] text-neutral-400 block mt-1">Support: MP4, PDF, JPEG (Max 10MB)</span>
                  </label>
                </div>
              </div>

              {/* Message feedbacks */}
              <div className="md:col-span-2 flex flex-col gap-3 mt-1">
                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200/50 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <Check size={14} className="shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/30 border border-rose-200/50 text-rose-800 dark:text-rose-300 text-[11px] flex items-center gap-1.5">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={!selectedProgId || !reason.trim()}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold flex justify-center items-center gap-2 transition-colors"
                >
                  <Send size={16} />
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Submitted Appeals & Timeline Tracking */}
          <div className="lg:col-span-3 rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-sm space-y-4" id="appeals-timeline-matrix">
            <div>
              <h3 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-100">Filed Appeals Log</h3>
              <p className="text-xs text-neutral-400">Track current status of submitted applications live.</p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1" id="appeals-ledger-list">
              {myAppeals.length > 0 ? (
                myAppeals.map((app) => {
                  // Timeline state markers
                  const states = ['Submitted', 'Under Review', 'Accepted', 'Completed'];
                  const curIdx = states.includes(app.status) 
                    ? states.indexOf(app.status) 
                    : app.status === 'Rejected' 
                    ? 2 // rejected replaces accepted in layout
                    : 0;

                  return (
                    <div 
                      key={app.id}
                      className="p-4.5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/20 dark:border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block">{app.id}</span>
                          <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-100">{app.programmeTitle}</h4>
                          <span className="text-[10px] text-neutral-400 font-mono">Filed on {new Date(app.datetime).toLocaleDateString()}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                          app.status === 'Completed' 
                            ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' 
                            : app.status === 'Accepted'
                            ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Timeline flow display */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase text-neutral-400">Review Timeline Track</span>
                        <div className="grid grid-cols-4 gap-1 pt-1.5" id={`timeline-row-${app.id}`}>
                          {states.map((st, sIdx) => {
                            let stateColor = 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400';
                            
                            if (app.status === 'Rejected' && sIdx === 2) {
                              stateColor = 'bg-rose-500 text-white font-bold';
                            } else if (sIdx <= curIdx) {
                              stateColor = sIdx === 3 ? 'bg-emerald-500 text-white font-bold' : 'bg-indigo-500 text-white font-bold';
                            }

                            return (
                              <div key={st} className="flex flex-col items-center">
                                <div className={`w-full h-1 rounded-full ${sIdx <= curIdx ? 'bg-indigo-500' : 'bg-neutral-200 dark:bg-neutral-800'}`} />
                                <span className={`text-[8px] font-mono mt-1 ${sIdx === curIdx ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-neutral-400'}`}>
                                  {app.status === 'Rejected' && sIdx === 2 ? 'Rejected' : st}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reason Description */}
                      <div className="text-xs text-neutral-600 dark:text-neutral-200 bg-white/40 dark:bg-white/20 p-3 rounded-xl border border-white/20 dark:border-white/10">
                        <span className="font-bold text-[9px] text-neutral-400 uppercase block mb-1">Your Filed Statement</span>
                        &ldquo;{app.reason}&rdquo;
                      </div>

                      {/* Official Administrative response */}
                      {app.adminNotes && (
                        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/20 text-xs space-y-1">
                          <span className="font-bold text-[9px] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1">
                            <UserCheck size={12} /> Committee Resolution Note
                          </span>
                          <p className="text-neutral-700 dark:text-neutral-200 italic">{app.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-neutral-400 text-sm italic premium-card">
                  No filed appeals found for your account. If you have an evaluation concern, fill out the form to initiate a review.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
