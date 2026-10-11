import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Wrench, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  MessageSquare, 
  Calendar, 
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Building2,
  Zap,
  Hammer,
  Utensils,
  Layers,
  Cpu,
  RefreshCw,
  Box,
  PackageSearch,
  Lock,
  ShieldCheck,
  Send,
  CheckSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    tickets, 
    currentUser, 
    updateTicketAdmin, 
    setSelectedTicketForDetail,
    canViewStudentDetails,
    reviewClaimRequest
  } = useApp();

  if (!currentUser) return null;

  const [selectedDomain, setSelectedDomain] = useState(
    currentUser.domain || 'electrical_av'
  );

  const [statusFilter, setStatusFilter] = useState('all');
  const [lnfSubFilter, setLnfSubFilter] = useState('claims'); // 'claims' | 'custody' | 'lost' | 'all'
  const [editingTicket, setEditingTicket] = useState(null);

  // Edit form state
  const [editStatus, setEditStatus] = useState('');
  const [editEta, setEditEta] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editTechnician, setEditTechnician] = useState('');

  // AI Dispatch Copilot State
  const [adminCopilotData, setAdminCopilotData] = useState(null);
  const [isGeneratingCopilot, setIsGeneratingCopilot] = useState(false);

  // Lost & Found records and Student Claims
  const lostFoundTickets = tickets.filter(t => t.scope === 'lost_found' || t.category === 'lost_found');
  
  const allClaimRequests = React.useMemo(() => {
    const list = [];
    lostFoundTickets.forEach(ticket => {
      (ticket.claimRequests || []).forEach(claim => {
        list.push({ ...claim, ticket });
      });
    });
    return list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [lostFoundTickets]);

  const pendingClaimsCount = allClaimRequests.filter(c => c.status === 'pending').length;
  const custodyFoundTickets = lostFoundTickets.filter(t => t.lostFoundType === 'found');
  const lostAlertTickets = lostFoundTickets.filter(t => t.lostFoundType === 'lost');
  const handedOverCount = lostFoundTickets.filter(t => t.claimedStatus === 'claimed' || t.status === 'resolved').length;

  // Domain operations only receive tickets after Stage-1 approval (or direct panel/campus emergency)
  const domainTickets = tickets.filter(t => {
    if (selectedDomain === 'lost_found') return false;
    if (selectedDomain !== 'all' && t.domain !== selectedDomain) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (t.advisorApprovalStatus === 'rejected' || t.wardenApprovalStatus === 'rejected') return false;
    return true;
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const fetchCopilotRecommendation = async (ticket) => {
    setIsGeneratingCopilot(true);
    setAdminCopilotData(null);
    try {
      const res = await api.getAdminCopilotAI(ticket);
      if (res && res.success && res.recommendation) {
        setAdminCopilotData(res.recommendation);
      }
    } catch (err) {
      console.warn('Copilot recommendation error:', err);
    } finally {
      setIsGeneratingCopilot(false);
    }
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setEditStatus(ticket.status);
    setEditEta(ticket.eta || '');
    setEditNote(ticket.adminNote || '');
    setEditTechnician(ticket.assignedTo || '');
    fetchCopilotRecommendation(ticket);
  };

  const applyCopilotPlan = () => {
    if (!adminCopilotData) return;
    setEditTechnician(adminCopilotData.technician || editTechnician);
    setEditEta(adminCopilotData.estimatedSla || editEta);
    setEditNote(adminCopilotData.suggestedBroadcast || editNote);
    if (editStatus === 'reported') {
      setEditStatus('in_progress');
    }
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    if (!editingTicket) return;

    updateTicketAdmin(editingTicket.id, {
      status: editStatus,
      eta: editEta,
      adminNote: editNote,
      assignedTo: editTechnician
    });

    setEditingTicket(null);
  };

  const DOMAINS = [
    { id: 'electrical_av', label: 'Electrical & AV', icon: 'Zap' },
    { id: 'carpentry_civil', label: 'Carpentry & Civil', icon: 'Hammer' },
    { id: 'hostel_mess', label: 'Hostels & Mess', icon: 'Utensils' },
    { id: 'lost_found', label: `🎒 Lost & Found Hub ${pendingClaimsCount > 0 ? `(${pendingClaimsCount} Claims)` : ''}`, icon: 'PackageSearch', isLNF: true, badge: pendingClaimsCount },
    { id: 'all', label: 'All Campus Domains', icon: 'Layers' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header Banner */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-mint-300 flex items-center justify-center font-bold shadow-md">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-forest-950">Domain Operations Console</h2>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  Estate Maintenance
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-1">
                Triage tickets by dynamic severity score, assign technicians, convey public ETAs, and trigger on-site student sign-offs. Student identities are masked for intermediate maintenance staff.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-ivory-100 p-2.5 rounded-2xl border border-ivory-200 self-start md:self-auto">
            <span className="text-xs text-charcoal-500 font-mono">Logged in:</span>
            <span className="text-xs font-bold text-forest-950">{currentUser.name}</span>
            <span className="text-[10px] bg-forest-900 text-mint-300 px-2 py-0.5 rounded-full font-mono font-semibold">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto mt-6 pt-4 border-t border-ivory-200 no-scrollbar touch-pan-y">
          {DOMAINS.map(dom => {
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-press ${
                  isSelected
                    ? 'bg-[#092d25] text-white shadow-md border border-[#092d25]'
                    : 'bg-white text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec] border border-ivory-300'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: '#092d25', color: '#ffffff' }
                    : { backgroundColor: '#ffffff', color: '#192822' }
                }
              >
                {dom.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDomain === 'lost_found' ? (
        /* LOST & FOUND CUSTODY & STUDENT CLAIMS OPERATIONS */
        <div className="space-y-6 animate-fade-in">
          {/* Top 4 Metric Cards for Lost & Found */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block">Total L&F Records</span>
              <div className="text-2xl font-black text-forest-950 mt-1">{lostFoundTickets.length}</div>
              <span className="text-[10px] text-charcoal-500">Registered on campus</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">In Safe Custody</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{custodyFoundTickets.length}</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Held in Dept / Security</span>
            </div>
            <div className={`p-4 rounded-2xl border shadow-subtle ${
              pendingClaimsCount > 0 ? 'bg-amber-50/80 border-amber-300 text-amber-950' : 'bg-white border-ivory-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Pending Claims</span>
                {pendingClaimsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <div className="text-2xl font-black text-amber-900 mt-1">{pendingClaimsCount}</div>
              <span className="text-[10px] text-amber-800 font-semibold">Requires admin authentication</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block">Handed Over / Returned</span>
              <div className="text-2xl font-black text-forest-950 mt-1">{handedOverCount}</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Reunited with students</span>
            </div>
          </div>

          {/* Sub-Filter Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-ivory-300">
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setLnfSubFilter('claims')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  lnfSubFilter === 'claims'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                <PackageSearch className="w-3.5 h-3.5" />
                <span>Student Claim Requests ({allClaimRequests.length})</span>
                {pendingClaimsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-300 text-amber-950 text-[10px] font-extrabold ml-1">
                    {pendingClaimsCount} new
                  </span>
                )}
              </button>
              <button
                onClick={() => setLnfSubFilter('custody')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  lnfSubFilter === 'custody'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Found in Custody ({custodyFoundTickets.length})</span>
              </button>
              <button
                onClick={() => setLnfSubFilter('lost')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  lnfSubFilter === 'lost'
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                <span>📢 Lost Item Alerts ({lostAlertTickets.length})</span>
              </button>
              <button
                onClick={() => setLnfSubFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  lnfSubFilter === 'all'
                    ? 'bg-[#092d25] text-white shadow-sm'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                All Records ({lostFoundTickets.length})
              </button>
            </div>
          </div>

          {/* Claims Review Sub-View */}
          {lnfSubFilter === 'claims' && (
            <div className="space-y-4">
              {allClaimRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-ivory-300 p-8 text-center text-charcoal-500 text-xs">
                  No student claim requests have been filed yet.
                </div>
              ) : (
                allClaimRequests.map(claim => (
                  <div 
                    key={claim.claimId}
                    className={`bg-white rounded-2xl border-2 p-5 shadow-subtle transition-all space-y-4 ${
                      claim.status === 'approved'
                        ? 'border-emerald-300'
                        : claim.status === 'rejected'
                        ? 'border-rose-200 opacity-80'
                        : 'border-amber-300 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-forest-950 text-mint-300 font-extrabold flex items-center justify-center text-sm shadow">
                          {claim.claimant?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-forest-950">{claim.claimant?.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ivory-200 font-bold text-charcoal-700">
                              {claim.claimant?.rollNo}
                            </span>
                            <span className="text-xs text-charcoal-500">
                              • {claim.claimant?.classSection} • {claim.claimant?.hostel}
                            </span>
                          </div>
                          <div className="text-[11px] text-charcoal-600 mt-0.5">
                            Contact Phone: <strong className="text-forest-950 font-mono">{claim.contactPhone || claim.claimant?.phone || 'N/A'}</strong> • Email: {claim.claimant?.email || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-charcoal-400">Claim ID: {claim.claimId}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
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

                    {/* Associated Product Dossier Snapshot */}
                    <div className="flex flex-col md:flex-row gap-4 items-start bg-ivory-50/80 p-3.5 rounded-xl border border-ivory-200">
                      <img 
                        src={claim.ticket?.imageUrl} 
                        alt={claim.ticket?.title}
                        className="w-20 h-20 rounded-xl object-cover border border-ivory-300 shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-charcoal-500">#{claim.ticket?.id}</span>
                          <span className="font-extrabold text-sm text-forest-950 hover:text-emerald-700 cursor-pointer" onClick={() => setSelectedTicketForDetail(claim.ticket)}>
                            {claim.ticket?.title}
                          </span>
                        </div>
                        <div className="text-xs text-charcoal-600">
                          Current Custody: <strong className="text-emerald-800">{claim.ticket?.safekeepingLocation || 'Department Office'}</strong>
                        </div>
                        <div className="text-[11px] text-charcoal-500">
                          Found at: {claim.ticket?.location} • Timing: {claim.ticket?.timings || 'Reported during class'}
                        </div>
                      </div>
                    </div>

                    {/* Side-by-Side Proof Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase block flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Confidential Secret Record (From Finder):</span>
                        </span>
                        <p className="text-emerald-950 font-medium leading-relaxed bg-white/70 p-2.5 rounded-lg border border-emerald-200 text-[11px]">
                          {claim.ticket?.secretDetails || 'No private marks provided.'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase block flex items-center space-x-1">
                          <PackageSearch className="w-3.5 h-3.5 text-amber-700" />
                          <span>Claimant Student's Submitted Proof:</span>
                        </span>
                        <p className="text-amber-950 font-medium leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-200 text-[11px]">
                          "{claim.proofDetails}"
                        </p>
                        {claim.lostLocation && (
                          <div className="text-[10px] text-charcoal-600 pt-0.5">
                            Claimant Stated Lost Location: <strong>{claim.lostLocation}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for Pending Claims */}
                    {claim.status === 'pending' ? (
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-ivory-200">
                        <button
                          onClick={() => setSelectedTicketForDetail(claim.ticket)}
                          className="px-3.5 py-2 rounded-xl border border-ivory-300 hover:bg-ivory-100 text-charcoal-700 text-xs font-bold transition-all"
                        >
                          View Full Item Dossier
                        </button>
                        <button
                          onClick={() => {
                            const reason = window.prompt('Reason for rejecting this claim:', 'Private markings and description did not match custodial record.');
                            if (reason !== null) {
                              reviewClaimRequest(claim.ticket.id, {
                                claimId: claim.claimId,
                                action: 'reject',
                                adminRemarks: reason
                              });
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold transition-all"
                        >
                          ✕ Reject Claim
                        </button>
                        <button
                          onClick={() => {
                            const confirmReturn = window.confirm(`Approve claim: Authenticate ${claim.claimant?.name} (${claim.claimant?.rollNo}) and confirm hand-over of product from ${claim.ticket?.safekeepingLocation || 'custody'}?`);
                            if (confirmReturn) {
                              reviewClaimRequest(claim.ticket.id, {
                                claimId: claim.claimId,
                                action: 'approve',
                                adminRemarks: `Verified in person by Admin. Handed over from ${claim.ticket?.safekeepingLocation || 'Department Office'}.`
                              });
                            }
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✓ Approve Claim & Hand Over Product</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-ivory-100 border border-ivory-200 text-xs text-charcoal-700 flex items-center justify-between">
                        <span><strong>Decision Note:</strong> {claim.adminRemarks}</span>
                        {claim.reviewedBy && (
                          <span className="text-[10px] text-charcoal-500 font-mono">Reviewed by {claim.reviewedBy.name}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Custody Inventory Sub-View (Found / Lost / All) */}
          {lnfSubFilter !== 'claims' && (
            <div className="space-y-3.5">
              {(lnfSubFilter === 'custody' ? custodyFoundTickets : lnfSubFilter === 'lost' ? lostAlertTickets : lostFoundTickets).map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-ivory-300 hover:border-charcoal-400 p-5 shadow-subtle transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-ivory-300" />
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-charcoal-500 font-bold">{item.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.lostFoundType === 'found' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}>
                            {item.lostFoundType === 'found' ? 'Found Item in Custody' : 'Lost Alert Broadcast'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.claimedStatus === 'claimed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {item.claimedStatus === 'claimed' ? '✓ Claimed / Resolved' : 'Unclaimed'}
                          </span>
                        </div>
                        <h4 onClick={() => setSelectedTicketForDetail(item)} className="text-base font-extrabold text-forest-950 hover:text-emerald-700 cursor-pointer">
                          {item.title}
                        </h4>
                        <div className="text-xs text-charcoal-600">
                          {item.safekeepingLocation ? `Custody: ${item.safekeepingLocation}` : `Location: ${item.location}`} • Reported by {item.raisedBy?.name}
                        </div>
                        {item.secretDetails && (
                          <div className="text-[11px] text-emerald-900 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                            <strong>Secret Markings:</strong> {item.secretDetails}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedTicketForDetail(item)}
                        className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <PackageSearch className="w-3.5 h-3.5 text-mint-300" />
                        <span>Inspect / Claims ({(item.claimRequests || []).length})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD MAINTENANCE TICKETS VIEW */
        <>
      {/* Filter Chips & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 text-xs overflow-x-auto no-scrollbar touch-pan-y pb-1">
          <span className="text-charcoal-500 font-semibold shrink-0">Status:</span>
          {['all', 'reported', 'in_progress', 'awaiting_verification', 'resolved'].map(st => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-all touch-press shrink-0 ${
                  isSelected
                    ? 'bg-[#0f8e65] text-white font-bold shadow-xs border border-[#0f8e65]'
                    : 'bg-white text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec] border border-ivory-300'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: '#0f8e65', color: '#ffffff' }
                    : { backgroundColor: '#ffffff', color: '#192822' }
                }
              >
                {st.replace('_', ' ')}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-charcoal-500 font-mono">
          Showing <strong>{domainTickets.length}</strong> tickets sorted by <strong>Priority Score</strong>
        </div>
      </div>

      {/* Domain Tickets List */}
      <div className="space-y-3.5">
        {domainTickets.map(ticket => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border border-ivory-300 hover:border-charcoal-400 p-5 shadow-subtle transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left Column */}
              <div className="flex items-start space-x-4 flex-1">
                <img
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-ivory-300"
                />

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-charcoal-500 font-bold">{ticket.id}</span>
                    
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Scope: {ticket.scope.toUpperCase()} {ticket.classSection ? `(${ticket.classSection})` : ticket.hostel ? `(${ticket.hostel})` : ''}
                    </span>

                    {ticket.status === 'awaiting_verification' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Fixed — Waiting Student Approval
                      </span>
                    ) : ticket.status === 'in_progress' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        In Progress
                      </span>
                    ) : ticket.status === 'resolved' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Resolved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700">
                        Reported
                      </span>
                    )}

                    {(ticket.advisorEndorsed || ticket.advisorApprovalStatus === 'approved') && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                        ✓ Advisor Approved (+20)
                      </span>
                    )}

                    {(ticket.wardenEndorsed || ticket.wardenApprovalStatus === 'approved') && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono font-bold border border-amber-200">
                        ✓ Warden Approved (+20)
                      </span>
                    )}
                  </div>

                  <h3 
                    className="text-base font-bold text-forest-950 hover:text-emerald-700 cursor-pointer" 
                    onClick={() => setSelectedTicketForDetail(ticket)}
                  >
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-charcoal-700 line-clamp-1 max-w-2xl">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 pt-1">
                    <span>📍 {ticket.location}</span>
                    <span>
                      👤{' '}
                      {canViewStudentDetails(ticket.raisedBy) || ticket.raisedByPanelRole
                        ? ticket.raisedBy?.name
                        : 'Protected Campus Member (Identity Masked)'}
                    </span>
                    <span className="text-emerald-700 font-semibold">👍 {ticket.upvotes?.length || 0} student confirmations</span>
                    {ticket.assignedTo && (
                      <span className="text-amber-800 font-semibold">🔧 Tech: {ticket.assignedTo}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority & Update Action */}
              <div className="flex items-center space-x-4 shrink-0 lg:border-l lg:border-ivory-200 lg:pl-6 justify-between lg:justify-end">
                
                <div className="text-center px-3 py-1.5 rounded-xl bg-ivory-100 border border-ivory-200">
                  <div className="text-[10px] uppercase font-bold text-charcoal-500">AI Priority</div>
                  <div className="text-base font-black text-forest-950 flex items-center justify-center space-x-1">
                    <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>{ticket.priorityScore}</span>
                  </div>
                  <div className="text-[8px] uppercase font-bold text-emerald-700 flex items-center justify-center space-x-0.5 mt-0.5">
                    <Cpu className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Triage Engine</span>
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(ticket)}
                  className="btn-primary text-xs py-2 px-3.5 shadow-sm font-bold flex items-center space-x-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Update & Dispatch</span>
                </button>

              </div>

            </div>

            {/* Public ETA & Note */}
            {(ticket.eta || ticket.adminNote) && (
              <div className="mt-3 pt-3 border-t border-ivory-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div className="text-charcoal-700">
                  <span className="text-forest-950 font-bold">Public Notice: </span>
                  <span>{ticket.adminNote || 'Inspection in progress.'}</span>
                </div>
                {ticket.eta && (
                  <div className="text-charcoal-600 font-mono text-[11px] shrink-0 font-medium">
                    ⏱️ Target Completion: <span className="text-emerald-700 font-bold">{ticket.eta}</span>
                  </div>
                )}
              </div>
            )}

          </div>
        ))}

        {domainTickets.length === 0 && (
          <div className="text-center py-12 text-charcoal-500 bg-white rounded-2xl border border-ivory-300">
            No maintenance tickets match this filter.
          </div>
        )}
      </div>
        </>
      )}

      {/* Modal to Update Ticket (Status, ETA, Technician, Notes) */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in overscroll-contain">
          <div className="bg-white border border-ivory-300 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-scale-in max-h-[96dvh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="text-base font-bold text-forest-950">Update Ticket #{editingTicket.id}</h3>
                <p className="text-xs text-charcoal-500 truncate max-w-sm">{editingTicket.title}</p>
              </div>
              <button onClick={() => setEditingTicket(null)} className="text-charcoal-400 hover:text-forest-950 touch-press p-1">✕</button>
            </div>

            {/* ✨ CAMPUSONE AI DISPATCH & SLA COPILOT */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 to-forest-950 text-white border border-emerald-700/60 shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-mint-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-mint-300">
                    AI Dispatch & SLA Copilot
                  </span>
                </div>
                {isGeneratingCopilot ? (
                  <span className="flex items-center space-x-1 text-[10px] text-mint-200 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Analyzing domain & parts...</span>
                  </span>
                ) : adminCopilotData ? (
                  <button
                    type="button"
                    onClick={applyCopilotPlan}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-extrabold text-[10px] transition-all flex items-center space-x-1 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Fill Dispatch Plan</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => fetchCopilotRecommendation(editingTicket)}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-mint-200 text-[10px] font-semibold"
                  >
                    Consult AI
                  </button>
                )}
              </div>

              {adminCopilotData && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/10 rounded-xl p-2 border border-white/10">
                      <div className="text-[10px] text-mint-300 font-medium">Recommended Specialist</div>
                      <div className="font-bold text-white mt-0.5">{adminCopilotData.technician}</div>
                      <div className="text-[9px] text-mint-200/70 font-mono mt-0.5">{adminCopilotData.requiredSkill}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 border border-white/10">
                      <div className="text-[10px] text-mint-300 font-medium">Predicted SLA Duration</div>
                      <div className="font-bold text-white mt-0.5">{adminCopilotData.estimatedSla}</div>
                      <div className="text-[9px] text-mint-200/70 font-mono mt-0.5">Confidence: {adminCopilotData.confidenceScore || 92}%</div>
                    </div>
                  </div>

                  {adminCopilotData.partsChecklist && (
                    <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <div className="text-[10px] text-mint-300 font-semibold mb-1 flex items-center space-x-1">
                        <Box className="w-3 h-3 text-mint-300" />
                        <span>Required Spare Parts & Diagnostic Toolset:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {adminCopilotData.partsChecklist.map((part, pi) => (
                          <span key={pi} className="px-1.5 py-0.5 rounded bg-emerald-900/70 text-[9px] text-mint-200 font-mono border border-emerald-800">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {adminCopilotData.rootCauseForecast && (
                    <div className="text-[10px] text-mint-100/90 bg-emerald-900/30 p-2 rounded-xl border border-emerald-800/40">
                      🔬 <strong>Root Cause Analysis:</strong> {adminCopilotData.rootCauseForecast}
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveUpdate} className="mt-4 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Status Workflow
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'reported', label: 'Reported / In Triage' },
                    { id: 'in_progress', label: 'In Progress (Active Work)' },
                    { id: 'awaiting_verification', label: 'Fixed — Await Student Approval ⭐' },
                    { id: 'resolved', label: 'Force Close / Resolved' }
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setEditStatus(st.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        editStatus === st.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-ivory-50 border-ivory-200 text-charcoal-700 hover:bg-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                {editStatus === 'awaiting_verification' && (
                  <p className="text-[11px] text-emerald-700 mt-1.5 font-medium">
                    ⚡ This dispatches an on-site inspection notice to {editingTicket?.raisedBy?.name || 'the reporting student'}. The ticket will only fully close once they confirm!
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Assign Maintenance Technician / Staff
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vignesh (AV Lead) or Ramesh Kumar (Shift-1 Electrician)"
                  value={editTechnician}
                  onChange={(e) => setEditTechnician(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Estimated Completion Time (ETA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Today by 4:30 PM or Tomorrow 11:00 AM"
                  value={editEta}
                  onChange={(e) => setEditEta(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Public Announcement Note for Affected Students
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain ongoing work (e.g. Spare HDMI splitter ordered, technician on-site at 3:00 PM)..."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 shadow-md font-bold"
                >
                  Save & Broadcast
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
