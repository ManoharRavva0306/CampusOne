import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { 
  GraduationCap, 
  ShieldCheck, 
  Flame, 
  Send,
  School,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Users,
  Lock,
  Sparkles,
  AlertTriangle,
  MapPin,
  Mail,
  Home,
  Check,
  X,
  FilePlus2,
  ArrowRight
} from 'lucide-react';

export default function AdvisorDashboard() {
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

  // All available class sections in the institution
  const ALL_SECTIONS = [
    'CSE-B 3rd Year',
    'CSE-A 3rd Year',
    'ECE-A 3rd Year',
    'ECE-B 3rd Year',
    'MECH-A 3rd Year',
    'EEE-B 3rd Year',
    'AIE-A 3rd Year',
    'CYS-B 3rd Year'
  ];

  // If logged in as a faculty_advisor, lock strictly to their assigned classSection!
  // If logged in as Main Admin (for oversight/testing), allow previewing any section.
  const isStrictAdvisor = currentUser.role === 'faculty_advisor';
  const [selectedSection, setSelectedSection] = useState(
    currentUser.classSection || 'CSE-B 3rd Year'
  );

  const activeSection = isStrictAdvisor
    ? (currentUser.classSection || 'CSE-B 3rd Year')
    : selectedSection;

  const [subTab, setSubTab] = useState('queue'); // 'queue' | 'raise_complaint' | 'students'
  const [approvalFilter, setApprovalFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected' | 'panel_raised'
  const [commentInput, setCommentInput] = useState({});
  const [reviewNotes, setReviewNotes] = useState({});
  const [studentSearch, setStudentSearch] = useState('');

  // Advisor Direct Complaint Form State
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('it_av');
  const [complaintLocation, setComplaintLocation] = useState(`${activeSection} Classroom (Academic Block 1)`);
  const [complaintUrgency, setComplaintUrgency] = useState('high');

  // Filter college-wise tickets belonging to this classSection
  const sectionTickets = useMemo(() => {
    return tickets.filter(t => {
      const isCollegeScope = t.scope === 'class' || t.scope === 'department';
      const matchesSection = t.classSection === activeSection;
      return isCollegeScope && matchesSection;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [tickets, activeSection]);

  const filteredTickets = useMemo(() => {
    return sectionTickets.filter(t => {
      if (approvalFilter === 'pending') return t.advisorApprovalStatus === 'pending' && !t.raisedByPanel;
      if (approvalFilter === 'approved') return t.advisorApprovalStatus === 'approved' || t.advisorEndorsed;
      if (approvalFilter === 'rejected') return t.advisorApprovalStatus === 'rejected';
      if (approvalFilter === 'panel_raised') return t.raisedByPanel === 'advisor' || t.raisedBy?.role === 'faculty_advisor';
      return true;
    });
  }, [sectionTickets, approvalFilter]);

  // Confidential Student Roster for this Class Advisor's section ONLY
  const sectionStudents = useMemo(() => {
    return (userList || []).filter(u =>
      u.role === 'student' && u.classSection === activeSection &&
      (!studentSearch.trim() ||
        u.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (u.rollNo || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
        (u.hostel || '').toLowerCase().includes(studentSearch.toLowerCase()))
    );
  }, [userList, activeSection, studentSearch]);

  const pendingCount = sectionTickets.filter(t => t.advisorApprovalStatus === 'pending' && !t.raisedByPanel).length;
  const approvedCount = sectionTickets.filter(t => t.advisorApprovalStatus === 'approved' || t.advisorEndorsed).length;
  const rejectedCount = sectionTickets.filter(t => t.advisorApprovalStatus === 'rejected').length;
  const advisorRaisedCount = sectionTickets.filter(t => t.raisedByPanel === 'advisor' || t.raisedBy?.role === 'faculty_advisor').length;

  const handleDecision = (ticketId, decision) => {
    const note = reviewNotes[ticketId] || '';
    reviewTicketByPanel(ticketId, {
      panelType: 'advisor',
      decision,
      note: note.trim()
    });
    setReviewNotes({ ...reviewNotes, [ticketId]: '' });
  };

  const handlePostAdvisorComment = (ticketId) => {
    const text = commentInput[ticketId];
    if (!text || !text.trim()) return;
    addComment(ticketId, text.trim());
    setCommentInput({ ...commentInput, [ticketId]: '' });
  };

  const handleCreateAdvisorComplaint = (e) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDesc.trim()) return;

    const matchedCat = CATEGORIES.find(c => c.id === complaintCategory);
    raiseTicket({
      title: `[Advisor Complaint - ${activeSection}] ${complaintTitle.trim()}`,
      description: complaintDesc.trim(),
      scope: 'class',
      classSection: activeSection,
      department: activeSection.split('-')[0] || currentUser.department || 'CSE',
      location: complaintLocation || `${activeSection} Classroom`,
      category: complaintCategory,
      domain: matchedCat ? matchedCat.domain : 'electrical_av',
      urgency: complaintUrgency,
      advisorNote: `Official complaint filed directly by Class Advisor (${currentUser.name}) for Main Admin resolution.`,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
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
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-mint-300 flex items-center justify-center font-bold shadow-md shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-forest-950">Class Advisor Supervisory Page</h2>
                <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Section: {activeSection}
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                  Stage-1 College Gatekeeper
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-1 max-w-2xl">
                College-wise issues raised by students of <strong>{activeSection}</strong> arrive here first before reaching the Final Admin. Approve valid issues to boost weightage (+20) and forward to Main Admin, or decline invalid ones.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {!isStrictAdvisor && (
              <div className="flex items-center space-x-1.5 bg-ivory-100 px-3 py-1.5 rounded-xl border border-ivory-300">
                <span className="text-[11px] font-bold text-charcoal-600">Inspect Section:</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-forest-950 focus:outline-none cursor-pointer"
                >
                  {ALL_SECTIONS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
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
              <span>Add Complaint to Main Admin</span>
            </button>
          </div>
        </div>

        {/* Strict Confidentiality Notice */}
        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-950">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Confidential Student Scope Isolation:</strong> Student details (Roll No, Hostel, Room, Section) for <strong>{activeSection}</strong> are accessible ONLY to you (their Class Advisor), their respective Hostel Resident Warden, and Main Admin — never exposed to unrelated sections in between.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 shrink-0">
            Advisor: {currentUser.name}
          </span>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-ivory-200">
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-center">
            <div className="text-xs text-amber-900 font-semibold">Pending Your Choice</div>
            <div className="text-xl font-black text-amber-800 mt-0.5">{pendingCount}</div>
            <div className="text-[10px] text-amber-700">Awaiting Accept / Reject</div>
          </div>
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center">
            <div className="text-xs text-emerald-900 font-semibold">Approved & Sent to Admin</div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">{approvedCount}</div>
            <div className="text-[10px] text-emerald-700">+20 Weightage Added</div>
          </div>
          <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 text-center">
            <div className="text-xs text-rose-900 font-semibold">Declined by Advisor</div>
            <div className="text-xl font-black text-rose-700 mt-0.5">{rejectedCount}</div>
            <div className="text-[10px] text-rose-700">Filtered before Admin</div>
          </div>
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-center">
            <div className="text-xs text-blue-900 font-semibold">Section Students</div>
            <div className="text-xl font-black text-blue-800 mt-0.5">{sectionStudents.length}</div>
            <div className="text-[10px] text-blue-700">{advisorRaisedCount} Advisor Complaints</div>
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
            <span>Student Issues Approval Queue ({sectionTickets.length})</span>
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
            <FilePlus2 className="w-4 h-4 text-emerald-500" />
            <span>Add Complaint to Main Admin</span>
          </button>

          <button
            onClick={() => setSubTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              subTab === 'students'
                ? 'bg-[#092d25] text-white shadow-sm'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={subTab === 'students' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <Users className="w-4 h-4 text-blue-500" />
            <span>My Section Students ({sectionStudents.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: STUDENT ISSUES APPROVAL QUEUE (ACCEPT / REJECT)
          ========================================================================= */}
      {subTab === 'queue' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-ivory-300">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-charcoal-500 font-bold mr-1">Filter Queue:</span>
              {[
                { id: 'all', label: `All Section Issues (${sectionTickets.length})` },
                { id: 'pending', label: `⏳ Pending Approval (${pendingCount})` },
                { id: 'approved', label: `✅ Approved & Sent to Admin (${approvedCount})` },
                { id: 'rejected', label: `❌ Declined (${rejectedCount})` },
                { id: 'panel_raised', label: `📢 Raised by Advisor (${advisorRaisedCount})` }
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
            const isPending = ticket.advisorApprovalStatus === 'pending' && !ticket.raisedByPanel;
            const isApproved = ticket.advisorApprovalStatus === 'approved' || ticket.advisorEndorsed;
            const isRejected = ticket.advisorApprovalStatus === 'rejected';

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
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {ticket.classSection}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700 uppercase">
                          {ticket.category}
                        </span>

                        {ticket.raisedByPanel === 'advisor' ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                            📢 Raised Directly by Class Advisor
                          </span>
                        ) : isPending ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            ⏳ Awaiting Class Advisor Approval (Before Final Admin)
                          </span>
                        ) : isApproved ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            ✅ Advisor Approved (+20 Strong Weightage) • Sent to Main Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                            ❌ Declined by Class Advisor
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
                        <span className="text-emerald-700 font-bold">👍 {ticket.upvotes?.length || 0} section confirmations</span>
                        <span>• Status: <strong className="uppercase text-forest-950">{ticket.status.replace('_', ' ')}</strong></span>
                      </div>

                      {/* Confidential Student Identity Card (Visible ONLY to Respective Advisor & Warden) */}
                      <div className="mt-2 p-3 rounded-2xl bg-ivory-50 border border-ivory-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={reporterStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={reporterStudent?.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                          />
                          <div>
                            <div className="font-bold text-forest-950 flex items-center space-x-1.5">
                              <span>{reporterStudent?.name || 'Student'}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-ivory-300 text-charcoal-700">
                                {reporterStudent?.rollNo || 'STAFF'}
                              </span>
                            </div>
                            <div className="text-[11px] text-charcoal-600 flex flex-wrap items-center gap-2 mt-0.5">
                              <span>🎓 Section: <strong>{reporterStudent?.classSection || activeSection}</strong></span>
                              {reporterStudent?.hostel && (
                                <span>• 🏠 Hostel: <strong>{reporterStudent.hostel} {reporterStudent.room ? `(Rm ${reporterStudent.room})` : ''}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-emerald-700" />
                          <span>Verified Student of Your Section</span>
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

                  {/* Right Column: Priority Score & Advisor Accept / Reject Decision */}
                  <div className="flex flex-col items-end justify-between gap-3 shrink-0 lg:w-72 border-t lg:border-t-0 lg:border-l border-ivory-200 pt-3 lg:pt-0 lg:pl-5">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-charcoal-500 uppercase">Priority Weightage</span>
                      <div className="px-3 py-1 rounded-xl bg-ivory-100 border border-ivory-200 flex items-center space-x-1 font-black text-forest-950 text-sm">
                        <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        <span>{ticket.priorityScore} / 100</span>
                      </div>
                    </div>

                    {/* Advisor Choice Box: Accept or Reject */}
                    <div className="w-full space-y-2 bg-ivory-50 p-3 rounded-2xl border border-ivory-200">
                      <div className="text-[11px] font-bold text-forest-950">
                        Advisor Decision (Before Final Admin):
                      </div>
                      <input
                        type="text"
                        placeholder="Optional remark / verification note..."
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
                      {ticket.advisorNote && (
                        <div className="text-[11px] text-charcoal-600 italic pt-1 border-t border-ivory-200">
                          "{ticket.advisorNote}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Advisor Comment / Directive */}
                <div className="pt-3 border-t border-ivory-200 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add official Class Advisor directive or follow-up comment..."
                    value={commentInput[ticket.id] || ''}
                    onChange={(e) => setCommentInput({ ...commentInput, [ticket.id]: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePostAdvisorComment(ticket.id); }}
                    className="input-field text-xs py-2 flex-1"
                  />
                  <button
                    onClick={() => handlePostAdvisorComment(ticket.id)}
                    className="btn-primary text-xs py-2 px-3.5 font-bold flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Directive</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="text-center py-12 text-charcoal-500 bg-white rounded-3xl border border-ivory-300 p-6">
              <GraduationCap className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
              <div className="font-bold text-sm text-forest-950">No Section Issues Match This Filter</div>
              <p className="text-xs text-charcoal-500 mt-1">
                Switch filter tabs above or file a direct section complaint to the Main Admin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ADD COMPLAINT DIRECTLY TO MAIN ADMIN (ADVISOR PANEL COMPLAINT)
          ========================================================================= */}
      {subTab === 'raise_complaint' && (
        <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-subtle max-w-3xl mx-auto space-y-5">
          <div className="flex items-start space-x-3 pb-4 border-b border-ivory-200">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-forest-950">
                Raise Official Section Complaint to Main Admin ({activeSection})
              </h3>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Complaints filed by the Class Advisor carry automatic <strong>+20 Strong Approval Weightage</strong> and appear directly under <strong>{activeSection}</strong> in the Main Admin's command panel.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAdvisorComplaint} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-forest-950 mb-1">Complaint Title *</label>
              <input
                type="text"
                required
                value={complaintTitle}
                onChange={(e) => setComplaintTitle(e.target.value)}
                placeholder="e.g. Replace faulty Smart Board HDMI switcher & 4 broken benches in CSE-B Classroom"
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
                  <option value="high">High Priority (Affects Daily Lectures)</option>
                  <option value="emergency">Emergency / Safety Critical</option>
                  <option value="medium">Standard Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-forest-950 mb-1">Classroom / Lab Location</label>
              <input
                type="text"
                value={complaintLocation}
                onChange={(e) => setComplaintLocation(e.target.value)}
                placeholder={`e.g. Academic Block 1 - ${activeSection} Lecture Hall`}
                className="input-field text-xs py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-950 mb-1">Detailed Advisor Observation & Action Needed *</label>
              <textarea
                rows={4}
                required
                value={complaintDesc}
                onChange={(e) => setComplaintDesc(e.target.value)}
                placeholder="Describe the classroom/lab infrastructure issue and required intervention from the Main Admin..."
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
                <span>Submit Official Complaint to Main Admin (+20 Weightage)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MY SECTION STUDENTS ROSTER (CONFIDENTIAL VIEW)
          ========================================================================= */}
      {subTab === 'students' && (
        <div className="bg-white border border-ivory-300 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ivory-200">
            <div>
              <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Confidential Student Roster — {activeSection}</span>
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Showing {sectionStudents.length} students enrolled in <strong>{activeSection}</strong>. These details are strictly private to you, their Hostel Warden, and Main Admin.
              </p>
            </div>

            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search section student by name, roll no, hostel..."
              className="px-3.5 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory-100 text-charcoal-600 border-b border-ivory-200 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Class Section</th>
                  <th className="py-3 px-4">Hostel & Room (Shared w/ Warden)</th>
                  <th className="py-3 px-4">Issues Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {sectionStudents.map(stu => {
                  const stuTickets = tickets.filter(t => t.raisedBy?.id === stu.id);
                  return (
                    <tr key={stu.id} className="hover:bg-ivory-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-forest-950 flex items-center space-x-2.5">
                        <img src={stu.avatar} alt={stu.name} className="w-7 h-7 rounded-full object-cover" />
                        <span>{stu.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-charcoal-700 font-semibold">{stu.rollNo}</td>
                      <td className="py-3 px-4 font-mono text-charcoal-600">{stu.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                          {stu.classSection}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[10px]">
                          {stu.hostel} • Rm {stu.room}
                        </span>
                      </td>
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
