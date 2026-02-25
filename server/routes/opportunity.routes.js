import express from 'express';
import {
  createOpportunity,
  getOpportunities,
  getOpportunity,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
  getRecommendedOpportunities,
  getRecommendedVolunteers
} from '../controllers/opportunity.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getOpportunities);
router.get('/recommended', protect, getRecommendedOpportunities);
router.get('/my', protect, getMyOpportunities);
router.get('/:id/recommended-volunteers', protect, getRecommendedVolunteers);
router.get('/:id', getOpportunity);
router.post('/', protect, createOpportunity);
router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);

export default router;
