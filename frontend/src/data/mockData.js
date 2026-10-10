// CampusOne / CMRS Mock Database & Presets

export const USERS = [
  {
    id: 'user_arjun',
    name: 'Arjun K.',
    role: 'student',
    rollNo: 'CB.EN.U4CSE23045',
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
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    hostel: 'Gargi Bhavan',
    room: '210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Classmate — CSE-B 3rd Year'
  },
  {
    id: 'user_rohit',
    name: 'Rohit Nair',
    role: 'student',
    rollNo: 'CB.EN.U4ME23012',
    department: 'MECH',
    classSection: 'MECH-A 3rd Year',
    hostel: 'Agastya Bhavan',
    room: '105',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    description: 'Student — Mechanical Dept'
  },
  {
    id: 'user_ramesh',
    name: 'Dr. Ramesh Kumar',
    role: 'faculty_advisor',
    rollNo: 'FAC.CSE.8821',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    designation: 'Associate Professor & Class Advisor CSE-B',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Class Advisor — CSE-B 3rd Year'
  },
  {
    id: 'user_kishore',
    name: 'Kishore V.',
    role: 'domain_admin',
    domain: 'electrical_av',
    domainTitle: 'Electrical & AV Infrastructure',
    department: 'Estate Maintenance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Domain Admin — Electrical & Projector/AV'
  },
  {
    id: 'user_suresh',
    name: 'Suresh Babu',
    role: 'domain_admin',
    domain: 'carpentry_civil',
    domainTitle: 'Carpentry & Civil Maintenance',
    department: 'Civil Works',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Domain Admin — Carpentry & Furniture'
  },
  {
    id: 'user_malathi',
    name: 'Mrs. Malathi / Warden',
    role: 'domain_admin',
    domain: 'hostel_mess',
    domainTitle: 'Hostels & Mess Quality Committee',
    department: 'Student Housing',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'Domain Admin — Mess & Hostels'
  },
  {
    id: 'user_dean',
    name: 'Dean of Student Affairs',
    role: 'central_admin',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Central Administrator — Amrita Campus'
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
    scope: 'class', // 'class' | 'room' | 'department' | 'hostel_generic' | 'campus'
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
    status: 'in_progress', // 'reported', 'endorsed', 'in_progress', 'awaiting_verification', 'resolved'
    priorityScore: 88,
    upvotes: ['user_arjun', 'user_sneha', 'user_rohit_vote1', 'user_v2', 'user_v3', 'user_v4', 'user_v5', 'user_v6', 'user_v7', 'user_v8', 'user_v9', 'user_v10', 'user_v11', 'user_v12', 'user_v13', 'user_v14', 'user_v15', 'user_v16'],
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
    status: 'awaiting_verification', // DEMO: Needs student to verify & approve to close!
    priorityScore: 72,
    upvotes: ['user_arjun', 'roommate_kiran', 'roommate_sanjay'],
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
    upvotes: ['user_rohit', 'user_arjun', 'user_sneha', 'user_u1', 'user_u2', 'user_u3', 'user_u4', 'user_u5', 'user_u6', 'user_u7', 'user_u8', 'user_u9', 'user_u10', 'user_u11', 'user_u12', 'user_u13', 'user_u14', 'user_u15', 'user_u16', 'user_u17', 'user_u18', 'user_u19', 'user_u20', 'user_u21', 'user_u22'],
    downvotes: [],
    assignedTo: 'Campus High-Voltage Emergency Squad',
    eta: 'Immediate / Within 30 Mins',
    adminNote: 'Emergency barricading placed. Power breaker 4 isolated. Cable being re-routed underground.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    comments: [
      {
        id: 'c4',
        userName: 'Arjun K.',
        userRole: 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'Saw this right before Genesis Hackathon briefing! Please take alternate path through library porch.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'TICK-104',
    title: 'CSE IoT Lab 3 Central AC Dripping Directly Over Switchboard 4',
    description: 'Condensate pipe blocked on split AC unit #2 in IoT Lab. Water dripping onto extension boxes and network switch.',
    scope: 'department',
    department: 'CSE',
    location: 'CSE Department — Advanced IoT & Robotics Lab (AB-1, 2nd Floor)',
    category: 'electrical',
    domain: 'electrical_av',
    raisedBy: {
      id: 'user_sneha',
      name: 'Sneha Reddy',
      rollNo: 'CB.EN.U4CSE23078',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    createdAt: '2026-10-10T10:45:00Z',
    status: 'reported',
    priorityScore: 79,
    upvotes: ['user_sneha', 'user_arjun', 'user_t1', 'user_t2', 'user_t3', 'user_t4', 'user_t5', 'user_t6', 'user_t7', 'user_t8'],
    downvotes: ['user_neg1'],
    assignedTo: 'Pending Allocation',
    eta: 'Pending Inspection',
    adminNote: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    comments: []
  },
  {
    id: 'TICK-105',
    title: 'Dining Hall 1 Water Purifier Unit Leaking & Low Pressure',
    description: 'The RO UV drinking water dispenser in North Dining Hall has a severe tap leak and muddy taste in filter outlet.',
    scope: 'hostel_generic',
    hostel: 'Dining Block / North Mess',
    location: 'Hostel Dining Hall 1 - Ground Floor Dispenser Station',
    category: 'mess_food',
    domain: 'hostel_mess',
    raisedBy: {
      id: 'user_arjun',
      name: 'Arjun K.',
      rollNo: 'CB.EN.U4CSE23045',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    createdAt: '2026-10-08T18:00:00Z',
    status: 'in_progress',
    priorityScore: 68,
    upvotes: ['user_arjun', 'user_m1', 'user_m2', 'user_m3', 'user_m4', 'user_m5', 'user_m6'],
    downvotes: [],
    assignedTo: 'Mess Sanitation Lead (Warden Malathi)',
    eta: 'Tomorrow, 9:00 AM',
    adminNote: 'Commercial sediment filter cartridge replaced. Waiting on plumber for valve sealing.',
    imageUrl: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?w=800&auto=format&fit=crop&q=80',
    comments: []
  },
  {
    id: 'TICK-106',
    title: 'Back-Row Bench #12 Broken Support Leg & Loose Plank',
    description: 'Wooden bench in CSE-B room wobbles and has an exposed wood splinter that tore a student notebook.',
    scope: 'class',
    classSection: 'CSE-B 3rd Year',
    department: 'CSE',
    location: 'Academic Block 1 - Room 302 (CSE-B Classroom)',
    category: 'carpentry',
    domain: 'carpentry_civil',
    raisedBy: {
      id: 'user_sneha',
      name: 'Sneha Reddy',
      rollNo: 'CB.EN.U4CSE23078',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    createdAt: '2026-10-07T14:10:00Z',
    status: 'resolved',
    priorityScore: 52,
    upvotes: ['user_sneha', 'user_arjun', 'user_c1', 'user_c2'],
    downvotes: [],
    assignedTo: 'Suresh Babu (Civil & Carpentry)',
    eta: 'Completed',
    adminNote: 'Bench reinforced with steel L-brackets and sanded smooth. Confirmed by Sneha Reddy.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    comments: [
      {
        id: 'c5',
        userName: 'Sneha Reddy',
        userRole: 'Student (Reporter)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Inspected on morning of Oct 8. Solid repair, approved!',
        timestamp: '2 days ago'
      }
    ]
  }
];
