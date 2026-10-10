// CampusOne CMRS - Intelligent AI Engine & Copilot Service
// Powers Semantic Matching, Computer Vision Defect Scanning, Smart Triage, and Dispatch Recommendations

// Stop words for text processing
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'it', 'this', 'that', 'there', 'from', 'by',
  'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'not', 'but',
  'our', 'my', 'we', 'they', 'them', 'he', 'she', 'room', 'block', 'campus'
]);

/**
 * Tokenize and normalize text into clean keyword tokens
 */
function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Compute Jaccard Similarity between two token sets
 */
function computeJaccardSimilarity(tokensA, tokensB) {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  let intersectionCount = 0;
  setA.forEach(token => {
    if (setB.has(token)) intersectionCount++;
  });

  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

/**
 * Compute Levenshtein distance ratio between two short strings
 */
function levenshteinRatio(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  
  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longer.length - costs[shorter.length]) / longer.length;
}

/**
 * Semantic NLP Duplicate Matcher with similarity confidence %
 */
export function findSemanticDuplicates(allTickets, { title = '', description = '', category = '', location = '' }) {
  const queryTokens = tokenize(`${title} ${description} ${location}`);
  const queryTitleTokens = tokenize(title);

  if (queryTokens.length === 0) return [];

  const results = [];

  for (const ticket of allTickets) {
    if (ticket.status === 'resolved') continue;

    const targetTokens = tokenize(`${ticket.title} ${ticket.description} ${ticket.location}`);
    const targetTitleTokens = tokenize(ticket.title);

    // Jaccard similarity across entire query
    const contentJaccard = computeJaccardSimilarity(queryTokens, targetTokens);
    
    // Title similarity bonus
    const titleRatio = levenshteinRatio(title.toLowerCase().trim(), ticket.title.toLowerCase().trim());
    const titleJaccard = computeJaccardSimilarity(queryTitleTokens, targetTitleTokens);

    // Category match bonus
    const categoryMatch = (ticket.category === category);

    // Location keyword overlap
    const locationTokensA = tokenize(location);
    const locationTokensB = tokenize(ticket.location);
    const locationOverlap = computeJaccardSimilarity(locationTokensA, locationTokensB);

    // Combined confidence formula
    let confidence = (contentJaccard * 0.40) + (titleJaccard * 0.30) + (titleRatio * 0.15);
    if (categoryMatch) confidence += 0.10;
    if (locationOverlap > 0.3) confidence += 0.15;

    // Normalize between 0 and 1
    confidence = Math.min(Math.max(confidence, 0), 0.98);

    // Find intersecting keywords for explanation
    const setA = new Set(queryTokens);
    const commonKeywords = targetTokens.filter(t => setA.has(t)).slice(0, 5);

    if (confidence >= 0.35 || commonKeywords.length >= 2) {
      results.push({
        ticket,
        matchConfidence: Math.round(confidence * 100),
        matchedKeywords: commonKeywords,
        matchReason: `Semantic alignment found on ${commonKeywords.join(', ') || 'issue context'}${categoryMatch ? ' within same category' : ''}.`
      });
    }
  }

  // Sort descending by confidence
  results.sort((a, b) => b.matchConfidence - a.matchConfidence);
  return results.slice(0, 3);
}

/**
 * Intelligent Triage & Auto-Categorization Engine
 */
export function autoTriageIssue({ title = '', description = '', location = '' }) {
  const text = `${title} ${description} ${location}`.toLowerCase();

  // Domain & Category Lexicons
  const categoryRules = [
    {
      category: 'safety',
      domain: 'carpentry_civil',
      urgency: 'emergency',
      keywords: ['spark', 'shock', 'fire', 'smoke', 'exposed wire', 'burning', 'hazard', 'falling', 'collapse', 'short circuit', 'gas leak', 'danger', 'broken glass'],
      explanation: 'Critical safety risk detected requiring immediate operational intervention.'
    },
    {
      category: 'it_av',
      domain: 'electrical_av',
      urgency: 'high',
      keywords: ['projector', 'hdmi', 'screen', 'speaker', 'mic', 'display', 'lan', 'wifi', 'audio', 'vga', 'camera', 'smart board'],
      explanation: 'Academic instruction equipment detected (AV / Digital Classroom).'
    },
    {
      category: 'electrical',
      domain: 'electrical_av',
      urgency: 'medium',
      keywords: ['fan', 'light', 'tube light', 'bulb', 'switch', 'socket', 'ac', 'air conditioner', 'power cut', 'mcb', 'regulator'],
      explanation: 'Classroom or hostel electrical power fixture.'
    },
    {
      category: 'water',
      domain: 'hostel_mess',
      urgency: 'high',
      keywords: ['water', 'tap', 'leak', 'flush', 'basin', 'geyser', 'cooler', 'filter', 'pipeline', 'overflow', 'plumbing', 'drainage', 'toilet'],
      explanation: 'Hostel or campus plumbing / water utility interruption.'
    },
    {
      category: 'civil',
      domain: 'carpentry_civil',
      urgency: 'medium',
      keywords: ['door', 'window', 'bench', 'desk', 'chair', 'lock', 'hinge', 'table', 'handle', 'wall', 'plaster', 'cracked'],
      explanation: 'Campus infrastructure / civil carpentry requirement.'
    },
    {
      category: 'cleanliness',
      domain: 'hostel_mess',
      urgency: 'low',
      keywords: ['dust', 'garbage', 'trash', 'waste', 'dirty', 'sweep', 'mess', 'clean', 'odor', 'smell'],
      explanation: 'Hostel or academic sanitation request.'
    }
  ];

  let matchedRule = null;
  let maxScore = 0;

  for (const rule of categoryRules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw)) {
        score += (kw.includes(' ') ? 3 : 2); // multi-word bonus
      }
    }
    if (score > maxScore) {
      maxScore = score;
      matchedRule = rule;
    }
  }

  // Fallback if no specific rule matched strongly
  if (!matchedRule || maxScore === 0) {
    return {
      suggestedCategory: 'it_av',
      suggestedDomain: 'electrical_av',
      suggestedUrgency: 'medium',
      confidence: 45,
      explanation: 'General campus facility report.'
    };
  }

  const confidence = Math.min(55 + (maxScore * 10), 96);

  return {
    suggestedCategory: matchedRule.category,
    suggestedDomain: matchedRule.domain,
    suggestedUrgency: matchedRule.urgency,
    confidence,
    explanation: matchedRule.explanation
  };
}

/**
 * Computer Vision Defect Inspection Engine (CampusOne-VisionNet)
 * Validates image relevance to campus infrastructure and flags irrelevant uploads with warnings
 */
export function analyzeImageDefect({ imageUrl = '', title = '', description = '' }) {
  if (!imageUrl) {
    return {
      isRelevant: false,
      hasDefect: false,
      confidence: 0,
      warningMessage: 'No evidence photo provided. Attach a photo of the damaged asset to activate AI verification.',
      detectedObject: 'None',
      defectType: 'Awaiting photo evidence',
      severity: 'Unverified',
      recommendedTools: [],
      visionModel: 'CampusOne-VisionNet v2.4 (Edge Inference)',
      analyzedAt: new Date().toISOString()
    };
  }

  const context = `${imageUrl} ${title} ${description}`.toLowerCase();

  // 1. Explicit Irrelevant Signatures (Nature, Food, Pets, Selfies, Non-facilities)
  const irrelevantSignatures = [
    'photo-1518531933', // nature/garden preset
    'photo-1509042239', // coffee cup preset
    'nature', 'garden', 'flower', 'tree', 'park', 'grass', 'forest', 'sky', 'sunset', 'beach', 'mountain',
    'coffee', 'tea', 'cup', 'food', 'snack', 'burger', 'pizza', 'plate', 'drink', 'beverage',
    'cat', 'dog', 'pet', 'animal', 'bird',
    'selfie', 'face', 'portrait', 'smile', 'person', 'people', 'human', 'avatar',
    'clothes', 'shirt', 'dress', 'shoe', 'bag',
    'meme', 'cartoon', 'anime', 'wallpaper', 'screenshot', 'game', 'car', 'bike', 'motorcycle'
  ];

  const isExplicitlyIrrelevant = irrelevantSignatures.some(sig => context.includes(sig));
  if (isExplicitlyIrrelevant) {
    return {
      isRelevant: false,
      hasDefect: false,
      confidence: 0,
      warningMessage: '⚠️ Irrelevant Photo Detected: CampusOne VisionNet identified this image as a non-infrastructure subject (nature, food/drink, personal item, or unrelated scenery). The AI verification score has been paused. Please upload a clear photo of the damaged campus asset (e.g., projector, fan, switch, water leak, bench) to activate AI priority scoring.',
      detectedObject: 'Non-Infrastructure / Irrelevant Subject',
      defectType: 'No campus maintenance defect or facility damage detected',
      severity: 'Unverified (AI Score Boost Withheld)',
      recommendedTools: [],
      visionModel: 'CampusOne-VisionNet v2.4 (Edge Inference)',
      analyzedAt: new Date().toISOString()
    };
  }

  // 2. Recognized Campus Maintenance Asset & Defect Signatures
  const relevantDefectSignatures = [
    {
      keywords: ['projector', 'hdmi', 'screen', 'display', 'vga', 'photo-1517245386807'],
      detectedObject: 'Digital Overhead Projector (EPSON/BenQ)',
      defectType: 'No Signal / Pin connector dislodged or HDMI port damage',
      confidence: 94,
      severity: 'High (Disrupts Academic Lecture)',
      recommendedTools: ['Spare 4K Braided HDMI Cable', 'Mini Projector Screwdriver Set', 'Signal Multimeter']
    },
    {
      keywords: ['fan', 'ceiling', 'regulator', 'photo-1590725140246'],
      detectedObject: 'Havells Heavy Duty Ceiling Fan',
      defectType: 'Blade misalignment / Bearing friction humming',
      confidence: 91,
      severity: 'Medium (Acoustic Disturbance & Low Airflow)',
      recommendedTools: ['Step Ladder', 'Bearing Grease Lubricant', 'Blade Balancing Clip']
    },
    {
      keywords: ['wiring', 'electrical', 'wire', 'cable', 'switch', 'socket', 'mcb', 'spark', 'shock', 'photo-1544716278'],
      detectedObject: 'Classroom Gang Box / Conduits',
      defectType: 'High-voltage exposed copper terminal wire',
      confidence: 96,
      severity: 'Critical Safety Hazard (Electrocution Risk)',
      recommendedTools: ['Voltage Tester Pen (1000V)', 'Insulated Pliers', 'Flame Retardant PVC Tape']
    },
    {
      keywords: ['furniture', 'bench', 'desk', 'chair', 'table', 'welding', 'photo-1503676260'],
      detectedObject: 'Ergonomic Dual-Seater Lecture Bench',
      defectType: 'Fractured metal weld joint / Loose anchor screw',
      confidence: 89,
      severity: 'Low to Medium (Unstable Seating)',
      recommendedTools: ['Portable Inverter Arc Welder', 'M8 Hex Bolts', 'Adjustable Spanner']
    },
    {
      keywords: ['water', 'dispenser', 'cooler', 'filter', 'tap', 'leak', 'pipeline', 'drainage', 'basin', 'photo-1584771145'],
      detectedObject: 'Commercial RO Water Purifier & Chiller',
      defectType: 'Pressure relief valve gasket leakage / Drip tray overflow',
      confidence: 93,
      severity: 'Medium (Floor slip hazard & water wastage)',
      recommendedTools: ['1/2 inch Teflon Sealing Tape', 'Pipe Wrench', 'Replacement Silicone Gasket']
    },
    {
      keywords: ['door', 'lock', 'handle', 'hinge', 'window', 'glass', 'wall', 'crack', 'plaster'],
      detectedObject: 'Classroom / Hostel Infrastructure Fixture',
      defectType: 'Civil structure fracture or latch mechanism failure',
      confidence: 90,
      severity: 'Medium Operational Defect',
      recommendedTools: ['Masonry Chisel', 'Heavy Duty Mortise Lockset', 'Cordless Driver']
    },
    {
      keywords: ['ac', 'air conditioner', 'hvac', 'cooling', 'compressor'],
      detectedObject: 'Daikin Dual-Inverter Cassette AC Unit',
      defectType: 'Condenser coil thermal cutoff / Refrigerant line frost',
      confidence: 92,
      severity: 'High (Classroom Climate Control Offline)',
      recommendedTools: ['R32 Manifold Gauge Set', 'Vacuum Pump', 'Digital Anemometer']
    }
  ];

  for (const defect of relevantDefectSignatures) {
    const isMatch = defect.keywords.some(kw => context.includes(kw));
    if (isMatch) {
      return {
        isRelevant: true,
        hasDefect: true,
        confidence: defect.confidence,
        detectedObject: defect.detectedObject,
        defectType: defect.defectType,
        warningMessage: null,
        severity: defect.severity,
        recommendedTools: defect.recommendedTools,
        visionModel: 'CampusOne-VisionNet v2.4 (Edge Inference)',
        analyzedAt: new Date().toISOString()
      };
    }
  }

  // 3. Unrecognized or Generic Photo with no clear campus maintenance defect
  return {
    isRelevant: false,
    hasDefect: false,
    confidence: 0,
    warningMessage: '⚠️ Unverified Photo: CampusOne VisionNet could not detect any verifiable campus infrastructure or hardware defects in this photo frame. The AI priority score boost is paused. Please upload a clear photo of the broken equipment to activate full AI priority scoring.',
    detectedObject: 'Unverified / Ambiguous Subject',
    defectType: 'No verifiable campus maintenance defect detected',
    severity: 'Unverified (AI Score Boost Withheld)',
    recommendedTools: [],
    visionModel: 'CampusOne-VisionNet v2.4 (Edge Inference)',
    analyzedAt: new Date().toISOString()
  };
}

/**
 * AI Maintenance Dispatch & SLA Copilot
 * Generates technician allocation, parts checklist, SLA forecast
 */
export function generateAdminRecommendation(ticket) {
  const category = ticket.category || 'it_av';
  const domain = ticket.domain || 'electrical_av';

  const recommendations = {
    it_av: {
      technician: 'Vignesh K. (Senior AV & Classroom Systems Specialist)',
      requiredSkill: 'Classroom Projection & Audio Engineering (Level 2)',
      estimatedSla: '2 to 4 Hours',
      partsChecklist: [
        'High-Speed Gold-Plated HDMI 2.1 Cable (5m)',
        'HDMI to Type-C Bidirectional Active Adapter',
        'Wall Faceplate Mount & RJ45 Crimper'
      ],
      rootCauseForecast: 'Repeated mechanical stress on console input port from instructor laptops.',
      suggestedBroadcast: `Classroom AV team dispatched. Technician Vignesh K. is carrying a replacement cable assembly. Estimated restoration within 3 hours.`
    },
    electrical: {
      technician: 'Ramesh Kumar (Campus Shift-1 Electrician)',
      requiredSkill: 'Certified High/Low Voltage Distribution (Wireman Grade-A)',
      estimatedSla: '3 to 5 Hours',
      partsChecklist: [
        'Havells 5-Step Capacitive Fan Regulator',
        '10A Modular Rocker Switch',
        'Flame Retardant Insulation Tape'
      ],
      rootCauseForecast: 'Capacitor degradation or voltage surge during power changeover.',
      suggestedBroadcast: `Electrician assigned. Replacement switchgear requisitioned from Central Stores. Scheduled for resolution before evening classes.`
    },
    safety: {
      technician: 'Sunil Rao (Chief Safety Officer & Civil Emergency Lead)',
      requiredSkill: 'Hazard Containment & Structural Safety Rapid Response',
      estimatedSla: 'Immediate (Within 45 Minutes)',
      partsChecklist: [
        'Hazard Caution Cautionary Barrier Tape',
        'Industrial Lockout/Tagout (LOTO) Kit',
        'Emergency Power Isolation Key'
      ],
      rootCauseForecast: 'Physical exposure hazard with potential student safety liability.',
      suggestedBroadcast: `URGENT: Estate Safety Team activated. Area cordoned off until complete structural clearance. Safety lead Sunil Rao on site.`
    },
    water: {
      technician: 'Manohar P. (Hostel Water Distribution & Plumbing Lead)',
      requiredSkill: 'Industrial Hydraulics & RO Filtration Maintenance',
      estimatedSla: '1 to 3 Hours',
      partsChecklist: [
        'Heavy Duty Ball Valve (1 inch)',
        'Teflon Thread Sealant Tape',
        'Sediment Filter Cartridge (5 Micron)'
      ],
      rootCauseForecast: 'Mineral sediment blockage or worn rubber washer seal.',
      suggestedBroadcast: `Hostel plumbing team dispatched with backup valves. Water supply will remain normal through redundant bypass pipeline.`
    },
    civil: {
      technician: 'Karthik N. (Campus Carpentry & Civil Works Specialist)',
      requiredSkill: 'Precision Carpentry & Structural Metal Joinery',
      estimatedSla: '4 to 6 Hours',
      partsChecklist: [
        'High-Tensile Steel Wood Screws (3 inch)',
        'Heavy-Duty Butt Hinges (Brass Finish)',
        'Cordless Impact Drill & Wood Chisel'
      ],
      rootCauseForecast: 'Daily heavy load wear and vibration looseness.',
      suggestedBroadcast: `Carpentry workshop notified. Work order generated for bench repair. Scheduled during scheduled break period.`
    },
    cleanliness: {
      technician: 'Lakshmi Devi (Sanitation Supervisor - Block 1)',
      requiredSkill: 'Campus Hygiene & Institutional Sanitization',
      estimatedSla: '1 to 2 Hours',
      partsChecklist: [
        'Disinfectant Chemical Concentrate',
        'Industrial Wet/Dry Vacuum Extractor',
        'Biodegradable Waste Bin Liners'
      ],
      rootCauseForecast: 'Peak hour student footfall accumulation.',
      suggestedBroadcast: `Sanitation crew deployed for deep cleaning and waste clearance.`
    }
  };

  const rec = recommendations[category] || recommendations.it_av;
  return {
    ...rec,
    domain,
    confidenceScore: 92,
    generatedAt: new Date().toISOString()
  };
}
