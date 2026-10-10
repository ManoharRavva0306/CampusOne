import React from 'react';
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
  ArrowUpRight
} from 'lucide-react';

export default function CinematicLanding({ onEnterWorkspace }) {
  const scrollToPillars = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-forest-950 text-ivory-100 selection:bg-emerald-500 selection:text-forest-950 relative overflow-hidden">
      
      {/* Grain & Atmospheric Lighting */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] atmospheric-glow pointer-events-none -z-0" />

      {/* Landing Navigation Header */}
      <header className="relative z-20 border-b border-forest-800/80 bg-forest-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-mint-300 flex items-center justify-center shadow-lg shadow-emerald-950/60 font-black text-forest-950 text-lg">
              C1
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">CampusOne</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-mint-300 border border-emerald-500/30">
                  GENESIS'26
                </span>
              </div>
              <p className="text-[11px] text-charcoal-400 font-medium">Amrita Vishwa Vidyapeetham • CMRS Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={scrollToPillars}
              className="text-xs text-charcoal-400 hover:text-white px-3 py-2 rounded-lg transition-colors hidden sm:inline-block font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => onEnterWorkspace('feed')}
              className="btn-primary text-xs py-2 px-4 shadow-md font-semibold"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION — Cinematic Full-Viewport */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 flex flex-col items-center text-center">
        
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-900 border border-forest-700/60 text-xs text-mint-300 mb-8 animate-fade-in shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
          <span className="font-medium tracking-wide">Unified Campus Service & E-Governance</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] animate-fade-up">
          Every issue deserves <br className="hidden sm:inline" />
          <span className="text-gradient-mint">to be heard.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-xl text-charcoal-400 max-w-2xl font-normal leading-relaxed animate-fade-up stagger-1">
          CampusOne turns individual grievances into visible, verified, and accountable improvements — ensuring no classroom fault, hostel concern, or campus hazard disappears into a void.
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-up stagger-2">
          <button
            onClick={() => onEnterWorkspace('feed')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-forest-950 font-bold text-sm shadow-xl shadow-emerald-950/60 button-glow flex items-center justify-center space-x-2 transition-all"
          >
            <span>Explore CampusOne Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToPillars}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white font-semibold text-sm border border-forest-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>See How It Works</span>
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          </button>
        </div>

        {/* Hero Interactive Node Diagram (Visualizing Connection & Transparency) */}
        <div className="mt-16 w-full max-w-4xl p-1 rounded-3xl glow-card bg-forest-900/60 backdrop-blur-md border border-forest-800 shadow-2xl animate-fade-up stagger-3">
          <div className="p-6 sm:p-8 rounded-[22px] bg-forest-950/80 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            
            <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <GitFork className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">1. Decision Tree</h4>
              <p className="text-xs text-charcoal-400 mt-1">Refines location scope to preserve classroom privacy.</p>
            </div>

            <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
              <div className="w-8 h-8 rounded-lg bg-mint-300/20 text-mint-300 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">2. Peer Validation</h4>
              <p className="text-xs text-charcoal-400 mt-1">Classmates confirm impact, boosting priority score.</p>
            </div>

            <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">3. Domain ETA</h4>
              <p className="text-xs text-charcoal-400 mt-1">Maintenance allocates technician and broadcasts timeline.</p>
            </div>

            <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-mint-300 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">4. Two-Way Signoff</h4>
              <p className="text-xs text-charcoal-400 mt-1">Ticket closes only after reporting student verifies on-site.</p>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION 2: THE INSTITUTIONAL CHALLENGE */}
      <section className="relative z-20 py-24 bg-forest-900/50 border-t border-forest-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The Core Reality</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Campus complaints shouldn't disappear into a black hole.
            </h2>
            <p className="text-sm text-charcoal-400 mt-3">
              Traditional complaint registers and unorganized messaging groups create friction, lack accountability, and leave students wondering if anything was ever fixed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-forest-950/70 border border-forest-800">
              <div className="text-rose-400 text-sm font-bold font-mono">01. Disconnected Voice</div>
              <h3 className="text-base font-bold text-white mt-2">15 Students, 15 Complaints</h3>
              <p className="text-xs text-charcoal-400 mt-2 leading-relaxed">
                When a classroom projector fails, multiple students file identical tickets, overwhelming administrators with redundant paperwork.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950/70 border border-forest-800">
              <div className="text-amber-400 text-sm font-bold font-mono">02. No Supervisory Insight</div>
              <h3 className="text-base font-bold text-white mt-2">Class Advisors Left in the Dark</h3>
              <p className="text-xs text-charcoal-400 mt-2 leading-relaxed">
                Faculty advisors have no formal insight into ongoing infrastructure impediments affecting their students' daily curriculum.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950/70 border border-forest-800">
              <div className="text-emerald-400 text-sm font-bold font-mono">03. Unilateral Closures</div>
              <h3 className="text-base font-bold text-white mt-2">Falsely "Resolved" Tickets</h3>
              <p className="text-xs text-charcoal-400 mt-2 leading-relaxed">
                Technicians mark tickets resolved without verified proof on-site. Without student sign-off, recurring defects continue unnoticed.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (THE 4 PILLARS) */}
      <section id="how-it-works" className="relative z-20 py-24 bg-forest-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-mint-300">Operational Rigor</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Engineered for trust, safety, and operational clarity.
            </h2>
            <p className="text-sm text-charcoal-400 mt-3">
              CampusOne combines smart scope routing, duplicate suppression, and two-way verification into an effortless digital journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-forest-900/60 border border-forest-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-mint-300 flex items-center justify-center">
                <GitFork className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Scope-Aware Decision Tree</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">
                Grievances are classified through a targeted tree. A classroom projector issue is strictly visible only to that class section and alerts their designated Class Advisor — suppressing spam across unrelated branches.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-forest-900/60 border border-forest-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-mint-300/10 border border-mint-300/20 text-mint-300 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Intelligent Duplicate Consolidation</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">
                As a student begins reporting, keyword analysis identifies existing active reports. Instead of redundant submissions, students can boost the existing report with 1 click and subscribe for live SMS and app updates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-forest-900/60 border border-forest-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Domain Accountability & Public ETAs</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">
                Domain administrators (Electrical, Carpentry, Food Committee, Central Admin) triage tickets by dynamic severity score, dispatch staff, and broadcast expected resolution times directly to affected students.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-forest-900/60 border border-forest-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Two-Way Verified Resolution</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">
                Maintenance staff cannot close tickets unilaterally. Once marked fixed, the reporting student inspects on-site to verify closure. If the issue persists, one tap reopens the report with priority escalation.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: IMPACT & TRANSPARENCY METRICS */}
      <section className="relative z-20 py-20 bg-forest-900/40 border-y border-forest-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-forest-950 border border-forest-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-mint-300">3.4 hrs</div>
              <div className="text-xs text-charcoal-400 mt-1 uppercase tracking-wider font-semibold">Median Response</div>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950 border border-forest-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-charcoal-400 mt-1 uppercase tracking-wider font-semibold">Two-Way Verified</div>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950 border border-forest-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">0%</div>
              <div className="text-xs text-charcoal-400 mt-1 uppercase tracking-wider font-semibold">Duplicate Spam</div>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950 border border-forest-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">4.9 / 5.0</div>
              <div className="text-xs text-charcoal-400 mt-1 uppercase tracking-wider font-semibold">Student Trust Score</div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: CLOSING CALL TO ACTION */}
      <section className="relative z-20 py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Help build a campus that listens.
          </h2>
          <p className="text-base text-charcoal-400 max-w-xl mx-auto">
            Experience the live prototype with role-based access for students, class advisors, domain administrators, and campus leadership.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onEnterWorkspace('feed')}
              className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-forest-950 font-bold text-sm shadow-2xl shadow-emerald-950/70 button-glow inline-flex items-center space-x-2.5 transition-all"
            >
              <span>Launch Interactive Prototype</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 border-t border-forest-900 text-center text-xs text-charcoal-500">
        <p>CampusOne (CMRS) • Developed for Genesis'26 Hackathon • Amrita Vishwa Vidyapeetham, Coimbatore</p>
      </footer>

    </div>
  );
}
