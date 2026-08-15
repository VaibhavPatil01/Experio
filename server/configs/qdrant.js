import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
dotenv.config();

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
});

export const initQdrant = async () => {
  try {
    const collections = await qdrantClient.getCollections();
    const hasInterviews = collections.collections.some(c => c.name === 'interviews');
    const hasUsers = collections.collections.some(c => c.name === 'users');

    if (!hasInterviews) {
      await qdrantClient.createCollection('interviews', {
        vectors: {
          size: 3072, // Standard for gemini-embedding-001
          distance: 'Cosine',
        },
      });
      console.log('[Qdrant] Created interviews collection');
    }

    if (!hasUsers) {
      await qdrantClient.createCollection('users', {
        vectors: {
          size: 3072, // Standard for gemini-embedding-001
          distance: 'Cosine',
        },
      });
      console.log('[Qdrant] Created users collection');
    }
  } catch (error) {
    console.error('[Qdrant] Initialization Error:', error);
  }
};

export default qdrantClient;
