// AI Keyword Duplicate Matcher for CampusOne CMRS

export function findDuplicateTickets(tickets, { title = '', description = '', category = '' }) {
  const query = `${title} ${description}`.toLowerCase();
  const keywords = query.split(/\s+/).filter(w => w.length > 3);

  if (keywords.length === 0) return [];

  return tickets.filter(t => {
    // Only check active tickets
    if (t.status === 'resolved') return false;

    const targetText = `${t.title} ${t.description} ${t.location}`.toLowerCase();
    
    let hits = 0;
    keywords.forEach(kw => {
      if (targetText.includes(kw)) hits++;
    });

    const sameCategory = t.category === category;
    return hits >= 2 || (hits >= 1 && sameCategory);
  }).slice(0, 3);
}
