import { 
  getUsersFromDB, 
  getTicketsFromDB, 
  addTicketToDB, 
  updateTicketInDB,
  deleteTicketFromDB
} from '../models/ticketModel.js';
import { calculatePriorityScore } from '../services/priorityService.js';
import { findDuplicateTickets } from '../services/aiDuplicateService.js';
import { filterTicketsByScope } from '../middleware/scopeAuthMiddleware.js';

// Get tickets with scope privacy applied
export function getTickets(req, res) {
  const users = getUsersFromDB();
  const tickets = getTicketsFromDB();
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = users.find(u => u.id === userId) || users[0];

  const visibleTickets = filterTicketsByScope(tickets, user);
  res.json({ success: true, user, count: visibleTickets.length, tickets: visibleTickets });
}

// Check duplicates via AI keyword similarity
export function checkDuplicates(req, res) {
  const tickets = getTicketsFromDB();
  const { title, description, category } = req.body;
  const duplicates = findDuplicateTickets(tickets, { title, description, category });
  res.json({ success: true, count: duplicates.length, duplicates });
}

// Create new ticket via Decision Tree or Panel Member (Advisor / Warden)
export function createTicket(req, res) {
  const users = getUsersFromDB();
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = users.find(u => u.id === userId) || users[0];
  const data = req.body;

  const isAdvisor = user.role === 'faculty_advisor';
  const isWarden = user.role === 'hostel_warden';
  const scope = data.scope || (isWarden ? 'hostel_generic' : 'class');
  const isHostelIssue = scope === 'room' || scope === 'hostel_generic';
  const isCollegeIssue = scope === 'class' || scope === 'department';

  const newTicket = {
    id: data.id || `TICK-${Math.floor(100 + Math.random() * 900)}`,
    title: data.title,
    description: data.description,
    scope,
    classSection: data.classSection || user.classSection || null,
    department: data.department || user.department || 'CSE',
    hostel: data.hostel || user.hostel || null,
    room: data.room || user.room || null,
    location: data.location || 'Campus Academic Area',
    category: data.category || 'electrical',
    domain: data.domain || 'electrical_av',
    raisedBy: {
      id: user.id,
      name: user.name,
      role: user.role,
      rollNo: user.rollNo || 'STAFF',
      classSection: user.classSection || null,
      hostel: user.hostel || null,
      room: user.room || null,
      avatar: user.avatar
    },
    raisedByPanel: isAdvisor ? 'advisor' : isWarden ? 'warden' : null,
    createdAt: new Date().toISOString(),
    status: 'reported',
    priorityScore: data.urgency === 'emergency' ? 95 : 65,
    upvotes: [user.id],
    downvotes: [],
    // Routing & Stage-1 Approval Metadata
    advisorNotified: isCollegeIssue || isAdvisor,
    advisorEndorsed: isAdvisor ? true : false,
    advisorApprovalStatus: isAdvisor ? 'approved' : (isCollegeIssue ? 'pending' : 'not_applicable'),
    advisorNote: isAdvisor ? 'Directly filed by Class Advisor for section priority resolution.' : '',
    wardenNotified: isHostelIssue || isWarden,
    wardenEndorsed: isWarden ? true : false,
    wardenApprovalStatus: isWarden ? 'approved' : (isHostelIssue ? 'pending' : 'not_applicable'),
    wardenNote: isWarden ? 'Directly filed by Hostel Resident Warden for Bhavan resolution.' : '',
    forwardedToAdmin: isAdvisor || isWarden || scope === 'campus',
    assignedTo: 'Pending Assignment',
    eta: 'Awaiting triage',
    adminNote: '',
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    comments: []
  };

  newTicket.priorityScore = calculatePriorityScore(newTicket, users);
  addTicketToDB(newTicket);

  res.status(201).json({ success: true, ticket: newTicket });
}

// Swipe Vote (Upvote / Downvote)
export function voteTicket(req, res) {
  const { id } = req.params;
  const { voteType, userId: bodyUserId } = req.body; // 'up' | 'down'
  const userId = bodyUserId || req.headers['x-user-id'] || 'user_arjun';
  const users = getUsersFromDB();

  const updatedTicket = updateTicketInDB(id, (ticket) => {
    let upvotes = [...(ticket.upvotes || [])];
    let downvotes = [...(ticket.downvotes || [])];

    if (voteType === 'up') {
      if (upvotes.includes(userId)) {
        upvotes = upvotes.filter(u => u !== userId);
      } else {
        upvotes.push(userId);
        downvotes = downvotes.filter(u => u !== userId);
      }
    } else if (voteType === 'down') {
      if (downvotes.includes(userId)) {
        downvotes = downvotes.filter(u => u !== userId);
      } else {
        downvotes.push(userId);
        upvotes = upvotes.filter(u => u !== userId);
      }
    }

    ticket.upvotes = upvotes;
    ticket.downvotes = downvotes;
    ticket.priorityScore = calculatePriorityScore(ticket, users);
    return ticket;
  });

  if (!updatedTicket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, ticket: updatedTicket });
}

// Main Admin / Domain Admin Updates (Status, ETA, Technician, Note)
export function updateTicketAdmin(req, res) {
  const { id } = req.params;
  const { status, eta, adminNote, assignedTo } = req.body;

  const updatedTicket = updateTicketInDB(id, (ticket) => {
    if (status) ticket.status = status;
    if (eta !== undefined) ticket.eta = eta;
    if (adminNote !== undefined) ticket.adminNote = adminNote;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    return ticket;
  });

  if (!updatedTicket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, ticket: updatedTicket });
}

// Two-Way Student Verification Closure Loop
export function verifyResolution(req, res) {
  const { id } = req.params;
  const { isApproved, feedback } = req.body;

  const updatedTicket = updateTicketInDB(id, (ticket) => {
    if (isApproved) {
      ticket.status = 'resolved';
      ticket.adminNote = (ticket.adminNote || '') + `\n[Verified & Closed by Reporter: "${feedback || 'Confirmed on-site'}"]`;
    } else {
      ticket.status = 'in_progress';
      ticket.priorityScore = Math.min(ticket.priorityScore + 15, 100);
      ticket.adminNote = (ticket.adminNote || '') + `\n[REOPENED by Reporter: "${feedback || 'Still broken'}" - Escalated]`;
    }
    return ticket;
  });

  if (!updatedTicket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, ticket: updatedTicket });
}

// Faculty Advisor or Hostel Warden Approval / Rejection Review
export function reviewTicketByPanel(req, res) {
  const { id } = req.params;
  const { panelType, decision, note, reviewerName, reviewerAvatar } = req.body;
  const users = getUsersFromDB();

  const updatedTicket = updateTicketInDB(id, (ticket) => {
    const isApproved = decision !== 'rejected';
    const isWarden = panelType === 'warden';

    if (isWarden) {
      ticket.wardenApprovalStatus = isApproved ? 'approved' : 'rejected';
      ticket.wardenEndorsed = isApproved;
      if (note) ticket.wardenNote = note;
    } else {
      ticket.advisorApprovalStatus = isApproved ? 'approved' : 'rejected';
      ticket.advisorEndorsed = isApproved;
      if (note) ticket.advisorNote = note;
    }

    if (isApproved) {
      ticket.forwardedToAdmin = true;
      if (ticket.status === 'declined') ticket.status = 'reported';
    } else {
      ticket.forwardedToAdmin = false;
      ticket.status = 'declined';
    }

    const roleLabel = isWarden ? 'Hostel Resident Warden' : 'Class Advisor';
    const commentText = isApproved
      ? `✅ Official ${roleLabel} Approval (+20 Weightage): ${note || 'Verified and forwarded to Main Admin for priority resolution.'}`
      : `❌ Declined by ${roleLabel}: ${note || 'Did not meet verification criteria for escalation.'}`;

    ticket.comments = [
      ...(ticket.comments || []),
      {
        id: `c_review_${Date.now()}`,
        userName: reviewerName || roleLabel,
        userRole: roleLabel,
        avatar: reviewerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        text: commentText,
        timestamp: 'Just now',
        isOfficial: true
      }
    ];

    ticket.priorityScore = calculatePriorityScore(ticket, users);
    return ticket;
  });

  if (!updatedTicket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, ticket: updatedTicket });
}

// Legacy / Direct Endorse endpoint
export function endorseTicket(req, res) {
  req.body = { ...req.body, panelType: req.body?.panelType || 'advisor', decision: 'approved' };
  return reviewTicketByPanel(req, res);
}

// Add Comment
export function addComment(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  const users = getUsersFromDB();
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = users.find(u => u.id === userId) || users[0];

  const comment = {
    id: `c_${Date.now()}`,
    userName: user.name,
    userRole: user.role,
    avatar: user.avatar,
    text,
    timestamp: 'Just now',
    isOfficial: user.role !== 'student'
  };

  const updatedTicket = updateTicketInDB(id, (ticket) => {
    ticket.comments = ticket.comments || [];
    ticket.comments.push(comment);
    return ticket;
  });

  if (!updatedTicket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.status(201).json({ success: true, comment, ticket: updatedTicket });
}

// Delete Ticket (Student can delete own ticket, or central/domain admin)
export function deleteTicket(req, res) {
  const { id } = req.params;
  const users = getUsersFromDB();
  const userId = req.headers['x-user-id'] || req.body?.userId;
  const user = users.find(u => u.id === userId) || users.find(u => u.rollNo === userId);

  const tickets = getTicketsFromDB();
  const ticket = tickets.find(t => t.id === id);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  // Permission check: student who raised it or admin
  const isOwner = ticket.raisedBy?.id === userId || (user && ticket.raisedBy?.id === user.id);
  const isAdmin = user && (user.role === 'central_admin' || user.role === 'domain_admin');

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized: Only the student who raised this request or an administrator can delete it.' 
    });
  }

  const success = deleteTicketFromDB(id);
  if (!success) {
    return res.status(500).json({ success: false, message: 'Failed to delete ticket from database.' });
  }

  res.json({ success: true, message: `Ticket #${id} deleted successfully.`, ticketId: id });
}
