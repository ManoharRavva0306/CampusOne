import { getUsersFromDB, addUserToDB, updateUserInDB } from '../models/ticketModel.js';
import crypto from 'crypto';

// In-memory active session token map
const activeSessions = new Map();

// POST /api/auth/login
export function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Institutional email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getUsersFromDB();
  const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail && u.password === password);

  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials. Ensure your institutional email & password are correct.' 
    });
  }

  const token = 'c1_' + crypto.randomBytes(24).toString('hex');
  activeSessions.set(token, user.id);

  const { password: _, ...safeUser } = user;

  res.json({
    success: true,
    message: `Signed in as ${user.name} (${user.role})`,
    token,
    user: safeUser
  });
}

// GET /api/auth/users
export function getUsers(req, res) {
  const users = getUsersFromDB();
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.json({ success: true, count: safeUsers.length, users: safeUsers });
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

// POST /api/auth/users (Overall Admin adds a new student or user directly to database)
export function createUser(req, res) {
  const { 
    name, 
    email, 
    password, 
    role, 
    department, 
    classSection, 
    rollNo,
    hostel,
    room 
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, password, and role are required' });
  }

  const users = getUsersFromDB();
  const exists = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    return res.status(409).json({ success: false, message: 'A student or user with this email already exists in the database' });
  }

  const generatedRoll = rollNo || (role === 'student' ? `CB.EN.U4${(department || 'CSE').toUpperCase()}23${Math.floor(100 + Math.random() * 900)}` : `FAC.${Math.floor(1000 + Math.random() * 9000)}`);

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    password,
    role: role || 'student',
    rollNo: generatedRoll,
    department: department || 'CSE',
    classSection: classSection || (role === 'student' ? 'CSE-B 3rd Year' : null),
    hostel: hostel || (role === 'student' ? 'Vashistha Bhavan' : null),
    room: room || (role === 'student' ? '304' : null),
    avatar: role === 'student' 
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: role === 'student' 
      ? `Student — ${department || 'CSE'} (${classSection || '3rd Year'}) & ${hostel || 'Hostel'} Rm ${room || '304'}`
      : `${role.replace('_', ' ').toUpperCase()} — ${department || 'Campus Wide'}`
  };

  addUserToDB(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser, fullUser: newUser });
}

// PATCH /api/auth/users/:id (Overall Admin updates user credentials)
export function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password, role, department } = req.body;

  const updatedUser = updateUserInDB(id, {
    ...(name ? { name } : {}),
    ...(email ? { email: email.trim().toLowerCase() } : {}),
    ...(password ? { password } : {}),
    ...(role ? { role } : {}),
    ...(department ? { department } : {})
  });

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found in database' });
  }

  const { password: _, ...safeUser } = updatedUser;
  res.json({ success: true, user: safeUser });
}
