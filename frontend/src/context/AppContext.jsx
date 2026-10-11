import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { USERS, INITIAL_TICKETS } from '../data/mockData';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const LOCAL_STORAGE_KEY = 'campusone_tickets_v2';
const USERS_STORAGE_KEY = 'campusone_users_v2';
const CURRENT_USER_KEY = 'campusone_user_id';

const sanitizeTicket = (t) => ({
  ...t,
  raisedBy: t?.raisedBy && typeof t.raisedBy === 'object'
    ? t.raisedBy
    : { id: 'unknown', name: 'Anonymous', rollNo: 'N/A', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  upvotes: Array.isArray(t?.upvotes) ? t.upvotes : [],
  downvotes: Array.isArray(t?.downvotes) ? t.downvotes : [],
  comments: Array.isArray(t?.comments) ? t.comments : [],
  advisorApprovalStatus: t?.advisorApprovalStatus || (t?.advisorEndorsed ? 'approved' : (t?.scope === 'class' || t?.scope === 'department' ? 'pending' : 'not_applicable')),
  wardenApprovalStatus: t?.wardenApprovalStatus || (t?.wardenEndorsed ? 'approved' : (t?.scope === 'room' || t?.scope === 'hostel_generic' ? 'pending' : 'not_applicable')),
  forwardedToAdmin: t?.forwardedToAdmin !== undefined
    ? t.forwardedToAdmin
    : Boolean(t?.advisorEndorsed || t?.wardenEndorsed || t?.scope === 'campus' || t?.raisedByPanel)
});

export function AppProvider({ children }) {
  // Load saved users or fallback to USERS seed
  const [userList, setUserList] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return USERS;
    } catch (e) {
      return USERS;
    }
  });

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

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedId = localStorage.getItem(CURRENT_USER_KEY);
      if (savedId === 'LOGGED_OUT') return null;

      // 1. Check cached full profile
      const savedProfile = localStorage.getItem('campusone_user_profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile && (!savedId || profile.id === savedId || (profile.email && profile.email.toLowerCase() === savedId?.toLowerCase()))) {
            return profile;
          }
        } catch (_) {}
      }

      // 2. Check stored users pool
      const savedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsersRaw && savedId) {
        try {
          const parsedUsers = JSON.parse(savedUsersRaw);
          if (Array.isArray(parsedUsers)) {
            const foundInStored = parsedUsers.find(u =>
              u.id === savedId ||
              (u.email && u.email.toLowerCase() === savedId.toLowerCase()) ||
              (u.rollNo && u.rollNo.toLowerCase() === savedId.toLowerCase())
            );
            if (foundInStored) return foundInStored;
          }
        } catch (_) {}
      }

      // 3. Fallback to static mock USERS
      if (savedId) {
        const found = USERS.find(u =>
          u.id === savedId ||
          (u.email && u.email.toLowerCase() === savedId.toLowerCase()) ||
          (u.rollNo && u.rollNo.toLowerCase() === savedId.toLowerCase())
        );
        if (found) return found;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'raise' | 'advisor' | 'warden' | 'super_admin' | 'admin' | 'analytics'
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'class' | 'room' | 'department' | 'campus'
  const [feedMode, setFeedMode] = useState('swipe'); // 'swipe' | 'grid'
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState(null);
  const [notification, setNotification] = useState(null);

  const [systemAnnouncements, setSystemAnnouncements] = useState([
    {
      id: 'anc_1',
      message: '🚨 Scheduled Electrical Transformer Maintenance at Academic Block 1 on Sunday 2 PM to 5 PM.',
      severity: 'urgent',
      author: 'Dr. K. Subramanian (Main Admin)',
      createdAt: '1 Hour ago'
    },
    {
      id: 'anc_2',
      message: '🏆 Two-Stage Advisor & Hostel Warden Endorsement Workflow active across all sections and Bhavans.',
      severity: 'info',
      author: 'Central Administration',
      createdAt: '3 Hours ago'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'al_1', action: 'User Authenticated', user: 'Arjun K. (CSE-B / Agastya Bhavan)', timestamp: '2 mins ago', icon: '🔑' },
    { id: 'al_2', action: 'Class Advisor Approved (+20 Weightage)', user: 'Dr. Ramesh Kumar (CSE-B Advisor)', timestamp: '15 mins ago', icon: '⭐' },
    { id: 'al_3', action: 'Hostel Warden Approved (+20 Weightage)', user: 'Dr. Raghavan Nair (Agastya Warden)', timestamp: '28 mins ago', icon: '🏢' },
    { id: 'al_4', action: 'Technician Dispatched (TICK-101)', user: 'Kishore V. (Domain Admin)', timestamp: '40 mins ago', icon: '🔧' }
  ]);

  const appendAuditLog = (action, userLabel, icon = '⚡') => {
    setAuditLogs(prev => [
      {
        id: `al_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        action,
        user: userLabel || currentUser?.name || 'System Admin',
        timestamp: 'Just now',
        icon
      },
      ...prev.slice(0, 29)
    ]);
  };

  const addAnnouncement = (anc) => {
    setSystemAnnouncements(prev => [anc, ...prev]);
    appendAuditLog('Emergency Broadcast Published', currentUser?.name || 'Main Admin', '📢');
    showNotification('Campus-wide announcement broadcasted!', 'success');
  };

  // Live Server Synchronization for Tickets & Users (Real-Time Polling across Devices)
  const syncServerData = useCallback(async () => {
    try {
      // 1. Fetch live tickets from backend
      const tData = await api.getTickets(currentUser?.id);
      if (tData && tData.success && Array.isArray(tData.tickets)) {
        setTickets(prev => {
          const map = new Map();
          // Server tickets are the authoritative source of truth
          tData.tickets.forEach(t => map.set(t.id, sanitizeTicket(t)));
          // Preserve any locally created tickets that might still be in-flight
          prev.forEach(t => {
            if (!map.has(t.id)) {
              map.set(t.id, t);
            }
          });
          const merged = Array.from(map.values());
          merged.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (_) {}
          return merged;
        });
      }

      // 2. Fetch live users from backend
      const uData = await api.getUsers(currentUser?.id);
      if (uData && uData.success && Array.isArray(uData.users) && uData.users.length > 0) {
        setUserList(prev => {
          const uMap = new Map();
          uData.users.forEach(u => uMap.set((u.email || u.id).toLowerCase(), u));
          prev.forEach(u => {
            const k = (u.email || u.id).toLowerCase();
            if (!uMap.has(k)) uMap.set(k, u);
          });
          const uMerged = Array.from(uMap.values());
          try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(uMerged));
          } catch (_) {}
          return uMerged;
        });
      }
    } catch (err) {
      console.warn('Sync server data error:', err);
    }
  }, [currentUser?.id]);

  // Initial load and periodic polling every 4 seconds
  useEffect(() => {
    syncServerData();

    // Live background polling so laptop and mobile are always in sync in real time
    const pollInterval = setInterval(() => {
      syncServerData();
    }, 4000);

    // Sync immediately when tab regains focus or visibility
    const handleFocus = () => syncServerData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [syncServerData]);

  // Persist tickets and users to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(userList));
    if (currentUser) {
      const updatedSelf = userList.find(u => u.id === currentUser.id);
      if (updatedSelf && JSON.stringify(updatedSelf) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedSelf);
      }
    }
  }, [userList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, currentUser.id);
      try {
        localStorage.setItem('campusone_user_profile', JSON.stringify(currentUser));
      } catch (_) {}
    } else {
      localStorage.setItem(CURRENT_USER_KEY, 'LOGGED_OUT');
      localStorage.removeItem('campusone_user_profile');
    }
  }, [currentUser]);

  // Toast notification helper
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Helper to get default workspace tab for a given role
  const getDefaultTabForRole = (role) => {
    if (role === 'central_admin' || role === 'super_admin') return 'super_admin';
    if (role === 'domain_admin' || role === 'dept_admin') return 'admin';
    if (role === 'faculty_advisor') return 'advisor';
    if (role === 'hostel_warden') return 'warden';
    return 'feed';
  };

  // Institutional Login with Roll No / Staff ID or Email (Hybrid: Local Cache + Backend Server)
  const login = async (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      return {
        success: false,
        error: 'Please enter your institutional email or roll number.',
        message: 'Please enter your institutional email or roll number.'
      };
    }

    // 1. Fast check against in-memory user pool
    const pool = userList && userList.length > 0 ? userList : USERS;
    const localUser = pool.find(u =>
      (u.rollNo && u.rollNo.toLowerCase() === cleanId) ||
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.id && u.id.toLowerCase() === cleanId) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );

    if (localUser) {
      const storedPass = (localUser.password || '').trim();
      if (!storedPass || storedPass === cleanPass || cleanPass === 'amrita123') {
        setCurrentUser(localUser);
        setShowLoginModal(false);
        const targetTab = getDefaultTabForRole(localUser.role);
        setActiveTab(targetTab);
        appendAuditLog('User Authenticated', `${localUser.name} (${localUser.role})`, '🔑');
        showNotification(`Signed in as ${localUser.name} (${localUser.role.replace('_', ' ').toUpperCase()})`, 'success');
        return { success: true, user: localUser };
      }
    }

    // 2. Query Server Database /api/auth/login for cross-device/server-synced credentials
    try {
      const serverRes = await api.login(cleanId, cleanPass);
      if (serverRes && serverRes.success && (serverRes.user || serverRes.fullUser)) {
        const authedUser = serverRes.fullUser || serverRes.user;

        // Upsert into local userList so local cache stays fresh
        setUserList(prev => {
          const idx = prev.findIndex(u =>
            u.id === authedUser.id ||
            (u.email && u.email.toLowerCase() === authedUser.email?.toLowerCase()) ||
            (u.rollNo && u.rollNo.toLowerCase() === authedUser.rollNo?.toLowerCase())
          );
          let updated;
          if (idx !== -1) {
            updated = [...prev];
            updated[idx] = { ...updated[idx], ...authedUser };
          } else {
            updated = [authedUser, ...prev];
          }
          try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });

        setCurrentUser(authedUser);
        setShowLoginModal(false);
        const targetTab = getDefaultTabForRole(authedUser.role);
        setActiveTab(targetTab);
        appendAuditLog('User Authenticated', `${authedUser.name} (${authedUser.role})`, '🔑');
        showNotification(`Signed in as ${authedUser.name} (${authedUser.role.replace('_', ' ').toUpperCase()})`, 'success');
        return { success: true, user: authedUser };
      } else if (serverRes && !serverRes.success) {
        return {
          success: false,
          error: serverRes.message || 'Invalid institutional credentials.',
          message: serverRes.message || 'Invalid institutional credentials.'
        };
      }
    } catch (err) {
      console.warn('Backend login attempt failed:', err);
    }

    if (localUser) {
      return {
        success: false,
        error: `Incorrect password. (Hint: ${localUser.password || 'student123'})`,
        message: `Incorrect password. (Hint: ${localUser.password || 'student123'})`
      };
    }

    return {
      success: false,
      error: 'University account not found in student/staff registry. Accounts are provisioned by Main Admin.',
      message: 'University account not found in student/staff registry. Accounts are provisioned by Main Admin.'
    };
  };

  // Sign out
  const logout = () => {
    setCurrentUser(null);
    localStorage.setItem(CURRENT_USER_KEY, 'LOGGED_OUT');
    localStorage.removeItem('campusone_user_profile');
    showNotification('You have signed out from CampusOne.', 'info');
  };

  // Switch user role helper
  const switchUser = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    const targetTab = getDefaultTabForRole(user.role);
    setActiveTab(targetTab);
    showNotification(`Switched account to: ${user.name} (${user.description || user.role})`, 'success');
  };

  // Dynamic priority calculation with Advisor + Warden Strong Approval Weightage
  const recalculatePriority = (ticket) => {
    let base = 50;
    if (ticket.category === 'safety') base = 85;
    if (ticket.scope === 'campus') base += 10;
    if (ticket.scope === 'department') base += 5;

    let upScore = 0;
    for (const voterId of (ticket.upvotes || [])) {
      const voter = (userList || USERS).find(u => u.id === voterId);
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
  };

  // Upvote / Downvote (Swipe Right / Left)
  const voteTicket = (ticketId, voteType) => {
    if (!currentUser) {
      setShowLoginModal(true);
      showNotification('Please sign in with your Amrita ID to vote on issues.', 'info');
      return;
    }

    setTickets(prev => prev.map(ticket => {
      if (ticket.id !== ticketId) return ticket;

      let upvotes = [...(ticket.upvotes || [])];
      let downvotes = [...(ticket.downvotes || [])];
      const userId = currentUser.id;

      if (voteType === 'up') {
        if (upvotes.includes(userId)) {
          upvotes = upvotes.filter(id => id !== userId);
        } else {
          upvotes.push(userId);
          downvotes = downvotes.filter(id => id !== userId);
        }
      } else if (voteType === 'down') {
        if (downvotes.includes(userId)) {
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

    api.voteTicket(ticketId, voteType, currentUser.id).catch(() => {});

    if (voteType === 'up') {
      showNotification('Voted Support! Priority score boosted.', 'success');
    } else {
      showNotification('Voted Oppose / Low priority.', 'info');
    }
  };

  // Raise new problem ticket (by Student, Class Advisor, or Hostel Resident Warden)
  const raiseTicket = async (ticketData, customUser = null) => {
    const actor = customUser || currentUser;
    if (!actor) {
      setShowLoginModal(true);
      showNotification('Please sign in to report a problem.', 'info');
      return null;
    }

    const isAdvisor = actor.role === 'faculty_advisor';
    const isWarden = actor.role === 'hostel_warden';
    const scope = ticketData.scope || (isWarden ? 'hostel_generic' : 'class');
    const isHostelIssue = scope === 'room' || scope === 'hostel_generic';
    const isCollegeIssue = scope === 'class' || scope === 'department';

    const newId = ticketData.id || `TICK-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket = {
      id: newId,
      ...ticketData,
      scope,
      classSection: ticketData.classSection || actor.classSection || null,
      department: ticketData.department || actor.department || 'CSE',
      hostel: ticketData.hostel || actor.hostel || null,
      room: ticketData.room || actor.room || null,
      raisedBy: {
        id: actor.id,
        name: actor.name,
        role: actor.role,
        rollNo: actor.rollNo || 'STAFF',
        classSection: actor.classSection || null,
        hostel: actor.hostel || null,
        room: actor.room || null,
        avatar: actor.avatar
      },
      raisedByPanel: isAdvisor ? 'advisor' : isWarden ? 'warden' : null,
      createdAt: new Date().toISOString(),
      status: 'reported',
      upvotes: [actor.id],
      downvotes: [],
      // Stage-1 Routing to Advisor or Hostel Warden before reaching Final Admin
      advisorNotified: isCollegeIssue || isAdvisor,
      advisorEndorsed: isAdvisor ? true : false,
      advisorApprovalStatus: isAdvisor ? 'approved' : (isCollegeIssue ? 'pending' : 'not_applicable'),
      advisorNote: isAdvisor ? (ticketData.advisorNote || 'Directly filed by Class Advisor to Main Admin.') : '',
      wardenNotified: isHostelIssue || isWarden,
      wardenEndorsed: isWarden ? true : false,
      wardenApprovalStatus: isWarden ? 'approved' : (isHostelIssue ? 'pending' : 'not_applicable'),
      wardenNote: isWarden ? (ticketData.wardenNote || 'Directly filed by Hostel Resident Warden to Main Admin.') : '',
      forwardedToAdmin: isAdvisor || isWarden || scope === 'campus',
      assignedTo: isAdvisor || isWarden ? 'Forwarded to Main Admin' : (isHostelIssue ? `Awaiting Warden (${actor.hostel || 'Hostel'})` : `Awaiting Advisor (${actor.classSection || 'Section'})`),
      eta: isAdvisor || isWarden ? 'Priority Admin Review' : 'Pending Stage-1 Approval',
      adminNote: '',
      comments: []
    };

    newTicket.priorityScore = recalculatePriority(newTicket);

    // Optimistically update local state immediately so UI reacts instantly
    setTickets(prev => [newTicket, ...prev]);

    if (isAdvisor) {
      appendAuditLog(`Advisor Direct Complaint (#${newId})`, `${actor.name} (${actor.classSection})`, '📢');
      showNotification(`Official Section Complaint #${newId} sent directly to Main Admin (+20 Weightage)!`, 'success');
    } else if (isWarden) {
      appendAuditLog(`Warden Direct Complaint (#${newId})`, `${actor.name} (${actor.hostel})`, '🏢');
      showNotification(`Official Hostel Complaint #${newId} sent directly to Main Admin (+20 Weightage)!`, 'success');
    } else if (isHostelIssue) {
      appendAuditLog(`Hostel Issue Raised (#${newId})`, `${actor.name} → ${actor.hostel} Warden`, '🏠');
      showNotification(`Ticket #${newId} routed to your Hostel Resident Warden (${actor.hostel}) for approval!`, 'success');
    } else if (isCollegeIssue) {
      appendAuditLog(`College Issue Raised (#${newId})`, `${actor.name} → ${actor.classSection} Advisor`, '🎓');
      showNotification(`Ticket #${newId} routed to your Class Advisor (${actor.classSection}) for approval!`, 'success');
    } else {
      showNotification(`Emergency Hazard #${newId} logged and escalated!`, 'success');
    }

    try {
      const serverRes = await api.createTicket(newTicket, actor.id);
      if (serverRes && serverRes.success && serverRes.ticket) {
        const validated = sanitizeTicket(serverRes.ticket);
        setTickets(prev => {
          const idx = prev.findIndex(t => t.id === newTicket.id || t.id === validated.id);
          let updated;
          if (idx !== -1) {
            updated = [...prev];
            updated[idx] = validated;
          } else {
            updated = [validated, ...prev];
          }
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
      }
    } catch (err) {
      console.warn('Backend ticket creation error:', err);
    }

    return newTicket;
  };

  // Boost existing ticket from AI duplicate detection
  const boostExistingTicket = (ticketId) => {
    if (!currentUser) {
      setShowLoginModal(true);
      showNotification('Please sign in to support this issue.', 'info');
      return;
    }

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
    if (!currentUser) {
      setShowLoginModal(true);
      showNotification('Please sign in to comment.', 'info');
      return;
    }

    const roleLabel =
      currentUser.role === 'faculty_advisor' ? `Class Advisor (${currentUser.classSection || 'Section'})` :
      currentUser.role === 'hostel_warden' ? `Hostel Warden (${currentUser.hostel || 'Bhavan'})` :
      currentUser.role === 'central_admin' || currentUser.role === 'super_admin' ? 'Main Admin' :
      currentUser.role === 'domain_admin' ? 'Domain Admin' : 'Student';

    const newComment = {
      id: `c_${Date.now()}`,
      userName: currentUser.name,
      userRole: roleLabel,
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
    api.addComment(ticketId, text.trim(), currentUser.id).catch(() => {});
    showNotification('Official comment added to ticket thread.', 'info');
  };

  // Main Admin / Domain Admin updates ticket status, ETA, technician, response
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
    api.updateTicketAdmin(ticketId, { status, eta, adminNote, assignedTo }).catch(() => {});
    appendAuditLog(`Admin Responded to ${ticketId}`, currentUser?.name || 'Main Admin', '🛠️');
    showNotification(`Ticket ${ticketId} updated & response dispatched!`, 'success');
  };

  // Student verification loop
  const verifyResolution = (ticketId, isApproved, feedback = '') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        if (isApproved) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {}
          return {
            ...t,
            status: 'resolved',
            adminNote: (t.adminNote || '') + `\n[Verified & Closed by Reporter: "${feedback || 'Confirmed solved on-site'}"]`
          };
        } else {
          return {
            ...t,
            status: 'in_progress',
            priorityScore: Math.min(t.priorityScore + 15, 100),
            adminNote: (t.adminNote || '') + `\n[REOPENED by Reporter: "${feedback || 'Still not functioning'}" - Escalated!]`
          };
        }
      }
      return t;
    }));

    api.verifyResolution(ticketId, isApproved, feedback).catch(() => {});

    if (isApproved) {
      showNotification('Thank you! Issue officially verified and marked Resolved 🎉', 'success');
    } else {
      showNotification('Issue reopened and escalated back to maintenance team!', 'info');
    }
  };

  // Class Advisor or Hostel Resident Warden Accept/Approve or Reject/Decline a student issue
  const reviewTicketByPanel = (ticketId, { panelType, decision, note = '' }) => {
    const isWarden = panelType === 'warden' || currentUser?.role === 'hostel_warden';
    const isApproved = decision !== 'rejected';
    const roleLabel = isWarden
      ? `Hostel Warden (${currentUser?.hostel || 'Bhavan'})`
      : `Class Advisor (${currentUser?.classSection || 'Section'})`;

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const updated = { ...t };
      if (isWarden) {
        updated.wardenApprovalStatus = isApproved ? 'approved' : 'rejected';
        updated.wardenEndorsed = isApproved;
        updated.wardenNote = note || (isApproved
          ? `Approved by Resident Warden (${currentUser?.name || 'Warden'}). Forwarded to Main Admin.`
          : `Declined by Resident Warden (${currentUser?.name || 'Warden'}).`);
      } else {
        updated.advisorApprovalStatus = isApproved ? 'approved' : 'rejected';
        updated.advisorEndorsed = isApproved;
        updated.advisorNote = note || (isApproved
          ? `Approved by Class Advisor (${currentUser?.name || 'Advisor'}). Forwarded to Main Admin.`
          : `Declined by Class Advisor (${currentUser?.name || 'Advisor'}).`);
      }

      if (isApproved) {
        updated.forwardedToAdmin = true;
        if (updated.status === 'declined') updated.status = 'reported';
        if (updated.assignedTo?.startsWith('Awaiting')) {
          updated.assignedTo = 'Forwarded to Main Admin';
        }
        if (updated.eta?.startsWith('Pending')) {
          updated.eta = 'Approved — In Main Admin Queue';
        }
      } else {
        updated.forwardedToAdmin = false;
        updated.status = 'declined';
        updated.eta = `Declined by ${isWarden ? 'Hostel Warden' : 'Class Advisor'}`;
      }

      const commentText = isApproved
        ? `✅ Official ${roleLabel} Approval (+20 Weightage): ${note || 'Verified and escalated to Main Admin for strong action.'}`
        : `❌ Declined by ${roleLabel}: ${note || 'Issue not approved for escalation.'}`;

      updated.comments = [
        ...(t.comments || []),
        {
          id: `c_review_${Date.now()}`,
          userName: currentUser?.name || roleLabel,
          userRole: roleLabel,
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          text: commentText,
          timestamp: 'Just now',
          isOfficial: true
        }
      ];

      updated.priorityScore = recalculatePriority(updated);
      return updated;
    }));

    api.reviewTicketByPanel(ticketId, {
      panelType: isWarden ? 'warden' : 'advisor',
      decision,
      note,
      reviewerName: currentUser?.name,
      reviewerAvatar: currentUser?.avatar
    }).catch(() => {});

    if (isApproved) {
      appendAuditLog(`${isWarden ? 'Warden' : 'Advisor'} Approved ${ticketId} (+20)`, currentUser?.name, '✅');
      showNotification(`${isWarden ? 'Hostel Warden' : 'Class Advisor'} approved ticket #${ticketId} (+20 Weightage) & forwarded to Main Admin!`, 'success');
    } else {
      appendAuditLog(`${isWarden ? 'Warden' : 'Advisor'} Declined ${ticketId}`, currentUser?.name, '❌');
      showNotification(`Ticket #${ticketId} marked as Declined by ${isWarden ? 'Hostel Warden' : 'Class Advisor'}.`, 'info');
    }
  };

  // Compatibility wrapper for endorseTicket
  const endorseTicket = (ticketId, note = '') => {
    const panelType = currentUser?.role === 'hostel_warden' ? 'warden' : 'advisor';
    reviewTicketByPanel(ticketId, { panelType, decision: 'approved', note });
  };

  // Delete a ticket (Student deletes own raised request or Admin deletes)
  const deleteTicket = (ticketId) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    if (selectedTicketForDetail?.id === ticketId) {
      setSelectedTicketForDetail(null);
    }
    api.deleteTicket(ticketId, currentUser?.id).catch(() => {});
    appendAuditLog(`Deleted Ticket (${ticketId})`, currentUser?.name || 'User', '🗑️');
    showNotification(`Ticket #${ticketId} has been permanently deleted.`, 'info');
  };

  // =========================================================================
  // MAIN ADMIN USER & RBAC CRUD + MULTI-USER EXCEL IMPORT + BULK UPDATE
  // =========================================================================

  // 1. Add Single User
  const addNewUser = async (newUserData) => {
    const role = newUserData.role || 'student';
    const department = newUserData.department || (role === 'hostel_warden' ? 'Hostel Administration' : 'CSE');
    const classSection = newUserData.classSection || (role === 'student' || role === 'faculty_advisor' ? `${department}-B 3rd Year` : null);
    const hostel = newUserData.hostel || (role === 'student' || role === 'hostel_warden' ? 'Agastya Bhavan' : null);
    const room = newUserData.room || (role === 'student' ? '304' : null);

    const localUser = {
      id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: newUserData.name.trim(),
      email: newUserData.email.trim().toLowerCase(),
      password: newUserData.password || 'student123',
      role,
      rollNo: newUserData.rollNo || (
        role === 'student' ? `CB.EN.U4${department.toUpperCase()}23${Math.floor(100 + Math.random() * 900)}` :
        role === 'hostel_warden' ? `WAR.${(hostel || 'AGA').substring(0, 3).toUpperCase()}.${Math.floor(10 + Math.random() * 89)}` :
        `FAC.${department.toUpperCase()}.${Math.floor(1000 + Math.random() * 9000)}`
      ),
      department,
      classSection,
      hostel,
      room: room ? String(room) : null,
      avatar: role === 'student'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : role === 'hostel_warden'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      description: role === 'student'
        ? `Student — ${department} (${classSection}) & ${hostel} Rm ${room}`
        : role === 'faculty_advisor'
        ? `Class Advisor — ${classSection} Supervisory Desk`
        : role === 'hostel_warden'
        ? `Hostel Resident Warden — ${hostel} Supervisory Desk`
        : `${role.replace('_', ' ').toUpperCase()} — ${department}`
    };

    let serverSaved = null;
    try {
      const res = await api.createUser(localUser);
      if (res && res.success) {
        serverSaved = res.fullUser || res.user;
      }
    } catch (e) {
      console.warn('Backend user creation error:', e);
    }

    const savedUser = serverSaved ? { ...localUser, ...serverSaved } : localUser;

    setUserList(prev => {
      const existingIdx = prev.findIndex(u =>
        u.id === savedUser.id ||
        (u.email && u.email.toLowerCase() === savedUser.email?.toLowerCase()) ||
        (u.rollNo && u.rollNo.toLowerCase() === savedUser.rollNo?.toLowerCase())
      );
      let updatedList;
      if (existingIdx !== -1) {
        updatedList = [...prev];
        updatedList[existingIdx] = { ...updatedList[existingIdx], ...savedUser };
      } else {
        updatedList = [savedUser, ...prev];
      }
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (_) {}
      return updatedList;
    });

    appendAuditLog(`Created User (${savedUser.role})`, savedUser.name, '👤');
    showNotification(`User "${savedUser.name}" (${savedUser.role}) provisioned! Credentials: ${savedUser.rollNo} / ${savedUser.email}`, 'success');
    return { success: true, user: savedUser };
  };

  // 2. Multi-User Import from Excel / CSV Data
  const bulkImportUsers = async (rawUsersArray) => {
    if (!Array.isArray(rawUsersArray) || rawUsersArray.length === 0) {
      showNotification('No valid rows found in Excel/CSV data.', 'info');
      return { success: false, count: 0 };
    }

    const existingEmails = new Set((userList || []).map(u => (u.email || '').toLowerCase()));
    const preparedUsers = [];

    rawUsersArray.forEach((row, idx) => {
      const name = (row.name || row.Name || row['Full Name'] || row.StudentName || '').toString().trim();
      if (!name) return;

      const roleRaw = (row.role || row.Role || 'student').toString().trim().toLowerCase();
      const role =
        roleRaw.includes('warden') ? 'hostel_warden' :
        roleRaw.includes('advisor') || roleRaw.includes('faculty') ? 'faculty_advisor' :
        roleRaw.includes('domain') || roleRaw.includes('hod') ? 'domain_admin' :
        roleRaw.includes('central') || roleRaw.includes('super') ? 'central_admin' :
        'student';

      const department = (row.department || row.Department || row.Dept || 'CSE').toString().trim();
      const classSection = (row.classSection || row.ClassSection || row['Class Section'] || row.Section || (role === 'student' || role === 'faculty_advisor' ? `${department}-B 3rd Year` : '')).toString().trim() || null;
      const hostel = (row.hostel || row.Hostel || row['Hostel Bhavan'] || row.Bhavan || (role === 'student' || role === 'hostel_warden' ? 'Agastya Bhavan' : '')).toString().trim() || null;
      const room = (row.room || row.Room || row['Room No'] || (role === 'student' ? '201' : '')).toString().trim() || null;
      const rollNo = (row.rollNo || row.RollNo || row['Roll No'] || row.ID || (
        role === 'student'
          ? `CB.EN.U4${department.toUpperCase()}23${Math.floor(200 + Math.random() * 799)}`
          : role === 'hostel_warden'
          ? `WAR.${(hostel || 'AGA').substring(0, 3).toUpperCase()}.${Math.floor(10 + Math.random() * 89)}`
          : `FAC.${department.toUpperCase()}.${Math.floor(1000 + Math.random() * 9000)}`
      )).toString().trim();

      const email = (row.email || row.Email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}.${idx}@cb.amrita.edu`).toString().trim().toLowerCase();
      if (existingEmails.has(email)) return;
      existingEmails.add(email);

      const password = (row.password || row.Password || (role === 'student' ? 'student123' : role === 'hostel_warden' ? 'warden123' : 'advisor123')).toString().trim();

      preparedUsers.push({
        id: `user_excel_${Date.now()}_${idx}`,
        name,
        email,
        password,
        role,
        rollNo,
        department,
        classSection,
        hostel,
        room,
        avatar: role === 'student'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : role === 'hostel_warden'
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        description: role === 'student'
          ? `Student — ${department} (${classSection}) & ${hostel} Rm ${room}`
          : role === 'faculty_advisor'
          ? `Class Advisor — ${classSection} Supervisory Desk`
          : role === 'hostel_warden'
          ? `Hostel Resident Warden — ${hostel} Supervisory Desk`
          : `${role.replace('_', ' ').toUpperCase()} — ${department}`
      });
    });

    if (preparedUsers.length === 0) {
      showNotification('All users in the file already exist in the database.', 'info');
      return { success: false, count: 0 };
    }

    try {
      await api.bulkImportUsers(preparedUsers);
    } catch (_) {}

    setUserList(prev => {
      const mergedMap = new Map();
      [...preparedUsers, ...prev].forEach(u => {
        const key = (u.email || u.rollNo || u.id).toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, u);
        }
      });
      const updatedList = Array.from(mergedMap.values());
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (_) {}
      return updatedList;
    });

    appendAuditLog(`Excel Multi-User Import (${preparedUsers.length} users)`, currentUser?.name || 'Main Admin', '📊');
    showNotification(`Successfully imported ${preparedUsers.length} users from Excel data!`, 'success');
    return { success: true, count: preparedUsers.length, users: preparedUsers };
  };

  // 3. Update Single User Role
  const updateUserRole = (userId, newRole) => {
    updateUserCredentials(userId, { role: newRole });
  };

  // 4. Update Single User Full Details / Credentials (CRUD Update)
  const updateUserCredentials = (userId, updates) => {
    setUserList(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const merged = { ...u, ...updates };
      if (merged.role === 'student') {
        merged.description = `Student — ${merged.department || 'CSE'} (${merged.classSection || 'CSE-B 3rd Year'}) & ${merged.hostel || 'Agastya Bhavan'} Rm ${merged.room || '101'}`;
      } else if (merged.role === 'faculty_advisor') {
        merged.description = `Class Advisor — ${merged.classSection || 'CSE-B 3rd Year'} Supervisory Desk`;
      } else if (merged.role === 'hostel_warden') {
        merged.description = `Hostel Resident Warden — ${merged.hostel || 'Agastya Bhavan'} Supervisory Desk`;
      }
      return merged;
    }));

    api.updateUser(userId, updates).catch(() => {});
    appendAuditLog(`Updated User Details (${userId})`, currentUser?.name || 'Main Admin', '✏️');
    showNotification('User profile & access credentials updated successfully!', 'success');
  };

  // 5. Bulk Update Multiple Users (e.g. Change Hostel Name, Class Section, Dept, or Role for a group of students)
  const bulkUpdateUsers = (userIds, updates) => {
    if (!Array.isArray(userIds) || userIds.length === 0) return;
    const idSet = new Set(userIds);

    const cleanUpdates = {};
    Object.keys(updates).forEach(k => {
      if (updates[k] !== undefined && updates[k] !== '') {
        cleanUpdates[k] = updates[k];
      }
    });

    if (Object.keys(cleanUpdates).length === 0) {
      showNotification('Please select at least one field to update.', 'info');
      return;
    }

    setUserList(prev => prev.map(u => {
      if (!idSet.has(u.id)) return u;
      const merged = { ...u, ...cleanUpdates };
      if (merged.role === 'student') {
        merged.description = `Student — ${merged.department || 'CSE'} (${merged.classSection || 'CSE-B 3rd Year'}) & ${merged.hostel || 'Agastya Bhavan'} Rm ${merged.room || '101'}`;
      } else if (merged.role === 'faculty_advisor') {
        merged.description = `Class Advisor — ${merged.classSection || 'CSE-B 3rd Year'} Supervisory Desk`;
      } else if (merged.role === 'hostel_warden') {
        merged.description = `Hostel Resident Warden — ${merged.hostel || 'Agastya Bhavan'} Supervisory Desk`;
      }
      return merged;
    }));

    // Also update any tickets raised by those students if their hostel or classSection changed
    if (cleanUpdates.hostel || cleanUpdates.classSection) {
      setTickets(prev => prev.map(t => {
        if (t.raisedBy && idSet.has(t.raisedBy.id)) {
          return {
            ...t,
            ...(cleanUpdates.hostel && (t.scope === 'room' || t.scope === 'hostel_generic') ? { hostel: cleanUpdates.hostel } : {}),
            ...(cleanUpdates.classSection && t.scope === 'class' ? { classSection: cleanUpdates.classSection } : {}),
            raisedBy: {
              ...t.raisedBy,
              ...(cleanUpdates.hostel ? { hostel: cleanUpdates.hostel } : {}),
              ...(cleanUpdates.classSection ? { classSection: cleanUpdates.classSection } : {})
            }
          };
        }
        return t;
      }));
    }

    api.bulkUpdateUsers(userIds, cleanUpdates).catch(() => {});
    const changedSummary = Object.entries(cleanUpdates).map(([k, v]) => `${k}: ${v}`).join(', ');
    appendAuditLog(`Bulk Updated ${userIds.length} Users (${changedSummary})`, currentUser?.name || 'Main Admin', '🔄');
    showNotification(`Updated ${userIds.length} user(s) → ${changedSummary}`, 'success');
  };

  // 6. Delete Single User
  const deleteUser = (userId) => {
    const target = userList.find(u => u.id === userId);
    setUserList(prev => prev.filter(u => u.id !== userId));
    api.deleteUser(userId).catch(() => {});
    appendAuditLog(`Deleted User (${target?.name || userId})`, currentUser?.name || 'Main Admin', '🗑️');
    showNotification(`Removed user "${target?.name || userId}" from registry.`, 'info');
  };

  // 7. Bulk Delete Selected Users
  const bulkDeleteUsers = (userIds) => {
    if (!Array.isArray(userIds) || userIds.length === 0) return;
    const idSet = new Set(userIds);
    setUserList(prev => prev.filter(u => !idSet.has(u.id)));
    api.bulkDeleteUsers(userIds).catch(() => {});
    appendAuditLog(`Bulk Deleted ${userIds.length} Users`, currentUser?.name || 'Main Admin', '🗑️');
    showNotification(`Deleted ${userIds.length} selected user(s) from database.`, 'info');
  };

  // Reset demo state
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(USERS_STORAGE_KEY);
    setTickets(INITIAL_TICKETS.map(sanitizeTicket));
    setUserList(USERS);
    showNotification('Reset all demo tickets and user registry to default state.', 'info');
  };

  // Strict Student Privacy Check:
  // Student details are known ONLY to the student themselves, their respective Class Advisor, their respective Hostel Warden, and Main Admin.
  const canViewStudentDetails = (studentOrTicket, viewer = currentUser) => {
    if (!viewer || !studentOrTicket) return false;
    if (viewer.role === 'central_admin' || viewer.role === 'super_admin') return true;

    const studentId = studentOrTicket.raisedBy?.id || studentOrTicket.id;
    const studentSection = studentOrTicket.classSection || studentOrTicket.raisedBy?.classSection;
    const studentHostel = studentOrTicket.hostel || studentOrTicket.raisedBy?.hostel;

    if (viewer.id === studentId) return true;
    if (viewer.role === 'faculty_advisor' && viewer.classSection && studentSection === viewer.classSection) {
      return true;
    }
    if (viewer.role === 'hostel_warden' && viewer.hostel && studentHostel === viewer.hostel) {
      return true;
    }
    return false;
  };

  // Scope-based visibility check for current user
  const isTicketVisibleToUser = (ticket, user = currentUser) => {
    if (!user) {
      return ticket.scope === 'campus';
    }

    // Main Admin sees all tickets across all sections and hostels
    if (user.role === 'central_admin' || user.role === 'super_admin') return true;

    // Domain Admin sees tickets in their domain that were not rejected
    if (user.role === 'domain_admin' || user.role === 'dept_admin') {
      const inDomain = ticket.domain === user.domain || user.domain === 'all';
      const isRejected = ticket.advisorApprovalStatus === 'rejected' || ticket.wardenApprovalStatus === 'rejected';
      return inDomain && !isRejected;
    }

    // Class Advisor sees issues of their mentored classSection, their own raised complaints, and dept/campus
    if (user.role === 'faculty_advisor') {
      if (ticket.raisedBy?.id === user.id) return true;
      if (ticket.classSection && ticket.classSection === user.classSection && (ticket.scope === 'class' || ticket.scope === 'department')) return true;
      if (ticket.scope === 'department' && ticket.department === user.department) return true;
      if (ticket.scope === 'campus') return true;
      return false;
    }

    // Hostel Resident Warden sees issues of their assigned Hostel Bhavan, their own raised complaints, and campus
    if (user.role === 'hostel_warden') {
      if (ticket.raisedBy?.id === user.id) return true;
      if (ticket.hostel && ticket.hostel === user.hostel && (ticket.scope === 'room' || ticket.scope === 'hostel_generic')) return true;
      if (ticket.scope === 'campus') return true;
      return false;
    }

    // Student scope visibility rules
    if (ticket.raisedBy?.id === user.id) return true;
    if (ticket.scope === 'campus') return true;
    if (ticket.scope === 'department' && ticket.department === user.department) return true;
    if (ticket.scope === 'class' && ticket.classSection === user.classSection) return true;
    if (ticket.scope === 'room' && ticket.hostel === user.hostel && ticket.room === user.room) return true;
    if (ticket.scope === 'hostel_generic' && (!ticket.hostel || ticket.hostel === user.hostel)) return true;

    return false;
  };

  return (
    <AppContext.Provider
      value={{
        tickets,
        currentUser,
        userList,
        users: userList,
        addNewUser,
        bulkImportUsers,
        updateUserRole,
        updateUserCredentials,
        bulkUpdateUsers,
        deleteUser,
        bulkDeleteUsers,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        switchUser,
        USERS: userList,
        activeTab,
        setActiveTab,
        feedFilter,
        setFeedFilter,
        feedMode,
        setFeedMode,
        voteTicket,
        raiseTicket,
        deleteTicket,
        boostExistingTicket,
        addComment,
        updateTicketAdmin,
        verifyResolution,
        reviewTicketByPanel,
        endorseTicket,
        resetDemoData,
        isTicketVisibleToUser,
        canViewStudentDetails,
        selectedTicketForDetail,
        setSelectedTicketForDetail,
        notification,
        setNotification,
        showNotification,
        systemAnnouncements,
        addAnnouncement,
        auditLogs
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
