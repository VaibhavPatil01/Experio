import crypto from 'crypto';
import ResumeAnalysisContextBuilder from './ResumeAnalysisContextBuilder.js';
import DocumentExtractionService from './DocumentExtractionService.js';
import AnalyzerPromptBuilder from './AnalyzerPromptBuilder.js';
import GeminiAnalyzerService from './GeminiAnalyzerService.js';
import ResumeAnalysisRepository from '../repositories/ResumeAnalysisRepository.js';
import ResumeAnalysisRetrievalService from './ResumeAnalysisRetrievalService.js';
import logger from '../../../utils/logger.js';

const repository = new ResumeAnalysisRepository();

export default class ResumeAnalysisOrchestrator {
  /**
   * Main entry point for the Resume Analyzer pipeline.
   * Coordinates the deterministic extraction, contextual retrieval, and AI evaluation layers concurrently.
   */
  static async executeAnalysis(userId, filePath, mimetype, originalName, targetRole, targetCompany, jobDescription) {
    const requestId = crypto.randomUUID();
    const startTime = performance.now();
    let analysisDoc;

    try {
      logger.info('Starting Resume Analysis Orchestration', { requestId, userId, targetRole, originalName });

      // 1. Initialize State
      const targetData = { role: targetRole, company: targetCompany, jobDescription };
      const resumeMetadata = { originalName };
      analysisDoc = await repository.createAnalysis(userId, targetData, resumeMetadata);

      logger.info('Created pending analysis record', { requestId, analysisId: analysisDoc._id });

      // 2. Concurrent Pre-Processing: Extract Document & Fetch Profile Context simultaneously
      const preProcessStartTime = performance.now();
      
      const [extractionResult, userProfile] = await Promise.all([
        DocumentExtractionService.extractText(filePath, mimetype, userId),
        ResumeAnalysisContextBuilder.buildUserProfileContext(userId) // Exposed dynamically
      ]);
      
      const preProcessDuration = performance.now() - preProcessStartTime;

      // 3. RAG Retrieval Layer
      // Now that we have the profile (skills) and target, we can fetch context.
      const retrievalStartTime = performance.now();
      const targetFacts = { role: targetRole, company: targetCompany, jobDescription };
      const candidateFacts = { profile: userProfile };
      
      const relevantExperiences = await ResumeAnalysisRetrievalService.retrieveRelevantExperiences(
        targetFacts, 
        candidateFacts
      );
      const retrievalDuration = performance.now() - retrievalStartTime;

      // 4. Structural Context Build
      const contextObject = ResumeAnalysisContextBuilder.buildContext(
        userId, 
        targetRole, 
        targetCompany, 
        jobDescription,
        extractionResult.text,
        userProfile,
        relevantExperiences
      );

      // 5. Prompt Compilation
      const prompt = AnalyzerPromptBuilder.buildPrompt(contextObject);

      // 6. Execute AI Evaluation (With Timeout)
      await repository.updateStatus(analysisDoc._id, 'processing');
      
      const aiStartTime = performance.now();
      const analysisJson = await this._executeWithTimeout(
        GeminiAnalyzerService.generateStructuredAnalysis(prompt),
        60000 // 60 seconds
      );
      const aiDuration = performance.now() - aiStartTime;

      // 7. Persist and Finalize
      const totalLatencyMs = performance.now() - startTime;
      const executionInfo = {
        modelUsed: 'gemini-1.5-pro',
        totalLatencyMs: Math.round(totalLatencyMs),
        preProcessDuration: Math.round(preProcessDuration),
        retrievalDuration: Math.round(retrievalDuration),
        aiDuration: Math.round(aiDuration)
      };

      analysisDoc = await repository.saveResult(analysisDoc._id, analysisJson, executionInfo);
      logger.info('Successfully saved Resume Analysis', { requestId, analysisId: analysisDoc._id });

      return analysisDoc;

    } catch (error) {
      logger.error('Error in Resume Analyzer Orchestrator', { requestId, error: error.message, stack: error.stack });
      
      if (analysisDoc && analysisDoc._id) {
        try {
          await repository.updateStatus(analysisDoc._id, 'failed', error.message);
        } catch (dbError) {
          logger.error('Failed to update analysis status to failed', { requestId, error: dbError.message });
        }
      }
      
      throw error;
    }
  }

  /**
   * Fetches past analyses for a user
   */
  static async getHistory(userId) {
    return await repository.findByUserId(userId);
  }

  /**
   * Wraps a promise with a hard timeout
   */
  static _executeWithTimeout(promise, timeoutMs) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }
}
