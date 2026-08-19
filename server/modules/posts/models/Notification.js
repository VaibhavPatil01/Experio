import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  actorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  type: { 
    type: String, 
    enum: [
      'POST_MATCH', 
      'POST_COMMENT', 
      'POST_LIKE', 
      'POST_DISLIKE', 
      'COMMENT_REPLY', 
      'REPLY_REPLY'
    ], 
    required: true 
  },
  entityType: {
    type: String,
    enum: ['POST', 'COMMENT', 'REPLY', 'SYSTEM'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  },
  commentId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  parentCommentId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  similarityScore: {
    type: Number,
    required: false
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readAt: {
    type: Date,
    default: null
  },
  eventId: {
    type: String,
    required: false,
    unique: true,
    sparse: true // Allows multiple nulls, but string values must be unique
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Compound indexes for efficient querying
// 1. Fetching a user's newest notifications & unread notifications
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
