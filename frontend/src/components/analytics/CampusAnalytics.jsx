import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function CampusAnalytics() {
  const { tickets } = useApp();

  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const awaitingVerification = tickets.filter(t => t.status === 'awaiting_verification').length;

  const resolutionRate = total > 0 ? Math.round(((resolved + awaitingVerification) / total) * 100) : 0;

  const scopeCounts = {
    class: tickets.filter(t => t.scope === 'class').length,
    room: tickets.filter(t => t.scope === 'room').length,
    department: tickets.filter(t => t.scope === 'department').length,
    hostel_generic: tickets.filter(t => t.scope === 'hostel_generic').length,
    campus: tickets.filter(t => t.scope === 'campus').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white border border-ivory-300 rounded-3xl p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-mint-300 flex items-center justify-center font-bold shadow-md">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-forest-950">Campus Governance & SLA Analytics</h2>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Illustrative Prototype Data
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-1">
                Objective performance insights across academic blocks, student hostels, and maintenance domains.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-charcoal-600 bg-ivory-100 px-3 py-2 rounded-xl border border-ivory-200">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>AI Duplicate Engine consolidated <strong>24 redundant reports</strong></span>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          
          <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
            <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
              <span>Total Active Reports</span>
              <Building2 className="w-4 h-4 text-charcoal-400" />
            </div>
            <div className="text-2xl font-black text-forest-950 mt-2">{total}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Routed via Decision Tree</span>
            </div>
          </div>

          <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
            <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
              <span>Resolution Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">{resolutionRate}%</div>
            <div className="text-[11px] text-charcoal-500 mt-1">
              Signed off on-site by students
            </div>
          </div>

          <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
            <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
              <span>Median Turnaround</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-800 mt-2">3.4 hrs</div>
            <div className="text-[11px] text-charcoal-500 mt-1">
              Down from 4.2 days manual
            </div>
          </div>

          <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
            <div className="text-xs text-charcoal-500 font-semibold flex items-center justify-between">
              <span>Student Trust Index</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-800 mt-2">4.9 / 5.0</div>
            <div className="text-[11px] text-charcoal-500 mt-1">
              Based on closed verification loops
            </div>
          </div>

        </div>
      </div>

      {/* Scope Distribution & Department Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scope Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 space-y-4 shadow-subtle">
          <h3 className="text-sm font-bold text-forest-950">
            Issue Scope & Privacy Breakdown
          </h3>
          <p className="text-xs text-charcoal-500">
            Isolation ensures classroom and hostel room tickets do not pollute campus-wide noise.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Classroom Specific (CSE-B)', count: scopeCounts.class, color: 'bg-blue-600' },
              { label: 'Hostel Room Specific', count: scopeCounts.room, color: 'bg-amber-600' },
              { label: 'Department Level (CSE Labs)', count: scopeCounts.department, color: 'bg-purple-600' },
              { label: 'Hostel Generic & Mess', count: scopeCounts.hostel_generic, color: 'bg-teal-600' },
              { label: 'Campus Hazards & Emergencies', count: scopeCounts.campus, color: 'bg-rose-600' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-charcoal-700 font-medium">{item.label}</span>
                  <span className="font-mono text-forest-950 font-bold">{item.count} reports</span>
                </div>
                <div className="h-2 w-full bg-ivory-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Department Efficiency */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 space-y-4 shadow-subtle">
          <h3 className="text-sm font-bold text-forest-950">
            Domain Response Performance
          </h3>
          <p className="text-xs text-charcoal-500">
            Ranked by adherence to public ETAs and student verification scores.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                name: 'Electrical & AV Infrastructure',
                lead: 'Kishore V.',
                score: '96% On-Time',
                badge: '1.8h Response',
                color: 'text-emerald-700'
              },
              {
                name: 'Civil & Carpentry Maintenance',
                lead: 'Suresh Babu',
                score: '91% On-Time',
                badge: '100% Student Verified',
                color: 'text-forest-950'
              },
              {
                name: 'Hostels & Mess Quality Committee',
                lead: 'Mrs. Malathi / Warden',
                score: '88% On-Time',
                badge: 'High Engagement',
                color: 'text-amber-800'
              }
            ].map((dept, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-forest-950">{dept.name}</h4>
                  <div className="text-[11px] text-charcoal-500 mt-0.5">
                    Lead: {dept.lead} • <span className="text-emerald-700 font-mono font-bold">{dept.badge}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${dept.color}`}>{dept.score}</div>
                  <div className="text-[10px] text-charcoal-400">Target Met</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Illustrative Notice Footnote */}
      <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-200 flex items-center space-x-2.5 text-xs text-charcoal-600">
        <Info className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          <strong>Demonstration Notice:</strong> All seeded analytics are illustrative mock telemetry for the Genesis'26 Hackathon prototype at Amrita Coimbatore.
        </span>
      </div>

    </div>
  );
}
