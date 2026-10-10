import { getTicketsFromDB } from '../models/ticketModel.js';
import { 
  findSemanticDuplicates, 
  autoTriageIssue, 
  analyzeImageDefect, 
  generateAdminRecommendation 
} from '../services/aiCopilotService.js';
import { calculatePriorityScore } from '../services/priorityService.js';

/**
 * Live AI Issue Analysis (Auto-Triage, Semantic Duplicates, Vision Defect)
 * POST /api/ai/analyze-issue
 */
export function analyzeIssue(req, res) {
  try {
    const { title = '', description = '', category = '', location = '', scope = 'class', imageUrl = '' } = req.body;
    const tickets = getTicketsFromDB();

    // 1. NLP Semantic Duplicate Matches
    const duplicateMatches = findSemanticDuplicates(tickets, { title, description, category, location });

    // 2. Intelligent Auto-Triage & Categorization
    const triage = autoTriageIssue({ title, description, location });

    // 3. Vision Defect Analysis
    const vision = analyzeImageDefect({ imageUrl, title, description });

    // 4. Predicted Priority Score Breakdown (Gated by Photo Relevance)
    const simulatedTicket = {
      category: category || triage.suggestedCategory,
      scope: scope || 'class',
      upvotes: ['seed_user'],
      downvotes: [],
      advisorEndorsed: false
    };
    
    const basePriority = calculatePriorityScore(simulatedTicket);
    // When relevant image is provided, apply +15 Verified Evidence Boost; otherwise withheld
    const photoBoost = vision.isRelevant ? 15 : 0;
    const finalScore = Math.min(basePriority + photoBoost, 100);

    res.json({
      success: true,
      triage,
      vision,
      duplicates: duplicateMatches,
      predictedPriority: {
        score: finalScore,
        baseScore: basePriority,
        isEvidenceVerified: vision.isRelevant,
        urgency: triage.suggestedUrgency,
        factors: [
          { name: 'Base Hazard Weight', value: simulatedTicket.category === 'safety' ? 85 : 50 },
          { name: 'Scope Impact Radius', value: scope === 'campus' ? '+10' : scope === 'department' ? '+5' : '+0' },
          { name: 'Initial Stakeholder Endorsement', value: '+3' },
          { 
            name: 'Computer Vision Evidence', 
            value: vision.isRelevant ? `+15 (Verified: ${vision.confidence}%)` : '⚠️ 0 (Irrelevant / Unverified)',
            verified: vision.isRelevant 
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
