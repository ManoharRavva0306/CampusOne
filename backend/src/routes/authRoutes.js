import { Router } from 'express';
import { getUsers, getCurrentUser } from '../controllers/authController.js';

const router = Router();

router.get('/users', getUsers);
router.get('/me', getCurrentUser);

export default router;
