import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/mockData';
import { 
  X, 
  CheckCircle, 
  Shield, 
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
  Info
} from 'lucide-react';

export default function RoleSwitcherModal({ onClose }) {
  const { currentUser, login, logout, switchUser } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showDirectory, setShowDirectory] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const result = login(identifier, password);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = (user) => {
    setIdentifier(user.rollNo || user.email);
    setPassword('amrita123');
    setError(null);
    switchUser(user);
    onClose();
  };

  const handleSignOut = () => {
    logout();
    onClose();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'faculty_advisor': return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'domain_admin': return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case 'central_admin': return <Shield className="w-3.5 h-3.5 text-forest-900" />;
      default: return <User className="w-3.5 h-3.5 text-charcoal-500" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'faculty_advisor': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'domain_admin': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'central_admin': return 'bg-forest-900 text-mint-300 border-forest-800';
      default: return 'bg-ivory-200 text-charcoal-700 border-ivory-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-ivory-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ivory-200 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Lock className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-forest-950">
                {currentUser ? 'Institutional Account Management' : 'Amrita Institutional Sign-In'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                GENESIS'26
              </span>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Unified Campus Service & E-Governance Portal • Amrita Vishwa Vidyapeetham
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-forest-950 hover:bg-ivory-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">

          {/* Central Admin Provisioning Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs">
            <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-amber-950">
              <strong className="font-bold text-amber-900 block">Centralized Account Provisioning Only:</strong>
              Student, faculty, and maintenance administrator accounts are created and registered exclusively by the <strong>Central University Administration</strong>. Public self-registration is disabled for campus integrity.
            </div>
          </div>

          {/* If already signed in: Active Session Card */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-forest-950">{currentUser.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 font-bold">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] text-charcoal-600 font-mono mt-0.5">
                    {currentUser.rollNo} • {currentUser.classSection || currentUser.department}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-bold transition-all shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 bg-ivory-50/70 p-4 rounded-2xl border border-ivory-200">
            <div className="text-xs font-bold text-forest-950 flex items-center justify-between">
              <span>{currentUser ? 'Switch to Another University Account' : 'Sign In With University Credentials'}</span>
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
              <span>{currentUser ? 'Switch & Authenticate Account' : 'Sign In to CampusOne'}</span>
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-ivory-200 text-[11px] text-charcoal-500 flex items-center justify-between shrink-0">
          <span>CampusOne CMRS • Amrita Vishwa Vidyapeetham</span>
          <button 
            type="button"
            onClick={onClose}
            className="text-xs text-charcoal-600 hover:text-forest-950 font-bold"
          >
            Cancel / Close
          </button>
        </div>

      </div>
    </div>
  );
}
