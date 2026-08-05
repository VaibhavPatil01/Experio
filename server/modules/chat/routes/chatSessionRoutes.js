import express from 'express';
import * as chatSessionController from '../controllers/chatSessionController.js';
import isUserAuth from '../../../middleware/isUserAuth.js';
import { strictChatLimiter } from '../../../middlewares/rateLimiter.js';
import { sanitizeInput, verifySessionOwnership } from '../../../middlewares/chatSecurity.js';

const router = express.Router();

// Apply auth middleware to all session routes
router.use(isUserAuth);

// Create session (Sanitize input)
router.post('/', sanitizeInput, chatSessionController.createSession);

// Get recent sessions
router.get('/', chatSessionController.getRecentSessions);

// Search sessions
router.get('/search', chatSessionController.searchSessions);

// Rename session (Ownership & Sanitization)
router.put('/:sessionId/rename', verifySessionOwnership, sanitizeInput, chatSessionController.renameSession);

// Pin / Unpin session
router.put('/:sessionId/pin', verifySessionOwnership, chatSessionController.togglePinSession);

// Soft delete session
router.delete('/:sessionId', verifySessionOwnership, chatSessionController.softDeleteSession);

// Restore session
router.put('/:sessionId/restore', verifySessionOwnership, chatSessionController.restoreSession);

// ==========================================
// Stream & Generation Sub-Routes
// ==========================================
import * as chatStreamController from '../controllers/chatStreamController.js';

router.post('/:sessionId/chat', verifySessionOwnership, strictChatLimiter, sanitizeInput, chatStreamController.streamChatGeneration);
router.post('/:sessionId/messages/:messageId/regenerate', verifySessionOwnership, strictChatLimiter, chatStreamController.regenerateChat);
router.post('/:sessionId/stop', verifySessionOwnership, (req, res) => res.status(200).json({ message: 'Stream aborted via client connection' }));

// ==========================================
// Message Sub-Routes
// ==========================================
import * as chatMessageController from '../controllers/chatMessageController.js';

router.post('/:sessionId/messages/user', verifySessionOwnership, sanitizeInput, chatMessageController.saveUserMessage);
router.post('/:sessionId/messages/assistant', verifySessionOwnership, chatMessageController.saveAssistantMessage);
router.get('/:sessionId/messages', verifySessionOwnership, chatMessageController.getSessionMessages);
router.delete('/:sessionId/messages/:messageId', verifySessionOwnership, chatMessageController.deleteMessage);
router.post('/:sessionId/messages/:messageId/feedback', verifySessionOwnership, chatMessageController.submitFeedback);

export default router;
