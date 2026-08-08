import PdfResumeParser from '../parsers/PdfResumeParser.js';
import DocxResumeParser from '../parsers/DocxResumeParser.js';
import logger from '../../../utils/logger.js';

export default class DocumentExtractionService {
  /**
   * Factory method to extract text based on the mimetype.
   * 
   * @param {string} filePath - Path to the uploaded file on disk
   * @param {string} mimetype - Validated MIME type
   * @param {string} userId - For logging
   * @returns {Promise<{text: string, metadata: Object}>}
   */
  static async extractText(filePath, mimetype, userId) {
    const startTime = performance.now();
    let parser;

    if (mimetype === 'application/pdf') {
      parser = new PdfResumeParser();
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimetype === 'application/msword'
    ) {
      parser = new DocxResumeParser();
    } else {
      throw new Error(`Unsupported file type for extraction: ${mimetype}`);
    }

    try {
      const result = await parser.parse(filePath);
      const durationMs = performance.now() - startTime;
      
      logger.info('Document extraction successful', {
        userId,
        parser: result.metadata.parser,
        durationMs: Math.round(durationMs),
        characterCount: result.text.length
      });

      // Augment metadata with extraction metrics
      result.metadata.extractionDurationMs = Math.round(durationMs);
      result.metadata.characterCount = result.text.length;

      return result;
    } catch (error) {
      const durationMs = performance.now() - startTime;
      logger.error('Document extraction failed', {
        userId,
        mimetype,
        durationMs: Math.round(durationMs),
        error: error.message
      });
      throw error;
    }
  }
}
