import express from 'express';
import { getUserProfile, updateUserProfile, uploadMyPitchVideo, uploadMyProfilePhoto, uploadMyResume } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadPitchVideo, uploadProfilePhoto, uploadResume } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.post('/:id/pitch-video', protect, uploadPitchVideo.single('video'), uploadMyPitchVideo);
router.post('/:id/resume', protect, uploadResume.single('resume'), uploadMyResume);
router.post('/:id/profile-photo', protect, uploadProfilePhoto.single('photo'), uploadMyProfilePhoto);

export default router;
