import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/', getAllUsers);
export default router;
