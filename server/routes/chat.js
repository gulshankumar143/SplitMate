import express from 'express';
import { getRoomMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/room/:roomId', getRoomMessages);
router.post('/room/:roomId/message', sendMessage);
export default router;
