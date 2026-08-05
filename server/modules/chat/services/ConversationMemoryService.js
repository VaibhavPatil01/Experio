import LLMFactory from '../../../ai/LLMFactory.js';
import { CHAT_CONSTANTS } from '../utils/chatConstants.js';
import ChatSessionRepository from '../repositories/ChatSessionRepository.js';
import ChatMessageRepository from '../repositories/ChatMessageRepository.js';
import logger from '../../../utils/logger.js';

export default class ConversationMemoryService {
  constructor(
    sessionRepo = new ChatSessionRepository(),
    messageRepo = new ChatMessageRepository()
  ) {
    this.sessionRepo = sessionRepo;
    this.messageRepo = messageRepo;
    
    this.SUMMARY_THRESHOLD = CHAT_CONSTANTS.MEMORY.SUMMARY_THRESHOLD; 
    this.RECENT_MEMORY_PRESERVE = CHAT_CONSTANTS.MEMORY.RECENT_PRESERVE;
  }

  /**
   * Tracks message count and triggers async summarization if threshold is met.
   * This should be called *after* saving a new message, in a non-blocking way.
   */
  async trackAndTriggerMemory(sessionId) {
    try {
      // 1. Increment counter atomically
      const session = await this.sessionRepo.model.findByIdAndUpdate(
        sessionId,
        { $inc: { 'memory.messageCountSinceSummary': 1 } },
        { new: true }
      ).lean();

      if (!session) return;

      // 2. Check if we crossed the threshold
      if (session.memory.messageCountSinceSummary >= this.SUMMARY_THRESHOLD) {
        // Fire and forget (do not await, to keep the API fast)
        this.performSummarization(sessionId, session).catch(err => {
          logger.error('Background summarization failed', { category: 'ai', sessionId, error: err.message });
        });
      }
    } catch (error) {
      logger.error('Failed to track memory trigger', { category: 'ai', sessionId, error: error.message });
    }
  }

  /**
   * Performs the heavy lifting of summarizing the conversation history.
   */
  async performSummarization(sessionId, session) {
    logger.info('Starting background conversation summarization', { category: 'ai', sessionId });
    const startTime = performance.now();
    
    // 1. Fetch messages to summarize
    // We want messages created AFTER the last summarization...
    const query = { sessionId, isDeleted: false };
    if (session.memory.lastSummarizedMessageAt) {
      query.createdAt = { $gt: session.memory.lastSummarizedMessageAt };
    }

    // ...BUT we want to LEAVE the most recent N messages un-summarized for immediate context precision.
    // To do this, we get all eligible messages sorted oldest first.
    let messagesToSummarize = await this.messageRepo.model.find(query).sort({ createdAt: 1 }).lean();

    // If there aren't enough messages to preserve the recent window, abort.
    if (messagesToSummarize.length <= this.RECENT_MEMORY_PRESERVE) {
      return;
    }

    // Remove the latest N messages from the summarization batch
    messagesToSummarize = messagesToSummarize.slice(0, messagesToSummarize.length - this.RECENT_MEMORY_PRESERVE);
    
    // The message that marks the boundary of this summarization
    const boundaryMessage = messagesToSummarize[messagesToSummarize.length - 1];

    // 2. Format the payload for Gemini
    let promptText = `You are a conversation summarization engine.\n`;
    if (session.memory.summary) {
      promptText += `Here is the summary of the conversation so far:\n"${session.memory.summary}"\n\n`;
    }
    
    promptText += `Here are the new messages to incorporate into the summary:\n`;
    messagesToSummarize.forEach(msg => {
      promptText += `[${msg.role.toUpperCase()}]: ${msg.content}\n`;
    });

    promptText += `\nProvide a unified, highly dense, concise summary of the entire conversation. Retain critical facts, user preferences, and the main topics discussed. Do NOT use conversational filler. Return ONLY the summary string.`;

    // 3. Call Gemini via Factory
    const model = LLMFactory.getModel();
    const result = await model.generateContent(promptText);
    const response = await result.response;
    let newSummary = response.text().trim();

    // 4. Update the DB atomically
    await this.sessionRepo.model.findByIdAndUpdate(sessionId, {
      $set: {
        'memory.summary': newSummary,
        'memory.lastSummarizedMessageAt': boundaryMessage.createdAt,
        'memory.messageCountSinceSummary': this.RECENT_MEMORY_PRESERVE // Reset to what we preserved
      }
    });

    const endTime = performance.now();
    logger.info('Background conversation summarization complete', { 
      category: 'ai', 
      sessionId, 
      latencyMs: Math.round(endTime - startTime),
      tokens: response.usageMetadata?.totalTokenCount || 0
    });
  }
}
