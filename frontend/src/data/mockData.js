// CampusOne / CMRS Clean Account Registry
// Streamlined: Few Students, Few Advisors, Few Admins, and One Overall Admin

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

export const CATEGORIES = [
  { id: 'electrical', label: 'Electrical & Power', icon: 'Zap', domain: 'electrical_av', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: 'it_av', label: 'IT & AV (Projectors/Wifi)', icon: 'MonitorPlay', domain: 'electrical_av', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { id: 'carpentry', label: 'Carpentry & Furniture', icon: 'Hammer', domain: 'carpentry_civil', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  { id: 'plumbing', label: 'Plumbing & Water', icon: 'Droplets', domain: 'carpentry_civil', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { id: 'mess_food', label: 'Mess & Food Quality', icon: 'Utensils', domain: 'hostel_mess', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: 'sanitation', label: 'Sanitation & Cleanliness', icon: 'Sparkles', domain: 'hostel_mess', color: 'text-teal-400 bg-teal-400/10 border-teal-400/20' },
  { id: 'safety', label: 'Hazard & Campus Safety', icon: 'AlertTriangle', domain: 'electrical_av', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' }
];

export const INITIAL_TICKETS = [
  {
    id: 'TICK-101',
    title: 'Ceiling Projector HDMI Flickering & Purple Tint in Room 302',
    description: 'During Operating Systems lecture, the main EPSON projector kept resetting and flickering with severe magenta color distortion. Slides are impossible to read from middle & back rows.',
    scope: 'class',
    classSection: 'CSE-B 3rd Year',
    department: 'CSE',
    location: 'Academic Block 1 - Room 302 (CSE-B Classroom)',
    category: 'it_av',
    domain: 'electrical_av',
    raisedBy: {
      id: 'user_arjun',
      name: 'Arjun K.',
      rollNo: 'CB.EN.U4CSE23045',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    createdAt: '2026-10-10T09:15:00Z',
    status: 'in_progress',
    priorityScore: 88,
    upvotes: ['user_arjun', 'user_sneha'],
    downvotes: [],
    advisorNotified: true,
    advisorEndorsed: true,
    assignedTo: 'Kishore V. (AV Lead)',
    eta: 'Today, 4:30 PM (Before Evening Lab)',
    adminNote: 'Technician Vignesh dispatched with 15m optical HDMI cable and replacement splitter.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    comments: [
      {
        id: 'c1',
        userName: 'Sneha Reddy',
        userRole: 'Classmate',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'True! Happened yesterday too. The HDMI wall panel socket is loose.',
        timestamp: '2 hours ago'
      },
      {
        id: 'c2',
        userName: 'Dr. Ramesh Kumar',
        userRole: 'Class Advisor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        text: 'Class Advisor Notice: Verified the issue during 3rd hour. Escalated with High Priority to Estate AV unit.',
        timestamp: '1 hour ago',
        isOfficial: true
      }
    ]
  },
  {
    id: 'TICK-102',
    title: 'Ceiling Fan Regulator Stuck at Speed 1 — Humming Noise',
    description: 'The ceiling fan in Room 304 cannot be turned to higher speeds. Regulator knob spins loose and motor makes a loud buzzing vibration.',
    scope: 'room',
    hostel: 'Vashistha Bhavan',
    room: '304',
    location: 'Vashistha Bhavan, 3rd Floor, Room 304',
    category: 'electrical',
    domain: 'electrical_av',
    raisedBy: {
      id: 'user_arjun',
      name: 'Arjun K.',
      rollNo: 'CB.EN.U4CSE23045',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    createdAt: '2026-10-09T20:30:00Z',
    status: 'awaiting_verification',
    priorityScore: 72,
    upvotes: ['user_arjun'],
    downvotes: [],
    assignedTo: 'Electrical Maintenance Shift-B',
    eta: 'Completed Today 2:10 PM',
    adminNote: 'Replaced fan step-regulator module and lubricated bearing. Marked as fixed. Please test and confirm on app!',
    imageUrl: 'https://images.unsplash.com/photo-1590725140246-20acbe44865e?w=800&auto=format&fit=crop&q=80',
    comments: [
      {
        id: 'c3',
        userName: 'Kishore V.',
        userRole: 'Electrical Dept',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Electrician checked the unit at 2:00 PM. Kindly approve if functioning properly.',
        timestamp: '30 mins ago',
        isOfficial: true
      }
    ]
  },
  {
    id: 'TICK-103',
    title: '⚠️ High-Voltage Exposed Wire Hanging Near Pathway Puddle',
    description: 'Behind RadhaKrishna CIR Hall leading to Academic Block 2, a severed conduit is resting in water puddle after noon rain. High electric hazard for pedestrians.',
    scope: 'campus',
    location: 'Walkway between RadhaKrishna Hall (CIR) and Academic Block 2',
    category: 'safety',
    domain: 'electrical_av',
    raisedBy: {
      id: 'user_rohit',
      name: 'Rohit Nair',
      rollNo: 'CB.EN.U4ME23012',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
    },
    createdAt: '2026-10-10T12:00:00Z',
    status: 'in_progress',
    priorityScore: 99,
    upvotes: ['user_rohit', 'user_arjun', 'user_sneha'],
    downvotes: [],
    assignedTo: 'Campus High-Voltage Emergency Squad',
    eta: 'Immediate / Within 30 Mins',
    adminNote: 'Emergency barricading placed. Power breaker 4 isolated. Cable being re-routed underground.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    comments: []
  }
];
