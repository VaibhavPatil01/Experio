import { jest } from '@jest/globals';
import ResumeAnalysisError, { ErrorCategories } from '../../errors/ResumeAnalysisError.js';

// Define the mock for geminiClient BEFORE any imports try to use it
const mockGenerateContent = jest.fn();

jest.unstable_mockModule('../../../../configs/gemini.js', () => ({
  default: {
    models: {
      generateContent: mockGenerateContent
    }
  }
}));

describe('GeminiAnalyzerService', () => {
  let GeminiAnalyzerService;

  beforeAll(async () => {
    GeminiAnalyzerService = (await import('../../services/GeminiAnalyzerService.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateStructuredAnalysis', () => {
    it('should successfully parse valid JSON from Gemini', async () => {
      const mockResult = {
        overallAssessment: "Great resume.",
        scores: { overall: 85 }
      };

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockResult)
      });

      const result = await GeminiAnalyzerService.generateStructuredAnalysis('mock prompt');
      
      expect(result).toEqual(mockResult);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('should strip markdown backticks and parse JSON successfully', async () => {
      const mockResult = {
        overallAssessment: "Great resume.",
        scores: { overall: 85 }
      };

      mockGenerateContent.mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockResult)}\n\`\`\``
      });

      const result = await GeminiAnalyzerService.generateStructuredAnalysis('mock prompt');
      
      expect(result).toEqual(mockResult);
    });

    it('should throw OUTPUT_VALIDATION_ERROR if Gemini returns empty text', async () => {
      mockGenerateContent.mockResolvedValue({ text: '' });

      try {
        await GeminiAnalyzerService.generateStructuredAnalysis('mock prompt');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.OUTPUT_VALIDATION_ERROR);
      }
    });

    it('should throw OUTPUT_VALIDATION_ERROR if Gemini returns malformed JSON', async () => {
      mockGenerateContent.mockResolvedValue({ text: '{ invalid_json: "yes" ' });

      try {
        await GeminiAnalyzerService.generateStructuredAnalysis('mock prompt');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.OUTPUT_VALIDATION_ERROR);
      }
    });

    it('should throw GEMINI_ERROR immediately on a 400 Bad Request', async () => {
      const error = new Error('400 Bad Request');
      mockGenerateContent.mockRejectedValue(error);

      try {
        await GeminiAnalyzerService.generateStructuredAnalysis('mock prompt');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.GEMINI_ERROR);
        // Because 400 is not retried, it should only be called once
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      }
    });

    it('should retry on 503 errors and eventually succeed', async () => {
      const error = new Error('503 Service Unavailable');
      const mockResult = { overallAssessment: "Success after retry", scores: { overall: 80 } };
      
      // Fail twice, succeed on third
      mockGenerateContent
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ text: JSON.stringify(mockResult) });

      // We override the retry delay for tests using a spy or fake timers if needed,
      // but the default backoff has a base of 2000ms which makes tests slow.
      // To speed up the test, we mock the setTimeout.
      jest.useFakeTimers();
      
      const promise = GeminiAnalyzerService.generateStructuredAnalysis('mock prompt');
      
      // Fast forward the backoff timeouts
      await Promise.resolve(); // flush microtasks
      jest.advanceTimersByTime(2500); // Attempt 1 delay
      await Promise.resolve(); // flush microtasks
      jest.advanceTimersByTime(5000); // Attempt 2 delay
      
      const result = await promise;
      
      expect(result).toEqual(mockResult);
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
      
      jest.useRealTimers();
    });
  });
});
