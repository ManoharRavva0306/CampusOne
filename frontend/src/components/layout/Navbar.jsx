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
  X,
  Home,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({ onToggleLanding }) {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    resetDemoData, 
    tickets,
    logout,
    showLoginModal,
    setShowLoginModal
  } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);

  // Tickets awaiting verification from the current student
  const pendingVerificationCount = currentUser ? tickets.filter(
    t => t.raisedBy?.id === currentUser?.id && t.status === 'awaiting_verification'
  ).length : 0;

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
            <nav className="hidden md:flex items-center space-x-1.5">
              <button
                onClick={onToggleLanding}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec]"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) setShowLoginModal(true);
                  else setActiveTab('feed');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'feed'
                    ? 'bg-[#092d25] text-white shadow-md'
                    : 'text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec]'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${activeTab === 'feed' ? 'text-mint-300' : 'text-charcoal-500'}`} />
                <span>Issue Feed</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) setShowLoginModal(true);
                  else setActiveTab('raise');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'raise'
                    ? 'bg-[#13a879] text-white shadow-md'
                    : 'text-[#0e6e52] hover:bg-[#e6faf2] border border-emerald-300/60'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) setShowLoginModal(true);
                  else setActiveTab('admin');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-[#092d25] text-white shadow-md'
                    : 'text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec]'
                }`}
              >
                <Wrench className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-amber-400' : 'text-amber-600'}`} />
                <span>Domain Console</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) setShowLoginModal(true);
                  else setActiveTab('advisor');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'advisor'
                    ? 'bg-[#092d25] text-white shadow-md'
                    : 'text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec]'
                }`}
              >
                <GraduationCap className={`w-3.5 h-3.5 ${activeTab === 'advisor' ? 'text-mint-300' : 'text-emerald-700'}`} />
                <span>Advisor Desk</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) setShowLoginModal(true);
                  else setActiveTab('analytics');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-[#092d25] text-white shadow-md'
                    : 'text-[#192822] hover:text-[#092d25] hover:bg-[#eef2ec]'
                }`}
              >
                <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'analytics' ? 'text-mint-300' : 'text-blue-600'}`} />
                <span>SLA Metrics</span>
              </button>
            </nav>

            {/* Right Tools: Notification, Persona Switcher */}
            <div className="flex items-center space-x-2">

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

              {/* User Authentication Pill / Sign In Button */}
              {currentUser ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 px-3 py-1.5 rounded-xl transition-all shadow-subtle"
                    title="Account details or switch profile"
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

                  <button
                    onClick={logout}
                    className="p-2 text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors hidden sm:block"
                    title="Sign Out of CampusOne"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md bg-[#092d25] hover:bg-[#061c18] text-white transition-all border border-[#092d25]"
                  style={{ backgroundColor: '#092d25', color: '#ffffff' }}
                >
                  <LogIn className="w-3.5 h-3.5 text-mint-300" />
                  <span>Institutional Sign-In</span>
                </button>
              )}

            </div>

          </div>

          {/* Mobile Bottom Sub-nav */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-ivory-200 text-xs bg-white">
            <button
              onClick={onToggleLanding}
              className="flex flex-col items-center py-1 text-charcoal-500 hover:text-forest-950"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                if (!currentUser) setShowLoginModal(true);
                else setActiveTab('feed');
              }}
              className={`flex flex-col items-center py-1 ${activeTab === 'feed' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Feed</span>
            </button>
            <button
              onClick={() => {
                if (!currentUser) setShowLoginModal(true);
                else setActiveTab('raise');
              }}
              className={`flex flex-col items-center py-1 ${activeTab === 'raise' ? 'text-emerald-600 font-bold' : 'text-charcoal-500'}`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report</span>
            </button>
            <button
              onClick={() => {
                if (!currentUser) setShowLoginModal(true);
                else setActiveTab('admin');
              }}
              className={`flex flex-col items-center py-1 ${activeTab === 'admin' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <Wrench className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => {
                if (!currentUser) setShowLoginModal(true);
                else setActiveTab('advisor');
              }}
              className={`flex flex-col items-center py-1 ${activeTab === 'advisor' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Advisor</span>
            </button>
            <button
              onClick={() => {
                if (!currentUser) setShowLoginModal(true);
                else setActiveTab('analytics');
              }}
              className={`flex flex-col items-center py-1 ${activeTab === 'analytics' ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>SLA</span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
