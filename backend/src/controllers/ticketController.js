import { TICKETS, USERS } from '../models/ticketModel.js';
import { calculatePriorityScore } from '../services/priorityService.js';
import { findDuplicateTickets } from '../services/aiDuplicateService.js';
import { filterTicketsByScope } from '../middleware/scopeAuthMiddleware.js';

let tickets = [...TICKETS];

// Get tickets with scope privacy applied
export function getTickets(req, res) {
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = USERS.find(u => u.id === userId) || USERS[0];

  const visibleTickets = filterTicketsByScope(tickets, user);
  res.json({ success: true, user, count: visibleTickets.length, tickets: visibleTickets });
}

// Check duplicates via AI keyword similarity
export function checkDuplicates(req, res) {
  const { title, description, category } = req.body;
  const duplicates = findDuplicateTickets(tickets, { title, description, category });
  res.json({ success: true, count: duplicates.length, duplicates });
}

// Create new ticket via Decision Tree
export function createTicket(req, res) {
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = USERS.find(u => u.id === userId) || USERS[0];
  const data = req.body;

  const newTicket = {
    id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
    title: data.title,
    description: data.description,
    scope: data.scope,
    classSection: data.scope === 'class' ? user.classSection : null,
    department: user.department,
    hostel: data.scope === 'room' || data.scope === 'hostel_generic' ? user.hostel : null,
    room: data.scope === 'room' ? user.room : null,
    location: data.location || 'Campus Academic Area',
    category: data.category,
    domain: data.domain || 'electrical_av',
    raisedBy: {
      id: user.id,
      name: user.name,
      rollNo: user.rollNo || 'FACULTY',
      avatar: user.avatar
    },
    createdAt: new Date().toISOString(),
    status: 'reported',
    priorityScore: data.urgency === 'emergency' ? 95 : 65,
    upvotes: [user.id],
    downvotes: [],
    advisorNotified: data.scope === 'class',
    advisorEndorsed: false,
    assignedTo: 'Pending Assignment',
    eta: 'Awaiting triage',
    adminNote: '',
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    comments: []
  };

  newTicket.priorityScore = calculatePriorityScore(newTicket);
  tickets.unshift(newTicket);

  res.status(201).json({ success: true, ticket: newTicket });
}

// Swipe Vote (Upvote / Downvote)
export function voteTicket(req, res) {
  const { id } = req.params;
  const { voteType } = req.body; // 'up' | 'down'
  const userId = req.headers['x-user-id'] || 'user_arjun';

  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  let upvotes = [...ticket.upvotes];
  let downvotes = [...ticket.downvotes];

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
  ticket.priorityScore = calculatePriorityScore(ticket);

  res.json({ success: true, ticket });
}

// Domain Admin Updates (Status, ETA, Technician, Note)
export function updateTicketAdmin(req, res) {
  const { id } = req.params;
  const { status, eta, adminNote, assignedTo } = req.body;

  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  if (status) ticket.status = status;
  if (eta !== undefined) ticket.eta = eta;
  if (adminNote !== undefined) ticket.adminNote = adminNote;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

  res.json({ success: true, ticket });
}

// Two-Way Student Verification Closure Loop
export function verifyResolution(req, res) {
  const { id } = req.params;
  const { isApproved, feedback } = req.body;

  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  if (isApproved) {
    ticket.status = 'resolved';
    ticket.adminNote += `\n[Verified & Closed by Reporter: "${feedback || 'Confirmed on-site'}"]`;
  } else {
    ticket.status = 'in_progress';
    ticket.priorityScore = Math.min(ticket.priorityScore + 15, 100);
    ticket.adminNote += `\n[REOPENED by Reporter: "${feedback || 'Still broken'}" - Escalated]`;
  }

  res.json({ success: true, ticket });
}

// Faculty Advisor Endorsement
export function endorseTicket(req, res) {
  const { id } = req.params;
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  ticket.advisorEndorsed = true;
  ticket.priorityScore = calculatePriorityScore(ticket);
  res.json({ success: true, ticket });
}

// Add Comment
export function addComment(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = USERS.find(u => u.id === userId) || USERS[0];

  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  const comment = {
    id: `c_${Date.now()}`,
    userName: user.name,
    userRole: user.role,
    avatar: user.avatar,
    text,
    timestamp: 'Just now',
    isOfficial: user.role !== 'student'
  };

  ticket.comments.push(comment);
  res.status(201).json({ success: true, comment });
}
