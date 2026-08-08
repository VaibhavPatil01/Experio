import geminiClient from '../../../configs/gemini.js';
import logger from '../../../utils/logger.js';

export default class GeminiAnalyzerService {
  /**
   * Calls Gemini to perform the resume analysis based on the complete prompt.
   * Forces JSON output.
   * 
   * @param {string} prompt The detailed system prompt containing context and resume text
   * @returns {Promise<Object>} The parsed JSON result
   */
  static async generateStructuredAnalysis(prompt) {
    try {
      logger.info('Calling Gemini 1.5 for Resume Analysis');
      
      const contents = [ prompt ];

      const response = await geminiClient.models.generateContent({
        model: 'gemini-1.5-pro', // Pro is better for complex reasoning/document analysis than flash
        contents: contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for consistent, analytical output
        }
      });

      let jsonString = response.text;
      
      // Safety net: in case the model wraps it in markdown despite instructions
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsedResponse = JSON.parse(jsonString);
      
      logger.info('Successfully generated structured analysis from Gemini');
      return parsedResponse;
    } catch (error) {
      logger.error('Failed to generate analysis from Gemini', { error: error.message, stack: error.stack });
      throw new Error('AI Analysis failed. Please try again later.');
    }
  }
}
