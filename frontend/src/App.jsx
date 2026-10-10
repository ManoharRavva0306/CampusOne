import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import SwipeCardFeed from './components/feed/SwipeCardFeed';
import RaiseIssueModal from './components/wizard/RaiseIssueModal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdvisorDashboard from './components/advisor/AdvisorDashboard';
import CampusAnalytics from './components/analytics/CampusAnalytics';
import TicketDetailModal from './components/feed/TicketDetailModal';
import CinematicLanding from './components/landing/CinematicLanding';
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
    notification
  } = useApp();

  // View state: 'story' (Cinematic Landing) or 'workspace' (Interactive App)
  // Story is the default starting interface when the user launches the website
  const [viewMode, setViewMode] = useState('story');

  const handleEnterWorkspace = (targetTab = 'feed') => {
    setActiveTab(targetTab);
    setViewMode('workspace');
  };

  if (viewMode === 'story') {
    return (
      <CinematicLanding onEnterWorkspace={handleEnterWorkspace} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-900 pb-20 selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
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

      {/* Top Navbar */}
      <Navbar onToggleLanding={() => setViewMode('story')} />

      {/* Main Role-Based Workspaces */}
      <main className="flex-1 animate-fade-in">
        {activeTab === 'feed' && <SwipeCardFeed />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'advisor' && <AdvisorDashboard />}
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

      {/* Floating Action Button to Report Issue */}
      {activeTab !== 'raise' && (
        <button
          onClick={() => setActiveTab('raise')}
          className="fixed bottom-6 left-6 z-30 flex items-center space-x-2 px-5 py-3 rounded-2xl bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs shadow-2xl button-glow transition-all"
        >
          <PlusCircle className="w-4 h-4 text-mint-300" />
          <span>Report an Issue (Wizard)</span>
        </button>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
