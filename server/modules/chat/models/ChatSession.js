import mongoose from 'mongoose';

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  metadata: {
    totalTokensUsed: { type: Number, default: 0 },
    primaryModel: { type: String, default: 'gemini-1.5-pro' },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  memory: {
    summary: { type: String, default: '' },
    lastSummarizedMessageAt: { type: Date, default: null },
    messageCountSinceSummary: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Compound index for quickly retrieving a user's active sessions ordered by latest update
ChatSessionSchema.index({ userId: 1, 'metadata.isDeleted': 1, updatedAt: -1 });

export default mongoose.model('ChatSession', ChatSessionSchema);
