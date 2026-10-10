const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Fetch tickets with user scope isolation
  async getTickets(userId) {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        headers: { 'x-user-id': userId || 'user_arjun' }
      });
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('API getTickets offline, using fallback:', err.message);
      return null;
    }
  },

  // Create new ticket
  async createTicket(ticketData, userId) {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || 'user_arjun'
        },
        body: JSON.stringify(ticketData)
      });
      if (!res.ok) throw new Error('Failed to create ticket on server');
      return await res.json();
    } catch (err) {
      console.warn('API createTicket offline:', err.message);
      return null;
    }
  },

  // Vote (Swipe right/left)
  async voteTicket(ticketId, voteType, userId) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || 'user_arjun'
        },
        body: JSON.stringify({ voteType })
      });
      return await res.json();
    } catch (err) {
      console.warn('API voteTicket offline:', err.message);
      return null;
    }
  },

  // Add Comment
  async addComment(ticketId, text, userId) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || 'user_arjun'
        },
        body: JSON.stringify({ text })
      });
      return await res.json();
    } catch (err) {
      console.warn('API addComment offline:', err.message);
      return null;
    }
  },

  // Admin Update
  async updateTicketAdmin(ticketId, payload) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn('API updateTicketAdmin offline:', err.message);
      return null;
    }
  },

  // Student Two-Way Verification
  async verifyResolution(ticketId, isApproved, feedback) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved, feedback })
      });
      return await res.json();
    } catch (err) {
      console.warn('API verifyResolution offline:', err.message);
      return null;
    }
  },

  // Faculty Advisor or Hostel Resident Warden Review (Approve / Reject)
  async reviewTicketByPanel(ticketId, payload) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn('API reviewTicketByPanel offline:', err.message);
      return null;
    }
  },

  // Faculty Advisor Endorsement (compatibility helper)
  async endorseTicket(ticketId) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/endorse`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.warn('API endorseTicket offline:', err.message);
      return null;
    }
  },

  // Delete Ticket (Student removes own request or Admin deletes)
  async deleteTicket(ticketId, userId) {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId || 'user_arjun'
        }
      });
      return await res.json();
    } catch (err) {
      console.warn('API deleteTicket offline:', err.message);
      return null;
    }
  },

  // Authentication Login
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (err) {
      console.warn('API login offline:', err.message);
      return null;
    }
  },

  // Overall Admin Provisions / Adds Single User to Database
  async createUser(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (err) {
      console.warn('API createUser offline:', err.message);
      return null;
    }
  },

  // Multi-User Import from Excel / CSV
  async bulkImportUsers(users) {
    try {
      const res = await fetch(`${API_BASE}/auth/users/bulk-import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      });
      return await res.json();
    } catch (err) {
      console.warn('API bulkImportUsers offline:', err.message);
      return null;
    }
  },

  // Update Single User Details / Credentials
  async updateUser(userId, updates) {
    try {
      const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err) {
      console.warn('API updateUser offline:', err.message);
      return null;
    }
  },

  // Bulk Update Multiple Users (e.g. Change Hostel / Section / Dept / Role for a group of students)
  async bulkUpdateUsers(userIds, updates) {
    try {
      const res = await fetch(`${API_BASE}/auth/users/bulk-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, updates })
      });
      return await res.json();
    } catch (err) {
      console.warn('API bulkUpdateUsers offline:', err.message);
      return null;
    }
  },

  // Delete Single User
  async deleteUser(userId) {
    try {
      const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      console.warn('API deleteUser offline:', err.message);
      return null;
    }
  },

  // Bulk Delete Multiple Users
  async bulkDeleteUsers(userIds) {
    try {
      const res = await fetch(`${API_BASE}/auth/users/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds })
      });
      return await res.json();
    } catch (err) {
      console.warn('API bulkDeleteUsers offline:', err.message);
      return null;
    }
  }
};
