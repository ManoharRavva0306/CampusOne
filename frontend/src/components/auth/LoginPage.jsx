import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Wrench, 
  Crown, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Megaphone
} from 'lucide-react';

export default function LoginPage() {
  const { login, loginAsPersona } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // The 4 Core Roles (Student 1, Student 2, Advisor, Dept Head, Overall Admin)
  const officialPersonas = [
    {
      id: 'user_arjun',
      title: 'Student #1 (CSE-B)',
      email: 'student1@campusone.edu',
      password: 'student123',
      name: 'Arjun K.',
      detail: 'CSE-B 3rd Year • Vashistha Rm 304',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      cardBorder: 'border-emerald-200 hover:border-emerald-500',
      icon: <UserCheck className="w-5 h-5 text-emerald-700" />,
      capabilities: [
        'Rise Voice (Guided Wizard)',
        'Vote & Confirm Peer Grievances',
        'Two-Way Resolution Sign-off'
      ]
    },
    {
      id: 'user_sneha',
      title: 'Student #2 (CSE-B)',
      email: 'student2@campusone.edu',
      password: 'student123',
      name: 'Sneha Reddy',
      detail: 'CSE-B 3rd Year • Gargi Rm 210',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-300',
      cardBorder: 'border-teal-200 hover:border-teal-500',
      icon: <UserCheck className="w-5 h-5 text-teal-700" />,
      capabilities: [
        'Rise Voice (Campus Hazards & Lab)',
        'Tinder Swipe Support Feed',
        'Verify On-site Resolution'
      ]
    },
    {
      id: 'user_ramesh',
      title: 'Class Advisor (Faculty)',
      email: 'advisor@campusone.edu',
      password: 'advisor123',
      name: 'Dr. Ramesh Kumar',
      detail: 'Assoc. Professor & Advisor CSE-B',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      cardBorder: 'border-blue-200 hover:border-blue-500',
      icon: <GraduationCap className="w-5 h-5 text-blue-700" />,
      capabilities: [
        'Supervisory Desk for CSE-B',
        'Official Faculty Endorsement (+20)',
        'Direct Liaison with Estate Domain'
      ]
    },
    {
      id: 'user_hod',
      title: 'Dept Head (HOD) - Admin',
      email: 'hod@campusone.edu',
      password: 'hod123',
      name: 'Dr. S. N. Rao',
      detail: 'Head of Computer Science Dept',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      cardBorder: 'border-amber-200 hover:border-amber-500',
      icon: <Wrench className="w-5 h-5 text-amber-700" />,
      capabilities: [
        'Department Operations Console',
        'Dispatch Technicians & Assign Tools',
        'Set Public Completion ETAs'
      ]
    },
    {
      id: 'user_dean',
      title: 'Overall Admin (Campus Director)',
      email: 'admin@campusone.edu',
      password: 'admin123',
      name: 'Dr. K. Subramanian',
      detail: 'Campus Director & Master Admin',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
      cardBorder: 'border-purple-200 hover:border-purple-500',
      icon: <Crown className="w-5 h-5 text-purple-700" />,
      capabilities: [
        'Root Website & Database Control',
        'Add/Edit User Credentials & Passwords',
        'Campus-wide Emergency Broadcasts'
      ]
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    }, 350);
  };

  const handleQuickLogin = (persona) => {
    setEmail(persona.email);
    setPassword(persona.password);
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      loginAsPersona(persona.id);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Official Top Institutional Bar */}
      <header className="border-b border-ivory-300 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-subtle">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-900 flex items-center justify-center font-extrabold text-mint-300 text-base shadow-md">
            C1
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-forest-950">CampusOne</span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                GENESIS'26
              </span>
            </div>
            <p className="text-xs text-charcoal-600">Unified e-Governance & Student Voice Portal • Amrita Vishwa Vidyapeetham</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-charcoal-600 bg-ivory-200 border border-ivory-300 px-3 py-1.5 rounded-xl">
          <Database className="w-4 h-4 text-emerald-700" />
          <span>Pre-seeded Database Loaded</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        
        {/* Institutional Welcome */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3 shadow-subtle">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>4-Tier Role Governance Authentication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-forest-950 tracking-tight">
            Institutional Single Sign-On Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            All user accounts are pre-registered and managed by the <strong>Overall Admin</strong>. Log in with your assigned institutional email below or use the 1-click test cards.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Lg 7): Pre-seeded Persona Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-forest-950 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Pre-Seeded Official Accounts (1-Click Login)</span>
              </h2>
              <span className="text-[11px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                5 Accounts Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {officialPersonas.map((persona) => (
                <div 
                  key={persona.id}
                  onClick={() => handleQuickLogin(persona)}
                  className={`bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-subtle hover:shadow-card hover:-translate-y-0.5 flex flex-col justify-between ${persona.cardBorder}`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-ivory-100 border border-ivory-300">
                          {persona.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-forest-950 hover:text-emerald-700 transition-colors">
                            {persona.name}
                          </div>
                          <div className="text-[11px] text-charcoal-500">
                            {persona.detail}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${persona.badgeColor}`}>
                        {persona.title}
                      </span>
                    </div>

                    {/* Capabilities list */}
                    <ul className="mt-3 space-y-1 border-t border-ivory-200 pt-2">
                      {persona.capabilities.map((cap, idx) => (
                        <li key={idx} className="text-[11px] text-charcoal-700 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Account credentials footer */}
                  <div className="mt-3 pt-2.5 border-t border-ivory-200 flex items-center justify-between text-[11px]">
                    <div className="font-mono text-charcoal-600">
                      <span className="text-charcoal-400">ID:</span> {persona.email}
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-forest-900 hover:bg-forest-850 text-white text-[10px] font-extrabold transition-colors flex items-center space-x-1 shadow-sm">
                      <span>Login</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Lg 5): Official Standard Form Card */}
          <div className="lg:col-span-5 bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-card relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-6">
              <div>
                <h2 className="text-base font-extrabold text-forest-950">Official Account Login</h2>
                <p className="text-xs text-charcoal-500 mt-0.5">Enter institutional login details</p>
              </div>
              <div className="p-2 rounded-xl bg-forest-900 text-mint-300">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Error Notice */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Email / Username Input */}
              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student1@campusone.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:border-forest-900 text-charcoal-900 text-xs font-mono placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-forest-900 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:border-forest-900 text-charcoal-900 text-xs font-mono placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-forest-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-charcoal-400 hover:text-charcoal-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Session Memory */}
              <div className="flex items-center justify-between text-xs text-charcoal-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-ivory-300 text-forest-900 focus:ring-forest-900" />
                  <span>Remember Session</span>
                </label>
                <span className="text-emerald-700 text-[11px] font-bold">Role Auto-Detection</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-850 text-white font-extrabold text-xs tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Campus Workspace</span>
                    <ArrowRight className="w-4 h-4 text-mint-300" />
                  </>
                )}
              </button>
            </form>

            {/* Default Credentials Cheat-Sheet for Judges */}
            <div className="mt-6 p-4 rounded-2xl bg-ivory-100 border border-ivory-200 text-[11px] text-charcoal-700 space-y-2">
              <div className="font-bold text-forest-950 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                <span>Default Pre-Seeded Credentials Reference:</span>
              </div>
              <div className="grid grid-cols-1 gap-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>• Student 1:</span>
                  <span className="font-bold text-forest-900">student1@campusone.edu / student123</span>
                </div>
                <div className="flex justify-between">
                  <span>• Student 2:</span>
                  <span className="font-bold text-forest-900">student2@campusone.edu / student123</span>
                </div>
                <div className="flex justify-between">
                  <span>• Class Advisor:</span>
                  <span className="font-bold text-blue-900">advisor@campusone.edu / advisor123</span>
                </div>
                <div className="flex justify-between">
                  <span>• Dept Head (Admin):</span>
                  <span className="font-bold text-amber-900">hod@campusone.edu / hod123</span>
                </div>
                <div className="flex justify-between">
                  <span>• Overall Admin:</span>
                  <span className="font-bold text-purple-900">admin@campusone.edu / admin123</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-ivory-300 bg-white py-3.5 px-6 text-center text-xs text-charcoal-500 font-medium">
        CampusOne CMRS Platform • Developed for GENESIS'26 Hackathon • Amrita Vishwa Vidyapeetham
      </footer>

    </div>
  );
}
