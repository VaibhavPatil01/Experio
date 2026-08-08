import fs from 'fs';
import AnalyzerPipelineService from '../services/AnalyzerPipelineService.js';
import logger from '../../../utils/logger.js';

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
      const analysis = await AnalyzerPipelineService.executeAnalysis(
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
    const history = await AnalyzerPipelineService.getHistory(userId);
    res.status(200).json({ data: history });
  } catch (error) {
    logger.error('Get Resume Analysis History Error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
};
