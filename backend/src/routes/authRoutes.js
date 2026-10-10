import { Router } from 'express';
import { 
  login, 
  getUsers, 
  getCurrentUser, 
  createUser, 
  updateUser 
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/users', getUsers);
router.get('/me', getCurrentUser);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);

export default router;
