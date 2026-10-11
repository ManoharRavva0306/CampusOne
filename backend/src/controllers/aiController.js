import { getTicketsFromDB } from '../models/ticketModel.js';
import { 
  findSemanticDuplicates, 
  autoTriageIssue, 
  analyzeImageDefect, 
  generateAdminRecommendation,
  predictResolutionSLA
} from '../services/aiCopilotService.js';
import { calculatePriorityScore } from '../services/priorityService.js';

/**
 * Live AI Issue Analysis (Auto-Triage, Semantic Duplicates, Vision Defect, SLA Regressor)
 * POST /api/ai/analyze-issue
 */
export function analyzeIssue(req, res) {
  try {
    const { 
      title = '', 
      description = '', 
      category = '', 
      location = '', 
      scope = 'class', 
      imageUrl = '',
      visualMetrics = null
    } = req.body;
    const tickets = getTicketsFromDB();

    // 1. NLP Semantic Duplicate Matches with 128-dim dense vector cosine similarity
    const duplicateMatches = findSemanticDuplicates(tickets, { title, description, category, location });

    // 2. Intelligent Auto-Triage & Categorization
    const triage = autoTriageIssue({ title, description, location });

    // 3. Vision Defect Analysis (Computes problem visibility percentage & detects defects with YOLOv8 bounding boxes)
    const vision = analyzeImageDefect({ imageUrl, title, description, category, visualMetrics });

    // 4. ML Predictive SLA Regression
    const effectiveCategory = category || vision.suggestedCategory || triage.suggestedCategory || 'it_av';
    const slaPrediction = predictResolutionSLA({
      category: effectiveCategory,
      scope,
      activeTickets: tickets
    });

    // 5. Predicted Priority Score Breakdown (Gated by Photo Relevance & Problem Visibility)
    const simulatedTicket = {
      category: effectiveCategory,
      scope: scope || 'class',
      upvotes: ['seed_user'],
      downvotes: [],
      advisorEndorsed: false
    };
    
    const basePriority = calculatePriorityScore(simulatedTicket);
    // When relevant image with a genuine detected defect is provided, apply +15 Verified Evidence Boost; otherwise 0
    const hasActiveFault = vision.isRelevant && vision.hasDefect;
    const photoBoost = hasActiveFault ? 15 : 0;
    const finalScore = Math.min(basePriority + photoBoost, 100);

    let cvEvidenceText = '⚠️ 0% (Irrelevant / Non-Facility Image — Score Paused)';
    if (hasActiveFault) {
      cvEvidenceText = `+15 (${vision.visibilityPercentage}% Fault Visibility)`;
    } else if (vision.isRelevant && !vision.hasDefect) {
      cvEvidenceText = '✅ 0% (Asset Verified Undamaged / Working Fine)';
    }

    res.json({
      success: true,
      triage,
      vision,
      duplicates: duplicateMatches,
      slaPrediction,
      mlMetadata: {
        visionModel: vision.visionModel || 'CampusOne-Multimodal VLM & YOLOv8-VisionNet',
        nlpModel: 'CampusOne-MiniLM-L6 Vector Space (128-Dim Cosine)',
        slaModel: slaPrediction.mlModel || 'CampusOne-XGBoost SLA Regressor v2.5',
        triageModel: 'CampusOne-Heuristic & Bayesian Triage Net',
        vectorDimensions: 128
      },
      predictedPriority: {
        score: finalScore,
        baseScore: basePriority,
        isEvidenceVerified: hasActiveFault,
        status: vision.status,
        visibilityPercentage: vision.visibilityPercentage || 0,
        urgency: triage.suggestedUrgency,
        factors: [
          { name: 'Base Hazard Weight', value: simulatedTicket.category === 'safety' ? 85 : 50 },
          { name: 'Scope Impact Radius', value: scope === 'campus' ? '+10' : scope === 'department' ? '+5' : '+0' },
          { name: 'Initial Stakeholder Endorsement', value: '+3' },
          { 
            name: 'Computer Vision Evidence', 
            value: cvEvidenceText,
            verified: hasActiveFault 
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error in analyzeIssue:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * AI Maintenance Dispatch & SLA Copilot
 * POST /api/ai/admin-copilot
 */
export function getAdminCopilot(req, res) {
  try {
    const ticketData = req.body;
    const recommendation = generateAdminRecommendation(ticketData);

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Error in getAdminCopilot:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
