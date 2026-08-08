import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import { analyzeResume, getHistory } from '../controllers/AnalyzerController.js';
import isUserAuth from '../../../middleware/isUserAuth.js';

const router = express.Router();

// Configure multer to hold the file temporarily on disk to avoid OOM errors
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    // Generate a safe internal identifier to prevent path traversal & execution risks
    const safeName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    cb(null, safeName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// All resume analyzer routes require authentication
router.use(isUserAuth);

// Analyze route requires a 'resume' file upload field
router.post('/analyze', upload.single('resume'), analyzeResume);
router.get('/history', getHistory);

export default router;
