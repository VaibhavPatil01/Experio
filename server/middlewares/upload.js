import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';

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

export default upload;
