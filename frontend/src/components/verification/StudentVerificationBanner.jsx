import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, RotateCcw, Sparkles, MapPin, Wrench, AlertCircle } from 'lucide-react';

export default function StudentVerificationBanner() {
  const { currentUser, tickets, verifyResolution } = useApp();
  const [feedback, setFeedback] = useState({});
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);

  if (!currentUser) return null;

  // Tickets raised by currentUser that are waiting for their on-site confirmation
  const pendingTickets = tickets.filter(
    t => t.raisedBy?.id === currentUser?.id && t.status === 'awaiting_verification'
  );

  if (pendingTickets.length === 0) return null;

  return (
    <div className="mb-6 space-y-3 animate-fade-down">
      {pendingTickets.map(ticket => (
        <div
          key={ticket.id}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border-2 border-amber-400 p-3.5 sm:p-5 shadow-md animate-amber-pulse"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex items-start space-x-3 sm:space-x-3.5">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0 mt-0.5">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Two-Way Verification Required
                  </span>
                  <span className="text-[11px] sm:text-xs text-charcoal-500 font-mono">#{ticket.id}</span>
                </div>
                
                <h4 className="text-sm sm:text-base font-bold text-forest-950 mt-1">
                  Department Marked As Fixed: "{ticket.title}"
                </h4>

                <p className="text-xs text-charcoal-700 mt-1 max-w-2xl">
                  <strong className="text-amber-900 font-semibold">Maintenance Note: </strong>
                  {ticket.adminNote || 'Technician completed repair on-site.'}
                </p>

                <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px] text-charcoal-500 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                  <span>{ticket.location} • Please inspect on-site to verify closure.</span>
                </div>
              </div>
            </div>

            {/* Verification Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => verifyResolution(ticket.id, true, feedback[ticket.id])}
                className="btn-primary text-xs py-2 px-4 shadow-md flex items-center justify-center space-x-1.5 font-bold touch-press"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Resolution</span>
              </button>

              <button
                onClick={() => {
                  if (activeFeedbackId === ticket.id) {
                    verifyResolution(ticket.id, false, feedback[ticket.id] || 'Problem still persists on-site');
                  } else {
                    setActiveFeedbackId(ticket.id);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-rose-50 text-rose-700 border border-ivory-300 hover:border-rose-300 text-xs font-semibold transition-all flex items-center justify-center space-x-1 touch-press"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Still Not Fixed — Reopen</span>
              </button>
            </div>

          </div>

          {/* Feedback input if student reports problem persists */}
          {activeFeedbackId === ticket.id && (
            <div className="mt-4 pt-3 border-t border-ivory-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 animate-fade-in">
              <input
                type="text"
                placeholder="Explain why the fault remains (e.g., fan still humming)..."
                value={feedback[ticket.id] || ''}
                onChange={(e) => setFeedback({ ...feedback, [ticket.id]: e.target.value })}
                className="input-field text-xs py-2 flex-1"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => verifyResolution(ticket.id, false, feedback[ticket.id])}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shrink-0 hover:bg-rose-700 touch-press flex-1 sm:flex-none"
                >
                  Submit Reopen Notice
                </button>
                <button
                  onClick={() => setActiveFeedbackId(null)}
                  className="px-3 py-2 rounded-xl bg-ivory-200 text-charcoal-700 text-xs font-semibold hover:bg-ivory-300 touch-press"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}
