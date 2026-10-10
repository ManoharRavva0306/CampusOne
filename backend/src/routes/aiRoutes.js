import { Router } from 'express';
import { analyzeIssue, getAdminCopilot } from '../controllers/aiController.js';

const router = Router();

router.post('/analyze-issue', analyzeIssue);
router.post('/admin-copilot', getAdminCopilot);

export default router;
