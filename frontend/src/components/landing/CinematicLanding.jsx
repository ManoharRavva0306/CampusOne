import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  GraduationCap, 
  MapPin, 
  Clock, 
  ChevronDown, 
  GitFork, 
  Users, 
  Building2, 
  Zap, 
  ArrowUpRight,
  LogIn,
  LogOut,
  User,
  Shield
} from 'lucide-react';

export default function CinematicLanding({ onEnterWorkspace }) {
  const { currentUser, setShowLoginModal, logout } = useApp();

  const scrollToPillars = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#192822] selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* Grain & Atmospheric Radial Lighting (Soft emerald spotlight on warm ivory) */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-10" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] pointer-events-none -z-0"
        style={{
          background: 'radial-gradient(circle at 50% 32%, rgba(19, 168, 121, 0.25) 0%, rgba(166, 242, 208, 0.45) 35%, rgba(247, 248, 243, 0) 70%)'
        }}
      />

      {/* Landing Navigation Header */}
      <header className="relative z-20 border-b border-[#e2e9e3] bg-[#f7f8f3]/85 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-md"
              style={{ background: 'linear-gradient(135deg, #13a879 0%, #a6f2d0 100%)', color: '#092d25' }}
            >
              C1
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-[#092d25]">CampusOne</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  GENESIS'26
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#485c53]">
                Amrita Vishwa Vidyapeetham • CMRS Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={scrollToPillars}
              className="text-xs px-3 py-2 rounded-lg font-medium text-[#485c53] hover:text-[#092d25] transition-colors hidden sm:inline-block"
            >
              How It Works
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 bg-white/95 border border-[#cbdad0] px-3 py-1.5 rounded-xl shadow-xs hover:border-emerald-400 transition-all text-left"
                  title="Institutional Profile & Switch Account"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-[#092d25]">{currentUser.name}</div>
                    <div className="text-[10px] text-[#485c53] font-mono uppercase">
                      {currentUser.role?.replace('_', ' ')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onEnterWorkspace('feed')}
                  className="text-xs py-2 px-3.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md bg-[#13a879] hover:bg-[#0f8e65] text-white transition-all hover:scale-105"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-[#485c53] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-xs py-2 px-3.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm bg-white hover:bg-slate-50 text-[#092d25] border border-[#cbdad0] transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Institutional Sign-In</span>
                </button>

                <button
                  onClick={() => onEnterWorkspace('feed')}
                  className="text-xs py-2 px-3.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md bg-[#13a879] hover:bg-[#0f8e65] text-white transition-all hover:scale-105"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* HERO SECTION — Cinematic Full-Viewport */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-28 flex flex-col items-center text-center">
        
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in shadow-sm bg-emerald-100/80 border border-emerald-300 text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
          <span className="tracking-wide">Unified Campus Service & E-Governance</span>
        </div>

        {/* Cinematic Headline — High-Contrast Deep Forest & Vivid Emerald */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#092d25] max-w-4xl leading-[1.08] animate-fade-up">
          Every issue deserves <br className="hidden sm:inline" />
          <span className="text-[#13a879]">
            to be heard.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-xl max-w-2xl font-normal leading-relaxed text-[#2b3d35] animate-fade-up stagger-1">
          CampusOne turns individual grievances into visible, verified, and accountable improvements — ensuring no classroom fault, hostel concern, or campus hazard disappears into a void.
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-up stagger-2">
          <button
            onClick={() => onEnterWorkspace('feed')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 bg-[#13a879] hover:bg-[#0f8e65] text-white shadow-emerald-900/15 transition-all hover:scale-105"
          >
            <span>{currentUser ? 'Explore CampusOne Workspace' : 'Sign In to Access Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToPillars}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-[#192822] border border-[#cbdad0] shadow-sm"
          >
            <span>See How It Works</span>
            <ChevronDown className="w-4 h-4 text-[#73827a]" />
          </button>
        </div>

        {!currentUser && (
          <p className="mt-4 text-xs text-[#526a5e] flex items-center justify-center space-x-1.5 animate-fade-up">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
            <span>Institutional Sign-In required to view live grievances, vote, or raise tickets.</span>
          </p>
        )}

        {/* Hero Interactive Node Diagram (Visualizing Connection & Transparency) */}
        <div className="mt-16 w-full max-w-4xl p-1 rounded-3xl bg-white/95 backdrop-blur-md border border-[#e2e9e3] shadow-card animate-fade-up stagger-3">
          <div className="p-6 sm:p-8 rounded-[22px] bg-[#fbfcf9] grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            
            <div className="p-4 rounded-xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <GitFork className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#092d25] uppercase tracking-wider">1. Decision Tree</h4>
              <p className="text-xs text-[#485c53] mt-1">Refines location scope to preserve classroom privacy.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#092d25] uppercase tracking-wider">2. Peer Validation</h4>
              <p className="text-xs text-[#485c53] mt-1">Classmates confirm impact, boosting priority score.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#092d25] uppercase tracking-wider">3. Domain ETA</h4>
              <p className="text-xs text-[#485c53] mt-1">Maintenance allocates technician and broadcasts timeline.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#092d25] uppercase tracking-wider">4. Two-Way Signoff</h4>
              <p className="text-xs text-[#485c53] mt-1">Ticket closes only after reporting student verifies on-site.</p>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION 2: THE INSTITUTIONAL CHALLENGE */}
      <section className="relative z-20 py-24 bg-[#eef2ec]/60 border-t border-[#e2e9e3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">The Core Reality</span>
            <h2 className="text-3xl font-extrabold text-[#092d25] mt-2">
              Campus complaints shouldn't disappear into a black hole.
            </h2>
            <p className="text-sm text-[#485c53] mt-3">
              Traditional complaint registers and unorganized messaging groups create friction, lack accountability, and leave students wondering if anything was ever fixed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-rose-600 text-sm font-bold font-mono">01. Disconnected Voice</div>
              <h3 className="text-base font-bold text-[#092d25] mt-2">15 Students, 15 Complaints</h3>
              <p className="text-xs text-[#485c53] mt-2 leading-relaxed">
                When a classroom projector fails, multiple students file identical tickets, overwhelming administrators with redundant paperwork.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-amber-600 text-sm font-bold font-mono">02. No Supervisory Insight</div>
              <h3 className="text-base font-bold text-[#092d25] mt-2">Class Advisors Left in the Dark</h3>
              <p className="text-xs text-[#485c53] mt-2 leading-relaxed">
                Faculty advisors have no formal insight into ongoing infrastructure impediments affecting their students' daily curriculum.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-emerald-700 text-sm font-bold font-mono">03. Unilateral Closures</div>
              <h3 className="text-base font-bold text-[#092d25] mt-2">Falsely "Resolved" Tickets</h3>
              <p className="text-xs text-[#485c53] mt-2 leading-relaxed">
                Technicians mark tickets resolved without verified proof on-site. Without student sign-off, recurring defects continue unnoticed.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (THE 4 PILLARS) */}
      <section id="how-it-works" className="relative z-20 py-24 bg-[#f7f8f3] border-t border-[#e2e9e3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Operational Rigor</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#092d25] mt-2">
              Engineered for trust, safety, and operational clarity.
            </h2>
            <p className="text-sm text-[#485c53] mt-3">
              CampusOne combines smart scope routing, duplicate suppression, and two-way verification into an effortless digital journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-8 rounded-3xl bg-white border border-[#e2e9e3] space-y-4 shadow-subtle hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <GitFork className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#092d25]">Scope-Aware Decision Tree</h3>
              <p className="text-sm text-[#485c53] leading-relaxed">
                Grievances are classified through a targeted tree. A classroom projector issue is strictly visible only to that class section and alerts their designated Class Advisor — suppressing spam across unrelated branches.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2e9e3] space-y-4 shadow-subtle hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#092d25]">Intelligent Duplicate Consolidation</h3>
              <p className="text-sm text-[#485c53] leading-relaxed">
                As a student begins reporting, keyword analysis identifies existing active reports. Instead of redundant submissions, students can boost the existing report with 1 click and subscribe for live SMS and app updates.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2e9e3] space-y-4 shadow-subtle hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#092d25]">Domain Accountability & Public ETAs</h3>
              <p className="text-sm text-[#485c53] leading-relaxed">
                Domain administrators (Electrical, Carpentry, Food Committee, Central Admin) triage tickets by dynamic severity score, dispatch staff, and broadcast expected resolution times directly to affected students.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2e9e3] space-y-4 shadow-subtle hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#092d25]">Two-Way Verified Resolution</h3>
              <p className="text-sm text-[#485c53] leading-relaxed">
                Maintenance staff cannot close tickets unilaterally. Once marked fixed, the reporting student inspects on-site to verify closure. If the issue persists, one tap reopens the report with priority escalation.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: IMPACT & TRANSPARENCY METRICS */}
      <section className="relative z-20 py-20 bg-[#eef2ec]/70 border-y border-[#e2e9e3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700">3.4 hrs</div>
              <div className="text-xs text-[#485c53] mt-1 uppercase tracking-wider font-semibold">Median Response</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#13a879]">100%</div>
              <div className="text-xs text-[#485c53] mt-1 uppercase tracking-wider font-semibold">Two-Way Verified</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#092d25]">0%</div>
              <div className="text-xs text-[#485c53] mt-1 uppercase tracking-wider font-semibold">Duplicate Spam</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e2e9e3] shadow-subtle">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">4.9 / 5.0</div>
              <div className="text-xs text-[#485c53] mt-1 uppercase tracking-wider font-semibold">Student Trust Score</div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: CLOSING CALL TO ACTION */}
      <section className="relative z-20 py-24 text-center bg-[#f7f8f3]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092d25] tracking-tight">
            Help build a campus that listens.
          </h2>
          <p className="text-base text-[#485c53] max-w-xl mx-auto">
            Experience the live prototype with role-based access for students, class advisors, domain administrators, and campus leadership.
          </p>
          <div className="pt-4 flex flex-col items-center">
            <button
              onClick={() => onEnterWorkspace('feed')}
              className="px-8 py-4 rounded-xl font-bold text-sm shadow-xl inline-flex items-center space-x-2.5 bg-[#13a879] hover:bg-[#0f8e65] text-white shadow-emerald-900/15 transition-all hover:scale-105"
            >
              <span>{currentUser ? 'Launch Interactive Prototype' : 'Sign In to Launch Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!currentUser && (
              <p className="text-xs text-[#526a5e] mt-3">
                Amrita Central Administration Provisioning Only • Public Self-Registration Disabled
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center text-xs border-t border-[#e2e9e3] text-[#73827a]">
        <p>CampusOne (CMRS) • Developed for Genesis'26 Hackathon • Amrita Vishwa Vidyapeetham, Coimbatore</p>
      </footer>

    </div>
  );
}
