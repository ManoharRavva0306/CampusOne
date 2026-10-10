// Dynamic Priority Score Engine for CampusOne CMRS
// Advisor vote and endorsements carry heavy institutional weight (+20 each vs student +3)

export function calculatePriorityScore(ticket, users = []) {
  let base = 50;
  if (ticket.category === 'safety') base = 85;
  if (ticket.scope === 'campus') base += 10;
  if (ticket.scope === 'department') base += 5;
  
  const upvotes = ticket.upvotes || [];
  const downvotes = ticket.downvotes || [];

  let studentUpCount = 0;
  let advisorUpCount = 0;

  upvotes.forEach(userId => {
    const user = users.find(u => u.id === userId);
    if (user && (user.role === 'faculty_advisor' || user.role === 'central_admin' || user.role === 'domain_admin')) {
      advisorUpCount += 1;
    } else {
      studentUpCount += 1;
    }
  });

  // Students get +3 per upvote, Faculty Advisors get +20 per endorsement/upvote!
  const studentUpScore = studentUpCount * 3;
  const advisorBonus = (advisorUpCount * 20) + (ticket.advisorEndorsed && advisorUpCount === 0 ? 20 : 0);
  const downScore = downvotes.length * 2;
  
  let total = base + studentUpScore + advisorBonus - downScore;
  return Math.min(Math.max(total, 10), 100);
}

