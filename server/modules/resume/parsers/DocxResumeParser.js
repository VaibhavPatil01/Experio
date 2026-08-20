import fs from 'fs';
import mammoth from 'mammoth';
import ResumeDocumentParser from './ResumeDocumentParser.js';

export default class DocxResumeParser extends ResumeDocumentParser {
  /**
   * Extracts raw text from a DOCX file using mammoth.
   * 
   * @param {string} filePath 
   * @returns {Promise<{text: string, metadata: Object}>}
   */
  async parse(filePath) {
    try {
      // mammoth extractRawText returns only the plain text with structural breaks
      const result = await mammoth.extractRawText({ path: filePath });
      
      const normalizedText = this.normalizeText(result.value);

      if (!normalizedText || normalizedText.length < 50) {
        throw new Error('DOCX document is empty or corrupted.');
      }

      return {
        text: normalizedText,
        metadata: {
          parser: 'mammoth',
          messages: result.messages // captures warnings from parsing
        }
      };
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
  }
}
