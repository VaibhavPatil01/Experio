import express from 'express';
import { 
  analyzeResume, 
  getHistory,
  getAnalysisById,
  getAnalysisStatus,
  deleteAnalysis,
  retryAnalysis,
  reanalyzeResume
} from '../controllers/AnalyzerController.js';
import isUserAuth from '../../../middlewares/isUserAuth.js';
import { handleAnalyzerUpload } from '../../../middlewares/upload.js';
import { analysisLimiter } from '../../../middlewares/rateLimiter.js';

const router = express.Router();

// Require authentication for all routes
router.use(isUserAuth);

// Collection level routes
router.get('/history', getHistory);
router.post('/analyze', analysisLimiter, handleAnalyzerUpload, analyzeResume);

// Individual analysis routes
router.get('/:id', getAnalysisById);
router.get('/:id/status', getAnalysisStatus);
router.delete('/:id', deleteAnalysis);

// Action routes
router.post('/:id/retry', retryAnalysis);
router.post('/:id/reanalyze', reanalyzeResume);

export default router;
