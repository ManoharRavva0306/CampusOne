import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle, 
  Shield, 
  ShieldCheck,
  User, 
  GraduationCap, 
  Wrench, 
  Building2, 
  Lock, 
  Mail, 
  LogIn, 
  LogOut, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Sparkles,
  Info,
  Home,
  CheckCircle2,
  MapPin,
  BadgeCheck
} from 'lucide-react';

export default function RoleSwitcherModal({ onClose, onAuthSuccess }) {
  const { currentUser, login, logout } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const result = login(identifier, password);
    if (result.success) {
      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleSignOut = () => {
    logout();
    onClose();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'faculty_advisor': return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'hostel_warden': return <Home className="w-3.5 h-3.5 text-amber-600" />;
      case 'domain_admin': return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case 'central_admin': return <Shield className="w-3.5 h-3.5 text-forest-900" />;
      default: return <User className="w-3.5 h-3.5 text-charcoal-500" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'faculty_advisor': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'hostel_warden': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'domain_admin': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'central_admin': return 'bg-forest-900 text-mint-300 border-forest-800';
      default: return 'bg-ivory-200 text-charcoal-700 border-ivory-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in overscroll-contain">
      <div className="bg-white border border-ivory-300 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl overflow-hidden animate-scale-in max-h-[96dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-ivory-200 shrink-0 gap-2">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentUser ? <User className="w-4 h-4 text-emerald-700" /> : <Lock className="w-4 h-4 text-emerald-700" />}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-forest-950">
                {currentUser ? 'My Institutional Profile' : 'Amrita Institutional Sign-In'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                GENESIS'26
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-charcoal-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {currentUser 
                ? 'Amrita Vishwa Vidyapeetham • Official Identity & Governance Record'
                : 'Unified Campus Service & E-Governance Portal • Amrita Vishwa Vidyapeetham'
              }
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-forest-950 hover:bg-ivory-200 transition-colors touch-press shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">

          {currentUser ? (
            /* ============================================================
               CASE 1: USER IS LOGGED IN — PURE USER DETAILS & PROFILE PAGE
               ============================================================ */
            <div className="space-y-4 animate-fade-in">
              
              {/* Profile Card Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 border border-emerald-300 p-5 shadow-sm space-y-4">
                
                {/* Header Row: Avatar, Name, Role Badge, Roll No, Active Indicator */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-emerald-200/70">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                        {getRoleIcon(currentUser.role)}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-base font-extrabold text-forest-950">{currentUser.name}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadge(currentUser.role)}`}>
                          {currentUser.role?.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-mono text-emerald-950 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                          {currentUser.rollNo || 'ID: DIR.AMRITA.01'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse"></span>
                          <span>Active Session</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Profile Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  
                  {/* Institutional Email */}
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider">
                        Institutional Email
                      </div>
                      <div className="font-bold text-forest-950 truncate text-xs">
                        {currentUser.email || 'user@cb.amrita.edu'}
                      </div>
                    </div>
                  </div>

                  {/* Academic Department */}
                  {currentUser.department && (
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider">
                          Academic Department
                        </div>
                        <div className="font-bold text-forest-950 truncate text-xs">
                          {currentUser.department}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Class Section & Year */}
                  {currentUser.classSection && (
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider">
                          Class Section & Year
                        </div>
                        <div className="font-bold text-forest-950 truncate text-xs">
                          {currentUser.classSection}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hostel & Room Number */}
                  {(currentUser.hostel || currentUser.room) && (
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider">
                          Campus Residence
                        </div>
                        <div className="font-bold text-forest-950 truncate text-xs">
                          {currentUser.hostel || 'Hostel'} {currentUser.room ? `• Room ${currentUser.room}` : ''}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Domain Scope (For Domain Admins) */}
                  {(currentUser.domainTitle || currentUser.domain) && (
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-xs col-span-1 sm:col-span-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider">
                          Maintenance Domain Scope
                        </div>
                        <div className="font-bold text-forest-950 truncate text-xs">
                          {currentUser.domainTitle || currentUser.domain}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Profile Description / Governance Scope Banner */}
                {currentUser.description && (
                  <div className="text-xs text-forest-900 bg-white/90 p-3 rounded-xl border border-emerald-200/80 flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                      <span className="font-bold text-emerald-950 block mb-0.5">Campus Governance Scope:</span>
                      {currentUser.description}
                    </div>
                  </div>
                )}

                {/* Official Verification Notice */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-[11px] leading-relaxed">
                    <strong>Verified Institutional Identity:</strong> Authorized for scope-isolated ticket filing, peer-verification, and official campus resolution tracking.
                  </span>
                </div>

              </div>

              {/* Sign Out Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-bold transition-all shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of CampusOne</span>
                </button>
              </div>

            </div>
          ) : (
            /* ============================================================
               CASE 2: USER IS LOGGED OUT — INSTITUTIONAL SIGN-IN FORM
               ============================================================ */
            <div className="space-y-4 animate-fade-in">
              
              {/* Central Admin Provisioning Policy Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-amber-950">
                  <strong className="font-bold text-amber-900 block">Centralized Account Provisioning Only:</strong>
                  Student, faculty, and maintenance administrator accounts are created and registered exclusively by the <strong>Central University Administration</strong>. Public self-registration is disabled for campus integrity.
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 bg-ivory-50/70 p-4 rounded-2xl border border-ivory-200">
                <div className="text-xs font-bold text-forest-950 flex items-center justify-between">
                  <span>Sign In With University Credentials</span>
                  <span className="text-[10px] text-charcoal-500 font-normal">Roll No / Staff ID</span>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Amrita Roll No, Staff ID, or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. CB.EN.U4CSE23045 or arjun@cb.amrita.edu"
                      className="input-field pl-9 text-xs py-2 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Institutional Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field pl-9 pr-9 text-xs py-2 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 hover:text-charcoal-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 text-xs font-bold shadow-md flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#092d25', color: '#ffffff' }}
                >
                  <LogIn className="w-4 h-4 text-mint-300" />
                  <span>Sign In to CampusOne</span>
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-ivory-200 text-[11px] text-charcoal-500 flex items-center justify-between shrink-0">
          <span>CampusOne CMRS • Amrita Vishwa Vidyapeetham</span>
          <button 
            type="button"
            onClick={onClose}
            className="text-xs text-charcoal-600 hover:text-forest-950 font-bold"
          >
            {currentUser ? 'Close' : 'Cancel'}
          </button>
        </div>

      </div>
    </div>
  );
}
