// Scope Privacy & Authorization Middleware

export function filterTicketsByScope(tickets, user) {
  if (!user) return tickets;

  return tickets.filter(ticket => {
    // Central Admin sees all
    if (user.role === 'central_admin') return true;

    // Domain Admin sees issues in their domain
    if (user.role === 'domain_admin') {
      return ticket.domain === user.domain || user.domain === 'all';
    }

    // Faculty Advisor sees issues in their mentored class section and department
    if (user.role === 'faculty_advisor') {
      if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
      if (ticket.scope === 'department' && ticket.department === user.department) return true;
      if (ticket.scope === 'campus') return true;
      return false;
    }

    // Student scope visibility
    if (ticket.scope === 'campus') return true;
    if (ticket.scope === 'department' && ticket.department === user.department) return true;
    if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
    if (ticket.scope === 'room' && ticket.hostel === user.hostel && ticket.room === user.room) return true;
    if (ticket.scope === 'hostel_generic') return true;

    return false;
  });
}
