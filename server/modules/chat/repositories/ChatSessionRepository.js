import ChatSession from '../models/ChatSession.js';

export default class ChatSessionRepository {
  /**
   * Supports dependency injection for testing and loose coupling
   */
  constructor(chatSessionModel) {
    this.model = chatSessionModel || ChatSession;
  }

  async createSession(userId, title = 'New Conversation') {
    return await this.model.create({ userId, title });
  }

  async findSessionsByUserId(userId, searchQuery = '', skip = 0, limit = 20) {
    const query = { userId, 'metadata.isDeleted': false };
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }

    return await this.model.find(query)
      .sort({ 'metadata.isPinned': -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findSessionById(sessionId) {
    return await this.model.findById(sessionId).lean();
  }

  async updateSessionTitle(sessionId, title) {
    return await this.model.findByIdAndUpdate(
      sessionId,
      { title },
      { new: true }
    ).lean();
  }

  async togglePin(sessionId, isPinned) {
    return await this.model.findByIdAndUpdate(
      sessionId,
      { 'metadata.isPinned': isPinned },
      { new: true }
    ).lean();
  }

  async softDeleteSession(sessionId) {
    return await this.model.findByIdAndUpdate(
      sessionId,
      { 'metadata.isDeleted': true },
      { new: true }
    ).lean();
  }

  async restoreSession(sessionId) {
    return await this.model.findByIdAndUpdate(
      sessionId,
      { 'metadata.isDeleted': false },
      { new: true }
    ).lean();
  }

  async permanentlyDeleteSession(sessionId) {
    return await this.model.findByIdAndDelete(sessionId).lean();
  }

  async updateTokenUsage(sessionId, tokensUsed) {
    return await this.model.findByIdAndUpdate(
      sessionId,
      { $inc: { 'metadata.totalTokensUsed': tokensUsed } },
      { new: true }
    ).lean();
  }
}
