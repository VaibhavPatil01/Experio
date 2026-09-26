import mongoose from "mongoose";


const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // High-level status
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  
  // Track schema/prompt evolution
  analysisVersion: { type: String, default: '1.0.0' },

  // Resume Metadata
  resumeMetadata: {
    fileUrl: { type: String, required: false },
    fileHash: { type: String, required: false }, // SHA-256 for deduping
    originalName: { type: String, required: false },
    extractedText: { type: String, required: false } // Stored for re-analysis
  },

  // Target Metadata
  target: {
    role: { type: String, required: true },
    company: { type: String, required: false },
    jobDescription: { type: String, required: false }
  },

  // Execution & Diagnostics
  executionInfo: {
    modelUsed: { type: String, required: false },
    latencyMs: { type: Number, required: false },
    retrievalTimeMs: { type: Number, required: false },
    tokensUsed: { type: Number, required: false },
    errorDetails: { type: String, required: false }
  },

  // Structured Result (populated on completion)
  result: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Indexes for performance
// 1. Fetching a user's history quickly
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });
// 2. Finding pending/failed jobs efficiently (for async workers)
resumeAnalysisSchema.index({ userId: 1, status: 1 });
// 3. Finding exact resume matches
resumeAnalysisSchema.index({ "resumeMetadata.fileHash": 1 });
// 4. Exact match duplicate detection (Caching)
resumeAnalysisSchema.index({ 
  userId: 1, 
  "resumeMetadata.fileHash": 1, 
  "target.role": 1, 
  "target.company": 1,
  status: 1
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
