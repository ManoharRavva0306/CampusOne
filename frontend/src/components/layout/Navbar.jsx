import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Layers, 
  PlusCircle, 
  Wrench, 
  GraduationCap, 
  BarChart3, 
  ChevronDown, 
  RotateCcw,
  Bell,
  Sparkles,
  ExternalLink,
  Film,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import RoleSwitcherModal from './RoleSwitcherModal';

export default function Navbar({ onToggleLanding }) {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    resetDemoData, 
    tickets 
  } = useApp();
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Tickets awaiting verification from the current student
  const pendingVerificationCount = tickets.filter(
    t => t.raisedBy.id === currentUser.id && t.status === 'awaiting_verification'
  ).length;

  // Recent activity / notifications
  const recentUpdates = [
    {
      id: 'n1',
      title: 'Technician Assigned',
      desc: 'Vignesh (AV Team) dispatched to Room 302 with optical HDMI cable.',
      time: '25m ago',
      type: 'assignment'
    },
    {
      id: 'n2',
      title: 'Verification Needed',
      desc: 'Ceiling fan in Room 304 marked fixed. Please confirm on-site.',
      time: '45m ago',
      type: 'action',
      urgent: pendingVerificationCount > 0
    },
    {
      id: 'n3',
      title: 'Advisor Endorsement',
      desc: 'Dr. Ramesh Kumar endorsed ticket #TICK-101 (+20 priority).',
      time: '1h ago',
      type: 'endorse'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Platform Tag */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
              <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center shadow-md font-bold text-mint-300 text-sm">
                C1
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold tracking-tight text-forest-950">CampusOne</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20">
                    GENESIS'26
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-500 hidden sm:block">Amrita Vishwa Vidyapeetham • CMRS Portal</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'feed'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-forest-950 hover:bg-ivory-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Issue Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('raise')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'raise'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-forest-950 hover:bg-ivory-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                <span>Domain Console</span>
              </button>

              <button
                onClick={() => setActiveTab('advisor')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'advisor'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-forest-950 hover:bg-ivory-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Advisor Desk</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-forest-950 hover:bg-ivory-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>SLA Metrics</span>
              </button>
            </nav>

            {/* Right Tools: Story Mode, Notification, Persona Switcher */}
            <div className="flex items-center space-x-2">
              
              {/* Toggle Landing / Storytelling */}
              <button
                onClick={onToggleLanding}
                title="View Cinematic Story"
                className="p-2 rounded-xl text-charcoal-700 hover:text-forest-950 hover:bg-ivory-200 transition-colors hidden sm:flex items-center space-x-1 text-xs font-medium"
              >
                <Film className="w-4 h-4 text-emerald-600" />
                <span className="hidden lg:inline">Story</span>
              </button>

              {/* Reset Demo button */}
              <button 
                onClick={resetDemoData}
                title="Reset demo data"
                className="p-2 rounded-xl text-charcoal-500 hover:text-charcoal-900 hover:bg-ivory-200 transition-colors hidden xl:block"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-charcoal-700 hover:text-forest-950 hover:bg-ivory-200 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {pendingVerificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white status-pulse" />
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-ivory-300 rounded-2xl shadow-xl z-50 p-4 animate-scale-in">
                    <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                      <div className="text-xs font-bold text-forest-950 uppercase tracking-wide">
                        Activity Updates
                      </div>
                      <button onClick={() => setShowNotifications(false)} className="text-charcoal-400 hover:text-charcoal-900">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                      {recentUpdates.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            n.urgent 
                              ? 'bg-amber-50/80 border-amber-300/80' 
                              : 'bg-ivory-100 border-ivory-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-forest-950">{n.title}</span>
                            <span className="text-[10px] text-charcoal-500 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-charcoal-700 mt-1">{n.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-ivory-200 text-center">
                      <span className="text-[10px] text-charcoal-500">Live CampusOne Event Stream</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Role Selector Pill */}
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex items-center space-x-2 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 px-3 py-1.5 rounded-xl transition-all shadow-subtle"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  {pendingVerificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-forest-950 flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="text-[10px] text-charcoal-500 truncate max-w-[120px]">
                    {currentUser.classSection || currentUser.domainTitle || currentUser.department}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500" />
              </button>

            </div>

          </div>

          {/* Mobile Bottom Sub-nav */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-ivory-200 text-xs bg-white">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center py-1 ${activeTab === 'feed' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Feed</span>
            </button>
            <button
              onClick={() => setActiveTab('raise')}
              className={`flex flex-col items-center py-1 ${activeTab === 'raise' ? 'text-emerald-600 font-bold' : 'text-charcoal-500'}`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center py-1 ${activeTab === 'admin' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <Wrench className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex flex-col items-center py-1 ${activeTab === 'advisor' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Advisor</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center py-1 ${activeTab === 'analytics' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>SLA</span>
            </button>
          </div>

        </div>
      </header>

      {/* Role Switcher Modal */}
      {showRoleModal && (
        <RoleSwitcherModal onClose={() => setShowRoleModal(false)} />
      )}
    </>
  );
}
