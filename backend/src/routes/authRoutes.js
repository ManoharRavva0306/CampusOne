import { Router } from 'express';
import { 
  login, 
  getUsers, 
  getCurrentUser, 
  createUser, 
  bulkImportUsers,
  bulkUpdateUsers,
  bulkDeleteUsers,
  updateUser,
  deleteUser
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/users', getUsers);
router.get('/me', getCurrentUser);
router.post('/users', createUser);
router.post('/users/bulk-import', bulkImportUsers);
router.patch('/users/bulk-update', bulkUpdateUsers);
router.post('/users/bulk-delete', bulkDeleteUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
