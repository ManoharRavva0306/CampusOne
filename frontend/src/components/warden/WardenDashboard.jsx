import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { 
  Home, 
  ShieldCheck, 
  Flame, 
  Send,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Users,
  Lock,
  Sparkles,
  Check,
  X,
  FilePlus2,
  MapPin
} from 'lucide-react';

export default function WardenDashboard() {
  const { 
    currentUser, 
    tickets, 
    userList,
    reviewTicketByPanel, 
    raiseTicket,
    addComment, 
    setSelectedTicketForDetail 
  } = useApp();

  if (!currentUser) return null;

  const ALL_HOSTELS = [
    'Agastya Bhavan',
    'Vashistha Bhavan',
    'Gargi Bhavan',
    'Maitreyi Bhavan',
    'Vyasa Bhavan'
  ];

  // If logged in as hostel_warden, lock strictly to their assigned hostel!
  const isStrictWarden = currentUser.role === 'hostel_warden';
  const [selectedHostel, setSelectedHostel] = useState(
    currentUser.hostel || 'Agastya Bhavan'
  );

  const activeHostel = isStrictWarden
    ? (currentUser.hostel || 'Agastya Bhavan')
    : selectedHostel;

  const [subTab, setSubTab] = useState('queue'); // 'queue' | 'raise_complaint' | 'residents'
  const [approvalFilter, setApprovalFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected' | 'panel_raised'
  const [commentInput, setCommentInput] = useState({});
  const [reviewNotes, setReviewNotes] = useState({});
  const [residentSearch, setResidentSearch] = useState('');

  // Warden Direct Complaint Form State
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('plumbing');
  const [complaintLocation, setComplaintLocation] = useState(`${activeHostel} - Common Wing / Floor`);
  const [complaintUrgency, setComplaintUrgency] = useState('high');

  // Filter hostel-wise tickets belonging to this Bhavan
  const hostelTickets = useMemo(() => {
    return tickets.filter(t => {
      const isHostelScope = t.scope === 'room' || t.scope === 'hostel_generic';
      const matchesHostel = t.hostel === activeHostel;
      return isHostelScope && matchesHostel;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [tickets, activeHostel]);

  const filteredTickets = useMemo(() => {
    return hostelTickets.filter(t => {
      if (approvalFilter === 'pending') return t.wardenApprovalStatus === 'pending' && !t.raisedByPanel;
      if (approvalFilter === 'approved') return t.wardenApprovalStatus === 'approved' || t.wardenEndorsed;
      if (approvalFilter === 'rejected') return t.wardenApprovalStatus === 'rejected';
      if (approvalFilter === 'panel_raised') return t.raisedByPanel === 'warden' || t.raisedBy?.role === 'hostel_warden';
      return true;
    });
  }, [hostelTickets, approvalFilter]);

  // Confidential Resident Roster for this Hostel Warden's Bhavan ONLY
  const hostelResidents = useMemo(() => {
    return (userList || []).filter(u =>
      u.role === 'student' && u.hostel === activeHostel &&
      (!residentSearch.trim() ||
        u.name.toLowerCase().includes(residentSearch.toLowerCase()) ||
        (u.rollNo || '').toLowerCase().includes(residentSearch.toLowerCase()) ||
        (u.room || '').toLowerCase().includes(residentSearch.toLowerCase()) ||
        (u.classSection || '').toLowerCase().includes(residentSearch.toLowerCase()))
    );
  }, [userList, activeHostel, residentSearch]);

  const pendingCount = hostelTickets.filter(t => t.wardenApprovalStatus === 'pending' && !t.raisedByPanel).length;
  const approvedCount = hostelTickets.filter(t => t.wardenApprovalStatus === 'approved' || t.wardenEndorsed).length;
  const rejectedCount = hostelTickets.filter(t => t.wardenApprovalStatus === 'rejected').length;
  const wardenRaisedCount = hostelTickets.filter(t => t.raisedByPanel === 'warden' || t.raisedBy?.role === 'hostel_warden').length;

  const handleDecision = (ticketId, decision) => {
    const note = reviewNotes[ticketId] || '';
    reviewTicketByPanel(ticketId, {
      panelType: 'warden',
      decision,
      note: note.trim()
    });
    setReviewNotes({ ...reviewNotes, [ticketId]: '' });
  };

  const handlePostWardenComment = (ticketId) => {
    const text = commentInput[ticketId];
    if (!text || !text.trim()) return;
    addComment(ticketId, text.trim());
    setCommentInput({ ...commentInput, [ticketId]: '' });
  };

  const handleCreateWardenComplaint = (e) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDesc.trim()) return;

    const matchedCat = CATEGORIES.find(c => c.id === complaintCategory);
    raiseTicket({
      title: `[Warden Complaint - ${activeHostel}] ${complaintTitle.trim()}`,
      description: complaintDesc.trim(),
      scope: 'hostel_generic',
      hostel: activeHostel,
      department: 'Hostel Administration',
      location: complaintLocation || `${activeHostel} Common Area`,
      category: complaintCategory,
      domain: matchedCat ? matchedCat.domain : 'carpentry_civil',
      urgency: complaintUrgency,
      wardenNote: `Official hostel complaint filed directly by Resident Warden (${currentUser.name}) for Main Admin resolution.`,
      imageUrl: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?w=800&auto=format&fit=crop&q=80'
    });

    setComplaintTitle('');
    setComplaintDesc('');
    setSubTab('queue');
    setApprovalFilter('panel_raised');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center font-bold shadow-md shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-forest-950">Hostel Resident Warden Page</h2>
                <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-300">
                  Bhavan: {activeHostel}
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Stage-1 Hostel Gatekeeper
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-1 max-w-2xl">
                Hostel-wise problems (room electrical, fans, water, sanitation, mess) raised by students of <strong>{activeHostel}</strong> come here first before reaching the Final Admin. Accept valid issues to increase weightage (+20) or decline invalid ones.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {!isStrictWarden && (
              <div className="flex items-center space-x-1.5 bg-ivory-100 px-3 py-1.5 rounded-xl border border-ivory-300">
                <span className="text-[11px] font-bold text-charcoal-600">Inspect Bhavan:</span>
                <select
                  value={selectedHostel}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-forest-950 focus:outline-none cursor-pointer"
                >
                  {ALL_HOSTELS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setSubTab('raise_complaint')}
              className="px-4 py-2.5 rounded-2xl bg-[#092d25] hover:bg-[#061c18] text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all"
              style={{ backgroundColor: '#092d25', color: '#ffffff' }}
            >
              <PlusCircle className="w-4 h-4 text-mint-300" />
              <span>Add Bhavan Complaint to Main Admin</span>
            </button>
          </div>
        </div>

        {/* Strict Confidentiality Notice */}
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-950">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Confidential Resident Privacy:</strong> Student residential details (Hostel, Room No, Class Section, Roll No) for <strong>{activeHostel}</strong> are known ONLY to you (their Resident Warden), their respective Class Advisor, and Main Admin — hidden from all other users in between.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-900 shrink-0">
            Warden: {currentUser.name}
          </span>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-ivory-200">
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-center">
            <div className="text-xs text-amber-900 font-semibold">Pending Warden Choice</div>
            <div className="text-xl font-black text-amber-800 mt-0.5">{pendingCount}</div>
            <div className="text-[10px] text-amber-700">Awaiting Accept / Reject</div>
          </div>
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center">
            <div className="text-xs text-emerald-900 font-semibold">Approved & Sent to Admin</div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">{approvedCount}</div>
            <div className="text-[10px] text-emerald-700">+20 Weightage Added</div>
          </div>
          <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 text-center">
            <div className="text-xs text-rose-900 font-semibold">Declined by Warden</div>
            <div className="text-xl font-black text-rose-700 mt-0.5">{rejectedCount}</div>
            <div className="text-[10px] text-rose-700">Filtered before Admin</div>
          </div>
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-center">
            <div className="text-xs text-blue-900 font-semibold">Bhavan Residents</div>
            <div className="text-xl font-black text-blue-800 mt-0.5">{hostelResidents.length}</div>
            <div className="text-[10px] text-blue-700">{wardenRaisedCount} Warden Complaints</div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-ivory-200">
          <button
            onClick={() => setSubTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              subTab === 'queue'
                ? 'bg-[#092d25] text-white shadow-sm'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={subTab === 'queue' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <ShieldCheck className="w-4 h-4 text-mint-300" />
            <span>Hostel Issues Approval Queue ({hostelTickets.length})</span>
          </button>

          <button
            onClick={() => setSubTab('raise_complaint')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              subTab === 'raise_complaint'
                ? 'bg-[#092d25] text-white shadow-sm'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={subTab === 'raise_complaint' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <FilePlus2 className="w-4 h-4 text-amber-400" />
            <span>Add Complaint to Main Admin</span>
          </button>

          <button
            onClick={() => setSubTab('residents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              subTab === 'residents'
                ? 'bg-[#092d25] text-white shadow-sm'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={subTab === 'residents' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>My Bhavan Residents ({hostelResidents.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: HOSTEL ISSUES APPROVAL QUEUE (ACCEPT / REJECT)
          ========================================================================= */}
      {subTab === 'queue' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-ivory-300">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-charcoal-500 font-bold mr-1">Filter Queue:</span>
              {[
                { id: 'all', label: `All Bhavan Issues (${hostelTickets.length})` },
                { id: 'pending', label: `⏳ Pending Warden Choice (${pendingCount})` },
                { id: 'approved', label: `✅ Approved & Sent to Admin (${approvedCount})` },
                { id: 'rejected', label: `❌ Declined (${rejectedCount})` },
                { id: 'panel_raised', label: `📢 Raised by Warden (${wardenRaisedCount})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setApprovalFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    approvalFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          {filteredTickets.map(ticket => {
            const reporterStudent = (userList || []).find(u => u.id === ticket.raisedBy?.id) || ticket.raisedBy;
            const isPending = ticket.wardenApprovalStatus === 'pending' && !ticket.raisedByPanel;
            const isApproved = ticket.wardenApprovalStatus === 'approved' || ticket.wardenEndorsed;
            const isRejected = ticket.wardenApprovalStatus === 'rejected';

            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-subtle space-y-4 transition-all ${
                  isPending
                    ? 'border-l-4 border-l-amber-500 border-ivory-300'
                    : isApproved
                    ? 'border-l-4 border-l-emerald-500 border-ivory-300'
                    : 'border-l-4 border-l-rose-400 border-ivory-300 opacity-90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-ivory-300"
                    />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-charcoal-500 font-bold">#{ticket.id}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                          {ticket.hostel} {ticket.room ? `• Rm ${ticket.room}` : '• Common Area'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700 uppercase">
                          {ticket.category}
                        </span>

                        {ticket.raisedByPanel === 'warden' ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                            📢 Raised Directly by Hostel Warden
                          </span>
                        ) : isPending ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            ⏳ Awaiting Hostel Warden Approval (Before Final Admin)
                          </span>
                        ) : isApproved ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            ✅ Warden Approved (+20 Strong Weightage) • Sent to Main Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                            ❌ Declined by Hostel Warden
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setSelectedTicketForDetail(ticket)}
                        className="text-base font-extrabold text-forest-950 hover:text-emerald-700 cursor-pointer"
                      >
                        {ticket.title}
                      </h3>

                      <p className="text-xs text-charcoal-700 leading-relaxed">
                        {ticket.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 pt-1">
                        <span>📍 {ticket.location}</span>
                        <span className="text-emerald-700 font-bold">👍 {ticket.upvotes?.length || 0} resident confirmations</span>
                        <span>• Status: <strong className="uppercase text-forest-950">{ticket.status.replace('_', ' ')}</strong></span>
                      </div>

                      {/* Confidential Resident Student Identity Card */}
                      <div className="mt-2 p-3 rounded-2xl bg-ivory-50 border border-ivory-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={reporterStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={reporterStudent?.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/30"
                          />
                          <div>
                            <div className="font-bold text-forest-950 flex items-center space-x-1.5">
                              <span>{reporterStudent?.name || 'Resident Student'}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-ivory-300 text-charcoal-700">
                                {reporterStudent?.rollNo || 'STAFF'}
                              </span>
                            </div>
                            <div className="text-[11px] text-charcoal-600 flex flex-wrap items-center gap-2 mt-0.5">
                              <span>🏠 Bhavan: <strong>{reporterStudent?.hostel || activeHostel} {reporterStudent?.room ? `(Room ${reporterStudent.room})` : ''}</strong></span>
                              {reporterStudent?.classSection && (
                                <span>• 🎓 Section: <strong>{reporterStudent.classSection}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Verified Resident of {activeHostel}</span>
                        </span>
                      </div>

                      {/* Main Admin Response if available */}
                      {ticket.adminNote && (
                        <div className="mt-2 p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950">
                          <div className="font-bold flex items-center justify-between">
                            <span>🛠️ Main Admin / Maintenance Response ({ticket.assignedTo || 'Admin'}):</span>
                            <span className="font-mono text-blue-800">{ticket.eta}</span>
                          </div>
                          <p className="mt-1">{ticket.adminNote}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Priority Score & Warden Accept / Reject Decision */}
                  <div className="flex flex-col items-end justify-between gap-3 shrink-0 lg:w-72 border-t lg:border-t-0 lg:border-l border-ivory-200 pt-3 lg:pt-0 lg:pl-5">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-charcoal-500 uppercase">Priority Weightage</span>
                      <div className="px-3 py-1 rounded-xl bg-ivory-100 border border-ivory-200 flex items-center space-x-1 font-black text-forest-950 text-sm">
                        <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        <span>{ticket.priorityScore} / 100</span>
                      </div>
                    </div>

                    {/* Warden Choice Box: Accept or Reject */}
                    <div className="w-full space-y-2 bg-ivory-50 p-3 rounded-2xl border border-ivory-200">
                      <div className="text-[11px] font-bold text-forest-950">
                        Warden Decision (Before Final Admin):
                      </div>
                      <input
                        type="text"
                        placeholder="Optional hostel inspection remark..."
                        value={reviewNotes[ticket.id] || ''}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [ticket.id]: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-ivory-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDecision(ticket.id, 'approved')}
                          disabled={isApproved && !isPending}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isApproved ? 'Approved (+20)' : 'Accept (+20)'}</span>
                        </button>

                        <button
                          onClick={() => handleDecision(ticket.id, 'rejected')}
                          disabled={isRejected}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
                            isRejected
                              ? 'bg-rose-100 text-rose-900 border border-rose-300 cursor-default'
                              : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{isRejected ? 'Declined' : 'Reject'}</span>
                        </button>
                      </div>
                      {ticket.wardenNote && (
                        <div className="text-[11px] text-charcoal-600 italic pt-1 border-t border-ivory-200">
                          "{ticket.wardenNote}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Warden Directive */}
                <div className="pt-3 border-t border-ivory-200 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add official Hostel Resident Warden note or instruction..."
                    value={commentInput[ticket.id] || ''}
                    onChange={(e) => setCommentInput({ ...commentInput, [ticket.id]: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePostWardenComment(ticket.id); }}
                    className="input-field text-xs py-2 flex-1"
                  />
                  <button
                    onClick={() => handlePostWardenComment(ticket.id)}
                    className="btn-primary text-xs py-2 px-3.5 font-bold flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Note</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="text-center py-12 text-charcoal-500 bg-white rounded-3xl border border-ivory-300 p-6">
              <Home className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
              <div className="font-bold text-sm text-forest-950">No Bhavan Issues Match This Filter</div>
              <p className="text-xs text-charcoal-500 mt-1">
                Switch filter tabs above or file a direct hostel complaint to the Main Admin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ADD BHAVAN COMPLAINT DIRECTLY TO MAIN ADMIN (WARDEN COMPLAINT)
          ========================================================================= */}
      {subTab === 'raise_complaint' && (
        <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-subtle max-w-3xl mx-auto space-y-5">
          <div className="flex items-start space-x-3 pb-4 border-b border-ivory-200">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-forest-950">
                Raise Official Hostel Complaint to Main Admin ({activeHostel})
              </h3>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Complaints filed by the Hostel Resident Warden carry automatic <strong>+20 Strong Approval Weightage</strong> and appear directly under <strong>{activeHostel}</strong> in the Main Admin's command panel.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateWardenComplaint} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-forest-950 mb-1">Hostel Complaint Title *</label>
              <input
                type="text"
                required
                value={complaintTitle}
                onChange={(e) => setComplaintTitle(e.target.value)}
                placeholder={`e.g. Overhaul 2nd Floor RO Water Purifier & Corridor Emergency Lights in ${activeHostel}`}
                className="input-field text-xs py-2.5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-950 mb-1">Maintenance Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="input-field text-xs py-2.5 font-semibold"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-forest-950 mb-1">Urgency Level</label>
                <select
                  value={complaintUrgency}
                  onChange={(e) => setComplaintUrgency(e.target.value)}
                  className="input-field text-xs py-2.5 font-semibold"
                >
                  <option value="high">High Priority (Affects Bhavan Residents)</option>
                  <option value="emergency">Emergency / Safety Critical</option>
                  <option value="medium">Routine Hostel Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-forest-950 mb-1">Bhavan Wing / Floor / Room Landmark</label>
              <input
                type="text"
                value={complaintLocation}
                onChange={(e) => setComplaintLocation(e.target.value)}
                placeholder={`e.g. ${activeHostel} - 3rd Floor North Wing / Dining Hall`}
                className="input-field text-xs py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-950 mb-1">Detailed Warden Inspection & Action Needed *</label>
              <textarea
                rows={4}
                required
                value={complaintDesc}
                onChange={(e) => setComplaintDesc(e.target.value)}
                placeholder="Describe the hostel infrastructure or mess issue requiring Main Admin intervention..."
                className="input-field text-xs py-2.5"
              />
            </div>

            <div className="pt-3 border-t border-ivory-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSubTab('queue')}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-5 font-bold shadow-md flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Official Bhavan Complaint to Main Admin (+20 Weightage)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MY BHAVAN RESIDENTS ROSTER (CONFIDENTIAL VIEW)
          ========================================================================= */}
      {subTab === 'residents' && (
        <div className="bg-white border border-ivory-300 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ivory-200">
            <div>
              <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-700" />
                <span>Confidential Residents Roster — {activeHostel}</span>
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Showing {hostelResidents.length} students residing in <strong>{activeHostel}</strong>. These details are strictly private to you, their Class Advisor, and Main Admin.
              </p>
            </div>

            <input
              type="text"
              value={residentSearch}
              onChange={(e) => setResidentSearch(e.target.value)}
              placeholder="Search resident by name, room, roll no, section..."
              className="px-3.5 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory-100 text-charcoal-600 border-b border-ivory-200 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Resident Student</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Hostel & Room</th>
                  <th className="py-3 px-4">Class Section (Shared w/ Advisor)</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Hostel Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {hostelResidents.map(stu => {
                  const stuTickets = hostelTickets.filter(t => t.raisedBy?.id === stu.id);
                  return (
                    <tr key={stu.id} className="hover:bg-ivory-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-forest-950 flex items-center space-x-2.5">
                        <img src={stu.avatar} alt={stu.name} className="w-7 h-7 rounded-full object-cover" />
                        <span>{stu.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-charcoal-700 font-semibold">{stu.rollNo}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px]">
                          {stu.hostel} • Room {stu.room}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px]">
                          {stu.classSection}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-charcoal-600">{stu.email}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {stuTickets.length} report(s)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
