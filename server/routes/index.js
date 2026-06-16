import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import friendRoutes from './friends.js';
import groupRoutes from './groups.js';
import expenseRoutes from './expenses.js';
import uploadRoutes from './uploads.js';
import chatRoutes from './chat.js';
import notificationRoutes from './notifications.js';
import adminRoutes from './admin.js';
import analyticsRoutes from './analytics.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/friends', friendRoutes);
router.use('/groups', groupRoutes);
router.use('/expenses', expenseRoutes);
router.use('/uploads', uploadRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

export default router;
