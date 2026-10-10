// Scope Privacy & Authorization Middleware

export function canViewStudentPrivateDetails(studentInfo, viewer) {
  if (!viewer || !studentInfo) return false;
  if (viewer.role === 'central_admin') return true;
  if (viewer.id === studentInfo.id) return true;
  if (viewer.role === 'faculty_advisor' && viewer.classSection && studentInfo.classSection === viewer.classSection) {
    return true;
  }
  if (viewer.role === 'hostel_warden' && viewer.hostel && studentInfo.hostel === viewer.hostel) {
    return true;
  }
  return false;
}

export function filterTicketsByScope(tickets, user) {
  if (!user) return tickets;

  return tickets.filter(ticket => {
    // Central / Main Admin sees all sections & hostels
    if (user.role === 'central_admin') return true;

    // Domain Admin sees issues in their domain (once approved by advisor/warden or campus-wide)
    if (user.role === 'domain_admin') {
      const inDomain = ticket.domain === user.domain || user.domain === 'all';
      const isRejected = ticket.advisorApprovalStatus === 'rejected' || ticket.wardenApprovalStatus === 'rejected';
      return inDomain && !isRejected;
    }

    // Faculty Class Advisor sees issues in their mentored class section, their own raised issues, and campus/dept
    if (user.role === 'faculty_advisor') {
      if (ticket.raisedBy?.id === user.id) return true;
      if (ticket.classSection && ticket.classSection === user.classSection) return true;
      if (ticket.scope === 'department' && ticket.department === user.department) return true;
      if (ticket.scope === 'campus') return true;
      return false;
    }

    // Hostel Resident Warden sees issues in their assigned Hostel Bhavan and their own raised issues
    if (user.role === 'hostel_warden') {
      if (ticket.raisedBy?.id === user.id) return true;
      if (ticket.hostel && ticket.hostel === user.hostel && (ticket.scope === 'room' || ticket.scope === 'hostel_generic')) return true;
      if (ticket.scope === 'campus') return true;
      return false;
    }

    // Student scope visibility
    if (ticket.raisedBy?.id === user.id) return true;
    if (ticket.scope === 'campus') return true;
    if (ticket.scope === 'department' && ticket.department === user.department) return true;
    if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
    if (ticket.scope === 'room' && ticket.hostel === user.hostel && ticket.room === user.room) return true;
    if (ticket.scope === 'hostel_generic' && (!ticket.hostel || ticket.hostel === user.hostel)) return true;

    return false;
  });
}
