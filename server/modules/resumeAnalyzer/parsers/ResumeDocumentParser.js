export default class ResumeDocumentParser {
  /**
   * Parses the given file and extracts normalized text.
   * Must be implemented by subclasses.
   * 
   * @param {string} filePath - Absolute path to the temporarily saved file.
   * @returns {Promise<{text: string, metadata: Object}>}
   */
  async parse(filePath) {
    throw new Error('Method "parse()" must be implemented by subclass.');
  }

  /**
   * Normalizes the extracted text.
   * Removes unnecessary whitespace, corrupt characters, etc.
   * 
   * @param {string} rawText 
   * @returns {string} Normalized clean text
   */
  normalizeText(rawText) {
    if (!rawText) return '';

    return rawText
      // Replace unusual unicode spaces with standard space
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Replace multiple spaces with a single space
      .replace(/[ \t]{2,}/g, ' ')
      // Replace more than 2 consecutive newlines with exactly 2 newlines (preserve paragraph breaks)
      .replace(/\n{3,}/g, '\n\n')
      // Remove leading/trailing whitespace
      .trim();
  }
}
