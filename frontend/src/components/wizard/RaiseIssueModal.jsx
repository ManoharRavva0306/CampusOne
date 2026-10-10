import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { 
  GitFork, 
  Building2, 
  Home, 
  School, 
  Sparkles, 
  AlertTriangle, 
  Camera, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  ThumbsUp, 
  Info, 
  Zap, 
  Lock, 
  X,
  ShieldAlert
} from 'lucide-react';

export default function RaiseIssueModal({ onClose }) {
  const { 
    currentUser, 
    raiseTicket, 
    tickets, 
    boostExistingTicket 
  } = useApp();

  // Step 1: Location & Scope
  // Step 2: Issue Category
  // Step 3: Description & Evidence
  // Step 4: Duplicate Detection Review & Priority Preview
  const [step, setStep] = useState(1);

  // Form State
  const [mainDomain, setMainDomain] = useState('college'); // 'college' | 'hostel' | 'campus'
  const [subScope, setSubScope] = useState('class'); // 'class' | 'department' | 'room' | 'hostel_generic' | 'campus'
  const [category, setCategory] = useState('it_av');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [selectedPhoto, setSelectedPhoto] = useState('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80');

  // Photo presets for testing/demo
  const PHOTO_PRESETS = [
    { label: 'Projector / AV', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80' },
    { label: 'Electrical Wiring', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ceiling Fan', url: 'https://images.unsplash.com/photo-1590725140246-20acbe44865e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Broken Furniture', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80' },
    { label: 'Water Dispenser', url: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?w=800&auto=format&fit=crop&q=80' },
  ];

  // AI Duplicate Detection Engine
  const duplicateMatches = useMemo(() => {
    if (!title && !description) return [];

    const query = `${title} ${description}`.toLowerCase();
    const keywords = query.split(/\s+/).filter(w => w.length > 3);

    if (keywords.length === 0) return [];

    return tickets.filter(t => {
      if (t.status === 'resolved') return false;

      const targetText = `${t.title} ${t.description} ${t.location}`.toLowerCase();
      
      let hits = 0;
      keywords.forEach(kw => {
        if (targetText.includes(kw)) hits++;
      });

      const sameCategory = t.category === category;
      return hits >= 2 || (hits >= 1 && sameCategory);
    }).slice(0, 2);
  }, [title, description, category, tickets]);

  const handleNextStep = () => {
    if (step === 1 && !subScope) return;
    if (step === 2 && !category) return;
    if (step === 3 && (!title.trim() || !description.trim())) return;
    setStep(Math.min(4, step + 1));
  };

  const handleBackStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const matchedCat = CATEGORIES.find(c => c.id === category);

    const ticketData = {
      title: title.trim(),
      description: description.trim(),
      scope: subScope,
      classSection: subScope === 'class' ? currentUser.classSection : null,
      department: currentUser.department,
      hostel: subScope === 'room' || subScope === 'hostel_generic' ? currentUser.hostel : null,
      room: subScope === 'room' ? currentUser.room : null,
      location: location || (
        subScope === 'class' ? `${currentUser.classSection} Classroom (Room 302)` :
        subScope === 'room' ? `${currentUser.hostel} Room ${currentUser.room}` :
        subScope === 'department' ? `${currentUser.department} Department Labs` :
        'Amrita Campus Central Area'
      ),
      category: category,
      domain: matchedCat ? matchedCat.domain : 'electrical_av',
      imageUrl: selectedPhoto,
      priorityScore: urgency === 'emergency' ? 95 : urgency === 'high' ? 80 : 65
    };

    raiseTicket(ticketData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-ivory-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        
        {/* Header */}
        <div className="pb-4 border-b border-ivory-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <GitFork className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-forest-950">Guided Issue Reporting Wizard</h3>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Refines scope to protect student privacy and automatically allocate to the responsible department.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Step Progress Pills */}
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4].map(s => (
                <div 
                  key={s}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    step === s 
                      ? 'bg-forest-900 text-white shadow-sm'
                      : step > s 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-ivory-200 text-charcoal-400'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
              ))}
            </div>

            <button onClick={onClose} className="p-1 text-charcoal-400 hover:text-forest-950">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1">

          {/* STEP 1: Scope & Location Selection */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <h4 className="text-sm font-bold text-forest-950">Step 1: Who does this issue affect?</h4>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Scope isolation ensures classroom issues remain private to your section and directly inform your Class Advisor.
                </p>
              </div>

              <div className="space-y-2.5">
                
                {/* Classroom Option */}
                <div
                  onClick={() => { setMainDomain('college'); setSubScope('class'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    subScope === 'class'
                      ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'bg-white border-ivory-300 hover:bg-ivory-100'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0 border border-blue-200">
                    <School className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-forest-950">
                        Specific to My Class Section ({currentUser.classSection || 'CSE-B'})
                      </h5>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Classroom Privacy
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      Projectors, classroom AC, benches, blackboard in Room 302.
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      ✓ Visible ONLY to {currentUser.classSection} peers & directly alerts Class Advisor.
                    </p>
                  </div>
                </div>

                {/* Hostel Room Option */}
                <div
                  onClick={() => { setMainDomain('hostel'); setSubScope('room'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    subScope === 'room'
                      ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'bg-white border-ivory-300 hover:bg-ivory-100'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 border border-amber-200">
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-forest-950">
                        My Hostel Room ({currentUser.hostel} - Rm {currentUser.room || '304'})
                      </h5>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Room Only
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      Ceiling fan regulator, study desk, personal switchboard, door latch.
                    </p>
                  </div>
                </div>

                {/* Department Level Option */}
                <div
                  onClick={() => { setMainDomain('college'); setSubScope('department'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    subScope === 'department'
                      ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'bg-white border-ivory-300 hover:bg-ivory-100'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0 border border-purple-200">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-forest-950">
                        Department Level ({currentUser.department || 'CSE'} Labs & Corridors)
                      </h5>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        Department
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      Advanced IoT Lab equipment, corridor water dispensers, department seminar halls.
                    </p>
                  </div>
                </div>

                {/* Campus-Wide Hazard Option */}
                <div
                  onClick={() => { setMainDomain('campus'); setSubScope('campus'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    subScope === 'campus'
                      ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'bg-white border-ivory-300 hover:bg-ivory-100'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 shrink-0 border border-rose-200">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-forest-950">Campus-Wide Hazard / Emergency</h5>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        Safety Critical
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      Live hanging wires, waterlogged pathways, snake sightings, open manholes.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Issue Category */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <h4 className="text-sm font-bold text-forest-950">Step 2: Select Maintenance Category</h4>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Directly routes to the specialized domain team with service-level agreement tracking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      category === cat.id
                        ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-white border-ivory-300 hover:bg-ivory-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-ivory-200 flex items-center justify-center text-forest-900">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-forest-950">{cat.label}</div>
                        <div className="text-[10px] text-charcoal-500 font-mono">
                          Routes to: {cat.domain.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-charcoal-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Description, Location Landmark & Evidence */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Issue Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projector HDMI port broken or buzzing fan regulator..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-xs py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Detailed Description <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain when this issue occurs and how it impacts lecture, lab work, or hostel living..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Exact Location / Room / Bench Landmark
                </label>
                <input
                  type="text"
                  placeholder={
                    subScope === 'class' ? 'Academic Block 1 - Room 302 (CSE-B)' :
                    subScope === 'room' ? 'Vashistha Bhavan - Room 304' :
                    'Walkway or room landmark...'
                  }
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              {/* Photo Evidence */}
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>Attach Evidence Photo</span>
                  </span>
                  <span className="text-[10px] text-charcoal-500">Accelerates on-site verification</span>
                </label>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(preset.url)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                        selectedPhoto === preset.url
                          ? 'bg-forest-900 text-white border-forest-900'
                          : 'bg-white text-charcoal-700 border-ivory-300 hover:bg-ivory-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="relative mt-2 rounded-2xl overflow-hidden h-28 border border-ivory-300">
                  <img
                    src={selectedPhoto}
                    alt="Evidence Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] text-mint-300 font-medium">✓ Geotagged evidence attached</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: Review, AI Duplicate Check & Submission */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Summary Path Card */}
              <div className="p-3 rounded-2xl bg-ivory-100 border border-ivory-200 text-xs text-charcoal-700 flex flex-wrap items-center gap-2">
                <span className="font-bold text-forest-950">Classification:</span>
                <span className="px-2 py-0.5 rounded bg-white border border-ivory-300 text-forest-950 font-bold uppercase text-[10px]">
                  {mainDomain}
                </span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-white border border-ivory-300 text-blue-700 font-bold uppercase text-[10px]">
                  Scope: {subScope}
                </span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-white border border-ivory-300 text-emerald-800 font-bold uppercase text-[10px]">
                  {CATEGORIES.find(c => c.id === category)?.label}
                </span>
              </div>

              {/* ✨ AI DUPLICATE CHECK PROMPT */}
              {duplicateMatches.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2.5">
                  <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Potential Duplicate Report Detected</span>
                  </div>

                  <p className="text-xs text-charcoal-800 leading-relaxed">
                    A similar report is already active in your area. Instead of creating a duplicate ticket, supporting this existing report increases its priority score so staff resolve it faster:
                  </p>

                  {duplicateMatches.map(match => (
                    <div 
                      key={match.id}
                      className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between shadow-subtle"
                    >
                      <div className="pr-2">
                        <div className="text-xs font-bold text-forest-950">
                          {match.title} <span className="font-mono text-charcoal-500 font-normal">({match.id})</span>
                        </div>
                        <div className="text-[11px] text-charcoal-500 mt-0.5">
                          Status: <strong className="text-amber-800 capitalize">{match.status}</strong> • {match.upvotes.length} peers confirmed
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          boostExistingTicket(match.id);
                          onClose();
                        }}
                        className="btn-primary text-xs py-1.5 px-3 shrink-0"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Support Existing</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Priority & Urgency Preview */}
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1.5">
                  Proposed Urgency & Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'medium', label: 'Standard', desc: 'Resolved in 24-48 hrs' },
                    { id: 'high', label: 'High Priority', desc: 'Affects lecture or lab' },
                    { id: 'emergency', label: 'Safety Hazard', desc: 'Immediate intervention' }
                  ].map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        urgency === u.id
                          ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/30'
                          : 'bg-white border-ivory-300 hover:bg-ivory-100'
                      }`}
                    >
                      <div className="text-xs font-bold text-forest-950">{u.label}</div>
                      <div className="text-[10px] text-charcoal-500 mt-0.5">{u.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full btn-primary py-3 text-sm font-bold shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Verified Campus Report</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBackStep}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary text-xs py-2 px-4 font-bold"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-charcoal-500 hover:text-charcoal-800"
            >
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
