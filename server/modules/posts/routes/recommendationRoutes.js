import express from 'express';
import { getRecommendedFeed } from '../controllers/recommendationController.js';
import isUserAuth from '../../../middlewares/isUserAuth.js';

const router = express.Router();

// GET /api/recommendations/feed
router.get('/feed', isUserAuth, getRecommendedFeed);

export default router;
