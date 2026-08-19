import ChatMessageService from '../services/ChatMessageService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ChatMessage from '../models/ChatMessage.js';

const chatMessageService = new ChatMessageService();

export const saveUserMessage = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { content } = req.body;
  const userId = req.authTokenData.id;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ message: 'Valid content is required' });
  }

  const message = await chatMessageService.saveUserMessage(sessionId, userId, content);
  res.status(201).json(message);
});

export const saveAssistantMessage = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { content, aiMetadata } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ message: 'Valid content is required' });
  }

  const message = await chatMessageService.saveAssistantMessage(sessionId, content, aiMetadata || {});
  res.status(201).json(message);
});

export const getSessionMessages = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.authTokenData.id;
  const limit = parseInt(req.query.limit) || 50;
  const beforeCursor = req.query.beforeCursor || null;

  const messages = await chatMessageService.getSessionMessages(sessionId, userId, limit, beforeCursor);
  res.status(200).json(messages);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { sessionId, messageId } = req.params;
  const userId = req.authTokenData.id;

  await chatMessageService.deleteMessage(messageId, sessionId, userId);
  res.status(200).json({ message: 'Message deleted successfully' });
});

export const submitFeedback = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { feedback } = req.body;
  
  if (!['like', 'dislike'].includes(feedback)) {
    return res.status(400).json({ message: 'Feedback must be like or dislike' });
  }

  const message = await ChatMessage.findByIdAndUpdate(messageId, { feedback }, { new: true });
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }
  
  res.status(200).json(message);
});
