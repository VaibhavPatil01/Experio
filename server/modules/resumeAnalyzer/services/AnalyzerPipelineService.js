import ResumeAnalysisContextBuilder from './ResumeAnalysisContextBuilder.js';
import DocumentExtractionService from './DocumentExtractionService.js';
import AnalyzerPromptBuilder from './AnalyzerPromptBuilder.js';
import GeminiAnalyzerService from './GeminiAnalyzerService.js';
import ResumeAnalysisRepository from '../repositories/ResumeAnalysisRepository.js';
import logger from '../../../utils/logger.js';

const repository = new ResumeAnalysisRepository();

export default class AnalyzerPipelineService {
  /**
   * Orchestrates the entire Resume Analysis process
   */
  static async executeAnalysis(userId, filePath, mimetype, originalName, targetRole, targetCompany, jobDescription) {
    try {
      logger.info('Starting Resume Analyzer Pipeline', { userId, targetRole, originalName });

      let analysisDoc;
      try {
        const targetData = { role: targetRole, company: targetCompany, jobDescription };
        const resumeMetadata = { originalName };
        analysisDoc = await repository.createAnalysis(userId, targetData, resumeMetadata);
      } catch(e) {
        // Fallback if initial creation fails
        throw e;
      }

      const startTime = performance.now();
      let retrievalTimeMs = 0;

      // 2. Extract Text from Document
      const extractionResult = await DocumentExtractionService.extractText(filePath, mimetype, userId);

      // 3. Build Context (including extracted text)
      const contextStartTime = performance.now();
      const contextObject = await ResumeAnalysisContextBuilder.buildContext(
        userId, 
        targetRole, 
        targetCompany, 
        jobDescription,
        extractionResult.text
      );
      retrievalTimeMs = performance.now() - contextStartTime;

      // 4. Build Prompt using the strongly-typed context object
      const prompt = AnalyzerPromptBuilder.buildPrompt(contextObject);

      // 5. Call Gemini
      // Update status to processing
      await repository.updateStatus(analysisDoc._id, 'processing');
      const analysisJson = await GeminiAnalyzerService.generateStructuredAnalysis(prompt);
      
      const latencyMs = performance.now() - startTime;

      // 5. Save Final Result to Database
      const executionInfo = {
        modelUsed: 'gemini-1.5-pro',
        latencyMs,
        retrievalTimeMs
      };

      analysisDoc = await repository.saveResult(analysisDoc._id, analysisJson, executionInfo);
      logger.info('Successfully saved Resume Analysis to database', { analysisId: analysisDoc._id });

      return analysisDoc;

    } catch (error) {
      if (analysisDoc && analysisDoc._id) {
        await repository.updateStatus(analysisDoc._id, 'failed', error.message);
      }
      logger.error('Error in Resume Analyzer Pipeline', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Fetches past analyses for a user
   */
  static async getHistory(userId) {
    return await repository.findByUserId(userId);
  }
}
