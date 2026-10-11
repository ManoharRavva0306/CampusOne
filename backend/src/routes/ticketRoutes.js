import { Router } from 'express';
import { 
  getTickets, 
  createTicket, 
  voteTicket, 
  checkDuplicates, 
  updateTicketAdmin, 
  verifyResolution, 
  reviewTicketByPanel,
  endorseTicket, 
  addComment,
  deleteTicket,
  submitClaimRequest,
  reviewClaimRequest
} from '../controllers/ticketController.js';

const router = Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.post('/check-duplicates', checkDuplicates);
router.post('/:id/vote', voteTicket);
router.patch('/:id/admin', updateTicketAdmin);
router.post('/:id/verify', verifyResolution);
router.post('/:id/review', reviewTicketByPanel);
router.post('/:id/endorse', endorseTicket);
router.post('/:id/comments', addComment);
router.delete('/:id', deleteTicket);
router.post('/:id/claim-request', submitClaimRequest);
router.post('/:id/review-claim', reviewClaimRequest);

export default router;
