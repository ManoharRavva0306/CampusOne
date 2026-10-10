// Dynamic Priority Score Engine for CampusOne CMRS

export function calculatePriorityScore(ticket) {
  let base = 50;
  if (ticket.category === 'safety') base = 85;
  if (ticket.scope === 'campus') base += 10;
  if (ticket.scope === 'department') base += 5;

  const upScore = (ticket.upvotes?.length || 0) * 3;
  const downScore = (ticket.downvotes?.length || 0) * 2;
  const advisorBonus = (ticket.advisorEndorsed || ticket.advisorApprovalStatus === 'approved') ? 20 : 0;
  const wardenBonus = (ticket.wardenEndorsed || ticket.wardenApprovalStatus === 'approved') ? 20 : 0;
  const panelDirectBonus = (ticket.raisedBy?.role === 'faculty_advisor' || ticket.raisedBy?.role === 'hostel_warden') ? 10 : 0;

  let total = base + upScore - downScore + advisorBonus + wardenBonus + panelDirectBonus;
  return Math.min(Math.max(total, 10), 100);
}
