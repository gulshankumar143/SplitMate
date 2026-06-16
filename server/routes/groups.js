import express from 'express';
import { createGroup, addMember, getGroups, updateGroup, removeMember, deleteGroup, getGroupById } from '../controllers/groupController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/', createGroup);
router.post('/member', addMember);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.patch('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.delete('/:groupId/member/:memberId', removeMember);
export default router;
