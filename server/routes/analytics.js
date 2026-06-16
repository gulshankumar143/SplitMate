import express from 'express';
import { protect } from '../middleware/auth.js';
import { getDashboardOverview, getAnalyticsSummary } from '../controllers/analyticsController.js';

const router = express.Router();
router.use(protect);
router.get('/overview', getDashboardOverview);
router.get('/summary', getAnalyticsSummary);

export default router;
