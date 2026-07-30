import { QdrantRepository } from '../repositories/qdrantRepository.js';
import { EmbeddingService } from './embeddingService.js';
import { PromptBuilder } from './promptBuilder.js';
import { Post } from '../models/Post.js';
import User from '../models/User.js';

export class RetrievalService {
  /**
   * Retrieves recommended posts for a user using Hybrid Search
   * @param {string} userId MongoDB User ID
   * @param {number} limit Number of recommendations to return
   * @returns {Promise<Array>} Recommended posts with match percentage
   */
  static async getRecommendationsForUser(userId, limit = 10) {
    try {
      // 1. Get user and generate/retrieve their embedding
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      
      const userDocStr = PromptBuilder.buildUserDocument(user);
      const userVector = await EmbeddingService.generateEmbedding(userDocStr);

      // 2. Query Qdrant for similar interview posts
      // Note: In a true hybrid search, you'd add metadata filters here (e.g., must match user.branch)
      // For this baseline, we're using dense vector similarity.
      const qdrantResults = await QdrantRepository.searchPosts(userVector, limit * 2); // Fetch extra for post-filtering

      if (!qdrantResults || qdrantResults.length === 0) {
        return [];
      }

      // 3. Extract IDs and calculate match percentages
      const postScores = qdrantResults.map(result => ({
        mongoId: result.payload.mongoId,
        score: result.score
      }));

      // 4. Fetch full documents from MongoDB (Source of Truth)
      const postIds = postScores.map(p => p.mongoId);
      const posts = await Post.find({ _id: { $in: postIds } })
        .populate('userId', 'username profilePicture')
        .lean();

      // 5. Combine and Rank
      const recommendedFeed = posts.map(post => {
        const qScore = postScores.find(p => p.mongoId === post._id.toString());
        const similarity = qScore ? qScore.score : 0;
        
        // High-dimensional LLM embeddings (like Gemini) suffer from the "Narrow Cone" effect,
        // where even completely unrelated text has a baseline cosine similarity around 0.55 - 0.60 
        // simply for being written in the same language and format. The true semantic difference 
        // lies in a narrow band (e.g., 0.60 to 0.75).
        // To make the percentage intuitive for end users, we apply Min-Max normalization to stretch this band.
        const MIN_SCORE = 0.60; // Baseline for completely unrelated posts
        const MAX_SCORE = 0.75; // Baseline for highly related posts
        const normalizedScore = (similarity - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
        
        const matchPercentage = Math.max(0, Math.min(100, Math.round(normalizedScore * 100)));

        return {
          ...post,
          matchPercentage: `${matchPercentage}% Match`,
          similarityScore: similarity,
        };
      });

      // Sort by similarity score descending
      recommendedFeed.sort((a, b) => b.similarityScore - a.similarityScore);

      // Return top limit
      return recommendedFeed.slice(0, limit);
    } catch (error) {
      console.error('[RetrievalService] Error getting recommendations:', error);
      throw error;
    }
  }
}
