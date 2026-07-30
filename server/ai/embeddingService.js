import geminiClient from '../configs/gemini.js';

export class EmbeddingService {
  /**
   * Generate an embedding vector from text using Gemini
   * @param {string} text The formatted document string
   * @returns {Promise<number[]>} The vector array
   */
  static async generateEmbedding(text) {
    try {
      const model = geminiClient.getGenerativeModel({ model: "gemini-embedding-001" });
      const response = await model.embedContent(text);
      
      const embedding = response.embedding;

      if (!embedding || !embedding.values || embedding.values.length === 0) {
        throw new Error('No embedding returned from Gemini');
      }

      return embedding.values;
    } catch (error) {
      console.error('[EmbeddingService] Failed to generate embedding:', error);
      throw error;
    }
  }
}
