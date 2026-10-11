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
  Trash2,
  Zap,
  PackageSearch,
  Package,
  Lock
} from 'lucide-react';

export default function TicketDetailModal({ ticket, onClose }) {
  const { 
    currentUser, 
    voteTicket, 
    addComment, 
    verifyResolution,
    deleteTicket,
    canViewStudentDetails,
    canViewLostFoundDetails,
    reviewTicketByPanel,
    submitClaimRequest,
    reviewClaimRequest,
    tickets 
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [claimSent, setClaimSent] = useState(false);
  const [isClaimFormOpen, setIsClaimFormOpen] = useState(false);
  const [claimProof, setClaimProof] = useState('');
  const [claimLostLocation, setClaimLostLocation] = useState('');
  const [claimPhone, setClaimPhone] = useState(currentUser?.phone || '');

  const currentTicket = tickets.find(t => t.id === ticket.id) || ticket;
  const isLostFound = currentTicket.scope === 'lost_found' || currentTicket.category === 'lost_found';
  const hasConfirmed = currentTicket.upvotes?.includes(currentUser?.id);
  const isReporter = currentTicket.raisedBy?.id === currentUser?.id;
  const isAwaitingVerification = currentTicket.status === 'awaiting_verification';
  const showPrivateIdentity = canViewStudentDetails(currentTicket.raisedBy) || Boolean(currentTicket.raisedByPanelRole);
  const canSeeLostFoundSecrets = canViewLostFoundDetails(currentTicket);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in overscroll-contain">
      <div className="bg-white border border-ivory-300 rounded-2xl sm:rounded-3xl max-w-3xl w-full p-3.5 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[96dvh] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-ivory-200 gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold text-forest-950 px-2 py-0.5 rounded-full bg-ivory-200 border border-ivory-300">
              #{currentTicket.id}
            </span>
            <span className="text-[11px] sm:text-xs text-charcoal-500">
              Scope: <strong className="text-forest-950 capitalize">{currentTicket.scope?.replace('_', ' ')}</strong>
            </span>
            {isLostFound && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${
                currentTicket.lostFoundType === 'found'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                {currentTicket.lostFoundType === 'found' ? '🎒 Found Item (In Safe Custody)' : '📢 Lost Item Broadcast Alert'}
              </span>
            )}
            {(currentTicket.advisorEndorsed || currentTicket.advisorApprovalStatus === 'approved') && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ Advisor Approved (+20)
              </span>
            )}
            {(currentTicket.wardenEndorsed || currentTicket.wardenApprovalStatus === 'approved') && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ✓ Warden Approved (+20)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-forest-950 hover:bg-ivory-200 transition-colors touch-press shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 sm:py-5 pr-1 space-y-4 sm:space-y-6">

          {/* Lifecycle Stepper */}
          <div className="bg-ivory-100/80 p-3 sm:p-4 rounded-2xl border border-ivory-200 overflow-x-auto no-scrollbar">
            <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-charcoal-500 mb-2 sm:mb-3 flex items-center justify-between min-w-[280px]">
              <span>2-Stage Lifecycle</span>
              <span className="text-emerald-700 font-mono font-bold">
                {currentTicket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between relative px-2 min-w-[280px]">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-ivory-300 -z-0" />
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 -z-0" 
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 92}%` }}
              />

              {steps.map((st, i) => (
                <div key={st.key} className="flex flex-col items-center z-10">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold border-2 transition-all ${
                    i <= currentStepIdx 
                      ? 'bg-emerald-600 border-white text-white shadow-sm' 
                      : 'bg-white border-ivory-300 text-charcoal-400'
                  }`}>
                    {i < currentStepIdx ? '✓' : i + 1}
                  </div>
                  <span className={`text-[8px] sm:text-[10px] mt-1 font-semibold text-center max-w-[56px] sm:max-w-none truncate sm:whitespace-normal ${i <= currentStepIdx ? 'text-forest-950' : 'text-charcoal-400'}`}>
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
              {currentTicket.predictedSla && (
                <>
                  <span>•</span>
                  <span className="text-amber-800 font-bold flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>ML SLA: {currentTicket.predictedSla}</span>
                  </span>
                </>
              )}
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

            <div className="relative rounded-2xl overflow-hidden h-60 border border-ivory-300 bg-ivory-100 group">
              <img
                src={currentTicket.imageUrl}
                alt={currentTicket.title}
                className="w-full h-full object-cover"
              />

              {/* Computer Vision YOLOv8 Bounding Box Localization Overlay */}
              {currentTicket.boundingBox && (
                <div 
                  className={`absolute border-2 ${currentTicket.visibilityPercentage > 0 ? 'border-emerald-400 bg-emerald-500/20' : 'border-sky-400 bg-sky-500/15'} rounded-lg pointer-events-none z-10 shadow-lg`}
                  style={{
                    top: `${currentTicket.boundingBox.ymin}%`,
                    left: `${currentTicket.boundingBox.xmin}%`,
                    width: `${currentTicket.boundingBox.xmax - currentTicket.boundingBox.xmin}%`,
                    height: `${currentTicket.boundingBox.ymax - currentTicket.boundingBox.ymin}%`,
                  }}
                >
                  <span className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${currentTicket.visibilityPercentage > 0 ? 'border-mint-300' : 'border-sky-300'}`} />
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${currentTicket.visibilityPercentage > 0 ? 'border-mint-300' : 'border-sky-300'}`} />
                  <span className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${currentTicket.visibilityPercentage > 0 ? 'border-mint-300' : 'border-sky-300'}`} />
                  <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${currentTicket.visibilityPercentage > 0 ? 'border-mint-300' : 'border-sky-300'}`} />
                  <div className={`absolute -top-5 left-0 ${currentTicket.visibilityPercentage > 0 ? 'bg-emerald-800/90 text-white border-emerald-400/50' : 'bg-sky-900/90 text-sky-100 border-sky-400/50'} backdrop-blur-md text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow flex items-center space-x-1 whitespace-nowrap border`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentTicket.visibilityPercentage > 0 ? 'bg-mint-300 animate-pulse' : 'bg-sky-300'}`} />
                    <span>YOLOv8: {currentTicket.boundingBox.defect || currentTicket.defectDiagnosis || 'Operating Fine (Intact)'}</span>
                  </div>
                </div>
              )}

              {currentTicket.visibilityPercentage > 0 ? (
                <div className="absolute top-3 right-3 bg-forest-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/50 flex items-center space-x-1.5 text-white shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-mint-300">
                    {currentTicket.visibilityPercentage}% Problem Visibility
                  </span>
                </div>
              ) : currentTicket.detectedAsset ? (
                <div className="absolute top-3 right-3 bg-[#081e2b]/90 backdrop-blur-md px-3 py-1 rounded-full border border-sky-400/50 flex items-center space-x-1.5 text-white shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-bold text-sky-300">
                    0% Fault (Operating Fine)
                  </span>
                </div>
              ) : null}

              {currentTicket.defectDiagnosis && (
                <div className={`absolute bottom-3 left-3 right-3 ${currentTicket.visibilityPercentage > 0 ? 'bg-forest-950/90 border-emerald-400/30' : 'bg-[#081e2b]/95 border-sky-400/40'} backdrop-blur-md px-3 py-1.5 rounded-xl border text-white text-[11px] flex items-center justify-between`}>
                  <span className={`${currentTicket.visibilityPercentage > 0 ? 'text-emerald-200' : 'text-sky-200'} truncate`}>
                    {currentTicket.visibilityPercentage > 0 ? 'AI Defect: ' : 'Optical Status: '}
                    <strong className={currentTicket.visibilityPercentage > 0 ? 'text-amber-300' : 'text-sky-300'}>{currentTicket.defectDiagnosis}</strong>
                  </span>
                  <span className={`text-[10px] ${currentTicket.visibilityPercentage > 0 ? 'text-mint-300' : 'text-sky-300'} font-mono shrink-0 ml-2`}>
                    {currentTicket.detectedAsset || 'Verified Asset'}
                  </span>
                </div>
              )}
            </div>

            {/* Description & Role-Based Lost & Found Verification Section */}
            {isLostFound ? (
              currentTicket.lostFoundType === 'found' ? (
                canSeeLostFoundSecrets ? (
                  /* Authorized Official Dossier: Dept Head, Advisor, Warden, Admin, or Finder */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
                          <ShieldCheck className="w-5 h-5 text-emerald-700" />
                          <span>Authorized Custody Record (Dept Head / Admin View)</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                          CONFIDENTIAL RECORD
                        </span>
                      </div>

                      <div className="text-xs text-emerald-900 leading-relaxed bg-white/70 p-3 rounded-xl border border-emerald-200">
                        <strong className="block text-emerald-950 mb-1">Finder's Full Description & Location Context:</strong>
                        {currentTicket.description}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                          <span className="text-[10px] text-charcoal-500 font-semibold block">Found Timing / When:</span>
                          <span className="font-bold text-forest-950">{currentTicket.timings || 'Reported during class'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                          <span className="text-[10px] text-charcoal-500 font-semibold block">Current Custody Location:</span>
                          <span className="font-bold text-emerald-800">{currentTicket.safekeepingLocation || 'Department Office'}</span>
                        </div>
                      </div>

                      {currentTicket.secretDetails && (
                        <div className="p-3 rounded-xl bg-white border-2 border-emerald-400 text-xs">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                            Secret Distinguishing Marks (Authenticate Claimant With This):
                          </span>
                          <p className="text-forest-950 font-medium leading-relaxed">{currentTicket.secretDetails}</p>
                        </div>
                      )}

                      <div className="text-xs text-charcoal-700 bg-white/60 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                        <span>Finder: <strong>{currentTicket.raisedBy?.name}</strong> ({currentTicket.raisedBy?.rollNo || 'Roll ID'})</span>
                        <span className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                          currentTicket.claimedStatus === 'claimed' ? 'bg-emerald-200 text-emerald-900 font-bold' : 'bg-amber-100 text-amber-900'
                        }`}>
                          Status: {currentTicket.claimedStatus === 'claimed' ? '✓ Claimed & Handed Over' : 'Unclaimed in Safe Custody'}
                        </span>
                      </div>
                    </div>

                    {/* Official Review of Incoming Student Claim Requests */}
                    <div className="bg-white border-2 border-ivory-300 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PackageSearch className="w-4 h-4 text-emerald-700" />
                          <h4 className="text-xs sm:text-sm font-extrabold text-forest-950">
                            Student Ownership Claim Requests ({(currentTicket.claimRequests || []).length})
                          </h4>
                        </div>
                        <span className="text-[10px] font-semibold text-charcoal-500">
                          Verify student proof against secret markings
                        </span>
                      </div>

                      {(!currentTicket.claimRequests || currentTicket.claimRequests.length === 0) ? (
                        <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-200 text-xs text-charcoal-500 text-center">
                          No student claim requests submitted yet for this product.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {currentTicket.claimRequests.map((claim) => (
                            <div 
                              key={claim.claimId} 
                              className={`p-3.5 rounded-xl border-2 transition-all space-y-2.5 ${
                                claim.status === 'approved'
                                  ? 'bg-emerald-50/70 border-emerald-300'
                                  : claim.status === 'rejected'
                                  ? 'bg-rose-50/60 border-rose-200'
                                  : 'bg-amber-50/50 border-amber-300'
                              }`}
                            >
                              {/* Claimant Profile Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-ivory-200">
                                <div className="flex items-center space-x-2">
                                  <div className="w-7 h-7 rounded-full bg-forest-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                    {claim.claimant?.name?.charAt(0) || 'S'}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-forest-950">
                                      {claim.claimant?.name} <span className="font-mono text-[10px] text-charcoal-500">({claim.claimant?.rollNo})</span>
                                    </div>
                                    <div className="text-[10px] text-charcoal-600">
                                      {claim.claimant?.classSection} • {claim.claimant?.hostel} • Phone: <strong className="text-forest-950">{claim.claimant?.phone || claim.contactPhone}</strong>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1.5">
                                  <span className="text-[10px] font-mono text-charcoal-400">ID: {claim.claimId}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                    claim.status === 'approved'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : claim.status === 'rejected'
                                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                                      : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                                  }`}>
                                    {claim.status === 'approved' ? '✓ Handed Over' : claim.status === 'rejected' ? '✕ Rejected' : 'Pending Verification'}
                                  </span>
                                </div>
                              </div>

                              {/* Proof Comparison */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                <div className="p-2.5 rounded-lg bg-white border border-emerald-300">
                                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                                    🔒 True Secret Record (Finder):
                                  </span>
                                  <p className="text-charcoal-800 text-[11px] leading-relaxed">
                                    {currentTicket.secretDetails || 'No private marks recorded.'}
                                  </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white border border-amber-300">
                                  <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">
                                    📝 Claimant Student's Submitted Proof:
                                  </span>
                                  <p className="text-charcoal-800 text-[11px] leading-relaxed font-medium">
                                    "{claim.proofDetails}"
                                  </p>
                                  {claim.lostLocation && (
                                    <div className="text-[10px] text-charcoal-500 mt-1">
                                      Reported Lost Location: <strong>{claim.lostLocation}</strong>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Admin Feedback or Verification Actions */}
                              {claim.status === 'pending' ? (
                                <div className="flex items-center justify-end space-x-2 pt-1">
                                  <button
                                    onClick={() => {
                                      const reason = window.prompt('Reason for rejecting this claim request:', 'Private details or serial number did not match custodial record.');
                                      if (reason !== null) {
                                        reviewClaimRequest(currentTicket.id, {
                                          claimId: claim.claimId,
                                          action: 'reject',
                                          adminRemarks: reason
                                        });
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold transition-all"
                                  >
                                    ✕ Reject Claim
                                  </button>
                                  <button
                                    onClick={() => {
                                      const confirmReturn = window.confirm(`Confirm handover: Have you authenticated student ${claim.claimant?.name} (${claim.claimant?.rollNo}) and verified their identity card?`);
                                      if (confirmReturn) {
                                        reviewClaimRequest(currentTicket.id, {
                                          claimId: claim.claimId,
                                          action: 'approve',
                                          adminRemarks: `Identity and secret marks verified. Handed over from ${currentTicket.safekeepingLocation || 'Department Office'}.`
                                        });
                                      }
                                    }}
                                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>✓ Approve Claim & Return Item</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="text-[11px] text-charcoal-600 bg-white/60 p-2 rounded-lg border border-ivory-200">
                                  <strong>Admin Remark:</strong> {claim.adminRemarks} {claim.reviewedBy?.name ? `(Reviewed by ${claim.reviewedBy.name})` : ''}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Student View: Strict Anti-Fraud Redaction + Interactive Claim Request Form */
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-950 font-bold text-sm">
                        <Lock className="w-5 h-5 text-amber-600" />
                        <span>Anti-Fraud Protected: Description & Private Nuances Hidden</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        CUSTODY PROTECTED
                      </span>
                    </div>

                    <p className="text-xs text-amber-900 leading-relaxed">
                      To prevent unauthorized claims and fraud, the finder's specific description, secret markings, exact discovery timestamps, and safe storage spot are <strong>restricted from student view</strong>.
                    </p>

                    {/* Check if student has already submitted a claim for this product */}
                    {(() => {
                      const studentClaim = (currentTicket.claimRequests || []).find(
                        c => c.claimant?.id === currentUser?.id || c.claimant?.rollNo === currentUser?.rollNo
                      );

                      if (studentClaim) {
                        return (
                          <div className={`p-4 rounded-xl border-2 space-y-2 ${
                            studentClaim.status === 'approved'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : studentClaim.status === 'rejected'
                              ? 'bg-rose-50 border-rose-300 text-rose-950'
                              : 'bg-white border-amber-400 text-amber-950'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs flex items-center space-x-1.5">
                                {studentClaim.status === 'approved' ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>🎉 Your Ownership Claim was Approved!</span>
                                  </>
                                ) : studentClaim.status === 'rejected' ? (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-rose-600" />
                                    <span>❌ Claim Not Authenticated</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                                    <span>⏳ Claim Request Under Administrative Review</span>
                                  </>
                                )}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-ivory-200 text-charcoal-700">
                                {studentClaim.claimId}
                              </span>
                            </div>

                            <p className="text-xs leading-relaxed">
                              {studentClaim.status === 'approved'
                                ? `The administration verified your proof of ownership. The item has been marked as returned to you.`
                                : studentClaim.status === 'rejected'
                                ? `Administration note: "${studentClaim.adminRemarks || 'Provided details did not match secret markings.'}". If this was in error, please visit the department office with additional proof.`
                                : `Your claim request has been sent to the Department Admin & Main Admin. Please proceed to the ${currentTicket.department || 'CSE'} Department Office with your College ID card.`}
                            </p>

                            <div className="p-2.5 rounded-lg bg-ivory-50 border border-ivory-200 text-[11px] text-charcoal-700">
                              <strong className="block text-charcoal-900 mb-0.5">Your Submitted Proof:</strong>
                              "{studentClaim.proofDetails}"
                            </div>
                          </div>
                        );
                      }

                      if (currentTicket.claimedStatus === 'claimed') {
                        return (
                          <div className="p-3.5 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>This product has already been successfully authenticated and returned to its verified owner.</span>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs text-charcoal-800 space-y-2">
                            <div className="font-bold text-forest-950 flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>How to Claim This Item:</span>
                            </div>
                            <ol className="list-decimal ml-4 space-y-1 text-[11px] text-charcoal-600">
                              <li>Verify the photo and item title shown above.</li>
                              <li>Submit an ownership claim with private distinguishing details only you know (sticker, scratches, wallpaper, serial number).</li>
                              <li>Department Head or Main Admin will authenticate your request and hand over the item.</li>
                            </ol>
                          </div>

                          {!isClaimFormOpen ? (
                            <button
                              onClick={() => setIsClaimFormOpen(true)}
                              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 touch-press"
                            >
                              <PackageSearch className="w-4 h-4" />
                              <span>This Belongs to Me — Submit Ownership Claim Request</span>
                            </button>
                          ) : (
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!claimProof.trim()) {
                                  alert('Please provide distinguishing proof of ownership.');
                                  return;
                                }
                                submitClaimRequest(currentTicket.id, {
                                  proofDetails: claimProof.trim(),
                                  lostLocation: claimLostLocation.trim(),
                                  contactPhone: claimPhone.trim()
                                });
                                setIsClaimFormOpen(false);
                                setClaimProof('');
                                setClaimLostLocation('');
                                setClaimPhone('');
                              }}
                              className="p-4 bg-white rounded-xl border-2 border-amber-400 space-y-3 text-xs"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
                                <span className="font-bold text-amber-950 text-xs flex items-center space-x-1.5">
                                  <PackageSearch className="w-4 h-4 text-amber-600" />
                                  <span>Submit Ownership Claim to Administration</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsClaimFormOpen(false)}
                                  className="text-charcoal-400 hover:text-charcoal-700 text-xs font-bold"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-charcoal-800 mb-1">
                                  Private Marks / Proof of Ownership <span className="text-rose-600">*</span>
                                </label>
                                <textarea
                                  rows={3}
                                  value={claimProof}
                                  onChange={(e) => setClaimProof(e.target.value)}
                                  placeholder="Describe details not visible in photo: unique stickers, serial number, scratches, wallpaper, contents inside..."
                                  className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-charcoal-800 mb-1">
                                    Where / When Did You Lose It?
                                  </label>
                                  <input
                                    type="text"
                                    value={claimLostLocation}
                                    onChange={(e) => setClaimLostLocation(e.target.value)}
                                    placeholder="e.g. LH-4 3rd Row ~11:30 AM"
                                    className="w-full p-2 rounded-xl border border-ivory-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-charcoal-800 mb-1">
                                    Your Contact Mobile Phone
                                  </label>
                                  <input
                                    type="tel"
                                    value={claimPhone}
                                    onChange={(e) => setClaimPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full p-2 rounded-xl border border-ivory-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-ivory-200">
                                <button
                                  type="button"
                                  onClick={() => setIsClaimFormOpen(false)}
                                  className="px-3 py-2 rounded-xl border border-ivory-300 text-charcoal-600 font-bold text-xs"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send Claim to Admin Portal</span>
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )
              ) : (
                /* Lost Item Broadcast Alert: Visible to All */
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-950 font-bold text-sm">
                    <PackageSearch className="w-5 h-5 text-amber-700" />
                    <span>Campus Lost Item Alert (Broadcast to All Students & Staff)</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                    <strong className="block text-forest-950 mb-1">Where & How Lost:</strong>
                    {currentTicket.description}
                  </div>

                  {currentTicket.timings && (
                    <div className="text-xs text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200 font-medium">
                      <strong>Lost When / Timing:</strong> {currentTicket.timings}
                    </div>
                  )}

                  <div className="text-[11px] text-charcoal-600 bg-white/70 p-2.5 rounded-xl border border-amber-200">
                    💡 If you found this item, please hand it over to the <strong>{currentTicket.department || 'CSE'} Dept Office</strong> or submit a "Found Item" report on CampusOne.
                  </div>
                </div>
              )
            ) : (
              /* Regular Complaint Description */
              <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
                {currentTicket.description}
              </p>
            )}
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

          {/* Community Confirmation Count OR Lost & Found Registry Status */}
          {isLostFound ? (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between shadow-subtle">
              <div className="text-xs text-charcoal-700 flex items-center space-x-2">
                <PackageSearch className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold text-amber-950">Campus Lost & Found Registry: </span>
                  <span className="text-charcoal-800">
                    {currentTicket.lostFoundType === 'found' ? 'Safe custody item filed by campus member.' : 'Broadcast alert issued across university.'}
                  </span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 ${
                currentTicket.lostFoundType === 'found'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {currentTicket.lostFoundType === 'found' ? (currentTicket.claimedStatus === 'claimed' ? 'Claimed' : 'In Custody') : 'Active Alert'}
              </span>
            </div>
          ) : (
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
          )}

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
