import { jest } from '@jest/globals';
import ResumeAnalysisOrchestrator from '../../services/ResumeAnalysisOrchestrator.js';
import ResumeAnalysisError, { ErrorCategories } from '../../errors/ResumeAnalysisError.js';

// Mock all internal services so we can test just the orchestrator flow
jest.unstable_mockModule('../../services/DocumentExtractionService.js', () => ({
  default: { extractText: jest.fn() }
}));
jest.unstable_mockModule('../../services/ResumeAnalysisContextBuilder.js', () => ({
  default: {
    buildUserProfileContext: jest.fn(),
    buildContext: jest.fn()
  }
}));
jest.unstable_mockModule('../../services/ResumeAnalysisRetrievalService.js', () => ({
  default: { retrieveRelevantExperiences: jest.fn() }
}));
jest.unstable_mockModule('../../services/AnalyzerPromptBuilder.js', () => ({
  default: { buildPrompt: jest.fn() }
}));
jest.unstable_mockModule('../../services/GeminiAnalyzerService.js', () => ({
  default: { generateStructuredAnalysis: jest.fn() }
}));

// Mock the repository completely
const mockCreateAnalysis = jest.fn();
const mockUpdateStatus = jest.fn();
const mockSaveResult = jest.fn();
const mockCheckDuplicate = jest.fn();

jest.unstable_mockModule('../../repositories/ResumeAnalysisRepository.js', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      createAnalysis: mockCreateAnalysis,
      updateStatus: mockUpdateStatus,
      saveResult: mockSaveResult,
      checkDuplicate: mockCheckDuplicate
    }))
  };
});

describe('ResumeAnalysisOrchestrator', () => {
  let docExtractionService, contextBuilder, retrievalService, promptBuilder, geminiService;

  beforeEach(async () => {
    jest.clearAllMocks();
    docExtractionService = (await import('../../services/DocumentExtractionService.js')).default;
    contextBuilder = (await import('../../services/ResumeAnalysisContextBuilder.js')).default;
    retrievalService = (await import('../../services/ResumeAnalysisRetrievalService.js')).default;
    promptBuilder = (await import('../../services/AnalyzerPromptBuilder.js')).default;
    geminiService = (await import('../../services/GeminiAnalyzerService.js')).default;
  });

  describe('executeAnalysis', () => {
    it('should successfully orchestrate a full analysis pipeline', async () => {
      // Mock all the steps
      mockCreateAnalysis.mockResolvedValue({ _id: 'analysis123' });
      mockCheckDuplicate.mockResolvedValue(null);
      
      docExtractionService.extractText.mockResolvedValue({ text: 'My resume text', fileHash: 'hash123' });
      contextBuilder.buildUserProfileContext.mockResolvedValue({ name: 'Test User' });
      
      retrievalService.retrieveRelevantExperiences.mockResolvedValue({ experiences: [] });
      contextBuilder.buildContext.mockReturnValue({ fakeContext: true });
      promptBuilder.buildPrompt.mockReturnValue('Mock Prompt String');
      
      geminiService.generateStructuredAnalysis.mockResolvedValue({
        overallAssessment: 'Good',
        references: []
      });
      
      mockSaveResult.mockResolvedValue({ _id: 'analysis123', status: 'completed' });

      const result = await ResumeAnalysisOrchestrator.executeAnalysis(
        'user123', '/tmp/file.pdf', 'application/pdf', 'resume.pdf', 'SDE', 'Google', 'SDE role'
      );

      expect(result.status).toBe('completed');
      expect(mockCreateAnalysis).toHaveBeenCalled();
      expect(docExtractionService.extractText).toHaveBeenCalled();
      expect(contextBuilder.buildUserProfileContext).toHaveBeenCalled();
      expect(geminiService.generateStructuredAnalysis).toHaveBeenCalledWith('Mock Prompt String');
      expect(mockSaveResult).toHaveBeenCalled();
    });

    it('should catch an error and attempt to update the database status to failed', async () => {
      mockCreateAnalysis.mockResolvedValue({ _id: 'analysis123' });
      docExtractionService.extractText.mockRejectedValue(new Error('Extraction failed'));

      try {
        await ResumeAnalysisOrchestrator.executeAnalysis(
          'user123', '/tmp/file.pdf', 'application/pdf', 'resume.pdf', 'SDE', null, null
        );
        fail('Should have thrown an error');
      } catch (error) {
        expect(mockUpdateStatus).toHaveBeenCalledWith('analysis123', 'failed', expect.any(Object));
      }
    });
  });
});
