// Dynamic Priority Score Engine for CampusOne CMRS

export function calculatePriorityScore(ticket) {
  let base = 50;
  if (ticket.category === 'safety') base = 85;
  if (ticket.scope === 'campus') base += 10;
  if (ticket.scope === 'department') base += 5;
  
  const upScore = (ticket.upvotes?.length || 0) * 3;
  const downScore = (ticket.downvotes?.length || 0) * 2;
  const advisorBonus = ticket.advisorEndorsed ? 20 : 0;
  
  let total = base + upScore - downScore + advisorBonus;
  return Math.min(Math.max(total, 10), 100);
}
