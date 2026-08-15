import { jest } from '@jest/globals';
import ResumeAnalysisError, { ErrorCategories } from '../../errors/ResumeAnalysisError.js';
import crypto from 'crypto';

// Mock Dependencies
const mockSearch = jest.fn();
jest.unstable_mockModule('../../../../configs/qdrant.js', () => ({
  default: {
    search: mockSearch
  }
}));

const mockGenerateEmbedding = jest.fn();
jest.unstable_mockModule('../../../../ai/embeddingService.js', () => ({
  EmbeddingService: {
    generateEmbedding: mockGenerateEmbedding
  }
}));

const mockPostFind = jest.fn();
jest.unstable_mockModule('../../../../models/Post.js', () => ({
  Post: {
    find: mockPostFind
  }
}));

describe('ResumeAnalysisRetrievalService', () => {
  let ResumeAnalysisRetrievalService;

  beforeAll(async () => {
    ResumeAnalysisRetrievalService = (await import('../../services/ResumeAnalysisRetrievalService.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPostFind.mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        {
          _id: '123',
          title: 'SDE at Google',
          company: 'Google',
          role: 'SDE',
          technologies: ['React'],
          rounds: [],
          overallTips: 'Practice LeetCode'
        },
        {
          _id: '999',
          title: 'SDE at Amazon',
          company: 'Amazon',
          role: 'SDE'
        }
      ])
    });
  });

  describe('retrieveRelevantExperiences', () => {
    it('should generate a semantic embedding and retrieve relevant experiences', async () => {
      mockGenerateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
      
      mockSearch.mockResolvedValue([
        { 
          id: '123', 
          score: 0.85, 
          payload: { 
            mongoId: '123',
            title: 'SDE at Google', 
            company: 'Google',
            role: 'SDE',
            content: 'Great interview experience.' 
          }
        }
      ]);
      
      mockPostFind.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValue([
          {
            _id: '123',
            title: 'SDE at Google',
            company: 'Google',
            role: 'SDE',
            technologies: ['React'],
            rounds: [],
            overallTips: 'Practice LeetCode'
          }
        ])
      });

      const targetFacts = { role: 'Software Engineer', company: 'Google' };
      const candidateFacts = { profile: { skills: ['React'] } };

      const result = await ResumeAnalysisRetrievalService.retrieveRelevantExperiences(targetFacts, candidateFacts);
      
      expect(mockGenerateEmbedding).toHaveBeenCalledTimes(2);
      expect(mockSearch).toHaveBeenCalledTimes(2);
      expect(result.isUnavailable).toBe(false);
      expect(result.experiences).toHaveLength(1);
      expect(result.experiences[0].experienceId).toBe('123');
    });

    it('should fall back gracefully if Qdrant crashes', async () => {
      mockGenerateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
      mockSearch.mockRejectedValue(new Error('Connection Refused'));

      const targetFacts = { role: 'Software Engineer' };
      const candidateFacts = { profile: {} };

      const result = await ResumeAnalysisRetrievalService.retrieveRelevantExperiences(targetFacts, candidateFacts);
      
      expect(result.isUnavailable).toBe(true);
      expect(result.experiences).toEqual([]);
      expect(result.fallbackNote).toContain('retrieval failed');
    });

    it('should aggressively truncate very large returned context to save tokens', async () => {
      mockGenerateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
      
      const massiveString = 'A'.repeat(5000);
      mockSearch.mockResolvedValue([
        { 
          id: '999', 
          score: 0.9, 
          payload: { 
            mongoId: '999',
            title: 'SDE', 
            company: 'Amazon',
            role: 'SDE'
          }
        }
      ]);
      
      mockPostFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { _id: '999', title: 'SDE at Amazon', company: 'Amazon', role: 'SDE', overallTips: massiveString }
        ])
      });

      const result = await ResumeAnalysisRetrievalService.retrieveRelevantExperiences({ role: 'SDE' }, {});
      
      // Ensure the content was truncated
      expect(result.experiences[0].candidateAdvice.length).toBeLessThan(5000);
      expect(result.experiences[0].candidateAdvice.endsWith('...')).toBe(true);
    });

    it('should filter out duplicate experiences', async () => {
      mockGenerateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
      
      // Return the same payload ID twice
      mockSearch.mockResolvedValue([
        { id: '123', score: 0.8, payload: { mongoId: '123', title: 'A', company: 'B', role: 'C' } },
        { id: '123', score: 0.7, payload: { mongoId: '123', title: 'A', company: 'B', role: 'C' } }
      ]);
      
      mockPostFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { _id: '123', title: 'A', company: 'B', role: 'C' }
        ])
      });

      const result = await ResumeAnalysisRetrievalService.retrieveRelevantExperiences({ role: 'SDE' }, {});
      
      expect(result.experiences).toHaveLength(1);
    });
  });
});
