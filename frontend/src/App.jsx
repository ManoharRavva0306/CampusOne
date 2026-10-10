import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import SwipeCardFeed from './components/feed/SwipeCardFeed';
import RaiseIssueModal from './components/wizard/RaiseIssueModal';
import AdminDashboard from './components/admin/AdminDashboard';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import AdvisorDashboard from './components/advisor/AdvisorDashboard';
import WardenDashboard from './components/warden/WardenDashboard';
import CampusAnalytics from './components/analytics/CampusAnalytics';
import TicketDetailModal from './components/feed/TicketDetailModal';
import CinematicLanding from './components/landing/CinematicLanding';
import RoleSwitcherModal from './components/layout/RoleSwitcherModal';
import { 
  PlusCircle, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function MainContent() {
  const { 
    activeTab, 
    setActiveTab, 
    selectedTicketForDetail, 
    setSelectedTicketForDetail,
    notification,
    setNotification,
    currentUser,
    showLoginModal,
    setShowLoginModal
  } = useApp();

  // View state: 'story' (Cinematic Landing) or 'workspace' (Interactive App)
  const [viewMode, setViewMode] = useState('story');

  // Enforce authentication: unauthenticated users can NEVER stay in the workspace
  useEffect(() => {
    if (!currentUser && viewMode === 'workspace') {
      setViewMode('story');
      setShowLoginModal(true);
    }
  }, [currentUser, viewMode]);

  const getDefaultTabForUser = (user) => {
    if (!user) return 'feed';
    if (user.role === 'central_admin') return 'super_admin';
    if (user.role === 'faculty_advisor') return 'advisor';
    if (user.role === 'hostel_warden') return 'warden';
    if (user.role === 'domain_admin') return 'admin';
    return 'feed';
  };

  const handleEnterWorkspace = (targetTab) => {
    if (!currentUser) {
      if (setNotification) {
        setNotification({
          message: 'Institutional Sign-In Required — Please log in or select a quick persona to enter the workspace.',
          type: 'info'
        });
      }
      setShowLoginModal(true);
      return;
    }
    const resolvedTab = (!targetTab || targetTab === 'feed') 
      ? getDefaultTabForUser(currentUser) 
      : targetTab;
    setActiveTab(resolvedTab);
    setViewMode('workspace');
  };

  return (
    <>
      {/* Toast Notification Alert (Shared across Story and Workspace views) */}
      {notification && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 animate-fade-up">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center space-x-2.5 backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900'
              : 'bg-white/95 border-ivory-300 text-charcoal-900'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* View Switcher: Cinematic Landing (Home) vs Operational Workspace */}
      {viewMode === 'story' ? (
        <CinematicLanding onEnterWorkspace={handleEnterWorkspace} />
      ) : (
        <div className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-900 pb-28 md:pb-12 selection:bg-emerald-500 selection:text-white">
          
          {/* Top Navbar & Fixed Mobile Bottom App Bar */}
          <Navbar onToggleLanding={() => setViewMode('story')} />

          {/* Main Role-Based Workspaces */}
          <main className="flex-1 animate-fade-in">
            {(activeTab === 'feed' || activeTab === 'raise') && <SwipeCardFeed />}
            {activeTab === 'super_admin' && <SuperAdminDashboard />}
            {activeTab === 'advisor' && <AdvisorDashboard />}
            {activeTab === 'warden' && <WardenDashboard />}
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'analytics' && <CampusAnalytics />}
          </main>

          {/* Raise Issue Guided Decision Tree Wizard */}
          {activeTab === 'raise' && (
            <RaiseIssueModal onClose={() => setActiveTab('feed')} />
          )}

          {/* Ticket Detail Modal */}
          {selectedTicketForDetail && (
            <TicketDetailModal
              ticket={selectedTicketForDetail}
              onClose={() => setSelectedTicketForDetail(null)}
            />
          )}

          {/* Floating Action Button to Report Issue (Desktop only; Mobile has central button in bottom bar) */}
          {activeTab !== 'raise' && (
            <button
              onClick={() => {
                if (!currentUser) {
                  setShowLoginModal(true);
                } else {
                  setActiveTab('raise');
                }
              }}
              className="hidden md:flex fixed bottom-6 left-6 z-30 items-center space-x-2.5 px-5 py-3 rounded-2xl bg-[#092d25] hover:bg-[#061c18] text-white font-bold text-xs shadow-2xl button-glow transition-all border border-[#0e3b31] touch-press"
              style={{ backgroundColor: '#092d25', color: '#ffffff' }}
            >
              <PlusCircle className="w-4 h-4 text-mint-300" />
              <span className="text-white font-bold">Report an Issue (Wizard)</span>
            </button>
          )}

        </div>
      )}

      {/* Global Institutional Sign-In / Account Modal */}
      {showLoginModal && (
        <RoleSwitcherModal 
          onClose={() => setShowLoginModal(false)} 
          onAuthSuccess={() => setViewMode('workspace')}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
