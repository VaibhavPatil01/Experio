import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import ResumeDocumentParser from './ResumeDocumentParser.js';

export default class PdfResumeParser extends ResumeDocumentParser {
  /**
   * Extracts text from a PDF file using pdf-parse.
   * 
   * @param {string} filePath 
   * @returns {Promise<{text: string, metadata: Object}>}
   */
  async parse(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      
      const normalizedText = this.normalizeText(data.text);
      
      if (!normalizedText || normalizedText.length < 50) {
        throw new Error('PDF appears to be an image or scanned document. OCR is not currently supported.');
      }

      return {
        text: normalizedText,
        metadata: {
          parser: 'pdf-parse',
          pages: data.pageCount || 0
        }
      };
    } catch (error) {
      if (error.message.includes('PDF appears to be an image')) {
        throw error;
      }
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
}
