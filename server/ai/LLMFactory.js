import geminiClient from '../configs/gemini.js';
import { CHAT_CONSTANTS } from '../modules/chat/utils/chatConstants.js';

export default class LLMFactory {
  /**
   * Retrieves an instantiated Google Generative AI model
   * @param {string} modelName - e.g., 'gemini-1.5-flash', 'gemini-embedding-001'
   * @returns {object} The initialized model instance
   */
  static getModel(modelName = CHAT_CONSTANTS.MODELS.FAST_TEXT) {
    if (!geminiClient) {
      throw new Error('LLM Client is not configured');
    }
    
    return geminiClient.getGenerativeModel({ model: modelName });
  }

  /**
   * Specialized getter for embedding models
   */
  static getEmbeddingModel() {
    return this.getModel(CHAT_CONSTANTS.MODELS.EMBEDDING);
  }
}
