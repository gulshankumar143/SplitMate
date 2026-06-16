import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadAttachment, uploadAvatar } from '../controllers/uploadController.js';

const router = express.Router();
router.post('/file', protect, upload.single('file'), uploadAttachment);
router.post('/avatar', protect, upload.single('file'), uploadAvatar);
export default router;
