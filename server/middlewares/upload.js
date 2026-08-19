import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
import crypto from 'crypto';
import os from 'os';
import path from 'path';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'interview_experience_profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// Configure Resume Storage
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'interview_experience_resumes',
    resource_type: 'auto',
    public_id: (req, file) => {
      const originalName = file.originalname || 'resume.pdf';
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
      return `${safeName}_${Date.now()}`;
    }
  }
});

export const uploadResume = multer({ 
  storage: resumeStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX formats are allowed!'), false);
    }
  }
});

export const handleImageUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(500).json({ 
        message: 'Image upload to Cloudinary failed', 
        error: err.message || err.toString() 
      });
    }
    next();
  });
};

export const handleResumeUpload = (req, res, next) => {
  uploadResume.single('resumeFile')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(500).json({ 
        message: 'Resume upload to Cloudinary failed', 
        error: err.message || err.toString() 
      });
    }
    next();
  });
};

// Configure local multer to hold the file temporarily on disk for Resume Analyzer
const analyzerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    // Generate a safe internal identifier to prevent path traversal & execution risks
    const safeName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    cb(null, safeName);
  }
});

const uploadAnalyzer = multer({
  storage: analyzerStorage,
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
      cb(new Error('Only PDF and DOCX files are allowed for analysis'), false);
    }
  }
});

export const handleAnalyzerUpload = (req, res, next) => {
  uploadAnalyzer.single('resume')(req, res, (err) => {
    if (err) {
      console.error("Multer analyzer upload error:", err);
      return res.status(400).json({ 
        message: 'Resume upload for analysis failed', 
        error: err.message || err.toString() 
      });
    }
    next();
  });
};

export default upload;
