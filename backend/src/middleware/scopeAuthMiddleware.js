// Scope Privacy & Authorization Middleware
// Allows students to view campus grievances across all categories while respecting privacy

export function filterTicketsByScope(tickets, user) {
  if (!user) return tickets;

  return tickets.filter(ticket => {
    // Central Admin & Domain Admins see full system or their domain
    if (user.role === 'central_admin') return true;
    if (user.role === 'domain_admin') {
      return ticket.domain === user.domain || user.domain === 'all';
    }

    // Faculty Advisor sees all issues in their mentored class section, dept, and campus
    if (user.role === 'faculty_advisor') {
      if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
      if (ticket.scope === 'department' && ticket.department === user.department) return true;
      if (ticket.scope === 'campus') return true;
      return true; // Let advisors view all student issues for oversight
    }

    // Student scope visibility:
    // Students can see all reports raised across campus, department, class, and hostels
    // Private individual room issues are visible to room occupants and general hostel
    if (ticket.scope === 'room') {
      return ticket.raisedBy?.id === user.id || (ticket.hostel === user.hostel && ticket.room === user.room);
    }

    // All campus, department, classroom, and hostel common issues are open for peer view & voting!
    return true;
  });
}
