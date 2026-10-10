import { Router } from 'express';
import { 
  getTickets, 
  createTicket, 
  voteTicket, 
  checkDuplicates, 
  updateTicketAdmin, 
  verifyResolution, 
  endorseTicket, 
  addComment 
} from '../controllers/ticketController.js';

const router = Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.post('/check-duplicates', checkDuplicates);
router.post('/:id/vote', voteTicket);
router.patch('/:id/admin', updateTicketAdmin);
router.post('/:id/verify', verifyResolution);
router.post('/:id/endorse', endorseTicket);
router.post('/:id/comments', addComment);

export default router;
