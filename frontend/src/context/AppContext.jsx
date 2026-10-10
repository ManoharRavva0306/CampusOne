import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS, INITIAL_TICKETS, CATEGORIES } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const LOCAL_STORAGE_KEY = 'campusone_tickets_v1';
const CURRENT_USER_KEY = 'campusone_user_id';

const sanitizeTicket = (t) => ({
  ...t,
  raisedBy: t?.raisedBy && typeof t.raisedBy === 'object' ? t.raisedBy : { id: 'unknown', name: 'Anonymous', rollNo: 'N/A', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  upvotes: Array.isArray(t?.upvotes) ? t.upvotes : [],
  downvotes: Array.isArray(t?.downvotes) ? t.downvotes : [],
  comments: Array.isArray(t?.comments) ? t.comments : []
});

export function AppProvider({ children }) {
  // Load saved tickets or fallback
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeTicket);
        }
      }
      return INITIAL_TICKETS.map(sanitizeTicket);
    } catch (e) {
      return INITIAL_TICKETS.map(sanitizeTicket);
    }
  });

  // Current logged in user (Default: Arjun K. - Student CSE-B)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedId = localStorage.getItem(CURRENT_USER_KEY);
      const found = USERS.find(u => u.id === savedId);
      return found || USERS[0];
    } catch (e) {
      return USERS[0];
    }
  });

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'raise' | 'admin' | 'advisor' | 'analytics'
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'class' | 'room' | 'department' | 'campus'
  const [feedMode, setFeedMode] = useState('swipe'); // 'swipe' | 'grid'
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState(null);
  const [notification, setNotification] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(CURRENT_USER_KEY, currentUser.id);
  }, [currentUser]);

  // Toast notification helper
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Switch user role helper
  const switchUser = (user) => {
    setCurrentUser(user);
    showNotification(`Switched role to: ${user.name} (${user.description})`, 'success');
    
    // Auto switch tab to appropriate view if relevant
    if (user.role === 'domain_admin') {
      setActiveTab('admin');
    } else if (user.role === 'faculty_advisor') {
      setActiveTab('advisor');
    }
  };

  // Dynamic priority calculation
  const recalculatePriority = (ticket) => {
    let base = 50;
    if (ticket.category === 'safety') base = 85;
    if (ticket.scope === 'campus') base += 10;
    if (ticket.scope === 'department') base += 5;
    
    const upScore = (ticket.upvotes?.length || 0) * 3;
    const downScore = (ticket.downvotes?.length || 0) * 2;
    const advisorBonus = ticket.advisorEndorsed ? 20 : 0;
    
    let total = base + upScore - downScore + advisorBonus;
    return Math.min(Math.max(total, 10), 100);
  };

  // Upvote / Downvote (Swipe Right / Left)
  const voteTicket = (ticketId, voteType) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id !== ticketId) return ticket;

      let upvotes = [...(ticket.upvotes || [])];
      let downvotes = [...(ticket.downvotes || [])];
      const userId = currentUser.id;

      if (voteType === 'up') {
        if (upvotes.includes(userId)) {
          // unvote
          upvotes = upvotes.filter(id => id !== userId);
        } else {
          upvotes.push(userId);
          downvotes = downvotes.filter(id => id !== userId);
        }
      } else if (voteType === 'down') {
        if (downvotes.includes(userId)) {
          // un-downvote
          downvotes = downvotes.filter(id => id !== userId);
        } else {
          downvotes.push(userId);
          upvotes = upvotes.filter(id => id !== userId);
        }
      }

      const updated = {
        ...ticket,
        upvotes,
        downvotes
      };
      updated.priorityScore = recalculatePriority(updated);
      return updated;
    }));

    if (voteType === 'up') {
      showNotification('Voted Support! Priority score boosted.', 'success');
    } else {
      showNotification('Voted Oppose / Low priority.', 'info');
    }
  };

  // Raise new problem ticket
  const raiseTicket = (ticketData) => {
    const newId = `TICK-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket = {
      id: newId,
      ...ticketData,
      raisedBy: {
        id: currentUser.id,
        name: currentUser.name,
        rollNo: currentUser.rollNo || 'FACULTY',
        avatar: currentUser.avatar
      },
      createdAt: new Date().toISOString(),
      status: 'reported',
      priorityScore: ticketData.priorityScore || 65,
      upvotes: [currentUser.id],
      downvotes: [],
      advisorNotified: ticketData.scope === 'class',
      advisorEndorsed: false,
      assignedTo: 'Pending Assignment',
      eta: 'Awaiting triage',
      adminNote: '',
      comments: []
    };

    setTickets(prev => [newTicket, ...prev]);
    showNotification(`Problem ticket #${newId} logged successfully!`, 'success');
    return newTicket;
  };

  // Boost existing ticket from AI duplicate detection
  const boostExistingTicket = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const upvotes = t.upvotes.includes(currentUser.id) ? t.upvotes : [...t.upvotes, currentUser.id];
        const updated = { ...t, upvotes };
        updated.priorityScore = recalculatePriority(updated);
        return updated;
      }
      return t;
    }));
    showNotification(`Existing ticket ${ticketId} boosted with your vote and subscribed!`, 'success');
  };

  // Add discussion comment
  const addComment = (ticketId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      userName: currentUser.name,
      userRole: currentUser.role === 'faculty_advisor' ? 'Class Advisor' : (currentUser.role === 'domain_admin' ? 'Domain Admin' : 'Student'),
      avatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      isOfficial: currentUser.role !== 'student'
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          comments: [...(t.comments || []), newComment]
        };
      }
      return t;
    }));
    showNotification('Comment added to discussion', 'info');
  };

  // Domain admin updates ticket status & ETA
  const updateTicketAdmin = (ticketId, { status, eta, adminNote, assignedTo }) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: status || t.status,
          eta: eta !== undefined ? eta : t.eta,
          adminNote: adminNote !== undefined ? adminNote : t.adminNote,
          assignedTo: assignedTo !== undefined ? assignedTo : t.assignedTo
        };
      }
      return t;
    }));
    showNotification(`Ticket ${ticketId} updated by domain administrator!`, 'success');
  };

  // Student verification loop (Key hackathon feature!)
  const verifyResolution = (ticketId, isApproved, feedback = '') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        if (isApproved) {
          // Trigger celebratory confetti
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // fallback
          }
          return {
            ...t,
            status: 'resolved',
            adminNote: t.adminNote + `\n[Verified & Closed by Reporter: "${feedback || 'Confirmed solved on-site'}"]`
          };
        } else {
          // Reporter claims issue not fixed yet
          return {
            ...t,
            status: 'in_progress',
            priorityScore: Math.min(t.priorityScore + 15, 100), // Escalates priority!
            adminNote: t.adminNote + `\n[REOPENED by Reporter: "${feedback || 'Still not functioning'}" - Escalated!]`
          };
        }
      }
      return t;
    }));

    if (isApproved) {
      showNotification('Thank you! Issue officially verified and marked Resolved 🎉', 'success');
    } else {
      showNotification('Issue reopened and escalated back to domain maintenance team!', 'info');
    }
  };

  // Faculty Advisor Endorsement
  const endorseTicket = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = {
          ...t,
          advisorEndorsed: true,
          comments: [
            ...(t.comments || []),
            {
              id: `c_endorse_${Date.now()}`,
              userName: currentUser.name,
              userRole: 'Class Advisor',
              avatar: currentUser.avatar,
              text: 'Official Faculty Endorsement: Escalated for expedited resolution.',
              timestamp: 'Just now',
              isOfficial: true
            }
          ]
        };
        updated.priorityScore = recalculatePriority(updated);
        return updated;
      }
      return t;
    }));
    showNotification('Faculty Advisor endorsement added (+20 Priority Score)!', 'success');
  };

  // Reset demo state
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setTickets(INITIAL_TICKETS);
    showNotification('Reset all demo tickets to default state', 'info');
  };

  // Scope-based visibility check for current user
  const isTicketVisibleToUser = (ticket, user = currentUser) => {
    // Admins see all tickets relevant to their scope or whole campus
    if (user.role === 'central_admin') return true;
    if (user.role === 'domain_admin') {
      return ticket.domain === user.domain || user.domain === 'all';
    }
    if (user.role === 'faculty_advisor') {
      // Advisors see their class, their dept, and campus wide
      if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
      if (ticket.scope === 'department' && ticket.department === user.department) return true;
      if (ticket.scope === 'campus') return true;
      return false;
    }

    // Student scope visibility rules
    if (ticket.scope === 'campus') return true;
    if (ticket.scope === 'department' && ticket.department === user.department) return true;
    if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
    if (ticket.scope === 'room' && ticket.hostel === user.hostel && ticket.room === user.room) return true;
    if (ticket.scope === 'hostel_generic') return true; // Visible to hostel residents

    // Otherwise hidden from unrelated classes
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        tickets,
        currentUser,
        switchUser,
        activeTab,
        setActiveTab,
        feedFilter,
        setFeedFilter,
        feedMode,
        setFeedMode,
        voteTicket,
        raiseTicket,
        boostExistingTicket,
        addComment,
        updateTicketAdmin,
        verifyResolution,
        endorseTicket,
        resetDemoData,
        isTicketVisibleToUser,
        selectedTicketForDetail,
        setSelectedTicketForDetail,
        notification,
        showNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
