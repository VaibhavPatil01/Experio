import mongoose from 'mongoose';

const CitationSchema = new mongoose.Schema({
  sourceId: { type: String }, // The Interview Post _id
  company: { type: String },
  role: { type: String },
  title: { type: String },
  url: { type: String },      // Deep link to /interview/:id
  confidenceScore: { type: Number }, // Qdrant Cosine Similarity (0-1)
  snippet: { type: String }
}, { _id: false });

const ChatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  // Used if this message is a regeneration of a previous response
  regeneratedFromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
    default: null
  },
  
  // AI specific tracking fields
  modelUsed: { type: String },
  tokenUsage: { type: Number },
  citations: [CitationSchema],
  feedback: {
    type: String,
    enum: ['like', 'dislike'],
    default: null
  }

}, { timestamps: true });

// Compound index optimized for fast retrieval and cursor-based pagination of messages in a session
ChatMessageSchema.index({ sessionId: 1, createdAt: -1 });

// Sparse index for finding regenerations quickly if needed
ChatMessageSchema.index({ regeneratedFromId: 1 }, { sparse: true });

export default mongoose.model('ChatMessage', ChatMessageSchema);
