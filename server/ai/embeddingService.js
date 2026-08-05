import geminiClient from '../configs/gemini.js';
import NodeCache from 'node-cache';

// Cache embeddings for 1 hour to prevent redundant Gemini calls on common questions
const embeddingCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export class EmbeddingService {
  /**
   * Generate an embedding vector from text using Gemini
   * @param {string} text The formatted document string
   * @returns {Promise<number[]>} The vector array
   */
  static async generateEmbedding(text) {
    try {
      const cacheKey = `embed_${text}`;
      const cachedVector = embeddingCache.get(cacheKey);

      if (cachedVector) {
        return cachedVector;
      }

      const response = await geminiClient.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text
      });
      
      const embedding = response.embeddings[0];

      if (!embedding || !embedding.values || embedding.values.length === 0) {
        throw new Error('No embedding returned from Gemini');
      }

      embeddingCache.set(cacheKey, embedding.values);
      return embedding.values;
    } catch (error) {
      console.error('[EmbeddingService] Failed to generate embedding:', error);
      throw error;
    }
  }
}
