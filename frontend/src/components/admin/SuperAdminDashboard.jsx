import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/mockData';
import { 
  ShieldAlert, 
  Users, 
  UserPlus, 
  Activity, 
  Megaphone, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Key, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Layers, 
  FileText,
  BarChart3,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { 
    currentUser, 
    tickets, 
    updateTicketAdmin, 
    showNotification,
    systemAnnouncements,
    addAnnouncement,
    userList,
    addNewUser,
    updateUserRole,
    updateUserCredentials,
    auditLogs
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // { id, name, email, password, role }

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'CSE',
    classSection: 'CSE-A 1st Year',
    rollNo: ''
  });

  // New announcement form state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState('urgent'); // 'urgent' | 'info' | 'maintenance'

  // Filtered users
  const filteredUsers = (userList || USERS).filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Calculate live site stats
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const pendingTickets = tickets.filter(t => t.status === 'reported' || t.status === 'awaiting_verification').length;
  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

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
      password: '',
      role: 'student',
      department: 'CSE',
      classSection: 'CSE-A 1st Year',
      rollNo: ''
    });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Supreme Banner Header - Official Institutional Palette */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 text-charcoal-900 shadow-subtle relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-mono text-xs font-bold border border-purple-200 mb-3 shadow-subtle">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>OVERALL ADMIN MASTER CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
              Website Command & Governance Center
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
              Welcome, <strong className="text-forest-950">{currentUser.name}</strong>. As the <strong>Overall Admin</strong>, you have root authority to register & control credentials for all students, class advisors, and department heads across the institution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs shadow-subtle flex items-center space-x-2 transition-all"
            >
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>Broadcast Announcement</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all"
            >
              <UserPlus className="w-4 h-4 text-mint-300" />
              <span>Register New User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Website Health & Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Total Database Users</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-2">
            {(userList || USERS).length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>4 Pre-seeded Roles Active</span>
          </div>
        </div>

        <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Grievance Resolution</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-2">
            {resolutionRate}%
          </div>
          <div className="text-[11px] text-charcoal-500 mt-1">
            {resolvedTickets} Solved out of {totalTickets} Reported
          </div>
        </div>

        <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Website SLA Status</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            94.8% SLA
          </div>
          <div className="text-[11px] text-charcoal-500 mt-1">
            Avg Turnaround: 4.2 Hours
          </div>
        </div>

        <div className="bg-white border border-ivory-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">System Health & Latency</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-2 flex items-center space-x-2">
            <span>Operational</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-charcoal-500 mt-1 font-mono">
            API Latency: 18ms • 99.9% Uptime
          </div>
        </div>

      </div>

      {/* Main Section: User & Role Management Console */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200">
          <div>
            <h2 className="text-base font-bold text-forest-950 flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Website User & Role Management Database</span>
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Inspect, edit roles, reset credentials, or add new accounts across the 4 primary personas.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user, email, dept..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-semibold text-charcoal-800 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty_advisor">Class Advisors</option>
              <option value="dept_admin">Dept Heads (HOD)</option>
              <option value="super_admin">Overall Admins</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-ivory-100 text-charcoal-600 border-b border-ivory-200 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User Info</th>
                <th className="py-3 px-4">Pre-seeded Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Dept / Section</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-ivory-50 transition-colors">
                  
                  {/* User Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-ivory-300"
                      />
                      <div>
                        <div className="font-bold text-forest-950 text-xs">{user.name}</div>
                        <div className="text-[11px] text-charcoal-500 font-mono">
                          {user.rollNo || user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email & Password */}
                  <td className="py-3.5 px-4 font-mono text-charcoal-700">
                    <div className="text-xs font-semibold">{user.email || `${user.id}@campusone.edu`}</div>
                    <div className="text-[11px] text-charcoal-400 font-mono mt-0.5 flex items-center space-x-1">
                      <Key className="w-3 h-3 text-amber-500" />
                      <span>pwd: {user.password || '••••••••'}</span>
                    </div>
                  </td>

                  {/* Role Selector */}
                  <td className="py-3.5 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        user.role === 'student' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        user.role === 'faculty_advisor' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        user.role === 'dept_admin' || user.role === 'domain_admin' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      <option value="student">Student</option>
                      <option value="faculty_advisor">Class Advisor</option>
                      <option value="dept_admin">Dept Head (HOD)</option>
                      <option value="super_admin">Overall Admin</option>
                    </select>
                  </td>

                  {/* Dept / Section */}
                  <td className="py-3.5 px-4 text-charcoal-700 font-medium">
                    {user.classSection || user.department || 'Campus Wide'}
                  </td>

                  {/* Actions: Edit Credentials */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => setEditingUser({
                        id: user.id,
                        name: user.name,
                        email: user.email || `${user.id}@campusone.edu`,
                        password: user.password || 'student123',
                        role: user.role
                      })}
                      className="px-2.5 py-1 rounded-lg bg-forest-900 hover:bg-forest-850 text-white text-[11px] font-bold flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <Edit3 className="w-3 h-3 text-mint-300" />
                      <span>Edit Credentials</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Broadcast Announcements & System Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Campus Broadcasts */}
        <div className="lg:col-span-6 bg-white border border-ivory-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <h3 className="text-sm font-bold text-forest-950 flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>Active Website Emergency Broadcasts</span>
            </h3>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + New Alert
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(systemAnnouncements || [
              {
                id: 'anc_1',
                message: '🚨 Scheduled Electrical Transformer Maintenance at Academic Block 1 on Sunday 2 PM to 5 PM.',
                severity: 'urgent',
                author: 'Dr. K. Subramanian (Campus Director)',
                createdAt: '1 Hour ago'
              },
              {
                id: 'anc_2',
                message: '🏆 GENESIS\'26 Hackathon Grievance Resolution Portal Live Voting active.',
                severity: 'info',
                author: 'Central Administration',
                createdAt: '3 Hours ago'
              }
            ]).map((anc) => (
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

        {/* System Security Audit Log */}
        <div className="lg:col-span-6 bg-white border border-ivory-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <h3 className="text-sm font-bold text-forest-950 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>System Real-Time Audit Log</span>
            </h3>
            <span className="text-[10px] font-mono bg-ivory-200 px-2 py-0.5 rounded-full text-charcoal-700">Live Sync</span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto font-mono text-[11px]">
            {(auditLogs || [
              { id: 'al_1', action: 'User Authenticated', user: 'Arjun K. (Student)', timestamp: '2 mins ago', icon: '🔑' },
              { id: 'al_2', action: 'Advisor Endorsement Added', user: 'Dr. Ramesh Kumar (Advisor)', timestamp: '15 mins ago', icon: '⭐' },
              { id: 'al_3', action: 'Technician Dispatched (TICK-101)', user: 'Dr. S. N. Rao (Dept Head)', timestamp: '40 mins ago', icon: '🔧' },
              { id: 'al_4', action: 'Verification Confirmed & Closed', user: 'Arjun K. (Student)', timestamp: '1 hour ago', icon: '✅' }
            ]).map((log) => (
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Add New User to Database</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="priya@campusone.edu"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Assign Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="faculty_advisor">Class Advisor</option>
                    <option value="dept_admin">Dept Head (HOD)</option>
                    <option value="super_admin">Overall Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="CSE / ECE / MECH"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none"
                  />
                </div>
              </div>

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
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Create User
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <span>Broadcast Emergency Campus Alert</span>
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
                  placeholder="e.g. ⚠️ Campus power shutdown scheduled tomorrow between 10 AM and 1 PM for grid upgrade."
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Severity / Style</label>
                <select
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold focus:outline-none"
                >
                  <option value="urgent">⚠️ Urgent Warning (Amber High Alert)</option>
                  <option value="info">📢 Information / Event Update (Emerald Notice)</option>
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

      {/* Edit Credentials & Role Modal (Controlled by Overall Admin) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-ivory-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="text-base font-bold text-forest-950 flex items-center space-x-2">
                  <Key className="w-5 h-5 text-amber-600" />
                  <span>Edit Account Credentials</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-0.5">Overall Administrator Control</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updateUserCredentials(editingUser.id, {
                  name: editingUser.name,
                  email: editingUser.email,
                  password: editingUser.password,
                  role: editingUser.role
                });
                setEditingUser(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Assigned Email (Username)</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Account Password</label>
                <input
                  type="text"
                  required
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-800 font-bold"
                />
                <span className="text-[10px] text-charcoal-400 mt-0.5 block">Stored directly in database session for 1-click verification</span>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">User System Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 font-bold focus:outline-none"
                >
                  <option value="student">Student (Rise the Voice Only)</option>
                  <option value="faculty_advisor">Class Advisor (CSE-B Supervision)</option>
                  <option value="dept_admin">Dept Head (HOD - Department Operations)</option>
                  <option value="super_admin">Overall Admin (Master Website Control)</option>
                </select>
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
                  <span>Save Account Details</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
