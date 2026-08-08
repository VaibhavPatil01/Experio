import geminiClient from '../configs/gemini.js';
import NodeCache from 'node-cache';
import logger from '../utils/logger.js';
import crypto from 'crypto';

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
      const startTime = performance.now();
      
      // Hash the text for the cache key to prevent giant strings as keys and secure logs
      const textHash = crypto.createHash('sha256').update(text).digest('hex');
      const cacheKey = `embed_${textHash}`;
      
      const cachedVector = embeddingCache.get(cacheKey);

      if (cachedVector) {
        logger.info('Embedding cache hit', { 
          hash: textHash, 
          latencyMs: Math.round(performance.now() - startTime),
          dimensions: cachedVector.length
        });
        return cachedVector;
      }

      logger.info('Embedding cache miss, calling Gemini API', { hash: textHash, model: 'gemini-embedding-001' });

      const response = await geminiClient.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text
      });
      
      const embedding = response.embeddings[0];

      if (!embedding || !embedding.values || embedding.values.length === 0) {
        throw new Error('No embedding returned from Gemini');
      }

      embeddingCache.set(cacheKey, embedding.values);
      
      logger.info('Embedding generated successfully', {
        hash: textHash,
        model: 'gemini-embedding-001',
        latencyMs: Math.round(performance.now() - startTime),
        dimensions: embedding.values.length
      });

      return embedding.values;
    } catch (error) {
      logger.error('Failed to generate embedding', { error: error.message });
      throw error;
    }
  }
}
