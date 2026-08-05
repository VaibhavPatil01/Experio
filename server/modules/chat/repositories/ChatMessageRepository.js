import ChatMessage from '../models/ChatMessage.js';

export default class ChatMessageRepository {
  /**
   * Supports dependency injection for testing and loose coupling
   */
  constructor(chatMessageModel) {
    this.model = chatMessageModel || ChatMessage;
  }

  async createMessage(data) {
    return await this.model.create(data);
  }

  /**
   * Uses keyset pagination (cursor-based) for highly optimized streaming/scrolling.
   * Loads newest messages first, allowing infinite scroll upwards.
   */
  async findMessagesBySessionId(sessionId, limit = 50, beforeCursor = null) {
    const query = { sessionId, isDeleted: false };
    
    if (beforeCursor) {
      query.createdAt = { $lt: new Date(beforeCursor) };
    }

    return await this.model.find(query)
      .sort({ createdAt: -1 }) 
      .limit(limit)
      .lean();
  }

  async markAsDeleted(messageId) {
    return await this.model.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    ).lean();
  }

  async editMessage(messageId, newContent) {
    return await this.model.findByIdAndUpdate(
      messageId,
      { content: newContent, isEdited: true },
      { new: true }
    ).lean();
  }
}
