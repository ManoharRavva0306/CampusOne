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

  // Faculty Advisor Endorsement
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

  // Overall Admin Provisions / Adds Student to Database
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
  }
};
