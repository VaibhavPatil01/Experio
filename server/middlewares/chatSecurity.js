import ChatSessionRepository from '../modules/chat/repositories/ChatSessionRepository.js';

const sessionRepo = new ChatSessionRepository();

/**
 * Strips dangerous HTML tags and scripts from user input
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body.prompt) {
    // Basic sanitization: strip script tags and convert common HTML entities
    let sanitized = req.body.prompt.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    sanitized = sanitized.replace(/<[^>]*>?/gm, ''); // Strip all remaining tags
    req.body.prompt = sanitized.trim();
  }
  
  if (req.body.title) {
    req.body.title = req.body.title.replace(/<[^>]*>?/gm, '').trim();
  }

  next();
};

/**
 * Validates that the requested sessionId belongs to the authenticated user.
 */
export const verifySessionOwnership = async (req, res, next) => {
  const { sessionId } = req.params;
  const userId = req.authTokenData.id;

  if (!sessionId) {
    return next(); // Let standard validation handle missing params if any
  }

  try {
    const session = await sessionRepo.findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to session' });
    }

    req.chatSession = session;
    next();
  } catch (error) {
    // Handle invalid ObjectId errors gracefully
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid session ID format' });
    }
    next(error);
  }
};
