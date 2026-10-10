// Synchronized Clean Database Users
export const USERS = [
  // 1. Overall Admin (Master System Control - ONLY ONE)
  {
    id: 'user_dean',
    name: 'Dr. K. Subramanian',
    role: 'central_admin',
    rollNo: 'DIR.AMRITA.01',
    email: 'admin@cb.amrita.edu',
    password: 'amrita123',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Overall Admin — Master Platform Oversight & Access Management'
  },

  // 2. Department Admin (HOD / Estate Admin)
  {
    id: 'user_kishore',
    name: 'Kishore V.',
    role: 'domain_admin',
    rollNo: 'ADM.EST.104',
    email: 'admin.infra@cb.amrita.edu',
    password: 'amrita123',
    domain: 'electrical_av',
    domainTitle: 'Electrical & AV Infrastructure',
    department: 'Estate Maintenance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Admin (Dept Head) — Triage, Assign Technicians & Set ETAs'
  },
  {
    id: 'user_suresh',
    name: 'Suresh Babu',
    role: 'domain_admin',
    rollNo: 'ADM.CIV.202',
    email: 'admin.civil@cb.amrita.edu',
    password: 'amrita123',
    domain: 'carpentry_civil',
    domainTitle: 'Carpentry & Civil Maintenance',
    department: 'Civil Works',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Admin (Civil Works) — Infrastructure Maintenance'
  },

  // 3. Faculty Class Advisors
  {
    id: 'user_ramesh',
    name: 'Dr. Ramesh Kumar',
    role: 'faculty_advisor',
    rollNo: 'FAC.CSE.8821',
    email: 'advisor.cseb@cb.amrita.edu',
    password: 'amrita123',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    designation: 'Associate Professor & Class Advisor CSE-B',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Class Advisor — CSE-B 3rd Year Supervisory Desk'
  },
  {
    id: 'user_priya',
    name: 'Dr. Priya Sharma',
    role: 'faculty_advisor',
    rollNo: 'FAC.MECH.4412',
    email: 'advisor.mecha@cb.amrita.edu',
    password: 'amrita123',
    department: 'MECH',
    classSection: 'MECH-A 3rd Year',
    designation: 'Assistant Professor & Class Advisor MECH-A',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'Class Advisor — MECH-A 3rd Year Supervisory Desk'
  },

  // 4. Students
  {
    id: 'user_arjun',
    name: 'Arjun K.',
    role: 'student',
    rollNo: 'CB.EN.U4CSE23045',
    email: 'student1@cb.amrita.edu',
    password: 'amrita123',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    hostel: 'Vashistha Bhavan',
    room: '304',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Student — CSE-B Class & Vashistha Rm 304'
  },
  {
    id: 'user_sneha',
    name: 'Sneha Reddy',
    role: 'student',
    rollNo: 'CB.EN.U4CSE23078',
    email: 'student2@cb.amrita.edu',
    password: 'amrita123',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    hostel: 'Gargi Bhavan',
    room: '210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Student — CSE-B Class & Gargi Rm 210'
  },
  {
    id: 'user_rohit',
    name: 'Rohit Nair',
    role: 'student',
    rollNo: 'CB.EN.U4ME23012',
    email: 'student3@cb.amrita.edu',
    password: 'amrita123',
    department: 'MECH',
    classSection: 'MECH-A 3rd Year',
    hostel: 'Agastya Bhavan',
    room: '105',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    description: 'Student — MECH-A Class & Agastya Rm 105'
  }
];

import { readDB, writeDB } from './db.js';

// Getter for USERS (read live from database)
export function getUsersFromDB() {
  const db = readDB();
  return db.users || USERS;
}

// Getter for TICKETS (read live from database)
export function getTicketsFromDB() {
  const db = readDB();
  return db.tickets || [];
}

// Save all tickets to DB
export function saveTicketsToDB(tickets) {
  const db = readDB();
  db.tickets = tickets;
  writeDB(db);
}

// Save all users to DB
export function saveUsersToDB(users) {
  const db = readDB();
  db.users = users;
  writeDB(db);
}

// Add user to DB
export function addUserToDB(user) {
  const db = readDB();
  db.users = db.users || [];
  db.users.push(user);
  writeDB(db);
  return user;
}

// Update user in DB
export function updateUserInDB(userId, updateFields) {
  const db = readDB();
  db.users = (db.users || []).map(u => {
    if (u.id === userId) {
      return { ...u, ...updateFields };
    }
    return u;
  });
  writeDB(db);
  return db.users.find(u => u.id === userId);
}

// Add ticket to DB
export function addTicketToDB(ticket) {
  const db = readDB();
  db.tickets = db.tickets || [];
  db.tickets.unshift(ticket);
  writeDB(db);
  return ticket;
}

// Update ticket in DB
export function updateTicketInDB(ticketId, updateFn) {
  const db = readDB();
  db.tickets = (db.tickets || []).map(t => {
    if (t.id === ticketId) {
      return updateFn(t);
    }
    return t;
  });
  writeDB(db);
  return db.tickets.find(t => t.id === ticketId);
}

// Delete ticket from DB
export function deleteTicketFromDB(ticketId) {
  const db = readDB();
  const initialLength = (db.tickets || []).length;
  db.tickets = (db.tickets || []).filter(t => t.id !== ticketId);
  const deleted = db.tickets.length < initialLength;
  if (deleted) {
    writeDB(db);
  }
  return deleted;
}

export const TICKETS = getTicketsFromDB();
