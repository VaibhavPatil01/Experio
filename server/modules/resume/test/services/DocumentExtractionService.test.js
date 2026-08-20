import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import path from 'path';
import ResumeAnalysisError, { ErrorCategories } from '../../errors/ResumeAnalysisError.js';

// Mock dependencies
jest.unstable_mockModule('pdf-parse', () => ({
  default: jest.fn()
}));
jest.unstable_mockModule('mammoth', () => ({
  default: {
    extractRawText: jest.fn()
  }
}));

describe('DocumentExtractionService', () => {
  let pdfParse;
  let mammoth;
  let DocumentExtractionService;

  beforeAll(async () => {
    DocumentExtractionService = (await import('../../services/DocumentExtractionService.js')).default;
  });

  beforeEach(async () => {
    // Dynamic import to get the mocked modules
    pdfParse = (await import('pdf-parse')).default;
    mammoth = (await import('mammoth')).default;
    
    // Mock fs.readFileSync
    jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('mock-file'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractText', () => {
    it('should successfully extract text from a valid PDF', async () => {
      pdfParse.mockResolvedValue({ text: 'Extracted PDF text' });
      
      const result = await DocumentExtractionService.extractText('test.pdf', 'application/pdf', 'user123');
      
      expect(result.text).toBe('Extracted PDF text');
      expect(result.pageCount).toBe(1); // Mocks fallback pageCount
      expect(pdfParse).toHaveBeenCalledTimes(1);
    });

    it('should successfully extract text from a valid DOCX', async () => {
      mammoth.extractRawText.mockResolvedValue({ value: 'Extracted DOCX text' });
      
      const mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const result = await DocumentExtractionService.extractText('test.docx', mimetype, 'user123');
      
      expect(result.text).toBe('Extracted DOCX text');
      expect(mammoth.extractRawText).toHaveBeenCalledTimes(1);
    });

    it('should throw FILE_PROCESSING_ERROR for an unsupported mimetype', async () => {
      await expect(DocumentExtractionService.extractText('test.txt', 'text/plain', 'user123'))
        .rejects
        .toThrow(ResumeAnalysisError);

      try {
        await DocumentExtractionService.extractText('test.txt', 'text/plain', 'user123');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.FILE_PROCESSING_ERROR);
        expect(error.userMessage).toContain('valid PDF or DOCX');
      }
    });

    it('should throw FILE_PROCESSING_ERROR if the extracted text is empty', async () => {
      pdfParse.mockResolvedValue({ text: '   \n   ' }); // Only whitespace
      
      try {
        await DocumentExtractionService.extractText('test.pdf', 'application/pdf', 'user123');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.FILE_PROCESSING_ERROR);
      }
    });

    it('should throw FILE_PROCESSING_ERROR if the file size exceeds the strict limit', async () => {
      // Mock a 10MB buffer
      jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.alloc(10 * 1024 * 1024));
      
      try {
        await DocumentExtractionService.extractText('test.pdf', 'application/pdf', 'user123');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.FILE_PROCESSING_ERROR);
        expect(error.internalDetails.originalError).toContain('File size exceeds 5MB limit');
      }
    });

    it('should throw FILE_PROCESSING_ERROR if the parsing library fails', async () => {
      pdfParse.mockRejectedValue(new Error('Corrupt PDF header'));
      
      try {
        await DocumentExtractionService.extractText('test.pdf', 'application/pdf', 'user123');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.category).toBe(ErrorCategories.FILE_PROCESSING_ERROR);
        expect(error.internalDetails.originalError).toContain('Corrupt PDF header');
      }
    });
  });
});
