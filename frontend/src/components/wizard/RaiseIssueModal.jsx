import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { api } from '../../services/api';
import { analyzeVisualEvidence } from '../../services/visionEngine';
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
  ShieldAlert,
  ShieldCheck,
  Trash2,
  RefreshCw,
  Video,
  Check,
  Cpu,
  Eye,
  Scan,
  Activity
} from 'lucide-react';

export default function RaiseIssueModal({ onClose }) {
  const { 
    currentUser, 
    raiseTicket, 
    tickets, 
    boostExistingTicket,
    setShowLoginModal 
  } = useApp();

  // If unauthenticated, redirect to login modal
  useEffect(() => {
    if (!currentUser) {
      onClose();
      setShowLoginModal(true);
    }
  }, [currentUser]);

  if (!currentUser) return null;

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
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // AI Copilot & Vision Intelligence State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [visualMetrics, setVisualMetrics] = useState(null);

  const videoRef = useRef(null);
  const nativeCameraInputRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Stop camera media stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (err) {}
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Launch live webcam or mobile camera
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video playback warning:', e));
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Direct camera stream unavailable or permission denied. You can upload an image or launch your phone camera app.');
      if (nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
      }
    }
  };

  // Handle immediate photo selection & AI vision defect inspection
  const handleSelectPhoto = async (photoUrl, canvasEl = null) => {
    setSelectedPhoto(photoUrl);
    if (!photoUrl) {
      setVisualMetrics(null);
      return;
    }

    setIsAnalyzingAI(true);
    try {
      const metrics = await analyzeVisualEvidence(canvasEl || photoUrl, category);
      setVisualMetrics(metrics);
      const res = await api.analyzeIssueAI({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        scope: subScope,
        imageUrl: photoUrl,
        visualMetrics: metrics
      });
      if (res && res.success) {
        setAiAnalysis(res);
      }
    } catch (err) {
      console.warn('Vision analysis failed:', err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Snap photo frame from live camera stream
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const maxDim = 800;
    let w = video.videoWidth || 640;
    let h = video.videoHeight || 480;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    await handleSelectPhoto(dataUrl, canvas);
  };

  // Process uploaded or camera file with client-side scaling
  const processImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = async () => {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        await handleSelectPhoto(dataUrl, canvas);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Cleanup on unmount or step changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (step !== 3) {
      stopCamera();
    }
  }, [step]);

  // Photo presets for testing/demo (Includes Defect Faults, Working Intact Assets, and Irrelevant items)
  const PHOTO_PRESETS = [
    { label: '🚨 Projector (Fault: HDMI & Lens)', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80' },
    { label: '🚨 Live Wire (Fault: Exposed 230V)', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
    { label: '🚨 Ceiling Fan (Fault: Blade Droop)', url: 'https://images.unsplash.com/photo-1590725140246-20acbe44865e?w=800&auto=format&fit=crop&q=80' },
    { label: '🚨 Water Leak (Fault: Valve Leak)', url: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?w=800&auto=format&fit=crop&q=80' },
    { label: '🚨 Broken Desk (Fault: Cracked Weld)', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80' },
    { label: '✅ Working Room / Fan (No Fault)', url: 'https://images.unsplash.com/photo-1540575467063-d7e7e59b2075?w=800&auto=format&fit=crop&q=80' },
    { label: '✅ Working Lab Desk (No Fault)', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
    { label: '⚠️ Nature Garden (Irrelevant)', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80' },
    { label: '⚠️ Coffee Cup (Irrelevant)', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80' },
    { label: '⚠️ Selfie Portrait (Irrelevant)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80' }
  ];

  // Live AI Issue Analysis (Auto-Triage, Vision Defect, Semantic Duplicate Matching)
  useEffect(() => {
    // If no text and no photo is selected, clear analysis
    if (!title.trim() && !description.trim() && !selectedPhoto) {
      setAiAnalysis(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzingAI(true);
      try {
        let metrics = visualMetrics;
        if (selectedPhoto && !metrics) {
          metrics = await analyzeVisualEvidence(selectedPhoto, category);
          setVisualMetrics(metrics);
        }
        const res = await api.analyzeIssueAI({
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          scope: subScope,
          imageUrl: selectedPhoto,
          visualMetrics: metrics
        });
        if (res && res.success) {
          setAiAnalysis(res);
        }
      } catch (err) {
        console.warn('AI analysis call failed:', err);
      } finally {
        setIsAnalyzingAI(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [title, description, category, location, subScope, selectedPhoto]);

  // AI Semantic Duplicate Detection Engine
  const duplicateMatches = useMemo(() => {
    if (aiAnalysis?.duplicates && aiAnalysis.duplicates.length > 0) {
      return aiAnalysis.duplicates;
    }

    // Heuristic fallback
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
    }).slice(0, 3).map(t => ({
      ticket: t,
      matchConfidence: 86,
      matchedKeywords: keywords.slice(0, 3),
      matchReason: 'Heuristic keyword overlap with active campus report'
    }));
  }, [aiAnalysis, title, description, category, tickets]);

  const handleNextStep = () => {
    if (step === 1 && !subScope) return;
    if (step === 2 && !category) return;
    if (step === 3 && (!title.trim() || !description.trim())) return;
    setStep(Math.min(4, step + 1));
  };

  const handleBackStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleModalClose = () => {
    stopCamera();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    stopCamera();
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
      imageUrl: selectedPhoto || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      visibilityPercentage: (aiAnalysis?.vision?.isRelevant && aiAnalysis?.vision?.hasDefect) ? (aiAnalysis.vision.visibilityPercentage || 92) : 0,
      defectDiagnosis: (aiAnalysis?.vision?.isRelevant && aiAnalysis?.vision?.hasDefect) 
        ? aiAnalysis.vision.defectType 
        : (aiAnalysis?.vision?.isRelevant && !aiAnalysis?.vision?.hasDefect ? 'No Fault Found — Asset Working Fine' : null),
      detectedAsset: aiAnalysis?.vision?.isRelevant ? aiAnalysis.vision.detectedObject : null,
      boundingBox: (aiAnalysis?.vision?.isRelevant && aiAnalysis?.vision?.hasDefect) ? aiAnalysis.vision.boundingBox : null,
      predictedSla: aiAnalysis?.slaPrediction?.formattedETA || null,
      mlModel: aiAnalysis?.mlMetadata?.visionModel || 'CampusOne-Multimodal VLM & YOLOv8-VisionNet',
      priorityScore: (() => {
        const isPhotoVerified = (aiAnalysis?.vision?.isRelevant === true && aiAnalysis?.vision?.hasDefect === true);
        const base = urgency === 'emergency' ? 85 : urgency === 'high' ? 70 : 50;
        const evidenceBoost = isPhotoVerified ? 15 : 0;
        return Math.min(base + evidenceBoost, 100);
      })()
    };

    raiseTicket(ticketData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in overscroll-contain">
      <div className="bg-white border border-ivory-300 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-3.5 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[96dvh] animate-scale-in">
        
        {/* Header */}
        <div className="pb-3 sm:pb-4 border-b border-ivory-200 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <GitFork className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-forest-950">Issue Reporting Wizard</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-charcoal-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Refines scope to protect student privacy and ensure fast routing.
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Step Progress Pills */}
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {[1, 2, 3, 4].map(s => (
                <div 
                  key={s}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all ${
                    step === s 
                      ? 'bg-[#092d25] text-white shadow-sm'
                      : step > s 
                      ? 'bg-[#0f8e65] text-white' 
                      : 'bg-ivory-200 text-charcoal-400'
                  }`}
                  style={
                    step === s ? { backgroundColor: '#092d25', color: '#ffffff' } :
                    step > s ? { backgroundColor: '#0f8e65', color: '#ffffff' } : {}
                  }
                >
                  {step > s ? '✓' : s}
                </div>
              ))}
            </div>

            <button onClick={handleModalClose} className="p-1 text-charcoal-400 hover:text-forest-950 touch-press">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1">

          {/* STEP 1: Scope & Location Selection */}
          {step === 1 && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Clean Editorial Title */}
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-bold text-forest-950">
                  Where is this issue located?
                </h4>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Select location for verified Stage-1 mentor routing to protect privacy & speed up triage.
                </p>
              </div>

              {/* Sleek Profile & Privacy Pill */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-ivory-100/80 border border-ivory-300 text-xs text-forest-950">
                <div className="flex items-center space-x-2 truncate min-w-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-semibold truncate">
                    {currentUser.rollNo || 'Student'}
                  </span>
                  <span className="text-charcoal-400 text-[11px] truncate hidden sm:inline">
                    • {currentUser.classSection || 'Section'} • {currentUser.hostel || 'Hostel'} Rm {currentUser.room || '-'}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 font-medium">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>Privacy Protected</span>
                </div>
              </div>

              {/* Aesthetic Location Cards */}
              <div className="space-y-2">
                {[
                  {
                    id: 'class',
                    domain: 'college',
                    title: 'My Class Section',
                    tag: currentUser.classSection || 'CSE-B 3rd Year',
                    desc: 'Projectors, smartboard, classroom AC, benches, lighting',
                    reviewer: 'Class Advisor',
                    badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
                    icon: School,
                    iconStyle: 'bg-blue-50 text-blue-700 border-blue-200'
                  },
                  {
                    id: 'room',
                    domain: 'hostel',
                    title: 'My Hostel Room',
                    tag: `${currentUser.hostel || 'Hostel'} • Rm ${currentUser.room || '129'}`,
                    desc: 'Ceiling fan, study desk, switchboard, LAN port, door latch',
                    reviewer: 'Hostel Warden',
                    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
                    icon: Home,
                    iconStyle: 'bg-amber-50 text-amber-700 border-amber-200'
                  },
                  {
                    id: 'hostel_generic',
                    domain: 'hostel',
                    title: 'Hostel Common Area & Mess',
                    tag: `${currentUser.hostel || 'Hostel'} Facilities`,
                    desc: 'RO water cooler, washroom plumbing, hostel Wi-Fi, mess hygiene',
                    reviewer: 'Hostel Warden',
                    badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
                    icon: Building2,
                    iconStyle: 'bg-teal-50 text-teal-700 border-teal-200'
                  },
                  {
                    id: 'department',
                    domain: 'college',
                    title: 'Department Labs & Halls',
                    tag: `${currentUser.department || 'CSE'} Department`,
                    desc: 'Lab workstations, seminar halls, corridor dispensers',
                    reviewer: 'Class Advisor',
                    badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
                    icon: Building2,
                    iconStyle: 'bg-purple-50 text-purple-700 border-purple-200'
                  },
                  {
                    id: 'campus',
                    domain: 'campus',
                    title: 'Campus Hazard / Emergency',
                    tag: 'Public Grounds',
                    desc: 'Live hanging wires, waterlogged pathways, safety hazards',
                    reviewer: 'Fast-Track',
                    badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
                    icon: AlertTriangle,
                    iconStyle: 'bg-rose-50 text-rose-700 border-rose-200'
                  }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = subScope === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => { setMainDomain(opt.domain); setSubScope(opt.id); }}
                      className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 touch-press ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-white border-ivory-300 hover:border-emerald-300 hover:bg-ivory-50/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center border ${opt.iconStyle} transition-transform group-hover:scale-105 shadow-2xs`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="text-xs sm:text-sm font-bold text-forest-950 truncate">
                              {opt.title}
                            </h5>
                            <span className="text-[10px] sm:text-[11px] text-charcoal-400 font-medium truncate hidden xs:inline">
                              • {opt.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-charcoal-500 truncate mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${opt.badgeStyle} hidden sm:inline-flex`}>
                          Stage 1 → {opt.reviewer}
                        </span>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                            : 'border-ivory-400 bg-white group-hover:border-emerald-400'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Stage-1 Weightage Context Note */}
              <div className="pt-0.5 flex items-center justify-between text-[11px] text-charcoal-500 px-1">
                <span className="flex items-center space-x-1.5">
                  <span className="text-emerald-700 font-bold">⚡</span>
                  <span>Mentor-verified reports receive <strong className="text-forest-950 font-bold">+20 Priority Boost</strong> before admin dispatch.</span>
                </span>
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

              {/* Photo Evidence (Live Camera + Presentation Presets) */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-forest-950 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>Evidence Photo (Live Camera Only)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live On-Site Verification</span>
                  </span>
                </label>

                {/* Native mobile camera fallback input */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={nativeCameraInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Live Camera Viewfinder (when camera active) */}
                {isCameraActive ? (
                  <div className="rounded-2xl border-2 border-emerald-500 bg-black overflow-hidden relative p-2 space-y-2 animate-fade-in shadow-xl">
                    <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-44 sm:h-56 object-cover rounded-xl"
                      />
                      <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-rose-400 font-bold border border-rose-500/40">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>LIVE CAMERA</span>
                      </div>
                    </div>

                    {cameraError && (
                      <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-500/40 text-[11px] text-rose-200">
                        {cameraError}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 px-1">
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors touch-press"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="btn-primary py-2 px-4 sm:px-5 text-xs font-bold flex items-center space-x-2 shadow-lg ring-2 ring-emerald-400 touch-press"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => nativeCameraInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-mint-300 text-[11px] font-medium transition-colors touch-press"
                        title="Open device camera application"
                      >
                        Native App
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Sole Primary Action: Take Photo (Live Camera Only) */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full flex items-center justify-center space-x-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md group touch-press border border-emerald-500/30"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <Camera className="w-5 h-5 text-mint-300" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs sm:text-sm text-white flex items-center space-x-1.5">
                          <span>Take Photo</span>
                          <span className="w-2 h-2 rounded-full bg-mint-300 animate-pulse" />
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-mint-200/90 font-normal">
                          Use Live Camera on-site to scan equipment
                        </div>
                      </div>
                    </button>

                    {/* Preview Box with YOLOv8 Defect Localization Bounding Box */}
                    {selectedPhoto ? (
                      <div className="relative rounded-2xl overflow-hidden h-36 sm:h-44 border border-ivory-300 group shadow-sm bg-black">
                        <img
                          src={selectedPhoto}
                          alt="Evidence Preview"
                          className="w-full h-full object-cover"
                        />

                        {/* Real-Time YOLOv8 Defect Localization Bounding Box Overlay */}
                        {aiAnalysis?.vision?.hasDefect && aiAnalysis?.vision?.boundingBox && (
                          <div 
                            className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded-lg pointer-events-none transition-all duration-500 z-10 shadow-lg"
                            style={{
                              top: `${aiAnalysis.vision.boundingBox.ymin}%`,
                              left: `${aiAnalysis.vision.boundingBox.xmin}%`,
                              width: `${aiAnalysis.vision.boundingBox.xmax - aiAnalysis.vision.boundingBox.xmin}%`,
                              height: `${aiAnalysis.vision.boundingBox.ymax - aiAnalysis.vision.boundingBox.ymin}%`,
                            }}
                          >
                            {/* Corner targeting reticles */}
                            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-mint-300" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-mint-300" />
                            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-mint-300" />
                            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-mint-300" />

                            {/* Defect Classification Pill with live ping */}
                            <div className="absolute -top-6 left-0 bg-emerald-800/90 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow flex items-center space-x-1.5 whitespace-nowrap border border-emerald-400/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-mint-300 animate-ping" />
                              <span>YOLOv8: {aiAnalysis.vision.boundingBox.defect || aiAnalysis.vision.defectType} ({aiAnalysis.vision.visibilityPercentage}%)</span>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent flex items-end justify-between p-3 pointer-events-none">
                          <span className="text-[11px] text-mint-300 font-semibold flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Live evidence photo attached</span>
                          </span>
                          <div className="flex items-center space-x-1.5 pointer-events-auto">
                            <button
                              type="button"
                              onClick={startCamera}
                              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold backdrop-blur-sm transition-all flex items-center space-x-1 touch-press"
                              title="Retake photo using live camera"
                            >
                              <Camera className="w-3 h-3 text-mint-300" />
                              <span>Retake</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectPhoto(null)}
                              className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white text-[10px] backdrop-blur-sm transition-all touch-press"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-ivory-300 rounded-2xl p-3 text-center bg-ivory-50/50">
                        <p className="text-xs text-charcoal-500">
                          No photo captured yet. Click "Take Photo" to activate the live camera.
                        </p>
                      </div>
                    )}

                    {/* Quick Demo Presets */}
                    <div className="pt-0.5">
                      <span className="text-[10px] font-semibold text-charcoal-500 block mb-1">
                        Or pick a sample photo for presentation:
                      </span>
                      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                        {PHOTO_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPhoto(preset.url)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all touch-press ${
                              selectedPhoto === preset.url
                                ? 'bg-[#092d25] text-white border-[#092d25] font-bold shadow-xs'
                                : 'bg-white text-charcoal-700 border-ivory-300 hover:bg-ivory-100'
                            }`}
                            style={
                              selectedPhoto === preset.url
                                ? { backgroundColor: '#092d25', color: '#ffffff' }
                                : { backgroundColor: '#ffffff', color: '#192822' }
                            }
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ✨ CAMPUSONE AI COPILOT & COMPUTER VISION SCANNER */}
                    {(isAnalyzingAI || aiAnalysis) && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-mint-50/50 border border-emerald-300/80 shadow-subtle space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between flex-wrap gap-1.5">
                          <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs">
                            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                            <span>CampusOne Multimodal AI Copilot</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300">
                              🧠 Multimodal VLM + MiniLM-L6
                            </span>
                            {isAnalyzingAI ? (
                              <span className="flex items-center space-x-1 text-[10px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full animate-pulse">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Analyzing...</span>
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-emerald-800 font-bold bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
                                ⚡ Active Inference
                              </span>
                            )}
                          </div>
                        </div>

                        {aiAnalysis?.triage && (
                          <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="text-[11px] font-bold text-forest-950 flex items-center space-x-1.5">
                                <span>Auto-Triage Suggestion:</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold uppercase text-[10px]">
                                  {CATEGORIES.find(c => c.id === aiAnalysis.triage.suggestedCategory)?.label || aiAnalysis.triage.suggestedCategory}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700">
                                  ({aiAnalysis.triage.confidence}% Confidence)
                                </span>
                              </div>
                              <p className="text-[10px] text-charcoal-600 mt-0.5">
                                {aiAnalysis.triage.explanation}
                              </p>
                            </div>

                            {category !== aiAnalysis.triage.suggestedCategory && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCategory(aiAnalysis.triage.suggestedCategory);
                                  if (aiAnalysis.triage.suggestedUrgency) {
                                    setUrgency(aiAnalysis.triage.suggestedUrgency);
                                  }
                                }}
                                className="btn-primary text-[10px] py-1 px-2.5 self-start sm:self-center shrink-0"
                              >
                                Apply AI Category
                              </button>
                            )}
                          </div>
                        )}

                        {/* ⚡ Machine Learning Predictive SLA Regressor */}
                        {aiAnalysis?.slaPrediction && (
                          <div className="bg-white/85 p-2.5 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                            <div>
                              <div className="text-[11px] font-bold text-forest-950 flex items-center space-x-1.5 flex-wrap">
                                <span className="flex items-center space-x-1 text-emerald-800">
                                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                  <span>ML Predicted SLA:</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-extrabold text-[10px] border border-amber-300">
                                  ⚡ {aiAnalysis.slaPrediction.formattedETA}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-700">
                                  ({aiAnalysis.slaPrediction.confidenceScore}% Model Confidence)
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {aiAnalysis.slaPrediction.factors?.map((factor, fi) => (
                                  <span key={fi} className="text-[9px] px-1.5 py-0.5 rounded bg-ivory-100 text-charcoal-600 border border-ivory-300 font-mono">
                                    {factor.name}: <strong className="text-forest-950">{factor.value}</strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 self-start sm:self-center font-bold">
                              {aiAnalysis.slaPrediction.mlModel}
                            </span>
                          </div>
                        )}

                        {/* Computer Vision Defect Scanner & Problem Visibility Output (3 Distinct States) */}
                        {aiAnalysis?.vision && selectedPhoto && (
                          aiAnalysis.vision.isRelevant && aiAnalysis.vision.hasDefect ? (
                            /* 🚨 STATE 1: FAULT DETECTED (Damage Visible) */
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-forest-950 to-[#07241d] text-white border-2 border-emerald-500/70 shadow-xl space-y-3 animate-fade-in">
                              {/* Header & Problem Visibility Score Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-mint-300 flex items-center space-x-1.5">
                                      <span>🚨 Fault Detected: {aiAnalysis.vision.defectType}</span>
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    </div>
                                    <div className="text-[10px] text-emerald-200/80">
                                      {aiAnalysis.vision.clarityRating}
                                    </div>
                                  </div>
                                </div>

                                {/* Prominent Problem Visibility Percentage Badge */}
                                <div className="text-right shrink-0">
                                  <div className="inline-flex items-baseline space-x-1 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 shadow-sm">
                                    <span className="text-xl font-black tracking-tight text-mint-300">
                                      {aiAnalysis.vision.visibilityPercentage}%
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-300 uppercase">
                                      Visibility
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Dynamic Problem Visibility Progress Meter */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-mint-200/90 font-medium">
                                  <span>Problem Visibility in Frame</span>
                                  <span className="font-mono font-bold text-mint-300">
                                    {aiAnalysis.vision.visibilityPercentage}% Defect Prominence
                                  </span>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-black/60 p-0.5 border border-emerald-500/40 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-mint-300 shadow-md transition-all duration-700 ease-out"
                                    style={{ width: `${aiAnalysis.vision.visibilityPercentage}%` }}
                                  />
                                </div>
                              </div>

                              {/* Recognized Defect Intelligence Card */}
                              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 space-y-2 text-xs">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-mint-200/80 block">
                                      Asset Identified
                                    </span>
                                    <span className="font-bold text-white text-xs">
                                      {aiAnalysis.vision.detectedObject}
                                    </span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/30 text-[10px] font-bold text-mint-300 shrink-0">
                                    ⚡ +15 AI Priority Active
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 block">
                                    Defect Diagnosis
                                  </span>
                                  <span className="text-amber-200 font-semibold text-xs">
                                    {aiAnalysis.vision.defectType}
                                  </span>
                                </div>

                                {aiAnalysis.vision.defectFeature && (
                                  <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/80 block">
                                      Recognized Defect Feature
                                    </span>
                                    <span className="text-ivory-200 text-[11px]">
                                      {aiAnalysis.vision.defectFeature}
                                    </span>
                                  </div>
                                )}

                                <div className="text-[10px] text-emerald-300 font-medium pt-0.5">
                                  Severity Assessment: {aiAnalysis.vision.severity}
                                </div>
                              </div>

                              {/* 1-Click Auto-Fill Button from Image Recognition */}
                              {aiAnalysis.vision.suggestedTitle && (!title || !description || title !== aiAnalysis.vision.suggestedTitle) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (aiAnalysis.vision.suggestedTitle) setTitle(aiAnalysis.vision.suggestedTitle);
                                    if (aiAnalysis.vision.suggestedDescription) setDescription(aiAnalysis.vision.suggestedDescription);
                                    if (aiAnalysis.vision.suggestedCategory) setCategory(aiAnalysis.vision.suggestedCategory);
                                  }}
                                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all touch-press border border-emerald-400/40"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                                  <span>✨ Auto-Fill Title & Details from Image Recognition</span>
                                </button>
                              )}

                              {/* Recommended Technician Toolset */}
                              {aiAnalysis.vision.recommendedTools && aiAnalysis.vision.recommendedTools.length > 0 && (
                                <div className="pt-1 border-t border-emerald-800/80">
                                  <div className="text-[10px] text-mint-200 font-bold mb-1">
                                    Recommended Technician Toolset:
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {aiAnalysis.vision.recommendedTools.map((tool, ti) => (
                                      <span key={ti} className="px-1.5 py-0.5 rounded bg-emerald-900/80 text-[9px] text-mint-300 border border-emerald-700 font-mono">
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : aiAnalysis.vision.isRelevant && !aiAnalysis.vision.hasDefect ? (
                            /* ✅ STATE 2: NO PROBLEM FOUND / WORKING FINE */
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c2333] via-[#091f2c] to-[#071924] text-white border-2 border-sky-400/80 shadow-xl space-y-3 animate-fade-in">
                              {/* Header & 0% Defect Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-xl bg-sky-400/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-sky-200 flex items-center space-x-1.5">
                                      <span>✅ No Problem Found — Working Fine</span>
                                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                    </div>
                                    <div className="text-[10px] text-sky-300/80">
                                      Asset Verified: {aiAnalysis.vision.detectedObject}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="inline-flex items-baseline space-x-1 px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/50 shadow-sm">
                                    <span className="text-xl font-black tracking-tight text-sky-300">
                                      0%
                                    </span>
                                    <span className="text-[10px] font-bold text-sky-300 uppercase">
                                      Fault
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Progress bar at 0% defect */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-sky-200/90 font-medium">
                                  <span>Defect Visibility in Frame</span>
                                  <span className="font-mono font-bold text-sky-300">0% Physical Defect (Asset Intact)</span>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-black/60 p-0.5 border border-sky-500/40 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-sky-400/50 transition-all duration-700 ease-out"
                                    style={{ width: '0%' }}
                                  />
                                </div>
                              </div>

                              {/* Inspection Result Box */}
                              <div className="p-3 rounded-xl bg-black/40 border border-sky-500/30 space-y-2 text-xs">
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300/80 block">
                                    Optical Inspection Result
                                  </span>
                                  <p className="text-sky-100 text-[11px] leading-relaxed mt-0.5">
                                    {aiAnalysis.vision.warningMessage || "Our optical inspection scanned this asset. No visible physical breakdown, cracks, severed wires, or fluid leaks were detected. The equipment appears to be operating normally and in good condition."}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-400/30 flex items-center justify-between text-[11px]">
                                  <span className="text-sky-200 font-medium">Physical Evidence Priority:</span>
                                  <span className="font-bold text-sky-300 uppercase tracking-wide">
                                    +0 Boost (No Visible Damage)
                                  </span>
                                </div>
                              </div>

                              <p className="text-[10px] text-sky-200/90">
                                💡 <strong>Internal Fault?</strong> If this asset has an internal or invisible fault (such as power outage, blown internal fuse, or software error), you may still proceed with reporting. If you need to show physical damage, click <strong>Retake</strong> to capture a closer angle.
                              </p>

                              <button
                                type="button"
                                onClick={startCamera}
                                className="w-full py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all touch-press"
                              >
                                <Camera className="w-3.5 h-3.5 text-sky-300" />
                                <span>Retake Photo (Closer Angle of Defect)</span>
                              </button>
                            </div>
                          ) : (
                            /* ⚠️ STATE 3: IRRELEVANT / NON-FACILITY IMAGE */
                            <div className="p-4 rounded-2xl bg-amber-950/95 text-white border-2 border-amber-500 shadow-xl space-y-3 animate-fade-in">
                              {/* Header & 0% Visibility Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                                      <span>⚠️ Irrelevant Image Detected</span>
                                    </div>
                                    <div className="text-[10px] text-amber-200/80">
                                      Zero campus maintenance problem visible
                                    </div>
                                  </div>
                                </div>

                                {/* 0% Visibility Badge */}
                                <div className="text-right shrink-0">
                                  <div className="inline-flex items-baseline space-x-1 px-3 py-1 rounded-xl bg-rose-500/25 border border-rose-500/40 shadow-sm">
                                    <span className="text-xl font-black tracking-tight text-rose-300">
                                      0%
                                    </span>
                                    <span className="text-[10px] font-bold text-rose-300 uppercase">
                                      Visibility
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 0% Progress Bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-amber-200 font-medium">
                                  <span>Problem Visibility in Frame</span>
                                  <span className="font-mono font-bold text-rose-400">0% (Score Paused)</span>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-black/60 p-0.5 border border-rose-500/30 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-rose-500/40 transition-all duration-500"
                                    style={{ width: '0%' }}
                                  />
                                </div>
                              </div>

                              <p className="text-xs text-amber-100/90 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-amber-500/30">
                                {aiAnalysis.vision.warningMessage || "Our AI Vision model identified this photo as non-facility subject matter (nature foliage, food/drink, portrait/selfie, or unrelated scenery). No physical maintenance problem is visible."}
                              </p>

                              <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/30 flex items-center justify-between text-[11px]">
                                <span className="text-amber-200/90 font-medium">AI Evidence Priority Status:</span>
                                <span className="font-bold text-rose-400 uppercase tracking-wide flex items-center space-x-1">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>AI Evidence Score Paused (+0 Boost)</span>
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={startCamera}
                                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md touch-press border border-amber-400/40"
                              >
                                <Camera className="w-4 h-4 text-white" />
                                <span>Retake Photo with Live Camera</span>
                              </button>
                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                )}
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
                <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-3 shadow-subtle">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold uppercase tracking-wide">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>MiniLM Dense Vector Duplicate Engine</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold">
                      128-Dim Cosine Space Active
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-800 leading-relaxed">
                    A matching active report was identified in your area. Boosting this report will raise its priority for maintenance teams faster than creating a redundant ticket:
                  </p>

                  {duplicateMatches.map((match, idx) => {
                    const t = match.ticket || match;
                    const conf = match.matchConfidence || 88;
                    return (
                      <div 
                        key={t.id || idx}
                        className="p-3.5 rounded-xl bg-white border border-amber-200 flex flex-col space-y-2 shadow-subtle"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="pr-2">
                            <div className="text-xs font-bold text-forest-950 flex items-center space-x-2 flex-wrap gap-y-1">
                              <span>{t.title}</span>
                              <span className="font-mono text-charcoal-500 font-normal">({t.id})</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {conf}% Hybrid Match
                              </span>
                              {match.vectorSimilarity !== undefined && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center space-x-1">
                                  <Zap className="w-2.5 h-2.5 text-blue-600" />
                                  <span>{match.vectorSimilarity}% Vector Cosine</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-charcoal-500 mt-0.5">
                              Status: <strong className="text-amber-800 capitalize">{t.status}</strong> • {(t.upvotes || []).length} peers confirmed
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              boostExistingTicket(t.id);
                              onClose();
                            }}
                            className="btn-primary text-xs py-1.5 px-3 shrink-0 flex items-center space-x-1.5"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Boost (+1 Vote)</span>
                          </button>
                        </div>

                        {match.matchedKeywords && match.matchedKeywords.length > 0 && (
                          <div className="flex items-center space-x-1.5 pt-1 text-[10px] text-charcoal-500 flex-wrap">
                            <span className="font-semibold text-charcoal-700">Matched Entities:</span>
                            {match.matchedKeywords.map((kw, ki) => (
                              <span key={ki} className="px-1.5 py-0.5 rounded bg-ivory-200 text-charcoal-700 font-mono text-[9px]">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                        {match.matchReason && (
                          <div className="text-[10px] text-amber-900 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/60">
                            💡 <em>{match.matchReason}</em>
                          </div>
                        )}
                      </div>
                    );
                  })}
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

              {/* AI Dynamic Priority Telemetry Card (Gated by Photo Verification) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-forest-950 to-forest-900 text-white shadow-md space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-mint-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-mint-300">
                      AI Dynamic Priority Telemetry
                    </span>
                  </div>
                  
                  {aiAnalysis?.vision?.isRelevant ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-mint-300 text-[11px] font-bold border border-emerald-400/40 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Score: {urgency === 'emergency' ? 98 : urgency === 'high' ? 85 : 68}/100</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 text-[11px] font-bold border border-amber-400/40 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Base Score: {urgency === 'emergency' ? 85 : urgency === 'high' ? 70 : 50}/100 (Unverified Photo)</span>
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1 text-[11px]">
                  <div className="bg-white/10 rounded-xl p-2 border border-white/10">
                    <div className="text-[10px] text-mint-200/80">Hazard Weight</div>
                    <div className="font-extrabold text-white mt-0.5">
                      {urgency === 'emergency' ? '85 (Critical)' : category === 'safety' ? '85 (Safety)' : '50 (Standard)'}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-2 border border-white/10">
                    <div className="text-[10px] text-mint-200/80">Scope Radius</div>
                    <div className="font-extrabold text-white mt-0.5">
                      {subScope === 'campus' ? '+10 Campus' : subScope === 'department' ? '+5 Dept' : '+0 Section'}
                    </div>
                  </div>

                  <div className={`rounded-xl p-2 border ${
                    aiAnalysis?.vision?.isRelevant 
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-mint-300' 
                      : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  }`}>
                    <div className="text-[10px] opacity-80">Photo Evidence</div>
                    <div className="font-extrabold mt-0.5">
                      {aiAnalysis?.vision?.isRelevant 
                        ? `+15 (${aiAnalysis.vision.visibilityPercentage}% Visibility)` 
                        : '⚠️ 0% (Paused)'}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-2 border border-white/10">
                    <div className="text-[10px] text-mint-200/80">Dispatch Queue</div>
                    <div className="font-extrabold text-white mt-0.5 capitalize truncate">
                      {CATEGORIES.find(c => c.id === category)?.domain?.replace('_', ' ') || 'AV / Electrical'}
                    </div>
                  </div>
                </div>

                {/* ML SLA Forecast Telemetry Strip */}
                {aiAnalysis?.slaPrediction && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-[11px]">
                    <div className="flex items-center space-x-1.5 text-mint-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>ML Regressed Resolution SLA: <strong className="text-white">{aiAnalysis.slaPrediction.formattedETA}</strong></span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 font-semibold">{aiAnalysis.slaPrediction.mlModel}</span>
                  </div>
                )}

                {!aiAnalysis?.vision?.isRelevant && (
                  <div className="text-[10px] text-amber-200/90 bg-amber-950/60 p-2 rounded-xl border border-amber-500/30 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Photo unverified: The +15 hardware evidence boost is withheld until a relevant damaged facility image is uploaded.</span>
                  </div>
                )}
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
        <div className="pt-3 sm:pt-4 border-t border-ivory-200 flex items-center justify-between pb-safe sm:pb-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBackStep}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-charcoal-600 hover:text-forest-950 hover:bg-ivory-200 text-xs font-semibold touch-press"
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
              className="btn-primary text-xs py-2 sm:py-2.5 px-4 sm:px-5 font-bold touch-press"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleModalClose}
              className="text-xs text-charcoal-500 hover:text-charcoal-800 touch-press py-2 px-3"
            >
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
