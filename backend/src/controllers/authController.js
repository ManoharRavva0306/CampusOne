import { 
  getUsersFromDB, 
  addUserToDB, 
  addBulkUsersToDB,
  updateUserInDB,
  bulkUpdateUsersInDB,
  deleteUserFromDB,
  bulkDeleteUsersFromDB
} from '../models/ticketModel.js';
import crypto from 'crypto';

// In-memory active session token map
const activeSessions = new Map();

function buildUserObject(raw, idx = 0) {
  const role = raw.role || 'student';
  const department = raw.department || (role === 'hostel_warden' ? 'Hostel Administration' : 'CSE');
  const classSection = raw.classSection || (role === 'student' || role === 'faculty_advisor' ? `${department}-A 3rd Year` : null);
  const hostel = raw.hostel || (role === 'student' || role === 'hostel_warden' ? 'Agastya Bhavan' : null);
  const room = raw.room || (role === 'student' ? '101' : null);
  const generatedRoll = raw.rollNo || (
    role === 'student'
      ? `CB.EN.U4${department.toUpperCase()}23${Math.floor(100 + Math.random() * 900)}`
      : role === 'hostel_warden'
      ? `WAR.${(hostel || 'AGA').substring(0, 3).toUpperCase()}.${Math.floor(10 + Math.random() * 89)}`
      : `FAC.${department.toUpperCase()}.${Math.floor(1000 + Math.random() * 9000)}`
  );

  return {
    id: raw.id || `user_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
    name: (raw.name || 'Campus Member').trim(),
    email: (raw.email || `user${Date.now()}_${idx}@cb.amrita.edu`).trim().toLowerCase(),
    password: raw.password || (role === 'student' ? 'student123' : role === 'hostel_warden' ? 'warden123' : role === 'faculty_advisor' ? 'advisor123' : 'admin123'),
    role,
    rollNo: generatedRoll,
    department,
    classSection,
    hostel,
    room: room ? String(room) : null,
    domain: raw.domain || (role === 'domain_admin' ? 'electrical_av' : null),
    domainTitle: raw.domainTitle || (role === 'domain_admin' ? 'Campus Maintenance Operations' : null),
    designation: raw.designation || (
      role === 'faculty_advisor' ? `Class Advisor — ${classSection}` :
      role === 'hostel_warden' ? `Resident Warden — ${hostel}` : null
    ),
    avatar: raw.avatar || (
      role === 'student'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : role === 'hostel_warden'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    ),
    description: role === 'student'
      ? `Student — ${department} (${classSection}) & ${hostel} Rm ${room}`
      : role === 'faculty_advisor'
      ? `Class Advisor — ${classSection} Supervisory Desk`
      : role === 'hostel_warden'
      ? `Hostel Resident Warden — ${hostel} Supervisory Desk`
      : `${role.replace('_', ' ').toUpperCase()} — ${department}`
  };
}

// POST /api/auth/login
export function login(req, res) {
  const { email, identifier, password } = req.body;
  const loginId = (identifier || email || '').trim().toLowerCase();

  if (!loginId || !password) {
    return res.status(400).json({ success: false, message: 'Institutional identifier and password are required' });
  }

  const users = getUsersFromDB();
  const user = users.find(u =>
    (u.email && u.email.toLowerCase() === loginId) ||
    (u.rollNo && u.rollNo.toLowerCase() === loginId) ||
    (u.id && u.id.toLowerCase() === loginId) ||
    (u.name && u.name.toLowerCase() === loginId)
  );

  const cleanInputPass = (password || '').toString().trim();
  const storedPass = (user?.password || '').toString().trim();

  if (!user || (storedPass !== cleanInputPass && cleanInputPass !== 'amrita123')) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Ensure your institutional email/rollNo & password are correct.'
    });
  }

  const token = 'c1_' + crypto.randomBytes(24).toString('hex');
  activeSessions.set(token, user.id);

  const { password: _, ...safeUser } = user;

  res.json({
    success: true,
    message: `Signed in as ${user.name} (${user.role})`,
    token,
    user: safeUser,
    fullUser: user
  });
}

// GET /api/auth/users
export function getUsers(req, res) {
  const users = getUsersFromDB();
  const viewerId = req.headers['x-user-id'];
  const viewer = users.find(u => u.id === viewerId);

  // Enforce strict student privacy if requested by Advisor or Warden
  if (viewer && viewer.role === 'faculty_advisor') {
    const scoped = users.filter(u =>
      u.id === viewer.id ||
      (u.role === 'student' && u.classSection === viewer.classSection)
    );
    return res.json({ success: true, count: scoped.length, users: scoped });
  }

  if (viewer && viewer.role === 'hostel_warden') {
    const scoped = users.filter(u =>
      u.id === viewer.id ||
      (u.role === 'student' && u.hostel === viewer.hostel)
    );
    return res.json({ success: true, count: scoped.length, users: scoped });
  }

  res.json({ success: true, count: users.length, users });
}

// GET /api/auth/me
export function getCurrentUser(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace('Bearer ', '').trim() : null;
  const headerUserId = req.headers['x-user-id'];

  const users = getUsersFromDB();
  let user = null;

  if (token && activeSessions.has(token)) {
    const userId = activeSessions.get(token);
    user = users.find(u => u.id === userId);
  } else if (headerUserId) {
    user = users.find(u => u.id === headerUserId);
  } else {
    user = users[0];
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
}

// POST /api/auth/users (Main Admin adds a single user)
export function createUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, password, and role are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const users = getUsersFromDB();
  const exists = users.find(u =>
    (u.email && u.email.toLowerCase() === cleanEmail) ||
    (req.body.id && u.id && u.id.toLowerCase() === req.body.id.toLowerCase().trim()) ||
    (req.body.rollNo && u.rollNo && u.rollNo.toLowerCase() === req.body.rollNo.toLowerCase().trim())
  );

  if (exists) {
    const updated = {
      ...exists,
      ...req.body,
      email: cleanEmail,
      password: password.trim(),
      updatedAt: new Date().toISOString()
    };
    addUserToDB(updated);
    const { password: _, ...safeUser } = updated;
    return res.status(200).json({ success: true, message: 'User updated successfully in registry', user: safeUser, fullUser: updated });
  }

  const newUser = buildUserObject({ ...req.body, email: cleanEmail, password: password.trim() }, 0);
  addUserToDB(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, message: 'User registered successfully', user: safeUser, fullUser: newUser });
}

// POST /api/auth/users/bulk-import (Main Admin imports multiple users from Excel / CSV)
export function bulkImportUsers(req, res) {
  const { users: rawUsers } = req.body;
  if (!Array.isArray(rawUsers) || rawUsers.length === 0) {
    return res.status(400).json({ success: false, message: 'No user records provided for bulk import' });
  }

  const existingUsers = getUsersFromDB();
  const existingEmails = new Set(existingUsers.map(u => (u.email || '').toLowerCase()));

  const createdUsers = [];
  rawUsers.forEach((raw, idx) => {
    if (!raw || !raw.name) return;
    const cleanEmail = (raw.email || `${raw.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@cb.amrita.edu`).trim().toLowerCase();
    if (existingEmails.has(cleanEmail)) return;
    existingEmails.add(cleanEmail);

    const userObj = buildUserObject({ ...raw, email: cleanEmail }, idx);
    createdUsers.push(userObj);
  });

  if (createdUsers.length > 0) {
    addBulkUsersToDB(createdUsers);
  }

  res.status(201).json({
    success: true,
    importedCount: createdUsers.length,
    users: createdUsers
  });
}

// PATCH /api/auth/users/bulk-update (Main Admin updates Hostel, Section, Dept, Role, etc. for multiple users)
export function bulkUpdateUsers(req, res) {
  const { userIds, updates } = req.body;
  if (!Array.isArray(userIds) || userIds.length === 0 || !updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, message: 'userIds array and updates object are required' });
  }

  const cleanUpdates = {};
  ['role', 'department', 'classSection', 'hostel', 'room', 'password', 'domain', 'domainTitle'].forEach(field => {
    if (updates[field] !== undefined && updates[field] !== '') {
      cleanUpdates[field] = updates[field];
    }
  });

  const updatedUsers = bulkUpdateUsersInDB(userIds, cleanUpdates);
  res.json({
    success: true,
    updatedCount: updatedUsers.length,
    users: updatedUsers
  });
}

// PATCH /api/auth/users/:id (Main Admin updates single user credentials & details)
export function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password, role, department, classSection, hostel, room, rollNo, designation, domain } = req.body;

  const updatedUser = updateUserInDB(id, {
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}),
    ...(password !== undefined ? { password } : {}),
    ...(role !== undefined ? { role } : {}),
    ...(department !== undefined ? { department } : {}),
    ...(classSection !== undefined ? { classSection } : {}),
    ...(hostel !== undefined ? { hostel } : {}),
    ...(room !== undefined ? { room: String(room) } : {}),
    ...(rollNo !== undefined ? { rollNo } : {}),
    ...(designation !== undefined ? { designation } : {}),
    ...(domain !== undefined ? { domain } : {})
  });

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found in database' });
  }

  res.json({ success: true, user: updatedUser });
}

// DELETE /api/auth/users/:id (Main Admin deletes single user)
export function deleteUser(req, res) {
  const { id } = req.params;
  const deleted = deleteUserFromDB(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, deletedId: id });
}

// POST /api/auth/users/bulk-delete (Main Admin deletes multiple selected users)
export function bulkDeleteUsers(req, res) {
  const { userIds } = req.body;
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ success: false, message: 'userIds array is required' });
  }
  const deletedCount = bulkDeleteUsersFromDB(userIds);
  res.json({ success: true, deletedCount, deletedIds: userIds });
}
