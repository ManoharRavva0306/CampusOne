// CampusOne API Service with Multi-Host Fallback (Supports Localhost, LAN Mobile, and Render Cloud)

function getCandidateBases() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return [envUrl];

  if (typeof window !== 'undefined') {
    const list = ['/api'];
    if (window.location.hostname && window.location.hostname !== 'localhost') {
      list.push(`http://${window.location.hostname}:5000/api`);
    }
    list.push('http://localhost:5000/api');
    return Array.from(new Set(list));
  }
  return ['http://localhost:5000/api'];
}

async function requestWithFallback(path, options = {}) {
  const candidates = getCandidateBases();
  let lastError = null;

  for (const base of candidates) {
    try {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const url = `${base}${cleanPath}`;
      const res = await fetch(url, options);

      // Successful HTTP response
      if (res.ok) {
        return await res.json();
      }

      // If server returned a formatted JSON error response (e.g. 400 or 401), parse and return it
      const jsonErr = await res.json().catch(() => null);
      if (jsonErr) return jsonErr;

      lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
    } catch (err) {
      lastError = err;
      // Continue to next candidate URL
    }
  }

  console.warn(`[CampusOne API] All endpoints failed for ${path}:`, lastError?.message);
  return null;
}

export const api = {
  // Fetch tickets with live sync support
  async getTickets(userId) {
    return await requestWithFallback('/tickets', {
      headers: userId ? { 'x-user-id': userId } : {}
    });
  },

  // Create new ticket (persists across mobile and laptop to backend database)
  async createTicket(ticketData, userId) {
    return await requestWithFallback('/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || 'user_arjun'
      },
      body: JSON.stringify(ticketData)
    });
  },

  // Vote (Swipe right/left)
  async voteTicket(ticketId, voteType, userId) {
    return await requestWithFallback(`/tickets/${ticketId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || 'user_arjun'
      },
      body: JSON.stringify({ voteType })
    });
  },

  // Add Comment
  async addComment(ticketId, text, userId) {
    return await requestWithFallback(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || 'user_arjun'
      },
      body: JSON.stringify({ text })
    });
  },

  // Admin Update
  async updateTicketAdmin(ticketId, payload) {
    return await requestWithFallback(`/tickets/${ticketId}/admin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Student Two-Way Verification
  async verifyResolution(ticketId, isApproved, feedback) {
    return await requestWithFallback(`/tickets/${ticketId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved, feedback })
    });
  },

  // Faculty Advisor or Hostel Resident Warden Review (Approve / Reject)
  async reviewTicketByPanel(ticketId, payload) {
    return await requestWithFallback(`/tickets/${ticketId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Faculty Advisor Endorsement (compatibility helper)
  async endorseTicket(ticketId) {
    return await requestWithFallback(`/tickets/${ticketId}/endorse`, {
      method: 'POST'
    });
  },

  // Delete Ticket (Student removes own request or Admin deletes)
  async deleteTicket(ticketId, userId) {
    return await requestWithFallback(`/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId || 'user_arjun' }
    });
  },

  // Fetch all users
  async getUsers(userId) {
    return await requestWithFallback('/auth/users', {
      headers: userId ? { 'x-user-id': userId } : {}
    });
  },

  // Authentication Login
  async login(identifier, password) {
    return await requestWithFallback('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, identifier, password })
    });
  },

  // Overall Admin Provisions / Adds Single User to Database
  async createUser(userData) {
    return await requestWithFallback('/auth/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },

  // Multi-User Import from Excel / CSV
  async bulkImportUsers(users) {
    return await requestWithFallback('/auth/users/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users })
    });
  },

  // Update Single User Details / Credentials
  async updateUser(userId, updates) {
    return await requestWithFallback(`/auth/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  },

  // Bulk Update Multiple Users
  async bulkUpdateUsers(userIds, updates) {
    return await requestWithFallback('/auth/users/bulk-update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds, updates })
    });
  },

  // Delete Single User
  async deleteUser(userId) {
    return await requestWithFallback(`/auth/users/${userId}`, {
      method: 'DELETE'
    });
  },

  // Bulk Delete Multiple Users
  async bulkDeleteUsers(userIds) {
    return await requestWithFallback('/auth/users/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds })
    });
  },

  // AI Semantic Issue Analysis (Auto-Triage, Duplicates, Vision Defect)
  async analyzeIssueAI(issueData) {
    return await requestWithFallback('/ai/analyze-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData)
    });
  },

  // AI Maintenance Dispatch & SLA Copilot
  async getAdminCopilotAI(ticketData) {
    return await requestWithFallback('/ai/admin-copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
  }
};
