import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Flame, 
  Send, 
  CheckCircle2, 
  Wrench, 
  RotateCcw,
  Sparkles,
  AlertCircle,
  Trash2
} from 'lucide-react';

export default function TicketDetailModal({ ticket, onClose }) {
  const { 
    currentUser, 
    voteTicket, 
    addComment, 
    verifyResolution,
    deleteTicket,
    canViewStudentDetails,
    reviewTicketByPanel,
    tickets 
  } = useApp();

  const [commentText, setCommentText] = useState('');

  const currentTicket = tickets.find(t => t.id === ticket.id) || ticket;
  const hasConfirmed = currentTicket.upvotes?.includes(currentUser?.id);
  const isReporter = currentTicket.raisedBy?.id === currentUser?.id;
  const isAwaitingVerification = currentTicket.status === 'awaiting_verification';
  const showPrivateIdentity = canViewStudentDetails(currentTicket.raisedBy) || Boolean(currentTicket.raisedByPanelRole);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(currentTicket.id, commentText.trim());
    setCommentText('');
  };

  const steps = [
    { key: 'reported', label: 'Reported' },
    { key: 'triage', label: 'Advisor/Warden Approved' },
    { key: 'in_progress', label: 'Main Admin Dispatched' },
    { key: 'awaiting_verification', label: 'Awaiting Sign-off' },
    { key: 'resolved', label: 'Verified & Closed' }
  ];

  const getStepIndex = (t) => {
    if (t.status === 'resolved') return 4;
    if (t.status === 'awaiting_verification') return 3;
    if (t.status === 'in_progress') return 2;
    if (t.status === 'acknowledged' || t.forwardedToMainAdmin || t.advisorEndorsed || t.wardenEndorsed) return 1;
    return 0;
  };

  const currentStepIdx = getStepIndex(currentTicket);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-ivory-300 rounded-3xl max-w-3xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-forest-950 px-2.5 py-0.5 rounded-full bg-ivory-200 border border-ivory-300">
              #{currentTicket.id}
            </span>
            <span className="text-xs text-charcoal-500">
              Scope: <strong className="text-forest-950 capitalize">{currentTicket.scope?.replace('_', ' ')}</strong>
            </span>
            {(currentTicket.advisorEndorsed || currentTicket.advisorApprovalStatus === 'approved') && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ Advisor Approved (+20 Priority)
              </span>
            )}
            {(currentTicket.wardenEndorsed || currentTicket.wardenApprovalStatus === 'approved') && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ✓ Warden Approved (+20 Priority)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-forest-950 hover:bg-ivory-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">

          {/* Lifecycle Stepper */}
          <div className="bg-ivory-100/80 p-4 rounded-2xl border border-ivory-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 mb-3 flex items-center justify-between">
              <span>2-Stage Governance & Resolution Lifecycle</span>
              <span className="text-emerald-700 font-mono font-bold">
                {currentTicket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-ivory-300 -z-0" />
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 -z-0" 
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 92}%` }}
              />

              {steps.map((st, i) => (
                <div key={st.key} className="flex flex-col items-center z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    i <= currentStepIdx 
                      ? 'bg-emerald-600 border-white text-white shadow-sm' 
                      : 'bg-white border-ivory-300 text-charcoal-400'
                  }`}>
                    {i < currentStepIdx ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold text-center ${i <= currentStepIdx ? 'text-forest-950' : 'text-charcoal-400'}`}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Way Student Verification Panel */}
          {isReporter && isAwaitingVerification && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-1.5 text-amber-900 text-xs font-bold uppercase">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>On-Site Inspection Required</span>
                </div>
                <p className="text-xs text-charcoal-800 mt-1">
                  The domain technician marked this issue fixed. Please verify on-site to close the ticket.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => verifyResolution(currentTicket.id, true)}
                  className="btn-primary text-xs py-2 px-3.5 font-bold shadow-md"
                >
                  ✓ Confirm Resolution
                </button>
                <button
                  onClick={() => verifyResolution(currentTicket.id, false, 'Issue still persists')}
                  className="px-3 py-2 rounded-xl bg-ivory-100 hover:bg-rose-50 text-rose-700 text-xs font-semibold border border-ivory-300"
                >
                  Still Broken
                </button>
              </div>
            </div>
          )}

          {/* Title, Details, & Confidential Reporter Identity */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-forest-950 leading-snug">
              {currentTicket.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{currentTicket.location}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 fill-emerald-600" />
                <span>Priority Score: {currentTicket.priorityScore}/100</span>
              </span>
            </div>

            {/* Strict Student Privacy Card */}
            <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              showPrivateIdentity
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-ivory-100 border-ivory-300 text-charcoal-600'
            }`}>
              {showPrivateIdentity ? (
                <div>
                  <div className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Confidential Reporter Identity (Authorized View): {currentTicket.raisedBy?.name}</span>
                  </div>
                  <div className="text-[11px] text-charcoal-700 font-mono mt-0.5">
                    ID: {currentTicket.raisedBy?.rollNo || 'N/A'}
                    {currentTicket.raisedBy?.classSection ? ` • Section: ${currentTicket.raisedBy.classSection}` : ''}
                    {currentTicket.raisedBy?.hostel ? ` • Hostel: ${currentTicket.raisedBy.hostel} (Rm ${currentTicket.raisedBy.room || '-'})` : ''}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-charcoal-500" />
                  <span>
                    <strong>Student Identity Protected:</strong> Personal details (Roll No, Section, Hostel Room) are restricted exclusively to the student's Class Advisor, Hostel Resident Warden, and Main Admin.
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden h-60 border border-ivory-300 bg-ivory-100">
              <img
                src={currentTicket.imageUrl}
                alt={currentTicket.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
              {currentTicket.description}
            </p>
          </div>

          {/* Stage-1 Advisor / Warden Remarks & Main Admin Response */}
          {(currentTicket.advisorRemarks || currentTicket.wardenRemarks || currentTicket.adminNote) && (
            <div className="space-y-2.5">
              {currentTicket.advisorRemarks && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-950">Class Advisor Review Note ({currentTicket.classSection}):</div>
                  <p className="text-emerald-900 mt-0.5">{currentTicket.advisorRemarks}</p>
                </div>
              )}
              {currentTicket.wardenRemarks && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="font-bold text-amber-950">Hostel Resident Warden Review Note ({currentTicket.hostel}):</div>
                  <p className="text-amber-900 mt-0.5">{currentTicket.wardenRemarks}</p>
                </div>
              )}
              {currentTicket.adminNote && (
                <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-forest-950 uppercase tracking-wide">
                      {currentTicket.assignedTo ? `Main Admin Dispatch (${currentTicket.assignedTo})` : 'Main Admin / Domain Update'}
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">ETA: {currentTicket.eta}</span>
                  </div>
                  <p className="text-xs text-charcoal-700">{currentTicket.adminNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Community Confirmation Count */}
          <div className="p-4 rounded-2xl bg-white border border-ivory-200 flex items-center justify-between shadow-subtle">
            <div className="text-xs text-charcoal-700">
              <span className="font-bold text-forest-950">Peer Confirmation: </span>
              <span>{currentTicket.upvotes?.length || 0} students confirmed this problem.</span>
            </div>

            <button
              onClick={() => voteTicket(currentTicket.id, 'up')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                hasConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-ivory-100 text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-800 border border-ivory-300'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{hasConfirmed ? 'Confirmed' : 'Confirm'} ({currentTicket.upvotes?.length || 0})</span>
            </button>
          </div>

          {/* Discussion Thread */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion & Testimonials ({currentTicket.comments?.length || 0})</span>
            </h4>

            <div className="space-y-2.5">
              {currentTicket.comments?.map(c => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-xl border text-xs ${
                    c.isOfficial
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-ivory-50 border-ivory-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <img src={c.avatar} alt={c.userName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-forest-950">{c.userName}</span>
                      <span className="text-[10px] text-charcoal-500 font-mono">({c.userRole})</span>
                    </div>
                    <span className="text-[10px] text-charcoal-400">{c.timestamp}</span>
                  </div>
                  <p className="text-charcoal-800">{c.text}</p>
                </div>
              ))}

              {(!currentTicket.comments || currentTicket.comments.length === 0) && (
                <p className="text-xs text-charcoal-400 italic py-2">
                  No comments yet. Students and faculty can post observations below.
                </p>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Add a comment or on-site evidence update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input-field text-xs py-2 flex-1"
              />
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-3.5 font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
          <div>
            {(isReporter || currentUser?.role === 'central_admin' || currentUser?.role === 'super_admin') && (
              <button
                onClick={() => {
                  deleteTicket(currentTicket.id);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete This Request</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-4"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
