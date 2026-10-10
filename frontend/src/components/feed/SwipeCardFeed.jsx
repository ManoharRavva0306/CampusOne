import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ThumbsUp, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  User, 
  Sparkles,
  Search,
  Filter,
  PlusCircle,
  Zap,
  Flame,
  ArrowRight,
  TrendingUp,
  Building2,
  Lock,
  Home,
  Wrench
} from 'lucide-react';
import StudentVerificationBanner from '../verification/StudentVerificationBanner';

export default function SwipeCardFeed() {
  const { 
    tickets, 
    currentUser, 
    voteTicket, 
    isTicketVisibleToUser, 
    feedFilter, 
    setFeedFilter,
    setSelectedTicketForDetail,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter strictly based on authorized scope visibility
  const authorizedTickets = useMemo(() => {
    return tickets.filter(t => isTicketVisibleToUser(t));
  }, [tickets, currentUser]);

  // Metric counts for current user's scope
  const myReportsCount = tickets.filter(t => t?.raisedBy?.id === currentUser?.id).length;
  const awaitingVerificationCount = tickets.filter(t => t?.raisedBy?.id === currentUser?.id && t?.status === 'awaiting_verification').length;
  const inProgressCount = authorizedTickets.filter(t => t?.status === 'in_progress').length;
  const resolvedCount = authorizedTickets.filter(t => t?.status === 'resolved').length;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return authorizedTickets.filter(ticket => {
      // Scope Tab
      if (feedFilter === 'class' && ticket.scope !== 'class') return false;
      if (feedFilter === 'room' && ticket.scope !== 'room' && ticket.scope !== 'hostel_generic') return false;
      if (feedFilter === 'department' && ticket.scope !== 'department') return false;
      if (feedFilter === 'campus' && ticket.scope !== 'campus') return false;

      // Category filter
      if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${ticket.title} ${ticket.description} ${ticket.location} ${ticket.id}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [authorizedTickets, feedFilter, categoryFilter, statusFilter, searchQuery]);

  const getScopeBadge = (ticket) => {
    switch (ticket.scope) {
      case 'class':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Lock className="w-2.5 h-2.5" />
            <span>Classroom ({ticket.classSection || 'CSE-B'})</span>
          </span>
        );
      case 'room':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Home className="w-2.5 h-2.5" />
            <span>Hostel Room ({ticket.room || '304'})</span>
          </span>
        );
      case 'department':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Building2 className="w-2.5 h-2.5" />
            <span>Department ({ticket.department || 'CSE'})</span>
          </span>
        );
      case 'hostel_generic':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <span>Hostel Common Area</span>
          </span>
        );
      case 'campus':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
            <span>Campus Hazard</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reported':
        return <span className="badge badge-neutral">Reported</span>;
      case 'in_progress':
        return <span className="badge badge-pending">In Progress</span>;
      case 'awaiting_verification':
        return <span className="badge badge-pending">Verification Needed</span>;
      case 'resolved':
        return <span className="badge badge-success">Resolved</span>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (iso) => {
    if (!iso) return 'Recently';
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Two-Way Student Verification Banner */}
      <StudentVerificationBanner />

      {/* Hero Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ivory-300">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Student Governance Desk</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 mt-1">
            Your campus. Your voice. Your impact.
          </h1>
          <p className="text-xs text-charcoal-700 mt-1 max-w-xl">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.classSection || currentUser.department}). All reports are scope-isolated and tracked with accountable resolution times.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('raise')}
          className="btn-primary text-xs py-2.5 px-5 shadow-md flex items-center space-x-2 self-start md:self-auto font-bold"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
            <span>My Reports</span>
            <User className="w-4 h-4 text-charcoal-400" />
          </div>
          <div className="text-2xl font-black text-forest-950 mt-2">{myReportsCount}</div>
          <div className="text-[11px] text-charcoal-500 mt-1">Submitted by you</div>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border shadow-card transition-all ${
          awaitingVerificationCount > 0 
            ? 'bg-amber-50/70 border-amber-300' 
            : 'bg-white border-ivory-300'
        }`}>
          <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
            <span>Awaiting Action</span>
            <Clock className={`w-4 h-4 ${awaitingVerificationCount > 0 ? 'text-amber-600' : 'text-charcoal-400'}`} />
          </div>
          <div className={`text-2xl font-black mt-2 ${awaitingVerificationCount > 0 ? 'text-amber-800' : 'text-forest-950'}`}>
            {awaitingVerificationCount}
          </div>
          <div className="text-[11px] text-charcoal-500 mt-1">Needs your on-site sign-off</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
            <span>In Progress</span>
            <Wrench className="w-4 h-4 text-charcoal-400" />
          </div>
          <div className="text-2xl font-black text-forest-950 mt-2">{inProgressCount}</div>
          <div className="text-[11px] text-charcoal-500 mt-1">Technicians dispatched</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-ivory-300 shadow-card">
          <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{resolvedCount}</div>
          <div className="text-[11px] text-charcoal-500 mt-1">Verified on-site by students</div>
        </div>

      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle space-y-3.5">
        
        {/* Top Scope Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setFeedFilter('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              feedFilter === 'all'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200'
            }`}
          >
            All Relevant ({authorizedTickets.length})
          </button>

          <button
            onClick={() => setFeedFilter('class')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              feedFilter === 'class'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200'
            }`}
          >
            <Lock className="w-3 h-3 text-blue-500" />
            <span>Classroom Only ({currentUser.classSection || 'CSE-B'})</span>
          </button>

          <button
            onClick={() => setFeedFilter('room')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              feedFilter === 'room'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200'
            }`}
          >
            <Home className="w-3 h-3 text-amber-500" />
            <span>Hostel & Room</span>
          </button>

          <button
            onClick={() => setFeedFilter('department')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              feedFilter === 'department'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200'
            }`}
          >
            <Building2 className="w-3 h-3 text-purple-500" />
            <span>Department ({currentUser.department})</span>
          </button>

          <button
            onClick={() => setFeedFilter('campus')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              feedFilter === 'campus'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span>Campus Hazards</span>
          </button>
        </div>

        {/* Search Bar & Secondary Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-ivory-200">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title, room number, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 text-xs py-2 bg-ivory-50"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field text-xs py-2 bg-ivory-50 sm:w-40"
            >
              <option value="all">All Categories</option>
              <option value="electrical">Electrical</option>
              <option value="it_av">IT & AV</option>
              <option value="carpentry">Carpentry</option>
              <option value="mess_food">Mess & Food</option>
              <option value="safety">Safety / Hazard</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field text-xs py-2 bg-ivory-50 sm:w-36"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_verification">Verification</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

      </div>

      {/* Issue Feed Cards (Clean Information Hierarchy) */}
      <div className="space-y-4">
        {filteredTickets.map(ticket => {
          const hasConfirmed = ticket.upvotes?.includes(currentUser.id);
          const isUrgent = ticket.category === 'safety' || ticket.priorityScore >= 90;

          return (
            <div
              key={ticket.id}
              className={`bg-white rounded-2xl border transition-all interactive-card p-5 sm:p-6 shadow-subtle ${
                isUrgent ? 'border-l-4 border-l-rose-500 border-ivory-300' : 'border-ivory-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left Info Column */}
                <div className="flex items-start space-x-4 flex-1">
                  
                  {/* Category Thumbnail / Icon */}
                  <div className="relative shrink-0">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-ivory-300"
                    />
                    {isUrgent && (
                      <div className="absolute -top-1 -right-1 p-1 bg-rose-600 rounded-full text-white shadow-sm" title="Safety Priority">
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5 flex-1">
                    
                    {/* Top Row Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-charcoal-500 font-semibold">#{ticket.id}</span>
                      {getScopeBadge(ticket)}
                      {getStatusBadge(ticket.status)}
                      
                      {ticket.advisorEndorsed && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Advisor Endorsed (+20)</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setSelectedTicketForDetail(ticket)}
                      className="text-base font-bold text-forest-950 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                    >
                      {ticket.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-charcoal-700 leading-relaxed line-clamp-2 max-w-2xl">
                      {ticket.description}
                    </p>

                    {/* Meta location and reporter */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                        <span>{ticket.location}</span>
                      </span>
                      <span>•</span>
                      <span>Reported by <strong>{ticket.raisedBy.name}</strong></span>
                      <span>•</span>
                      <span>{formatTimeAgo(ticket.createdAt)}</span>
                    </div>

                    {/* Department Progress Note if available */}
                    {ticket.adminNote && (
                      <div className="mt-2 p-2.5 rounded-xl bg-ivory-100 border border-ivory-200 text-xs text-charcoal-800 flex items-start space-x-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-forest-950">
                            {ticket.assignedTo ? `Assigned to ${ticket.assignedTo}: ` : 'Maintenance Note: '}
                          </span>
                          <span>{ticket.adminNote}</span>
                          {ticket.eta && <span className="font-mono text-emerald-700 ml-1">({ticket.eta})</span>}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                {/* Right Action & Confirmation Column */}
                <div className="flex items-center lg:flex-col lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-ivory-200">
                  
                  {/* Priority Gauge */}
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-charcoal-500">Priority Score</div>
                    <div className="text-base font-black text-forest-950 flex items-center justify-end space-x-1">
                      <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      <span>{ticket.priorityScore}</span>
                      <span className="text-[10px] text-charcoal-400 font-normal">/ 100</span>
                    </div>
                  </div>

                  {/* Community Confirmation Button */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => voteTicket(ticket.id, 'up')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        hasConfirmed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-ivory-100 text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-800 border border-ivory-300'
                      }`}
                      title="Confirm this issue exists"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{hasConfirmed ? 'Confirmed' : 'Confirm Issue'} ({ticket.upvotes?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setSelectedTicketForDetail(ticket)}
                      className="p-1.5 rounded-xl text-charcoal-500 hover:text-forest-950 hover:bg-ivory-200 border border-ivory-300 transition-colors"
                      title="View Details & Comments"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8 shadow-subtle">
            <Sparkles className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-forest-950">No Reports in this Scope</h4>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              All tickets under this filter have been addressed or resolved. You can report a new issue anytime.
            </p>
            <button
              onClick={() => { setFeedFilter('all'); setCategoryFilter('all'); setStatusFilter('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-forest-900 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
