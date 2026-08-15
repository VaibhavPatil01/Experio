import ResumeAnalysis from '../models/ResumeAnalysis.js';
import logger from '../../../utils/logger.js';

export default class ResumeAnalysisRepository {
  /**
   * Supports dependency injection for testing and loose coupling
   */
  constructor(model) {
    this.model = model || ResumeAnalysis;
  }

  /**
   * Initializes a new analysis document in 'pending' status.
   */
  async createAnalysis(userId, targetData, resumeMetadata) {
    try {
      return await this.model.create({
        userId,
        target: {
          role: targetData.role,
          company: targetData.company,
          jobDescription: targetData.jobDescription
        },
        resumeMetadata: {
          fileUrl: resumeMetadata.fileUrl || '',
          fileHash: resumeMetadata.fileHash || '',
          originalName: resumeMetadata.originalName || ''
        },
        status: 'pending'
      });
    } catch (error) {
      logger.error('Failed to create ResumeAnalysis document', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Transitions the status of an analysis.
   */
  async updateStatus(analysisId, status, errorDetails = null) {
    try {
      const updateData = { status };
      if (errorDetails) {
        updateData['executionInfo.errorDetails'] = errorDetails;
      }

      return await this.model.findByIdAndUpdate(
        analysisId,
        updateData,
        { new: true }
      ).lean();
    } catch (error) {
      logger.error('Failed to update ResumeAnalysis status', { analysisId, status, error: error.message });
      throw error;
    }
  }

  /**
   * Saves the final structured LLM result and execution metrics.
   */
  async saveResult(analysisId, result, executionInfo) {
    try {
      return await this.model.findByIdAndUpdate(
        analysisId,
        {
          status: 'completed',
          result: result,
          executionInfo: executionInfo
        },
        { new: true }
      ).lean();
    } catch (error) {
      logger.error('Failed to save ResumeAnalysis result', { analysisId, error: error.message });
      throw error;
    }
  }

  /**
   * Retrieves paginated history for a user.
   */
  async findByUserId(userId, skip = 0, limit = 20) {
    try {
      return await this.model.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (error) {
      logger.error('Failed to fetch ResumeAnalysis history', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Fetches a specific analysis, ensuring the user owns it.
   */
  async findByIdAndUser(analysisId, userId) {
    try {
      return await this.model.findOne({ _id: analysisId, userId }).lean();
    } catch (error) {
      logger.error('Failed to fetch ResumeAnalysis by ID', { analysisId, userId, error: error.message });
      throw error;
    }
  }

  /**
   * Retrieves the most recent analysis for a user.
   */
  async findLatestByUserId(userId) {
    try {
      return await this.model.findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();
    } catch (error) {
      logger.error('Failed to fetch latest ResumeAnalysis', { userId, error: error.message });
      throw error;
    }
  }
}
