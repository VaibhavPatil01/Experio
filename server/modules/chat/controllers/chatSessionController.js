import ChatSessionService from '../services/ChatSessionService.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

const chatSessionService = new ChatSessionService();

export const createSession = asyncHandler(async (req, res) => {
  const { initialPrompt } = req.body;
  const userId = req.user._id;

  const session = await chatSessionService.createSession(userId, initialPrompt);
  res.status(201).json(session);
});

export const getRecentSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await chatSessionService.getRecentSessions(userId, page, limit);
  res.status(200).json(result);
});

export const searchSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const query = req.query.q || '';

  const sessions = await chatSessionService.searchSessions(userId, query);
  res.status(200).json(sessions);
});

export const renameSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { title } = req.body;
  const userId = req.user._id;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Valid title is required' });
  }

  const session = await chatSessionService.renameSession(sessionId, userId, title.trim());
  res.status(200).json(session);
});

export const pinSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { isPinned } = req.body;
  const userId = req.user._id;

  if (typeof isPinned !== 'boolean') {
    return res.status(400).json({ message: 'isPinned must be a boolean' });
  }

  const session = await chatSessionService.pinSession(sessionId, userId, isPinned);
  res.status(200).json(session);
});

export const softDeleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user._id;

  await chatSessionService.softDeleteSession(sessionId, userId);
  res.status(200).json({ message: 'Session deleted successfully' });
});

export const restoreSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user._id;

  const session = await chatSessionService.restoreSession(sessionId, userId);
  res.status(200).json(session);
});
