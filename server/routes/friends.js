import express from 'express';
import { sendRequest, respondRequest, listFriends, getFriendRequests, searchFriends, removeFriend } from '../controllers/friendController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/request', sendRequest);
router.patch('/respond', respondRequest);
router.get('/', listFriends);
router.get('/requests', getFriendRequests);
router.get('/search', searchFriends);
router.delete('/:id', removeFriend);
export default router;
