import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Activity, 
  Megaphone, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Trash2, 
  Edit3, 
  Key, 
  Sparkles, 
  Building2, 
  Layers, 
  FileText,
  Plus,
  X,
  Upload,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Home,
  Wrench,
  Flame,
  Send,
  CheckSquare,
  Square,
  ChevronRight,
  Lock,
  Check,
  PackageSearch
} from 'lucide-react';

const ALL_SECTIONS = [
  'CSE-B 3rd Year',
  'CSE-A 3rd Year',
  'ECE-A 3rd Year',
  'ECE-B 3rd Year',
  'MECH-A 3rd Year',
  'EEE-B 3rd Year',
  'AIE-A 3rd Year',
  'CYS-B 3rd Year'
];

const ALL_HOSTELS = [
  'Agastya Bhavan',
  'Vashistha Bhavan',
  'Gargi Bhavan',
  'Maitreyi Bhavan',
  'Vyasa Bhavan'
];

const ALL_DEPARTMENTS = ['CSE', 'ECE', 'MECH', 'EEE', 'AIE', 'CYS', 'Hostel Administration', 'Central Administration'];

export default function SuperAdminDashboard() {
  const { 
    currentUser, 
    tickets, 
    updateTicketAdmin, 
    addComment,
    showNotification,
    systemAnnouncements,
    addAnnouncement,
    userList,
    addNewUser,
    bulkImportUsers,
    updateUserRole,
    updateUserCredentials,
    bulkUpdateUsers,
    deleteUser,
    bulkDeleteUsers,
    setSelectedTicketForDetail,
    reviewClaimRequest,
    auditLogs
  } = useApp();

  if (!currentUser) return null;

  // Primary Console View: 'sections_explorer' | 'user_crud' | 'governance_logs' | 'lost_found_claims'
  const [consoleView, setConsoleView] = useState('sections_explorer');

  // =========================================================================
  // STATE FOR VIEW 4: LOST & FOUND CUSTODY & STUDENT CLAIM REQUESTS
  // =========================================================================
  const [lnfAdminFilter, setLnfAdminFilter] = useState('claims'); // 'claims' | 'custody' | 'lost' | 'all'
  const [lnfSearch, setLnfSearch] = useState('');
  const [lnfCustodyFilter, setLnfCustodyFilter] = useState('all');

  const lostFoundTickets = useMemo(() => {
    return tickets.filter(t => t.scope === 'lost_found' || t.category === 'lost_found');
  }, [tickets]);

  const allClaimRequests = useMemo(() => {
    const list = [];
    lostFoundTickets.forEach(ticket => {
      (ticket.claimRequests || []).forEach(claim => {
        list.push({ ...claim, ticket });
      });
    });
    return list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [lostFoundTickets]);

  const pendingClaimsCount = allClaimRequests.filter(c => c.status === 'pending').length;
  const custodyFoundTickets = lostFoundTickets.filter(t => t.lostFoundType === 'found');
  const lostAlertTickets = lostFoundTickets.filter(t => t.lostFoundType === 'lost');
  const handedOverCount = lostFoundTickets.filter(t => t.claimedStatus === 'claimed' || t.status === 'resolved').length;

  const handleExportLostFoundExcel = () => {
    const rows = lostFoundTickets.map(t => ({
      ID: t.id,
      Type: t.lostFoundType === 'found' ? 'Found Item in Custody' : 'Lost Alert Broadcast',
      Title: t.title,
      Category: t.itemCategory || 'general',
      CustodyLocation: t.safekeepingLocation || 'N/A',
      FoundLostLocation: t.location,
      FinderOrReporter: t.raisedBy?.name || 'N/A',
      ReporterRollNo: t.raisedBy?.rollNo || 'N/A',
      SecretDetails: t.secretDetails || 'N/A',
      Status: t.claimedStatus === 'claimed' ? 'Claimed & Handed Over' : 'Unclaimed',
      TotalClaimRequests: (t.claimRequests || []).length,
      PendingClaims: (t.claimRequests || []).filter(c => c.status === 'pending').length,
      ReportedAt: t.createdAt
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lost_And_Found');
    XLSX.writeFile(wb, 'CampusOne_Lost_And_Found_Registry.xlsx');
    showNotification('Exported CampusOne_Lost_And_Found_Registry.xlsx!', 'success');
  };

  // =========================================================================
  // STATE FOR VIEW 1: ALL SECTIONS & HOSTELS GRIEVANCE EXPLORER
  // =========================================================================
  const [explorerMode, setExplorerMode] = useState('sections'); // 'sections' | 'hostels' | 'all'
  const [selectedSectionCard, setSelectedSectionCard] = useState('CSE-B 3rd Year');
  const [selectedHostelCard, setSelectedHostelCard] = useState('Agastya Bhavan');
  const [stageFilter, setStageFilter] = useState('all'); // 'all' | 'approved_or_panel' | 'panel_only' | 'pending_stage1'
  const [respondingTicket, setRespondingTicket] = useState(null);
  const [respStatus, setRespStatus] = useState('in_progress');
  const [respAssignedTo, setRespAssignedTo] = useState('');
  const [respEta, setRespEta] = useState('');
  const [respNote, setRespNote] = useState('');
  const [quickReplyText, setQuickReplyText] = useState({});

  // =========================================================================
  // STATE FOR VIEW 2: USER & ROLE ACCESS CRUD + EXCEL IMPORT + BULK UPDATE
  // =========================================================================
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [hostelFilter, setHostelFilter] = useState('all');

  // Multi-select checkboxes for bulk CRUD
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [bulkHostel, setBulkHostel] = useState('');
  const [bulkSection, setBulkSection] = useState('');
  const [bulkDepartment, setBulkDepartment] = useState('');
  const [bulkRole, setBulkRole] = useState('');
  const [bulkPassword, setBulkPassword] = useState('');

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Excel import state
  const excelInputRef = useRef(null);
  const [excelPreviewRows, setExcelPreviewRows] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [csvPasteText, setCsvPasteText] = useState('');

  // Single New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'student123',
    role: 'student',
    department: 'CSE',
    classSection: 'CSE-B 3rd Year',
    hostel: 'Agastya Bhavan',
    room: '304',
    rollNo: ''
  });

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState('urgent');

  // =========================================================================
  // COMPUTED DATA FOR SECTIONS & HOSTELS EXPLORER
  // =========================================================================
  const sectionStats = useMemo(() => {
    return ALL_SECTIONS.map(sec => {
      const advisor = (userList || []).find(u => u.role === 'faculty_advisor' && u.classSection === sec);
      const studentsCount = (userList || []).filter(u => u.role === 'student' && u.classSection === sec).length;
      const secTickets = tickets.filter(t => t.classSection === sec && (t.scope === 'class' || t.scope === 'department'));
      const approvedCount = secTickets.filter(t => t.advisorApprovalStatus === 'approved' || t.advisorEndorsed).length;
      const advisorComplaintsCount = secTickets.filter(t => t.raisedByPanel === 'advisor' || t.raisedBy?.role === 'faculty_advisor').length;
      const pendingCount = secTickets.filter(t => t.advisorApprovalStatus === 'pending' && !t.raisedByPanel).length;
      return {
        section: sec,
        advisorName: advisor?.name || 'Assigned Faculty Advisor',
        advisorEmail: advisor?.email || '',
        studentsCount,
        totalTickets: secTickets.length,
        approvedCount,
        advisorComplaintsCount,
        pendingCount
      };
    });
  }, [userList, tickets]);

  const hostelStats = useMemo(() => {
    return ALL_HOSTELS.map(h => {
      const warden = (userList || []).find(u => u.role === 'hostel_warden' && u.hostel === h);
      const residentsCount = (userList || []).filter(u => u.role === 'student' && u.hostel === h).length;
      const hTickets = tickets.filter(t => t.hostel === h && (t.scope === 'room' || t.scope === 'hostel_generic'));
      const approvedCount = hTickets.filter(t => t.wardenApprovalStatus === 'approved' || t.wardenEndorsed).length;
      const wardenComplaintsCount = hTickets.filter(t => t.raisedByPanel === 'warden' || t.raisedBy?.role === 'hostel_warden').length;
      const pendingCount = hTickets.filter(t => t.wardenApprovalStatus === 'pending' && !t.raisedByPanel).length;
      return {
        hostel: h,
        wardenName: warden?.name || 'Resident Warden',
        wardenEmail: warden?.email || '',
        residentsCount,
        totalTickets: hTickets.length,
        approvedCount,
        wardenComplaintsCount,
        pendingCount
      };
    });
  }, [userList, tickets]);

  const activeExplorerTickets = useMemo(() => {
    let base = tickets;
    if (explorerMode === 'sections') {
      base = tickets.filter(t => t.classSection === selectedSectionCard && (t.scope === 'class' || t.scope === 'department'));
    } else if (explorerMode === 'hostels') {
      base = tickets.filter(t => t.hostel === selectedHostelCard && (t.scope === 'room' || t.scope === 'hostel_generic'));
    }

    return base.filter(t => {
      if (stageFilter === 'approved_or_panel') {
        return t.forwardedToAdmin || t.advisorEndorsed || t.wardenEndorsed || t.raisedByPanel;
      }
      if (stageFilter === 'panel_only') {
        return Boolean(t.raisedByPanel || t.raisedBy?.role === 'faculty_advisor' || t.raisedBy?.role === 'hostel_warden');
      }
      if (stageFilter === 'pending_stage1') {
        return !t.forwardedToAdmin && (t.advisorApprovalStatus === 'pending' || t.wardenApprovalStatus === 'pending');
      }
      return true;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [tickets, explorerMode, selectedSectionCard, selectedHostelCard, stageFilter]);

  const openRespondModal = (ticket) => {
    setRespondingTicket(ticket);
    setRespStatus(ticket.status === 'reported' ? 'in_progress' : ticket.status);
    setRespAssignedTo(ticket.assignedTo && !ticket.assignedTo.startsWith('Awaiting') ? ticket.assignedTo : 'Central Maintenance Squad');
    setRespEta(ticket.eta && !ticket.eta.startsWith('Pending') ? ticket.eta : 'Today by 5:00 PM');
    setRespNote(ticket.adminNote || '');
  };

  const handleSaveAdminResponse = (e) => {
    e.preventDefault();
    if (!respondingTicket) return;
    updateTicketAdmin(respondingTicket.id, {
      status: respStatus,
      assignedTo: respAssignedTo,
      eta: respEta,
      adminNote: respNote
    });
    if (respNote.trim()) {
      addComment(respondingTicket.id, `🛠️ Main Admin Official Response: ${respNote.trim()} (Assigned: ${respAssignedTo}, ETA: ${respEta})`);
    }
    setRespondingTicket(null);
  };

  const handleQuickAdminComment = (ticketId) => {
    const txt = quickReplyText[ticketId];
    if (!txt || !txt.trim()) return;
    updateTicketAdmin(ticketId, {
      status: 'in_progress',
      adminNote: txt.trim(),
      eta: 'Action Initiated by Main Admin'
    });
    addComment(ticketId, `👑 Main Admin Directive: ${txt.trim()}`);
    setQuickReplyText({ ...quickReplyText, [ticketId]: '' });
  };

  // =========================================================================
  // COMPUTED DATA & HANDLERS FOR USER CRUD & EXCEL MULTI-USER IMPORT
  // =========================================================================
  const filteredUsers = useMemo(() => {
    return (userList || []).filter(u => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesSection = sectionFilter === 'all' || u.classSection === sectionFilter;
      const matchesHostel = hostelFilter === 'all' || u.hostel === hostelFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.rollNo || '').toLowerCase().includes(q) ||
        (u.department || '').toLowerCase().includes(q) ||
        (u.classSection || '').toLowerCase().includes(q) ||
        (u.hostel || '').toLowerCase().includes(q);
      return matchesRole && matchesSection && matchesHostel && matchesSearch;
    });
  }, [userList, roleFilter, sectionFilter, hostelFilter, searchTerm]);

  const toggleSelectUser = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredUsers.map(u => u.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedUserIds.includes(id));
    if (allSelected) {
      setSelectedUserIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedUserIds(Array.from(new Set([...selectedUserIds, ...filteredIds])));
    }
  };

  const handleApplyBulkUpdate = (e) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      showNotification('Please select at least one student/user checkbox first!', 'info');
      return;
    }
    const updates = {};
    if (bulkHostel) updates.hostel = bulkHostel;
    if (bulkSection) updates.classSection = bulkSection;
    if (bulkDepartment) updates.department = bulkDepartment;
    if (bulkRole) updates.role = bulkRole;
    if (bulkPassword.trim()) updates.password = bulkPassword.trim();

    if (Object.keys(updates).length === 0) {
      showNotification('Select at least one option (e.g. Hostel Bhavan or Class Section) to update.', 'info');
      return;
    }

    bulkUpdateUsers(selectedUserIds, updates);
    setBulkHostel('');
    setBulkSection('');
    setBulkDepartment('');
    setBulkRole('');
    setBulkPassword('');
    setSelectedUserIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) return;
    bulkDeleteUsers(selectedUserIds);
    setSelectedUserIds([]);
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      showNotification('Please fill in all required fields!', 'info');
      return;
    }
    addNewUser(newUser);
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      password: 'student123',
      role: 'student',
      department: 'CSE',
      classSection: 'CSE-B 3rd Year',
      hostel: 'Agastya Bhavan',
      room: '304',
      rollNo: ''
    });
  };

  // Excel (.xlsx / .xls / .csv) File Upload Handler
  const handleExcelFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
        if (Array.isArray(jsonRows) && jsonRows.length > 0) {
          const normalized = jsonRows.map((r, i) => ({
            name: r.Name || r.name || r['Full Name'] || r.StudentName || `Student ${i + 1}`,
            rollNo: r.RollNo || r.rollNo || r['Roll No'] || r.ID || `CB.EN.U4CSE23${300 + i}`,
            email: r.Email || r.email || `user.batch${i + 1}@cb.amrita.edu`,
            password: r.Password || r.password || 'student123',
            role: (r.Role || r.role || 'student').toString().toLowerCase(),
            department: r.Department || r.department || r.Dept || 'CSE',
            classSection: r.ClassSection || r.classSection || r['Class Section'] || r.Section || 'CSE-B 3rd Year',
            hostel: r.Hostel || r.hostel || r['Hostel Bhavan'] || r.Bhavan || 'Agastya Bhavan',
            room: String(r.Room || r.room || r['Room No'] || 301 + i)
          }));
          setExcelPreviewRows(normalized);
          showNotification(`Parsed ${normalized.length} user records from "${file.name}"`, 'success');
        } else {
          showNotification('The uploaded Excel sheet appears empty.', 'info');
        }
      } catch (err) {
        console.error('Excel parse error:', err);
        showNotification('Could not parse file. Please upload a valid .xlsx, .xls, or .csv file.', 'info');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Download Sample Excel (.xlsx) Template
  const handleDownloadSampleExcel = () => {
    const sampleRows = [
      {
        Name: 'Karthik Subramanian',
        RollNo: 'CB.EN.U4CSE23201',
        Email: 'karthik.s@cb.amrita.edu',
        Password: 'student123',
        Role: 'student',
        Department: 'CSE',
        ClassSection: 'CSE-B 3rd Year',
        Hostel: 'Agastya Bhavan',
        Room: '305'
      },
      {
        Name: 'Meghana Nair',
        RollNo: 'CB.EN.U4CSE23202',
        Email: 'meghana.nair@cb.amrita.edu',
        Password: 'student123',
        Role: 'student',
        Department: 'CSE',
        ClassSection: 'CSE-B 3rd Year',
        Hostel: 'Gargi Bhavan',
        Room: '212'
      },
      {
        Name: 'Pranav Krishnan',
        RollNo: 'CB.EN.U4CSE23203',
        Email: 'pranav.k@cb.amrita.edu',
        Password: 'student123',
        Role: 'student',
        Department: 'CSE',
        ClassSection: 'CSE-A 3rd Year',
        Hostel: 'Agastya Bhavan',
        Room: '308'
      },
      {
        Name: 'Dr. Harishankar V.',
        RollNo: 'FAC.CSE.8890',
        Email: 'advisor.cse2@cb.amrita.edu',
        Password: 'advisor123',
        Role: 'faculty_advisor',
        Department: 'CSE',
        ClassSection: 'CSE-B 3rd Year',
        Hostel: '',
        Room: ''
      },
      {
        Name: 'Prof. Sudeep Menon',
        RollNo: 'WAR.AGA.09',
        Email: 'warden2.agastya@cb.amrita.edu',
        Password: 'warden123',
        Role: 'hostel_warden',
        Department: 'Hostel Administration',
        ClassSection: '',
        Hostel: 'Agastya Bhavan',
        Room: ''
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CampusOne_Users');
    XLSX.writeFile(wb, 'CampusOne_MultiUser_Import_Template.xlsx');
    showNotification('Downloaded CampusOne_MultiUser_Import_Template.xlsx!', 'success');
  };

  // Export Current Filtered Users to Excel (.xlsx)
  const handleExportUsersExcel = () => {
    const rows = filteredUsers.map(u => ({
      Name: u.name,
      RollNo: u.rollNo || '',
      Email: u.email || '',
      Password: u.password || 'student123',
      Role: u.role,
      Department: u.department || '',
      ClassSection: u.classSection || '',
      Hostel: u.hostel || '',
      Room: u.room || ''
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users_Export');
    XLSX.writeFile(wb, 'CampusOne_User_Registry_Export.xlsx');
    showNotification(`Exported ${rows.length} users to Excel!`, 'success');
  };

  // Load 1-Click Demo Excel Batch
  const handleLoadDemoExcelBatch = () => {
    const batch = [
      { name: 'Karthik Subramanian', rollNo: 'CB.EN.U4CSE23201', email: 'karthik.s@cb.amrita.edu', password: 'student123', role: 'student', department: 'CSE', classSection: 'CSE-B 3rd Year', hostel: 'Agastya Bhavan', room: '305' },
      { name: 'Meghana Nair', rollNo: 'CB.EN.U4CSE23202', email: 'meghana.nair@cb.amrita.edu', password: 'student123', role: 'student', department: 'CSE', classSection: 'CSE-B 3rd Year', hostel: 'Gargi Bhavan', room: '212' },
      { name: 'Pranav Krishnan', rollNo: 'CB.EN.U4CSE23203', email: 'pranav.k@cb.amrita.edu', password: 'student123', role: 'student', department: 'CSE', classSection: 'CSE-A 3rd Year', hostel: 'Agastya Bhavan', room: '308' },
      { name: 'Aditi Menon', rollNo: 'CB.EN.U4ECE23204', email: 'aditi.menon@cb.amrita.edu', password: 'student123', role: 'student', department: 'ECE', classSection: 'ECE-A 3rd Year', hostel: 'Maitreyi Bhavan', room: '118' },
      { name: 'Sanjay Vikram', rollNo: 'CB.EN.U4MECH23205', email: 'sanjay.v@cb.amrita.edu', password: 'student123', role: 'student', department: 'MECH', classSection: 'MECH-A 3rd Year', hostel: 'Vashistha Bhavan', room: '204' },
      { name: 'Nivedita Rao', rollNo: 'CB.EN.U4AIE23206', email: 'nivedita.rao@cb.amrita.edu', password: 'student123', role: 'student', department: 'AIE', classSection: 'AIE-A 3rd Year', hostel: 'Vyasa Bhavan', room: '109' }
    ];
    setExcelFileName('Demo_Batch_Students_Excel.xlsx');
    setExcelPreviewRows(batch);
  };

  // Parse pasted CSV/TSV text
  const handleParsePastedCSV = () => {
    if (!csvPasteText.trim()) return;
    const lines = csvPasteText.trim().split(/\r?\n/).filter(Boolean);
    const parsed = lines.map((line, idx) => {
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const [name, rollNo, email, role, department, classSection, hostel, room, password] = parts.map(s => (s || '').trim());
      if (idx === 0 && (name || '').toLowerCase() === 'name') return null;
      return {
        name: name || `Student ${idx + 1}`,
        rollNo: rollNo || `CB.EN.U4CSE23${400 + idx}`,
        email: email || `student.paste${idx}@cb.amrita.edu`,
        role: (role || 'student').toLowerCase(),
        department: department || 'CSE',
        classSection: classSection || 'CSE-B 3rd Year',
        hostel: hostel || 'Agastya Bhavan',
        room: room || '304',
        password: password || 'student123'
      };
    }).filter(Boolean);
    setExcelPreviewRows(parsed);
  };

  const handleConfirmExcelImport = async () => {
    if (excelPreviewRows.length === 0) return;
    await bulkImportUsers(excelPreviewRows);
    setExcelPreviewRows([]);
    setExcelFileName('');
    setCsvPasteText('');
    setShowExcelModal(false);
  };

  const handlePostBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    addAnnouncement({
      id: `anc_${Date.now()}`,
      message: broadcastMessage.trim(),
      severity: broadcastSeverity,
      author: currentUser.name,
      createdAt: 'Just now'
    });
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  // KPI metrics
  const totalTickets = tickets.length;
  const approvedOrPanelTickets = tickets.filter(t => t.forwardedToAdmin || t.advisorEndorsed || t.wardenEndorsed || t.raisedByPanel).length;
  const panelDirectCount = tickets.filter(t => t.raisedByPanel || t.raisedBy?.role === 'faculty_advisor' || t.raisedBy?.role === 'hostel_warden').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">

      {/* Supreme Main Admin Header Banner */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 text-charcoal-900 shadow-subtle">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-mono text-xs font-bold border border-purple-200 mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>MAIN ADMIN MASTER GOVERNANCE CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
              All Sections & Hostels Oversight + RBAC User Registry
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-3xl leading-relaxed">
              Welcome, <strong className="text-forest-950">{currentUser.name}</strong>. Click any <strong>Class Section</strong> or <strong>Hostel Bhavan</strong> below to inspect approved student problems and direct Advisor/Warden complaints, or manage role-based credentials, <strong>Multi-User Excel Imports</strong>, and <strong>Bulk Student CRUD updates</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { setConsoleView('user_crud'); setShowExcelModal(true); }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Multi-User Excel Import</span>
            </button>

            <button
              onClick={() => { setConsoleView('user_crud'); setShowAddUserModal(true); }}
              className="px-4 py-2.5 rounded-2xl bg-[#092d25] hover:bg-[#061c18] text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all"
              style={{ backgroundColor: '#092d25', color: '#ffffff' }}
            >
              <UserPlus className="w-4 h-4 text-mint-300" />
              <span>+ Add Single User</span>
            </button>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>Broadcast</span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-ivory-200">
          <div className="bg-ivory-50 border border-ivory-200 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-charcoal-500 uppercase">Total Registry Users</div>
            <div className="text-2xl font-black text-forest-950 mt-1">{(userList || []).length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Students, Advisors, Wardens & Admins
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-emerald-900 uppercase">Advisor / Warden Approved</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{approvedOrPanelTickets}</div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
              High Weightage (+20) Escalated Issues
            </div>
          </div>

          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-purple-900 uppercase">Panel Member Complaints</div>
            <div className="text-2xl font-black text-purple-800 mt-1">{panelDirectCount}</div>
            <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
              Raised by Advisors & Hostel Wardens
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-blue-900 uppercase">Sections & Bhavans</div>
            <div className="text-2xl font-black text-blue-800 mt-1">{ALL_SECTIONS.length} Sec • {ALL_HOSTELS.length} Hostels</div>
            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
              Click any card below to inspect & respond
            </div>
          </div>
        </div>

        {/* Main Console View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-ivory-200">
          <button
            onClick={() => setConsoleView('sections_explorer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              consoleView === 'sections_explorer'
                ? 'bg-[#092d25] text-white shadow-md'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={consoleView === 'sections_explorer' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <Layers className="w-4 h-4 text-mint-300" />
            <span>1. All Sections & Hostels Grievance Explorer ({totalTickets})</span>
          </button>

          <button
            onClick={() => setConsoleView('user_crud')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              consoleView === 'user_crud'
                ? 'bg-[#092d25] text-white shadow-md'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={consoleView === 'user_crud' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>2. User Credentials, Excel Multi-User Import & Bulk CRUD ({(userList || []).length})</span>
          </button>

          <button
            onClick={() => setConsoleView('governance_logs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              consoleView === 'governance_logs'
                ? 'bg-[#092d25] text-white shadow-md'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={consoleView === 'governance_logs' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>3. Broadcasts & Live Audit Logs</span>
          </button>

          <button
            onClick={() => setConsoleView('lost_found_claims')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
              consoleView === 'lost_found_claims'
                ? 'bg-[#092d25] text-white shadow-md'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
            style={consoleView === 'lost_found_claims' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
          >
            <PackageSearch className="w-4 h-4 text-amber-400" />
            <span>4. Lost & Found Custody & Claim Requests</span>
            {pendingClaimsCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] animate-pulse">
                {pendingClaimsCount} Pending
              </span>
            ) : (
              <span className="text-[10px] text-charcoal-400 font-mono">({lostFoundTickets.length})</span>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ALL SECTIONS & HOSTELS GRIEVANCE EXPLORER
          ("he will be having all the sections under him and if we click any section
           in that admin panel we can get all the problems related to that and he can respond accordingly")
          ========================================================================= */}
      {consoleView === 'sections_explorer' && (
        <div className="space-y-6">

          {/* Mode Toggle: Class Sections vs Hostel Bhavans vs All Combined */}
          <div className="bg-white border border-ivory-300 rounded-3xl p-6 shadow-subtle space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-forest-950">
                  Select a Class Section or Hostel Bhavan to Inspect & Respond
                </h2>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Click any section or hostel card below to view all student issues approved by the Advisor/Warden as well as direct complaints added by those panel members.
                </p>
              </div>

              <div className="flex items-center space-x-1.5 bg-ivory-100 p-1 rounded-2xl border border-ivory-300 self-start">
                <button
                  onClick={() => setExplorerMode('sections')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    explorerMode === 'sections'
                      ? 'bg-[#092d25] text-white shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-950'
                  }`}
                  style={explorerMode === 'sections' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Class Sections ({ALL_SECTIONS.length})</span>
                </button>

                <button
                  onClick={() => setExplorerMode('hostels')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    explorerMode === 'hostels'
                      ? 'bg-[#092d25] text-white shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-950'
                  }`}
                  style={explorerMode === 'hostels' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Hostel Bhavans ({ALL_HOSTELS.length})</span>
                </button>

                <button
                  onClick={() => setExplorerMode('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    explorerMode === 'all'
                      ? 'bg-[#092d25] text-white shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-950'
                  }`}
                  style={explorerMode === 'all' ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Campus ({tickets.length})</span>
                </button>
              </div>
            </div>

            {/* Interactive Class Section Cards */}
            {explorerMode === 'sections' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {sectionStats.map(sec => {
                  const isSelected = selectedSectionCard === sec.section;
                  return (
                    <div
                      key={sec.section}
                      onClick={() => setSelectedSectionCard(sec.section)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/90 border-2 border-emerald-600 shadow-md scale-[1.01]'
                          : 'bg-ivory-50/70 border-ivory-300 hover:bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-forest-950 flex items-center space-x-1.5">
                          <GraduationCap className="w-4 h-4 text-emerald-700" />
                          <span>{sec.section}</span>
                        </span>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          sec.totalTickets > 0 ? 'bg-emerald-600 text-white' : 'bg-ivory-200 text-charcoal-600'
                        }`}>
                          {sec.totalTickets} issues
                        </span>
                      </div>

                      <div className="text-[11px] text-charcoal-600 mt-1.5 truncate">
                        Advisor: <strong>{sec.advisorName}</strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-ivory-200 text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          ✓ {sec.approvedCount} Approved
                        </span>
                        {sec.advisorComplaintsCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                            📢 {sec.advisorComplaintsCount} Advisor Filed
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 ml-auto">
                          {sec.studentsCount} Students
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Interactive Hostel Bhavan Cards */}
            {explorerMode === 'hostels' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {hostelStats.map(h => {
                  const isSelected = selectedHostelCard === h.hostel;
                  return (
                    <div
                      key={h.hostel}
                      onClick={() => setSelectedHostelCard(h.hostel)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50/90 border-2 border-amber-600 shadow-md scale-[1.01]'
                          : 'bg-ivory-50/70 border-ivory-300 hover:bg-white hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-forest-950 flex items-center space-x-1.5">
                          <Home className="w-4 h-4 text-amber-700" />
                          <span>{h.hostel}</span>
                        </span>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          h.totalTickets > 0 ? 'bg-amber-600 text-white' : 'bg-ivory-200 text-charcoal-600'
                        }`}>
                          {h.totalTickets} issues
                        </span>
                      </div>

                      <div className="text-[11px] text-charcoal-600 mt-1.5 truncate">
                        Warden: <strong>{h.wardenName}</strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-ivory-200 text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          ✓ {h.approvedCount} Approved
                        </span>
                        {h.wardenComplaintsCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                            📢 {h.wardenComplaintsCount} Warden Filed
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 ml-auto">
                          {h.residentsCount} Residents
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Section / Hostel Problems List & Main Admin Response Console */}
          <div className="bg-white border border-ivory-300 rounded-3xl p-6 shadow-subtle space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-ivory-200">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black text-forest-950">
                    {explorerMode === 'sections'
                      ? `Problems in Section: ${selectedSectionCard}`
                      : explorerMode === 'hostels'
                      ? `Problems in Hostel: ${selectedHostelCard}`
                      : 'All Campus Problems Across Sections & Hostels'}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeExplorerTickets.length} Ticket(s)
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Issues approved by Class Advisor / Hostel Warden carry <strong>+20 Strong Approval Weightage</strong>. Respond below to dispatch teams or update status.
                </p>
              </div>

              {/* Stage Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Section Issues' },
                  { id: 'approved_or_panel', label: '✅ Approved / Escalated (+20)' },
                  { id: 'panel_only', label: '📢 Added by Advisor / Warden' },
                  { id: 'pending_stage1', label: '⏳ Pending Advisor/Warden' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setStageFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      stageFilter === st.id
                        ? 'bg-[#092d25] text-white'
                        : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                    }`}
                    style={stageFilter === st.id ? { backgroundColor: '#092d25', color: '#ffffff' } : {}}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {activeExplorerTickets.map(ticket => {
                const isPanelRaised = Boolean(ticket.raisedByPanel || ticket.raisedBy?.role === 'faculty_advisor' || ticket.raisedBy?.role === 'hostel_warden');
                const isApproved = ticket.advisorEndorsed || ticket.wardenEndorsed || ticket.advisorApprovalStatus === 'approved' || ticket.wardenApprovalStatus === 'approved';

                return (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-ivory-300 hover:border-emerald-400 p-5 bg-ivory-50/40 space-y-4 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <img
                          src={ticket.imageUrl}
                          alt={ticket.title}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-ivory-300"
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-charcoal-600">#{ticket.id}</span>

                            {ticket.classSection && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                🎓 {ticket.classSection}
                              </span>
                            )}
                            {ticket.hostel && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                                🏠 {ticket.hostel} {ticket.room ? `(Rm ${ticket.room})` : ''}
                              </span>
                            )}

                            {isPanelRaised && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                                📢 Direct {ticket.raisedByPanel === 'warden' ? 'Hostel Warden' : 'Class Advisor'} Complaint
                              </span>
                            )}

                            {isApproved ? (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                ⭐ Strong Approval (+20 Weightage)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                ⏳ Pending Advisor/Warden Stage-1 Review
                              </span>
                            )}

                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white border border-ivory-300 text-forest-950 font-bold">
                              Status: {ticket.status.replace('_', ' ')}
                            </span>
                          </div>

                          <h4
                            onClick={() => setSelectedTicketForDetail(ticket)}
                            className="text-base font-extrabold text-forest-950 hover:text-emerald-700 cursor-pointer"
                          >
                            {ticket.title}
                          </h4>

                          <p className="text-xs text-charcoal-700 leading-relaxed">
                            {ticket.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600 pt-1">
                            <span>📍 {ticket.location}</span>
                            <span>• 👤 Raised by: <strong>{ticket.raisedBy?.name}</strong> ({ticket.raisedBy?.rollNo})</span>
                            <span className="text-emerald-700 font-bold">• 👍 {ticket.upvotes?.length || 0} Confirmations</span>
                          </div>

                          {(ticket.advisorNote || ticket.wardenNote) && (
                            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                              <strong>Panel Endorsement Note: </strong>
                              <span>{ticket.advisorNote || ticket.wardenNote}</span>
                            </div>
                          )}

                          {ticket.adminNote && (
                            <div className="p-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-800">
                              <strong className="text-forest-950">Current Admin Response ({ticket.assignedTo}): </strong>
                              <span>{ticket.adminNote}</span>
                              {ticket.eta && <span className="ml-2 font-mono text-emerald-700 font-bold">[ETA: {ticket.eta}]</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Priority & Respond Button */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
                        <div className="px-3.5 py-2 rounded-2xl bg-white border border-ivory-300 text-center shadow-xs">
                          <div className="text-[10px] uppercase font-bold text-charcoal-500">Weightage</div>
                          <div className="text-base font-black text-forest-950 flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                            <span>{ticket.priorityScore}/100</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openRespondModal(ticket)}
                          className="btn-primary text-xs py-2.5 px-4 font-bold shadow-md flex items-center space-x-1.5"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Respond & Dispatch</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Quick Admin Response Input */}
                    <div className="pt-3 border-t border-ivory-200 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Quick response to ${ticket.classSection || ticket.hostel || 'this issue'} (updates status & notifies Advisor/Warden & Student)...`}
                        value={quickReplyText[ticket.id] || ''}
                        onChange={(e) => setQuickReplyText({ ...quickReplyText, [ticket.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdminComment(ticket.id); }}
                        className="input-field text-xs py-2 flex-1 bg-white"
                      />
                      <button
                        onClick={() => handleQuickAdminComment(ticket.id)}
                        className="px-4 py-2 rounded-xl bg-[#092d25] hover:bg-[#061c18] text-white text-xs font-bold flex items-center space-x-1.5 shrink-0"
                        style={{ backgroundColor: '#092d25', color: '#ffffff' }}
                      >
                        <Send className="w-3.5 h-3.5 text-mint-300" />
                        <span>Send Response</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {activeExplorerTickets.length === 0 && (
                <div className="text-center py-12 bg-ivory-50 rounded-2xl border border-ivory-200 p-6 text-charcoal-500 text-xs">
                  No tickets currently filed under this section/hostel filter. Click another section card above or switch the filter!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ROLE-BASED USER ACCESS, MULTI-USER EXCEL IMPORT & BULK CRUD
          ========================================================================= */}
      {consoleView === 'user_crud' && (
        <div className="bg-white border border-ivory-300 rounded-3xl p-6 shadow-subtle space-y-6">

          {/* Top Header & Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-ivory-200">
            <div>
              <h2 className="text-base font-extrabold text-forest-950 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Role-Based Access Credentials & Bulk Student/User CRUD</span>
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Select any student or group of students using the checkboxes below to bulk-update their <strong>Hostel Bhavan</strong>, <strong>Class Section</strong>, <strong>Department</strong>, or <strong>Role</strong> at once.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#092d25] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                style={{ backgroundColor: '#092d25', color: '#ffffff' }}
              >
                <UserPlus className="w-3.5 h-3.5 text-mint-300" />
                <span>+ Add Single User</span>
              </button>

              <button
                onClick={() => setShowExcelModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Multi-User Excel Import</span>
              </button>

              <button
                onClick={handleExportUsersExcel}
                className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 border border-ivory-300 text-xs font-bold flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Search & Multi-Dimension Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, roll no, email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-bold text-charcoal-800"
            >
              <option value="all">All Roles ({(userList || []).length})</option>
              <option value="student">Students</option>
              <option value="faculty_advisor">Class Advisors</option>
              <option value="hostel_warden">Hostel Resident Wardens</option>
              <option value="domain_admin">Domain Admins (HOD)</option>
              <option value="central_admin">Main Admin</option>
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-bold text-charcoal-800"
            >
              <option value="all">All Class Sections</option>
              {ALL_SECTIONS.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>

            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-bold text-charcoal-800"
            >
              <option value="all">All Hostel Bhavans</option>
              {ALL_HOSTELS.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* =========================================================================
              BULK CRUD OPERATIONS BAR (Change Hostel, Class Section, Dept, Role for 1 or Group of Students)
              ========================================================================= */}
          <form
            onSubmit={handleApplyBulkUpdate}
            className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
              selectedUserIds.length > 0
                ? 'bg-emerald-50/90 border-emerald-500 shadow-md'
                : 'bg-ivory-50 border-ivory-300'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                  selectedUserIds.length > 0 ? 'bg-emerald-600 text-white' : 'bg-ivory-200 text-charcoal-700'
                }`}>
                  {selectedUserIds.length} Selected
                </span>
                <span className="text-xs font-bold text-forest-950">
                  Bulk CRUD Operations — Update Hostel, Section, Dept, or Role for Selected Student(s):
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={toggleSelectAllFiltered}
                  className="px-2.5 py-1 rounded-lg bg-white border border-ivory-300 hover:bg-ivory-100 font-bold text-charcoal-700"
                >
                  Select All Filtered ({filteredUsers.length})
                </button>
                {selectedUserIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedUserIds([])}
                    className="px-2.5 py-1 rounded-lg bg-white border border-ivory-300 hover:bg-rose-50 font-bold text-rose-700"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-1">
              {/* Bulk Change Hostel Name */}
              <select
                value={bulkHostel}
                onChange={(e) => setBulkHostel(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs font-bold text-forest-950"
              >
                <option value="">Change Hostel Bhavan...</option>
                {ALL_HOSTELS.map(h => (
                  <option key={h} value={h}>🏠 Move to {h}</option>
                ))}
              </select>

              {/* Bulk Change Class Section */}
              <select
                value={bulkSection}
                onChange={(e) => setBulkSection(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs font-bold text-forest-950"
              >
                <option value="">Change Class Section...</option>
                {ALL_SECTIONS.map(sec => (
                  <option key={sec} value={sec}>🎓 Move to {sec}</option>
                ))}
              </select>

              {/* Bulk Change Department */}
              <select
                value={bulkDepartment}
                onChange={(e) => setBulkDepartment(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs font-bold text-forest-950"
              >
                <option value="">Change Department...</option>
                {ALL_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>🏢 Dept: {d}</option>
                ))}
              </select>

              {/* Bulk Change Role */}
              <select
                value={bulkRole}
                onChange={(e) => setBulkRole(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs font-bold text-forest-950"
              >
                <option value="">Change System Role...</option>
                <option value="student">Role: Student</option>
                <option value="faculty_advisor">Role: Class Advisor</option>
                <option value="hostel_warden">Role: Hostel Warden</option>
                <option value="domain_admin">Role: Domain Admin</option>
              </select>

              {/* Apply Bulk Update Button */}
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Bulk Update</span>
              </button>

              {/* Bulk Delete Button */}
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={selectedUserIds.length === 0}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border ${
                  selectedUserIds.length > 0
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
                    : 'bg-ivory-100 text-charcoal-400 border-ivory-200 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </form>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory-100 text-charcoal-600 border-b border-ivory-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id))}
                      onChange={toggleSelectAllFiltered}
                      className="rounded border-ivory-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">User / Roll No</th>
                  <th className="py-3 px-3">Login Credentials</th>
                  <th className="py-3 px-3">Assigned Role</th>
                  <th className="py-3 px-3">Class Section / Dept</th>
                  <th className="py-3 px-3">Hostel Bhavan & Room</th>
                  <th className="py-3 px-3 text-right">CRUD Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors ${isSelected ? 'bg-emerald-50/60' : 'hover:bg-ivory-50'}`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectUser(user.id)}
                          className="rounded border-ivory-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* User Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-ivory-300"
                          />
                          <div>
                            <div className="font-bold text-forest-950 text-xs">{user.name}</div>
                            <div className="text-[11px] text-charcoal-500 font-mono">
                              {user.rollNo || user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Credentials */}
                      <td className="py-3 px-3 font-mono text-charcoal-700">
                        <div className="text-xs font-semibold">{user.email}</div>
                        <div className="text-[11px] text-charcoal-500 flex items-center space-x-1 mt-0.5">
                          <Key className="w-3 h-3 text-amber-600" />
                          <span>pwd: <strong>{user.password || 'student123'}</strong></span>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="py-3 px-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                            user.role === 'student' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            user.role === 'faculty_advisor' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            user.role === 'hostel_warden' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                            user.role === 'domain_admin' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                            'bg-purple-50 text-purple-800 border-purple-200'
                          }`}
                        >
                          <option value="student">Student</option>
                          <option value="faculty_advisor">Class Advisor</option>
                          <option value="hostel_warden">Hostel Warden</option>
                          <option value="domain_admin">Domain Admin</option>
                          <option value="central_admin">Main Admin</option>
                        </select>
                      </td>

                      {/* Class Section / Dept Quick Selector */}
                      <td className="py-3 px-3">
                        {(user.role === 'student' || user.role === 'faculty_advisor') ? (
                          <select
                            value={user.classSection || 'CSE-B 3rd Year'}
                            onChange={(e) => updateUserCredentials(user.id, { classSection: e.target.value, department: e.target.value.split('-')[0] })}
                            className="px-2 py-1 rounded-lg bg-white border border-ivory-300 text-xs font-semibold text-forest-950 cursor-pointer"
                          >
                            {ALL_SECTIONS.map(sec => (
                              <option key={sec} value={sec}>{sec}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-charcoal-600 font-medium">{user.department || 'Campus Wide'}</span>
                        )}
                      </td>

                      {/* Hostel Bhavan & Room Quick Selector */}
                      <td className="py-3 px-3">
                        {(user.role === 'student' || user.role === 'hostel_warden') ? (
                          <div className="flex items-center space-x-1.5">
                            <select
                              value={user.hostel || 'Agastya Bhavan'}
                              onChange={(e) => updateUserCredentials(user.id, { hostel: e.target.value })}
                              className="px-2 py-1 rounded-lg bg-amber-50/70 border border-amber-200 text-xs font-bold text-amber-950 cursor-pointer"
                            >
                              {ALL_HOSTELS.map(h => (
                                <option key={h} value={h}>{h}</option>
                              ))}
                            </select>
                            {user.role === 'student' && (
                              <span className="text-[11px] font-mono text-charcoal-500">
                                Rm {user.room || '101'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-charcoal-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* CRUD Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => setEditingUser({ ...user })}
                            className="px-2.5 py-1 rounded-lg bg-[#092d25] hover:bg-[#061c18] text-white text-[11px] font-bold flex items-center space-x-1 shadow-xs"
                            style={{ backgroundColor: '#092d25', color: '#ffffff' }}
                          >
                            <Edit3 className="w-3 h-3 text-mint-300" />
                            <span>Edit</span>
                          </button>

                          {user.role !== 'central_admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: GOVERNANCE BROADCASTS & LIVE AUDIT TRAIL
          ========================================================================= */}
      {consoleView === 'governance_logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-ivory-300 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-sm font-bold text-forest-950 flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Active Campus Emergency Broadcasts</span>
              </h3>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                + New Alert
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(systemAnnouncements || []).map((anc) => (
                <div
                  key={anc.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                    anc.severity === 'urgent'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{anc.author}</span>
                    </span>
                    <span className="text-[10px] font-mono text-charcoal-500">{anc.createdAt}</span>
                  </div>
                  <p className="text-xs font-medium">{anc.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-ivory-300 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-sm font-bold text-forest-950 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Real-Time Security & CRUD Audit Log</span>
              </h3>
              <span className="text-[10px] font-mono bg-ivory-200 px-2 py-0.5 rounded-full text-charcoal-700">Live Sync</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto font-mono text-[11px]">
              {(auditLogs || []).map((log) => (
                <div key={log.id} className="p-2.5 bg-ivory-100 rounded-xl border border-ivory-200 flex items-center justify-between text-charcoal-800">
                  <div className="flex items-center space-x-2">
                    <span>{log.icon}</span>
                    <span className="font-bold">{log.action}</span>
                    <span className="text-charcoal-500">• {log.user}</span>
                  </div>
                  <span className="text-[10px] text-charcoal-400">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: LOST & FOUND REGISTRY & STUDENT CLAIM REQUESTS
          Central Admin Master Governance of all campus Lost & Found items and Claims
          ========================================================================= */}
      {consoleView === 'lost_found_claims' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top 4 Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-subtle">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Total Lost & Found Records</span>
              <div className="text-3xl font-black text-forest-950 mt-1">{lostFoundTickets.length}</div>
              <span className="text-[11px] text-charcoal-500 font-semibold mt-0.5 block">Campus-wide register</span>
            </div>

            <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-subtle">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">Active in Safe Custody</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">{custodyFoundTickets.length}</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Held in Department / Security</span>
            </div>

            <div className={`border rounded-2xl p-5 shadow-subtle ${
              pendingClaimsCount > 0 ? 'bg-amber-50/80 border-amber-300 text-amber-950' : 'bg-white border-ivory-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 uppercase block">Pending Claim Requests</span>
                {pendingClaimsCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <div className="text-3xl font-black text-amber-900 mt-1">{pendingClaimsCount}</div>
              <span className="text-[11px] text-amber-800 font-semibold mt-0.5 block">Students awaiting handover review</span>
            </div>

            <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-subtle">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Reunited / Handed Over</span>
              <div className="text-3xl font-black text-forest-950 mt-1">{handedOverCount}</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Successfully claimed & closed</span>
            </div>
          </div>

          {/* Search, Filter Toolbar & Excel Export */}
          <div className="bg-white border border-ivory-300 rounded-3xl p-5 shadow-subtle space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLnfAdminFilter('claims')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    lnfAdminFilter === 'claims'
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  <PackageSearch className="w-4 h-4" />
                  <span>Student Claim Requests ({allClaimRequests.length})</span>
                  {pendingClaimsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 text-[10px] font-black">
                      {pendingClaimsCount} Pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setLnfAdminFilter('custody')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    lnfAdminFilter === 'custody'
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Found in Custody ({custodyFoundTickets.length})</span>
                </button>

                <button
                  onClick={() => setLnfAdminFilter('lost')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    lnfAdminFilter === 'lost'
                      ? 'bg-blue-800 text-white shadow-md'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  <span>📢 Lost Item Alerts ({lostAlertTickets.length})</span>
                </button>

                <button
                  onClick={() => setLnfAdminFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    lnfAdminFilter === 'all'
                      ? 'bg-[#092d25] text-white shadow-md'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  All Items ({lostFoundTickets.length})
                </button>
              </div>

              {/* Actions & Export */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportLostFoundExcel}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Registry (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center space-x-3 pt-3 border-t border-ivory-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lnfSearch}
                  onChange={(e) => setLnfSearch(e.target.value)}
                  placeholder="Search by product name, claimant student, roll number, or custodial department office..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sub-View: Student Claims Queue */}
          {lnfAdminFilter === 'claims' && (
            <div className="space-y-4">
              {(() => {
                const filteredClaims = allClaimRequests.filter(c => {
                  if (!lnfSearch.trim()) return true;
                  const q = lnfSearch.toLowerCase();
                  return (
                    (c.claimant?.name || '').toLowerCase().includes(q) ||
                    (c.claimant?.rollNo || '').toLowerCase().includes(q) ||
                    (c.ticket?.title || '').toLowerCase().includes(q) ||
                    (c.ticket?.safekeepingLocation || '').toLowerCase().includes(q) ||
                    (c.proofDetails || '').toLowerCase().includes(q)
                  );
                });

                if (filteredClaims.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center text-charcoal-500 text-xs space-y-2">
                      <PackageSearch className="w-8 h-8 mx-auto text-charcoal-400" />
                      <p className="font-bold text-sm text-forest-950">No Student Claim Requests Found</p>
                      <p>When students click "Claim / Verify" on found items and submit their ownership proof, requests appear here for administrative verification.</p>
                    </div>
                  );
                }

                return filteredClaims.map(claim => (
                  <div 
                    key={claim.claimId}
                    className={`bg-white rounded-3xl border-2 p-6 shadow-subtle transition-all space-y-4 ${
                      claim.status === 'approved'
                        ? 'border-emerald-300'
                        : claim.status === 'rejected'
                        ? 'border-rose-200 opacity-80'
                        : 'border-amber-300 bg-amber-50/20'
                    }`}
                  >
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-forest-950 text-mint-300 font-black flex items-center justify-center text-base shadow">
                          {claim.claimant?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-base text-forest-950">{claim.claimant?.name}</span>
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-ivory-200 font-bold text-charcoal-800">
                              {claim.claimant?.rollNo}
                            </span>
                            <span className="text-xs text-charcoal-500">
                              • {claim.claimant?.classSection} • {claim.claimant?.hostel}
                            </span>
                          </div>
                          <div className="text-xs text-charcoal-600 mt-0.5">
                            Mobile Phone: <strong className="text-forest-950 font-mono">{claim.contactPhone || claim.claimant?.phone || 'N/A'}</strong> • Email: {claim.claimant?.email || 'N/A'} • Submitted: {new Date(claim.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-charcoal-400">Claim ID: {claim.claimId}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : claim.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                        }`}>
                          {claim.status === 'approved' ? '✓ Handed Over & Reunited' : claim.status === 'rejected' ? '✕ Claim Rejected' : '⚠️ Pending Verification'}
                        </span>
                      </div>
                    </div>

                    {/* Found Item Snapshot */}
                    <div className="flex flex-col md:flex-row gap-4 items-start bg-ivory-50/80 p-4 rounded-2xl border border-ivory-200">
                      <img 
                        src={claim.ticket?.imageUrl} 
                        alt={claim.ticket?.title}
                        className="w-24 h-24 rounded-2xl object-cover border border-ivory-300 shrink-0 shadow-sm"
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-charcoal-500">#{claim.ticket?.id}</span>
                          <span 
                            className="font-black text-base text-forest-950 hover:text-emerald-700 cursor-pointer" 
                            onClick={() => setSelectedTicketForDetail(claim.ticket)}
                          >
                            {claim.ticket?.title}
                          </span>
                        </div>
                        <div className="text-xs text-charcoal-700">
                          Current Custody Location: <strong className="text-emerald-800 font-bold">{claim.ticket?.safekeepingLocation || 'Department Office'}</strong>
                        </div>
                        <div className="text-xs text-charcoal-500">
                          Discovered at: {claim.ticket?.location} • Found Timing: {claim.ticket?.timings || 'Reported during class'} • Finder: {claim.ticket?.raisedBy?.name} ({claim.ticket?.raisedBy?.rollNo})
                        </div>
                      </div>
                    </div>

                    {/* Side-by-Side Proof Authentication Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-950 uppercase flex items-center space-x-1.5">
                            <Lock className="w-4 h-4 text-emerald-700" />
                            <span>1. Official Confidential Secret Record (From Finder):</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                            INTERNAL ONLY
                          </span>
                        </div>
                        <p className="text-emerald-950 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
                          {claim.ticket?.secretDetails || 'No private marks recorded.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950 uppercase flex items-center space-x-1.5">
                            <PackageSearch className="w-4 h-4 text-amber-700" />
                            <span>2. Claimant Student's Submitted Proof:</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                            CLAIM PROOF
                          </span>
                        </div>
                        <p className="text-amber-950 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200 text-xs">
                          "{claim.proofDetails}"
                        </p>
                        {claim.lostLocation && (
                          <div className="text-xs text-charcoal-700 pt-1">
                            Claimant Reported Lost Location: <strong>{claim.lostLocation}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Central Admin Verification Controls */}
                    {claim.status === 'pending' ? (
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-ivory-200">
                        <button
                          onClick={() => setSelectedTicketForDetail(claim.ticket)}
                          className="px-4 py-2 rounded-xl border border-ivory-300 hover:bg-ivory-100 text-charcoal-700 text-xs font-bold transition-all"
                        >
                          View Full Dossier
                        </button>
                        <button
                          onClick={() => {
                            const reason = window.prompt('Reason for rejecting this claim request:', 'Private markings and serial description did not match custodial record.');
                            if (reason !== null) {
                              reviewClaimRequest(claim.ticket.id, {
                                claimId: claim.claimId,
                                action: 'reject',
                                adminRemarks: reason
                              });
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold transition-all"
                        >
                          ✕ Reject Claim Request
                        </button>
                        <button
                          onClick={() => {
                            const confirmReturn = window.confirm(`Authorize official handover: Confirm that student ${claim.claimant?.name} (${claim.claimant?.rollNo}) has authenticated their ownership and presented their student ID?`);
                            if (confirmReturn) {
                              reviewClaimRequest(claim.ticket.id, {
                                claimId: claim.claimId,
                                action: 'approve',
                                adminRemarks: `Approved by Main Admin (${currentUser.name}). Ownership verified and item returned from ${claim.ticket?.safekeepingLocation || 'custody'}.`
                              });
                            }
                          }}
                          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✓ Approve Claim & Complete Handover</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-ivory-100 border border-ivory-200 text-xs text-charcoal-800 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong>Administrative Decision:</strong> {claim.adminRemarks}
                        </div>
                        {claim.reviewedBy && (
                          <div className="text-[11px] text-charcoal-500 font-mono">
                            Authenticated by: <strong>{claim.reviewedBy.name}</strong> ({new Date(claim.reviewedAt).toLocaleDateString()})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Sub-View: Inventory List (Custody, Lost, or All) */}
          {lnfAdminFilter !== 'claims' && (
            <div className="space-y-4">
              {(() => {
                const list = (
                  lnfAdminFilter === 'custody' 
                    ? custodyFoundTickets 
                    : lnfAdminFilter === 'lost' 
                    ? lostAlertTickets 
                    : lostFoundTickets
                ).filter(item => {
                  if (!lnfSearch.trim()) return true;
                  const q = lnfSearch.toLowerCase();
                  return (
                    (item.title || '').toLowerCase().includes(q) ||
                    (item.safekeepingLocation || '').toLowerCase().includes(q) ||
                    (item.location || '').toLowerCase().includes(q) ||
                    (item.raisedBy?.name || '').toLowerCase().includes(q) ||
                    (item.raisedBy?.rollNo || '').toLowerCase().includes(q)
                  );
                });

                if (list.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center text-charcoal-500 text-xs">
                      No matching Lost & Found inventory records found.
                    </div>
                  );
                }

                return list.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-ivory-300 hover:border-charcoal-400 p-5 shadow-subtle transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-ivory-300" />
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-charcoal-500 font-bold">{item.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.lostFoundType === 'found' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300'
                            }`}>
                              {item.lostFoundType === 'found' ? 'Found Item in Custody' : 'Lost Alert Broadcast'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.claimedStatus === 'claimed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {item.claimedStatus === 'claimed' ? '✓ Claimed / Handed Over' : 'Unclaimed'}
                            </span>
                            {(item.claimRequests || []).length > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                                {(item.claimRequests || []).length} Claim Requests
                              </span>
                            )}
                          </div>
                          <h4 onClick={() => setSelectedTicketForDetail(item)} className="text-base font-extrabold text-forest-950 hover:text-emerald-700 cursor-pointer">
                            {item.title}
                          </h4>
                          <div className="text-xs text-charcoal-600">
                            {item.safekeepingLocation ? `Custody: ${item.safekeepingLocation}` : `Location: ${item.location}`} • Reported by {item.raisedBy?.name} ({item.raisedBy?.rollNo})
                          </div>
                          {item.secretDetails && (
                            <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              <strong>Confidential Secret Marks:</strong> {item.secretDetails}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => setSelectedTicketForDetail(item)}
                          className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <PackageSearch className="w-3.5 h-3.5 text-mint-300" />
                          <span>Manage Custody & Claims</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: MAIN ADMIN RESPOND & DISPATCH MODAL (FOR SECTION / HOSTEL TICKET)
          ========================================================================= */}
      {respondingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="text-base font-bold text-forest-950">
                  Main Admin Response — #{respondingTicket.id}
                </h3>
                <p className="text-xs text-charcoal-500 truncate max-w-sm">
                  {respondingTicket.classSection || respondingTicket.hostel} • {respondingTicket.title}
                </p>
              </div>
              <button onClick={() => setRespondingTicket(null)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminResponse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-forest-950 mb-1">Set Resolution Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'reported', label: 'Reported / Under Review' },
                    { id: 'in_progress', label: 'In Progress (Dispatched)' },
                    { id: 'awaiting_verification', label: 'Fixed — Await Student Sign-off ⭐' },
                    { id: 'resolved', label: 'Resolved & Closed' }
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setRespStatus(st.id)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        respStatus === st.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                          : 'bg-ivory-50 border-ivory-200 text-charcoal-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-950 mb-1">Assign Department Lead / Technician</label>
                <input
                  type="text"
                  value={respAssignedTo}
                  onChange={(e) => setRespAssignedTo(e.target.value)}
                  placeholder="e.g. Kishore V. (Electrical & AV) or Suresh Babu (Civil)"
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-950 mb-1">Target Completion ETA</label>
                <input
                  type="text"
                  value={respEta}
                  onChange={(e) => setRespEta(e.target.value)}
                  placeholder="e.g. Today by 4:30 PM"
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-950 mb-1">Official Main Admin Response Note</label>
                <textarea
                  rows={3}
                  value={respNote}
                  onChange={(e) => setRespNote(e.target.value)}
                  placeholder="Write official response visible to the student and their Class Advisor / Hostel Warden..."
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRespondingTicket(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-md"
                >
                  Save & Dispatch Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: MULTI-USER IMPORT FROM EXCEL DATA (.XLSX / .CSV / PASTE / DEMO BATCH)
          ========================================================================= */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-forest-950 flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span>Multi-User Bulk Provisioning from Excel / CSV Data</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Upload an Excel workbook (<code>.xlsx</code>, <code>.xls</code>, <code>.csv</code>), load a sample batch, or paste rows from Excel to create role-based credentials for multiple users at a time.
                </p>
              </div>
              <button onClick={() => setShowExcelModal(false)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Upload / Template / Demo Batch Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  ref={excelInputRef}
                  onChange={handleExcelFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => excelInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-dashed border-emerald-400 text-emerald-950 font-bold flex flex-col items-center justify-center space-y-1.5 transition-all"
                >
                  <Upload className="w-5 h-5 text-emerald-700" />
                  <span>Upload Excel / CSV File</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Supports .xlsx, .xls, .csv</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemoExcelBatch}
                  className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 font-bold flex flex-col items-center justify-center space-y-1.5 transition-all"
                >
                  <Sparkles className="w-5 h-5 text-blue-700" />
                  <span>Load Sample Excel Batch (6 Users)</span>
                  <span className="text-[10px] text-blue-700 font-normal">1-click instant preview</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSampleExcel}
                  className="p-4 rounded-2xl bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 text-forest-950 font-bold flex flex-col items-center justify-center space-y-1.5 transition-all"
                >
                  <Download className="w-5 h-5 text-forest-900" />
                  <span>Download Sample .xlsx Template</span>
                  <span className="text-[10px] text-charcoal-500 font-normal">Pre-formatted Excel columns</span>
                </button>
              </div>

              {/* Optional Paste from Excel / CSV */}
              <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest-950">
                    Or Paste Rows Directly from Excel / CSV (Name, RollNo, Email, Role, Dept, ClassSection, Hostel, Room, Password):
                  </span>
                  <button
                    type="button"
                    onClick={handleParsePastedCSV}
                    className="px-3 py-1 rounded-lg bg-[#092d25] text-white font-bold text-[11px]"
                    style={{ backgroundColor: '#092d25', color: '#ffffff' }}
                  >
                    Parse Pasted Rows
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={csvPasteText}
                  onChange={(e) => setCsvPasteText(e.target.value)}
                  placeholder="Example: Karthik S, CB.EN.U4CSE23210, karthik@cb.amrita.edu, student, CSE, CSE-B 3rd Year, Agastya Bhavan, 309, student123"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-ivory-300 font-mono text-[11px]"
                />
              </div>

              {/* Preview Table of Parsed Excel Rows */}
              {excelPreviewRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-forest-950">
                      Previewing {excelPreviewRows.length} Users Ready for Import {excelFileName ? `(${excelFileName})` : ''}:
                    </span>
                    <button
                      type="button"
                      onClick={() => setExcelPreviewRows([])}
                      className="text-rose-600 hover:underline font-bold"
                    >
                      Clear Preview
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-ivory-300 rounded-2xl max-h-60">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-ivory-100 text-charcoal-700 border-b border-ivory-200 font-bold uppercase">
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Roll No</th>
                          <th className="py-2 px-3">Email</th>
                          <th className="py-2 px-3">Password</th>
                          <th className="py-2 px-3">Role</th>
                          <th className="py-2 px-3">Class Section</th>
                          <th className="py-2 px-3">Hostel Bhavan</th>
                          <th className="py-2 px-3">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ivory-200">
                        {excelPreviewRows.map((r, i) => (
                          <tr key={i} className="bg-white">
                            <td className="py-2 px-3 font-bold text-forest-950">{r.name}</td>
                            <td className="py-2 px-3 font-mono">{r.rollNo}</td>
                            <td className="py-2 px-3 font-mono">{r.email}</td>
                            <td className="py-2 px-3 font-mono text-emerald-700">{r.password}</td>
                            <td className="py-2 px-3 uppercase font-bold">{r.role}</td>
                            <td className="py-2 px-3">{r.classSection}</td>
                            <td className="py-2 px-3">{r.hostel}</td>
                            <td className="py-2 px-3">{r.room}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-ivory-200 flex items-center justify-end space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowExcelModal(false)}
                className="px-4 py-2 rounded-xl bg-ivory-200 text-charcoal-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={excelPreviewRows.length === 0}
                onClick={handleConfirmExcelImport}
                className={`px-5 py-2 rounded-xl font-extrabold text-xs shadow-md flex items-center space-x-1.5 ${
                  excelPreviewRows.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-ivory-200 text-charcoal-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Import All {excelPreviewRows.length} Users into Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD SINGLE USER MODAL
          ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Create Role-Based User Credentials</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Manohar R."
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Assign Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-bold"
                  >
                    <option value="student">Student</option>
                    <option value="faculty_advisor">Class Advisor</option>
                    <option value="hostel_warden">Hostel Resident Warden</option>
                    <option value="domain_admin">Domain Admin (HOD)</option>
                    <option value="central_admin">Main Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@cb.amrita.edu"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="student123"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Roll No / Staff ID</label>
                  <input
                    type="text"
                    value={newUser.rollNo}
                    onChange={(e) => setNewUser({ ...newUser, rollNo: e.target.value })}
                    placeholder="CB.EN.U4CSE23099"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Department</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold"
                  >
                    {ALL_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(newUser.role === 'student' || newUser.role === 'faculty_advisor') && (
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Assigned Class Section</label>
                  <select
                    value={newUser.classSection}
                    onChange={(e) => setNewUser({ ...newUser, classSection: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-bold"
                  >
                    {ALL_SECTIONS.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              )}

              {(newUser.role === 'student' || newUser.role === 'hostel_warden') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal-700 mb-1">Hostel Bhavan</label>
                    <select
                      value={newUser.hostel}
                      onChange={(e) => setNewUser({ ...newUser, hostel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-bold"
                    >
                      {ALL_HOSTELS.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  {newUser.role === 'student' && (
                    <div>
                      <label className="block font-bold text-charcoal-700 mb-1">Room Number</label>
                      <input
                        type="text"
                        value={newUser.room}
                        onChange={(e) => setNewUser({ ...newUser, room: e.target.value })}
                        placeholder="304"
                        className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-ivory-200 text-charcoal-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md"
                >
                  Provision User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: EDIT SINGLE USER FULL DETAILS & CREDENTIALS (CRUD UPDATE)
          ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>Update User Details & Credentials</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Modify Role, Hostel Bhavan, Class Section, Room, or Login Credentials
                </p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUserCredentials(editingUser.id, editingUser);
                setEditingUser(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Roll No / Staff ID</label>
                  <input
                    type="text"
                    value={editingUser.rollNo || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Email (Login ID)</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={editingUser.password || 'student123'}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono text-emerald-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">System Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-bold"
                  >
                    <option value="student">Student</option>
                    <option value="faculty_advisor">Class Advisor</option>
                    <option value="hostel_warden">Hostel Resident Warden</option>
                    <option value="domain_admin">Domain Admin (HOD)</option>
                    <option value="central_admin">Main Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Department</label>
                  <select
                    value={editingUser.department || 'CSE'}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold"
                  >
                    {ALL_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Class Section</label>
                  <select
                    value={editingUser.classSection || 'CSE-B 3rd Year'}
                    onChange={(e) => setEditingUser({ ...editingUser, classSection: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold"
                  >
                    {ALL_SECTIONS.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Hostel Bhavan</label>
                  <select
                    value={editingUser.hostel || 'Agastya Bhavan'}
                    onChange={(e) => setEditingUser({ ...editingUser, hostel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold"
                  >
                    {ALL_HOSTELS.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Room No</label>
                  <input
                    type="text"
                    value={editingUser.room || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, room: e.target.value })}
                    placeholder="304"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-ivory-200 text-charcoal-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Updated Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: BROADCAST EMERGENCY ALERT MODAL
          ========================================================================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <span>Broadcast Campus Alert</span>
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Announcement Text</label>
                <textarea
                  rows="3"
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter campus-wide announcement..."
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Severity</label>
                <select
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold"
                >
                  <option value="urgent">⚠️ Urgent Warning</option>
                  <option value="info">📢 General Information</option>
                </select>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-ivory-200 text-charcoal-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400 shadow-md"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
