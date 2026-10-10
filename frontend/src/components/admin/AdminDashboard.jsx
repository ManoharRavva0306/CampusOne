import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    tickets, 
    currentUser, 
    updateTicketAdmin, 
    setSelectedTicketForDetail 
  } = useApp();

  const [selectedDomain, setSelectedDomain] = useState(
    currentUser.domain || 'electrical_av'
  );

  const [statusFilter, setStatusFilter] = useState('all');
  const [editingTicket, setEditingTicket] = useState(null);

  // Edit form state
  const [editStatus, setEditStatus] = useState('');
  const [editEta, setEditEta] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editTechnician, setEditTechnician] = useState('');

  const domainTickets = tickets.filter(t => {
    if (selectedDomain !== 'all' && t.domain !== selectedDomain) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setEditStatus(ticket.status);
    setEditEta(ticket.eta || '');
    setEditNote(ticket.adminNote || '');
    setEditTechnician(ticket.assignedTo || '');
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
                Triage tickets by dynamic severity score, assign technicians, convey public ETAs, and trigger on-site student sign-offs.
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
        <div className="flex items-center space-x-2 overflow-x-auto mt-6 pt-4 border-t border-ivory-200">
          {DOMAINS.map(dom => {
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Filter Chips & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-charcoal-500 font-semibold">Status:</span>
          {['all', 'reported', 'in_progress', 'awaiting_verification', 'resolved'].map(st => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
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
                      Scope: {ticket.scope.toUpperCase()} {ticket.classSection ? `(${ticket.classSection})` : ''}
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

                    {ticket.advisorNotified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono font-bold border border-purple-200">
                        Advisor Alerted
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
                    <span>👤 {ticket.raisedBy?.name || 'Student'}</span>
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
                  <div className="text-[10px] uppercase font-bold text-charcoal-500">Priority</div>
                  <div className="text-base font-black text-forest-950 flex items-center justify-center space-x-1">
                    <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>{ticket.priorityScore}</span>
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

      {/* Modal to Update Ticket (Status, ETA, Technician, Notes) */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scale-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="text-base font-bold text-forest-950">Update Ticket #{editingTicket.id}</h3>
                <p className="text-xs text-charcoal-500 truncate max-w-sm">{editingTicket.title}</p>
              </div>
              <button onClick={() => setEditingTicket(null)} className="text-charcoal-400 hover:text-forest-950">✕</button>
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
