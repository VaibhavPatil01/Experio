import { jest } from '@jest/globals';
import { initNotificationWorker } from '../modules/posts/workers/notificationWorker.js';
import qdrantClient from '../configs/qdrant.js';
import { Post } from '../modules/posts/models/Post.js';
import * as notificationRepo from '../modules/posts/repositories/notificationRepository.js';
import * as socketConfig from '../configs/socket.js';
import { Worker } from 'bullmq';

jest.mock('bullmq');
jest.mock('../configs/qdrant.js', () => ({
  search: jest.fn()
}));
jest.mock('../modules/posts/models/Post.js', () => ({
  Post: {
    findById: jest.fn()
  }
}));
jest.mock('../modules/posts/repositories/notificationRepository.js', () => ({
  createNotificationsBatch: jest.fn(),
  createNotification: jest.fn()
}));
jest.mock('../configs/socket.js', () => ({
  emitNotificationToUser: jest.fn()
}));

// We need to extract the job handler function passed to Worker
let jobHandler;
Worker.mockImplementation((name, handler) => {
  jobHandler = handler;
  return { on: jest.fn() };
});

describe('Notification Worker', () => {
  beforeAll(() => {
    initNotificationWorker();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processPostMatch (Qdrant Matching)', () => {
    const mockPostId = 'post_123';
    const mockPostAuthorId = 'user_author';
    const mockPayload = { postId: mockPostId, vector: [0.1, 0.2] };

    beforeEach(() => {
      Post.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ userId: { toString: () => mockPostAuthorId } })
      });
    });

    it('should match users strictly above the threshold and normalize score', async () => {
      // 50% target matches to 0.675 score threshold
      qdrantClient.search.mockResolvedValueOnce([
        { payload: { mongoId: 'user_1' }, score: 0.8 }, // Match
        { payload: { mongoId: 'user_2' }, score: 0.68 }, // Match
        { payload: { mongoId: 'user_3' }, score: 0.6 }, // Below threshold, excluded
        { payload: { mongoId: mockPostAuthorId }, score: 0.9 } // Author, excluded
      ]).mockResolvedValueOnce([]); // Empty to break pagination loop

      notificationRepo.createNotificationsBatch.mockResolvedValueOnce([
        { recipientId: 'user_1' },
        { recipientId: 'user_2' }
      ]);

      await jobHandler({ name: 'process-post-match', data: mockPayload });

      expect(notificationRepo.createNotificationsBatch).toHaveBeenCalledTimes(1);
      
      const batchPayload = notificationRepo.createNotificationsBatch.mock.calls[0][0];
      expect(batchPayload).toHaveLength(2);
      
      // Verify score normalization (score 0.8 normalized over 0.6-0.75 maxes out at 100%)
      expect(batchPayload[0].recipientId).toBe('user_1');
      expect(batchPayload[0].metadata.matchPercentage).toBe(100); 

      // WebSocket emit
      expect(socketConfig.emitNotificationToUser).toHaveBeenCalledWith('user_1', expect.any(Object));
      expect(socketConfig.emitNotificationToUser).toHaveBeenCalledWith('user_2', expect.any(Object));
    });

    it('should chunk requests gracefully if there are multiple matches', async () => {
      // Create 600 fake users
      const largeMatches = Array(600).fill(0).map((_, i) => ({
        payload: { mongoId: `user_${i}` },
        score: 0.7
      }));

      qdrantClient.search
        .mockResolvedValueOnce(largeMatches.slice(0, 500))
        .mockResolvedValueOnce(largeMatches.slice(500, 600))
        .mockResolvedValueOnce([]);

      notificationRepo.createNotificationsBatch.mockResolvedValue([]);

      await jobHandler({ name: 'process-post-match', data: mockPayload });

      // Should chunk by 500 -> 2 calls
      expect(notificationRepo.createNotificationsBatch).toHaveBeenCalledTimes(2);
      expect(notificationRepo.createNotificationsBatch.mock.calls[0][0]).toHaveLength(500);
      expect(notificationRepo.createNotificationsBatch.mock.calls[1][0]).toHaveLength(100);
    });

    it('should fail and throw if Qdrant fails', async () => {
      qdrantClient.search.mockRejectedValueOnce(new Error('Qdrant Timeout'));

      await expect(jobHandler({ name: 'process-post-match', data: mockPayload }))
        .rejects.toThrow('Qdrant Timeout');
      
      expect(notificationRepo.createNotificationsBatch).not.toHaveBeenCalled();
    });
  });

  describe('processSocialNotification', () => {
    it('should process like event and prevent self notification', async () => {
      Post.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ userId: 'author_id' })
      });

      await jobHandler({ 
        name: 'process-social-notification', 
        data: { eventId: 'like_1_post1', actorUserId: 'author_id', postId: 'post1' } 
      });

      // Should not notify self
      expect(notificationRepo.createNotification).not.toHaveBeenCalled();

      // Different actor
      await jobHandler({ 
        name: 'process-social-notification', 
        data: { eventId: 'like_2_post1', actorUserId: 'other_user', postId: 'post1' } 
      });

      expect(notificationRepo.createNotification).toHaveBeenCalledWith(expect.objectContaining({
        type: 'POST_LIKE',
        recipientId: 'author_id',
        actorId: 'other_user'
      }));
    });
  });
});
