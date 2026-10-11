import { readDB, writeDB } from './db.js';

// Synchronized Clean Database Users
export const USERS = [
  // 1. Overall Admin (Master System Control - ONLY ONE)
  {
    id: 'user_dean',
    name: 'Dr. K. Subramanian',
    role: 'central_admin',
    rollNo: 'DIR.AMRITA.01',
    email: 'admin@cb.amrita.edu',
    password: 'admin123',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Overall Admin — Master Platform Oversight & Access Management'
  },

  // 2. Department Admins (HOD / Estate Admin)
  {
    id: 'user_kishore',
    name: 'Kishore V.',
    role: 'domain_admin',
    rollNo: 'ADM.EST.104',
    email: 'admin.infra@cb.amrita.edu',
    password: 'admin123',
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
    password: 'admin123',
    domain: 'carpentry_civil',
    domainTitle: 'Carpentry & Civil Maintenance',
    department: 'Civil Works',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Admin (Civil Works) — Infrastructure Maintenance'
  },

  // 3. Faculty Class Advisors
  {
    id: 'adv_cseb',
    name: 'Dr. Ramesh Kumar',
    role: 'faculty_advisor',
    rollNo: 'FAC.CSE.8821',
    email: 'advisor.cseb@cb.amrita.edu',
    password: 'advisor123',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    designation: 'Associate Professor & Class Advisor CSE-B',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Class Advisor — CSE-B 3rd Year Supervisory Desk'
  },
  {
    id: 'adv_csea',
    name: 'Dr. M. Senthil Nathan',
    role: 'faculty_advisor',
    rollNo: 'FAC.CSE.8822',
    email: 'advisor.csea@cb.amrita.edu',
    password: 'advisor123',
    department: 'CSE',
    classSection: 'CSE-A 3rd Year',
    designation: 'Associate Professor & Class Advisor CSE-A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Class Advisor — CSE-A 3rd Year Supervisory Desk'
  },
  {
    id: 'adv_mecha',
    name: 'Dr. Priya Sharma',
    role: 'faculty_advisor',
    rollNo: 'FAC.MECH.4412',
    email: 'advisor.mecha@cb.amrita.edu',
    password: 'advisor123',
    department: 'MECH',
    classSection: 'MECH-A 3rd Year',
    designation: 'Assistant Professor & Class Advisor MECH-A',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'Class Advisor — MECH-A 3rd Year Supervisory Desk'
  },

  // 4. Hostel Resident Wardens
  {
    id: 'warden_agastya',
    name: 'Dr. Raghavan Nair',
    role: 'hostel_warden',
    rollNo: 'WAR.AGA.01',
    email: 'warden.agastya@cb.amrita.edu',
    password: 'warden123',
    department: 'Hostel Administration',
    hostel: 'Agastya Bhavan',
    designation: 'Resident Warden — Agastya Bhavan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Hostel Resident Warden — Agastya Bhavan Supervisory Desk'
  },
  {
    id: 'warden_vashistha',
    name: 'Prof. Karthikeya V.',
    role: 'hostel_warden',
    rollNo: 'WAR.VAS.02',
    email: 'warden.vashistha@cb.amrita.edu',
    password: 'warden123',
    department: 'Hostel Administration',
    hostel: 'Vashistha Bhavan',
    designation: 'Resident Warden — Vashistha Bhavan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Hostel Resident Warden — Vashistha Bhavan Supervisory Desk'
  },
  {
    id: 'warden_gargi',
    name: 'Dr. Meenakshi Sundaram',
    role: 'hostel_warden',
    rollNo: 'WAR.GAR.03',
    email: 'warden.gargi@cb.amrita.edu',
    password: 'warden123',
    department: 'Hostel Administration',
    hostel: 'Gargi Bhavan',
    designation: 'Resident Warden — Gargi Bhavan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'Hostel Resident Warden — Gargi Bhavan Supervisory Desk'
  },

  // 5. Students
  {
    id: 'user_arjun',
    name: 'Arjun K.',
    role: 'student',
    rollNo: 'CB.EN.U4CSE23045',
    email: 'student1@cb.amrita.edu',
    password: 'student123',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    hostel: 'Agastya Bhavan',
    room: '304',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Student — CSE-B 3rd Year & Agastya Bhavan Rm 304'
  },
  {
    id: 'user_sneha',
    name: 'Sneha Reddy',
    role: 'student',
    rollNo: 'CB.EN.U4CSE23078',
    email: 'student2@cb.amrita.edu',
    password: 'student123',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    hostel: 'Gargi Bhavan',
    room: '210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Student — CSE-B 3rd Year & Gargi Bhavan Rm 210'
  },
  {
    id: 'user_rohit',
    name: 'Rohit Nair',
    role: 'student',
    rollNo: 'CB.EN.U4ME23012',
    email: 'student3@cb.amrita.edu',
    password: 'student123',
    department: 'MECH',
    classSection: 'MECH-A 3rd Year',
    hostel: 'Agastya Bhavan',
    room: '105',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    description: 'Student — MECH-A 3rd Year & Agastya Bhavan Rm 105'
  }
];

// Getter for USERS (read live from database)
export function getUsersFromDB() {
  const db = readDB();
  return db.users && db.users.length > 0 ? db.users : USERS;
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

// Add or update user in DB
export function addUserToDB(user) {
  const db = readDB();
  db.users = db.users || [];
  const existingIdx = db.users.findIndex(u => u.id === user.id || (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase()));
  if (existingIdx >= 0) {
    db.users[existingIdx] = { ...db.users[existingIdx], ...user };
  } else {
    db.users.unshift(user);
  }
  writeDB(db);
  return user;
}

// Add multiple users in bulk to DB (Excel / CSV Multi-User Import)
export function addBulkUsersToDB(newUsers) {
  const db = readDB();
  db.users = db.users || [];
  const userMap = new Map();
  // Keep existing
  db.users.forEach(u => userMap.set((u.email || u.id).toLowerCase(), u));
  // Upsert new
  newUsers.forEach(u => userMap.set((u.email || u.id).toLowerCase(), u));
  db.users = Array.from(userMap.values());
  writeDB(db);
  return newUsers;
}

// Update single user in DB
export function updateUserInDB(userId, updateFields) {
  const db = readDB();
  db.users = (db.users || []).map(u => {
    if (u.id === userId) {
      const updated = { ...u, ...updateFields };
      if (updated.role === 'student') {
        updated.description = `Student — ${updated.department || 'CSE'} (${updated.classSection || 'CSE-B 3rd Year'}) & ${updated.hostel || 'Agastya Bhavan'} Rm ${updated.room || '101'}`;
      } else if (updated.role === 'faculty_advisor') {
        updated.description = `Class Advisor — ${updated.classSection || 'CSE-B 3rd Year'} Supervisory Desk`;
      } else if (updated.role === 'hostel_warden') {
        updated.description = `Hostel Resident Warden — ${updated.hostel || 'Agastya Bhavan'} Supervisory Desk`;
      }
      return updated;
    }
    return u;
  });
  writeDB(db);
  return db.users.find(u => u.id === userId);
}

// Bulk update multiple users in DB (e.g. changing Hostel name or Class Section for a group of students)
export function bulkUpdateUsersInDB(userIds, updateFields) {
  const db = readDB();
  const idSet = new Set(userIds);
  const updatedList = [];

  db.users = (db.users || []).map(u => {
    if (idSet.has(u.id)) {
      const updated = { ...u, ...updateFields };
      if (updated.role === 'student') {
        updated.description = `Student — ${updated.department || 'CSE'} (${updated.classSection || 'CSE-B 3rd Year'}) & ${updated.hostel || 'Agastya Bhavan'} Rm ${updated.room || '101'}`;
      } else if (updated.role === 'faculty_advisor') {
        updated.description = `Class Advisor — ${updated.classSection || 'CSE-B 3rd Year'} Supervisory Desk`;
      } else if (updated.role === 'hostel_warden') {
        updated.description = `Hostel Resident Warden — ${updated.hostel || 'Agastya Bhavan'} Supervisory Desk`;
      }
      updatedList.push(updated);
      return updated;
    }
    return u;
  });
  writeDB(db);
  return updatedList;
}

// Delete single user from DB
export function deleteUserFromDB(userId) {
  const db = readDB();
  const beforeCount = (db.users || []).length;
  db.users = (db.users || []).filter(u => u.id !== userId);
  writeDB(db);
  return db.users.length < beforeCount;
}

// Bulk delete multiple users from DB
export function bulkDeleteUsersFromDB(userIds) {
  const db = readDB();
  const idSet = new Set(userIds);
  const beforeCount = (db.users || []).length;
  db.users = (db.users || []).filter(u => !idSet.has(u.id));
  writeDB(db);
  return beforeCount - db.users.length;
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
