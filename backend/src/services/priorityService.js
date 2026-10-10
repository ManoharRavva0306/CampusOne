// Dynamic Priority Score Engine for CampusOne CMRS

export function calculatePriorityScore(ticket, users = []) {
  let base = 50;
  if (ticket.category === 'safety') base = 85;
  if (ticket.scope === 'campus') base += 10;
  if (ticket.scope === 'department') base += 5;

  // Faculty Advisor / Hostel Warden / Admin votes carry 6x higher institutional power (+20 pts) vs Student vote (+3 pts)
  let upScore = 0;
  for (const voterId of (ticket.upvotes || [])) {
    const voter = users.find(u => u.id === voterId);
    if (voter && (voter.role === 'faculty_advisor' || voter.role === 'hostel_warden' || voter.role === 'central_admin' || voter.role === 'domain_admin')) {
      upScore += 20;
    } else {
      upScore += 3;
    }
  }

  const downScore = (ticket.downvotes?.length || 0) * 2;
  const advisorBonus = (ticket.advisorEndorsed || ticket.advisorApprovalStatus === 'approved') ? 20 : 0;
  const wardenBonus = (ticket.wardenEndorsed || ticket.wardenApprovalStatus === 'approved') ? 20 : 0;
  const panelDirectBonus = (ticket.raisedBy?.role === 'faculty_advisor' || ticket.raisedBy?.role === 'hostel_warden' || ticket.raisedByPanel) ? 10 : 0;

  let total = base + upScore - downScore + advisorBonus + wardenBonus + panelDirectBonus;
  return Math.min(Math.max(total, 10), 100);
}
