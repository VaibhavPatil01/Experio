import LLMFactory from '../../../ai/LLMFactory.js';
import ChatSessionRepository from '../repositories/ChatSessionRepository.js';
import logger from '../../../utils/logger.js';

export default class ChatSessionService {
  constructor(repo = new ChatSessionRepository()) {
    this.repo = repo;
  }

  /**
   * Generates a short title based on the first prompt
   */
  async generateTitle(prompt) {
    try {
      const model = LLMFactory.getModel();
      const promptText = `Generate a very short, concise title (max 5 words) summarizing this chat prompt. Do not use quotes or prefixes. Prompt: "${prompt}"`;
      
      const result = await model.generateContent(promptText);
      const response = await result.response;
      let title = response.text().trim();
      
      // Clean up potential quotes
      title = title.replace(/^["'](.*)["']$/, '$1');
      
      return title || 'New Conversation';
    } catch (error) {
      logger.error('Failed to generate session title via Gemini', { error: error.message, prompt });
      return 'New Conversation'; // Fallback
    }
  }

  async createSession(userId, initialPrompt) {
    logger.info('Creating new chat session', { category: 'db', userId });
    
    let title = 'New Conversation';
    if (initialPrompt) {
      title = await this.generateTitle(initialPrompt);
    }

    const session = await this.repo.createSession(userId, title);
    logger.info('Chat session created successfully', { category: 'db', sessionId: session._id });
    
    return session;
  }

  async getRecentSessions(userId, skip = 0, limit = 20) {
    logger.debug('Fetching recent sessions', { userId, skip, limit });
    return await this.repo.findSessionsByUserId(userId, '', skip, limit);
  }

  async searchSessions(userId, query, skip = 0, limit = 20) {
    logger.debug('Searching sessions', { userId, query });
    return await this.repo.findSessionsByUserId(userId, query, skip, limit);
  }

  async renameSession(sessionId, userId, newTitle) {
    logger.info('Renaming session', { category: 'db', sessionId, newTitle });
    
    return await this.repo.updateSessionTitle(sessionId, newTitle);
  }

  async togglePinSession(sessionId, userId, isPinned) {
    logger.info('Toggling session pin status', { category: 'db', sessionId, isPinned });
    
    return await this.repo.togglePin(sessionId, isPinned);
  }

  async softDeleteSession(sessionId, userId) {
    logger.info('Soft deleting session', { category: 'db', sessionId });
    
    return await this.repo.softDeleteSession(sessionId);
  }

  async restoreSession(sessionId, userId) {
    logger.info('Restoring session', { category: 'db', sessionId });
    
    return await this.repo.restoreSession(sessionId);
  }
}
