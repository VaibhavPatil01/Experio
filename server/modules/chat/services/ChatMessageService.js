import ChatMessageRepository from '../repositories/ChatMessageRepository.js';
import ChatSessionRepository from '../repositories/ChatSessionRepository.js';
import ConversationMemoryService from './ConversationMemoryService.js';
import logger from '../../../utils/logger.js';

export default class ChatMessageService {
  constructor(
    messageRepo = new ChatMessageRepository(),
    sessionRepo = new ChatSessionRepository(),
    memoryService = new ConversationMemoryService()
  ) {
    this.messageRepo = messageRepo;
    this.sessionRepo = sessionRepo;
    this.memoryService = memoryService;
  }

  /**
   * Save the user's prompt immediately to ensure no data loss
   */
  async saveUserMessage(sessionId, userId, content) {
    logger.info('Saving user message', { sessionId, userId });
    
    // Route middleware guarantees ownership

    const message = await this.messageRepo.createMessage({
      sessionId,
      role: 'user',
      content
    });

    // Update the session's updatedAt timestamp
    await this.sessionRepo.model.findByIdAndUpdate(sessionId, { updatedAt: new Date() });

    return message;
  }

  /**
   * Save the AI response after streaming is complete
   */
  async saveAssistantMessage(sessionId, content, aiMetadata = {}) {
    logger.info('Saving assistant message completion', { sessionId, tokens: aiMetadata.tokenUsage });
    
    const { tokenUsage, modelUsed, citations, regeneratedFromId } = aiMetadata;

    const message = await this.messageRepo.createMessage({
      sessionId,
      role: 'assistant',
      content,
      tokenUsage,
      modelUsed,
      citations: citations || [],
      regeneratedFromId: regeneratedFromId || null
    });

    // Update the session's token usage and timestamp
    const updates = { updatedAt: new Date() };
    if (tokenUsage) {
      await this.sessionRepo.updateTokenUsage(sessionId, tokenUsage);
    } else {
      await this.sessionRepo.model.findByIdAndUpdate(sessionId, updates);
    }

    // Trigger async memory tracking (does not block the response)
    this.memoryService.trackAndTriggerMemory(sessionId);

    return message;
  }

  /**
   * Fetch messages using cursor-based pagination
   */
  async getSessionMessages(sessionId, userId, limit = 50, beforeCursor = null) {
    logger.debug('Fetching session messages', { sessionId, limit, beforeCursor });
    
    // Route middleware guarantees ownership

    return await this.messageRepo.findMessagesBySessionId(sessionId, limit, beforeCursor);
  }

  /**
   * Mark a message as deleted
   */
  async deleteMessage(messageId, sessionId, userId) {
    logger.info('Deleting message', { messageId });
    
    // Route middleware guarantees ownership

    return await this.messageRepo.markAsDeleted(messageId);
  }

  /**
   * Edit a user message (and typically triggers a regeneration in the controller/socket)
   */
  async editUserMessage(messageId, sessionId, userId, newContent) {
    logger.info('Editing user message', { messageId });
    
    // Route middleware guarantees ownership

    return await this.messageRepo.editMessage(messageId, newContent);
  }
}
