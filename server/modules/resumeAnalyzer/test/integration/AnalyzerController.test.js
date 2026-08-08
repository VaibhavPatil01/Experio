import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/analyzerRoutes.js';

// Create a test app
const app = express();
app.use(express.json());
// Mock auth middleware - force user 'test-user-123'
app.use((req, res, next) => {
  req.authTokenData = { id: 'test-user-123' };
  next();
});
app.use('/api/resume-analysis', router);

// Mock the repository
const mockFindByUserId = jest.fn();
const mockFindByIdAndUser = jest.fn();
const mockModelCreate = jest.fn();
const mockModelUpdateMany = jest.fn();
const mockModelFindByIdAndDelete = jest.fn();
const mockModelDeleteMany = jest.fn();

jest.unstable_mockModule('../../repositories/ResumeAnalysisRepository.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    findByUserId: mockFindByUserId,
    findByIdAndUser: mockFindByIdAndUser,
    model: {
      create: mockModelCreate,
      updateMany: mockModelUpdateMany,
      findByIdAndDelete: mockModelFindByIdAndDelete,
      deleteMany: mockModelDeleteMany
    }
  }))
}));

// Mock orchestrator
jest.unstable_mockModule('../../services/ResumeAnalysisOrchestrator.js', () => ({
  default: {
    executeAnalysis: jest.fn().mockResolvedValue({ _id: 'newAnalysis123', status: 'completed' }),
    executeReanalysis: jest.fn().mockResolvedValue({ _id: 'reanalysis123', status: 'completed' })
  }
}));

describe('AnalyzerController Integration', () => {
  let orchestrator;

  beforeEach(async () => {
    jest.clearAllMocks();
    orchestrator = (await import('../../services/ResumeAnalysisOrchestrator.js')).default;
  });

  describe('POST /analyze', () => {
    it('should return 400 if resume file is missing', async () => {
      const res = await request(app)
        .post('/api/resume-analysis/analyze')
        .field('targetRole', 'SDE');

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Resume document is required');
    });

    it('should return 400 if targetRole is missing', async () => {
      const res = await request(app)
        .post('/api/resume-analysis/analyze')
        .attach('resume', Buffer.from('mock pdf'), 'test.pdf');

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Target role is required');
    });

    it('should successfully initiate analysis if inputs are valid', async () => {
      const res = await request(app)
        .post('/api/resume-analysis/analyze')
        .field('targetRole', 'Software Engineer')
        .field('targetCompany', 'Google')
        .attach('resume', Buffer.from('mock pdf content'), 'resume.pdf');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Resume analyzed successfully');
      expect(orchestrator.executeAnalysis).toHaveBeenCalled();
    });
  });

  describe('GET /history', () => {
    it('should return empty array if no history', async () => {
      const res = await request(app).get('/api/resume-analysis/history');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should return paginated history', async () => {
      mockFindByUserId.mockResolvedValue([
        { userId: 'test-user-123', status: 'completed', targetParams: { role: 'SDE' } }
      ]);
      mockModelUpdateMany.mockResolvedValue({ modifiedCount: 0 });

      const res = await request(app).get('/api/resume-analysis/history?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should perform lazy cleanup of stale processing jobs', async () => {
      mockModelUpdateMany.mockResolvedValue({ modifiedCount: 1 });
      mockFindByUserId.mockResolvedValue([
        { userId: 'test-user-123', status: 'failed' }
      ]);

      const res = await request(app).get('/api/resume-analysis/history');
      expect(res.status).toBe(200);
      expect(mockModelUpdateMany).toHaveBeenCalled();
    });
  });

  describe('IDOR Protection', () => {
    it('should block user from fetching another users analysis', async () => {
      mockFindByIdAndUser.mockResolvedValue(null);

      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/resume-analysis/${fakeId}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Analysis not found');
    });

    it('should block user from deleting another users analysis', async () => {
      mockFindByIdAndUser.mockResolvedValue(null);

      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/resume-analysis/${fakeId}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Analysis not found');
    });
  });

  describe('POST /retry', () => {
    it('should fail if analysis does not exist', async () => {
      mockFindByIdAndUser.mockResolvedValue(null);
      
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).post(`/api/resume-analysis/${fakeId}/retry`);
      expect(res.status).toBe(404);
    });

    it('should fail if analysis is already completed', async () => {
      mockFindByIdAndUser.mockResolvedValue({
        status: 'completed'
      });

      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).post(`/api/resume-analysis/${fakeId}/retry`);
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already completed');
    });

    it('should successfully retry a failed analysis', async () => {
      mockFindByIdAndUser.mockResolvedValue({
        status: 'failed',
        targetParams: { targetRole: 'SDE' }
      });

      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).post(`/api/resume-analysis/${fakeId}/retry`);
      expect(res.status).toBe(200);
      expect(orchestrator.executeReanalysis).toHaveBeenCalledWith('test-user-123', fakeId.toString(), 'SDE', undefined, undefined);
    });
  });
});
