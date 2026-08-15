import qdrantClient from '../configs/qdrant.js';

export class QdrantRepository {
  /**
   * Upsert an embedding for a Post (Interview)
   * @param {string} mongoId The MongoDB ObjectId as string
   * @param {number[]} vector The embedding vector
   * @param {Object} payload Metadata payload
   */
  static async upsertPost(mongoId, vector, payload) {
    try {
      await qdrantClient.upsert('interviews', {
        wait: true, // Wait for confirmation
        points: [
          {
            id: mongoId, // Qdrant allows UUID format strings, but wait, Mongo ObjectId is 24 hex chars. 
            // Qdrant supports UUID or integers. We must hash or format the mongoId to UUID format, 
            // or let Qdrant generate it and store mongo_id in payload.
            // ACTUALLY, Qdrant allows string UUIDs. A 24-char hex string is not a valid UUID.
            // We should use UUID v5 based on MongoID, or just let payload have mongoId and use a hash.
            id: this.mongoIdToUuid(mongoId),
            vector: vector,
            payload: {
              ...payload,
              mongoId,
              entityType: 'post'
            }
          }
        ]
      });
    } catch (error) {
      console.error('[QdrantRepository] Failed to upsert Post:', error);
      throw error;
    }
  }

  /**
   * Upsert an embedding for a User
   */
  static async upsertUser(mongoId, vector, payload) {
    try {
      await qdrantClient.upsert('users', {
        wait: true,
        points: [
          {
            id: this.mongoIdToUuid(mongoId),
            vector: vector,
            payload: {
              ...payload,
              mongoId,
              entityType: 'user'
            }
          }
        ]
      });
    } catch (error) {
      console.error('[QdrantRepository] Failed to upsert User:', error);
      throw error;
    }
  }
  
  static async searchPosts(vector, limit = 10, filter = null) {
      const response = await qdrantClient.search('interviews', {
          vector: vector,
          limit: limit,
          filter: filter,
          with_payload: true,
      });
      return response;
  }

  static async searchUsers(vector, limit = 10, filter = null, scoreThreshold = null) {
      const searchParams = {
          vector: vector,
          limit: limit,
          filter: filter,
          with_payload: true,
      };
      if (scoreThreshold !== null) {
          searchParams.score_threshold = scoreThreshold;
      }
      const response = await qdrantClient.search('users', searchParams);
      return response;
  }

  /**
   * Convert 24-char hex Mongo ObjectId to 36-char UUID format
   * (e.g., 507f1f77bcf86cd799439011 -> 507f1f77-bcf8-6cd7-9943-901100000000)
   * This is a deterministic conversion trick for Qdrant compatibility.
   */
  static mongoIdToUuid(mongoId) {
    const hex = mongoId.padEnd(32, '0'); // Pad to 32 chars
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }
}
