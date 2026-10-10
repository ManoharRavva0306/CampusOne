import { USERS } from '../models/ticketModel.js';

export function getUsers(req, res) {
  res.json({ success: true, count: USERS.length, users: USERS });
}

export function getCurrentUser(req, res) {
  const userId = req.headers['x-user-id'] || 'user_arjun';
  const user = USERS.find(u => u.id === userId) || USERS[0];
  res.json({ success: true, user });
}
