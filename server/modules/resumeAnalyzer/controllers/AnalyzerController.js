import fs from 'fs';
import ResumeAnalysisOrchestrator from '../services/ResumeAnalysisOrchestrator.js';
import ResumeAnalysisRepository from '../repositories/ResumeAnalysisRepository.js';
import logger from '../../../utils/logger.js';

const repository = new ResumeAnalysisRepository();

export const analyzeResume = async (req, res) => {
  try {
    const userId = req.authTokenData.id;
    const { targetRole, targetCompany, jobDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Resume document is required.' });
    }

    if (!targetRole) {
      // Clean up the unused file
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Target role is required.' });
    }

    logger.info('Received resume analysis request', { userId, targetRole });

    // The file is now on disk
    const filePath = file.path;
    const mimetype = file.mimetype;
    const originalName = file.originalname;

    try {
      const analysis = await ResumeAnalysisOrchestrator.executeAnalysis(
        userId,
        filePath,
        mimetype,
        originalName,
        targetRole,
        targetCompany,
        jobDescription
      );

      res.status(200).json({
        message: 'Resume analyzed successfully',
        data: analysis
      });
    } finally {
      // Secure cleanup of temporary file
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        logger.error('Failed to clean up temporary resume file', { filePath, error: cleanupError.message });
      }
    }
  } catch (error) {
    logger.error('Analyze Resume Error', { error: error.message });
    res.status(500).json({ error: 'Failed to analyze resume. ' + error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.authTokenData.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const history = await repository.findByUserId(userId, skip, limit);
    res.status(200).json({ data: history, page, limit });
  } catch (error) {
    logger.error('Get Resume Analysis History Error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const userId = req.authTokenData.id;
    const analysisId = req.params.id;

    const analysis = await repository.findByIdAndUser(analysisId, userId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.status(200).json({ data: analysis });
  } catch (error) {
    logger.error('Get Analysis By ID Error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch analysis.' });
  }
};

export const getAnalysisStatus = async (req, res) => {
  try {
    const userId = req.authTokenData.id;
    const analysisId = req.params.id;

    const analysis = await repository.findByIdAndUser(analysisId, userId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.status(200).json({ 
      data: {
        status: analysis.status,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt
      } 
    });
  } catch (error) {
    logger.error('Get Analysis Status Error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch status.' });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const userId = req.authTokenData.id;
    const analysisId = req.params.id;

    const analysis = await repository.findByIdAndUser(analysisId, userId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    await repository.model.findByIdAndDelete(analysisId);
    logger.info('Deleted resume analysis', { analysisId, userId });

    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    logger.error('Delete Analysis Error', { error: error.message });
    res.status(500).json({ error: 'Failed to delete analysis.' });
  }
};

export const retryAnalysis = async (req, res) => {
  return res.status(400).json({ error: 'Resume file is not persisted. Please upload your resume again to retry.' });
};

export const reanalyzeResume = async (req, res) => {
  try {
    const userId = req.authTokenData.id;
    const analysisId = req.params.id;
    const { targetRole, targetCompany, jobDescription } = req.body;

    if (!targetRole) {
      return res.status(400).json({ error: 'Target role is required for re-analysis.' });
    }

    logger.info('Received re-analysis request', { userId, analysisId, targetRole });

    const newAnalysis = await ResumeAnalysisOrchestrator.executeReanalysis(
      userId,
      analysisId,
      targetRole,
      targetCompany,
      jobDescription
    );

    res.status(200).json({
      message: 'Resume re-analyzed successfully',
      data: newAnalysis
    });
  } catch (error) {
    logger.error('Reanalyze Resume Error', { error: error.message });
    if (error.message.includes('not store extracted text')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Analysis not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to re-analyze resume. ' + error.message });
  }
};
