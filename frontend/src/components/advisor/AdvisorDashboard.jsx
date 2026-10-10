import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Flame, 
  Send,
  School,
  Building2,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AdvisorDashboard() {
  const { 
    currentUser, 
    tickets, 
    endorseTicket, 
    addComment, 
    setSelectedTicketForDetail 
  } = useApp();

  if (!currentUser) return null;

  const [commentInput, setCommentInput] = useState({});

  const classTickets = tickets.filter(
    t => t.scope === 'class' && (t.classSection === currentUser.classSection || currentUser.role !== 'faculty_advisor')
  );

  const handlePostAdvisorComment = (ticketId) => {
    const text = commentInput[ticketId];
    if (!text || !text.trim()) return;

    addComment(ticketId, text.trim());
    setCommentInput({ ...commentInput, [ticketId]: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header Banner */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-mint-300 flex items-center justify-center font-bold shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-forest-950">Class Advisor Supervisory Desk</h2>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {currentUser.classSection || 'CSE-B 3rd Year'}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-1">
                Direct faculty oversight of classroom infrastructure reports raised by your section students.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-ivory-100 p-2.5 rounded-2xl border border-ivory-200 self-start md:self-auto">
            <span className="text-xs text-charcoal-500 font-mono">Advisor:</span>
            <span className="text-xs font-bold text-forest-950">{currentUser.name}</span>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-ivory-200">
          <div className="bg-ivory-100 p-3.5 rounded-xl border border-ivory-200 text-center">
            <div className="text-xs text-charcoal-500 font-medium">Class Reports</div>
            <div className="text-xl font-bold text-forest-950 mt-0.5">{classTickets.length}</div>
          </div>
          <div className="bg-ivory-100 p-3.5 rounded-xl border border-ivory-200 text-center">
            <div className="text-xs text-charcoal-500 font-medium">Faculty Endorsed</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {classTickets.filter(t => t.advisorEndorsed).length}
            </div>
          </div>
          <div className="bg-ivory-100 p-3.5 rounded-xl border border-ivory-200 text-center">
            <div className="text-xs text-charcoal-500 font-medium">Verified Resolved</div>
            <div className="text-xl font-bold text-blue-700 mt-0.5">
              {classTickets.filter(t => t.status === 'resolved').length}
            </div>
          </div>
        </div>
      </div>

      {/* Classroom issues feed */}
      <div className="space-y-4">
        {classTickets.map(ticket => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border border-ivory-300 p-5 shadow-subtle space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start space-x-3.5">
                <img
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-ivory-300"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-charcoal-500 font-bold">{ticket.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {ticket.classSection}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700">
                      {ticket.category.toUpperCase()}
                    </span>
                  </div>

                  <h3 
                    onClick={() => setSelectedTicketForDetail(ticket)}
                    className="text-base font-bold text-forest-950 hover:text-emerald-700 cursor-pointer mt-1"
                  >
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-charcoal-700 mt-0.5">
                    {ticket.description}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-charcoal-500 pt-1">
                    <span>📍 {ticket.location}</span>
                    <span>👤 Reported by: {ticket.raisedBy?.name || 'Student'}</span>
                    <span className="text-emerald-700 font-semibold">👍 {ticket.upvotes?.length || 0} confirmations</span>
                  </div>
                </div>
              </div>

              {/* Priority & Endorsement Action */}
              <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                <div className="text-center px-3 py-1.5 rounded-xl bg-ivory-100 border border-ivory-200">
                  <div className="text-[10px] uppercase font-bold text-charcoal-500">Score</div>
                  <div className="text-sm font-black text-forest-950 flex items-center justify-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>{ticket.priorityScore}</span>
                  </div>
                </div>

                {!ticket.advisorEndorsed ? (
                  <button
                    onClick={() => endorseTicket(ticket.id)}
                    className="btn-primary text-xs py-2 px-3.5 font-bold shadow-sm flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Endorse Report (+20 Priority)</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Officially Endorsed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Advisor Feedback box */}
            <div className="pt-3 border-t border-ivory-200 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add official faculty directive to maintenance staff..."
                value={commentInput[ticket.id] || ''}
                onChange={(e) => setCommentInput({ ...commentInput, [ticket.id]: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') handlePostAdvisorComment(ticket.id); }}
                className="input-field text-xs py-2 flex-1"
              />
              <button
                onClick={() => handlePostAdvisorComment(ticket.id)}
                className="btn-primary text-xs py-2 px-3 font-bold flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Directive</span>
              </button>
            </div>
          </div>
        ))}

        {classTickets.length === 0 && (
          <div className="text-center py-12 text-charcoal-500 bg-white rounded-2xl border border-ivory-300">
            No classroom infrastructure reports logged for your section currently.
          </div>
        )}
      </div>

    </div>
  );
}
