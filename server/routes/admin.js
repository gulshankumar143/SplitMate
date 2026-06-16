import express from 'express';
import { listUsers, toggleBanUser } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();
router.use(protect, restrictTo('admin'));
router.get('/users', listUsers);
router.patch('/users/:id/ban', toggleBanUser);
export default router;
