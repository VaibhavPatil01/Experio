import express from 'express';
import { getRecommendedFeed } from '../controllers/recommendationController.js';
import isUserAuth from '../../../middlewares/isUserAuth.js';

const router = express.Router();

// Recommendation routes
router.get('/feed', isUserAuth, getRecommendedFeed);

export default router;
