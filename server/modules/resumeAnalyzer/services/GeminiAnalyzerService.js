import { Type } from '@google/genai';
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
  static async generateStructuredAnalysis(prompt, retries = 1) {
    try {
      logger.info('Calling Gemini 1.5 for Resume Analysis');
      
      const contents = [ prompt ];

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          overallAssessment: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              roleAlignmentScore: { type: Type.INTEGER },
              technicalSkillScore: { type: Type.INTEGER }
            }
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillAnalysis: { type: Type.STRING },
          jobDescriptionAnalysis: { type: Type.STRING },
          roleAnalysis: { type: Type.STRING },
          companyAnalysis: { type: Type.STRING },
          projectFeedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                projectName: { type: Type.STRING },
                feedback: { type: Type.STRING }
              }
            }
          },
          experienceFeedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                roleTitle: { type: Type.STRING },
                feedback: { type: Type.STRING }
              }
            }
          },
          summaryFeedback: { type: Type.STRING },
          priorityRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                priority: { type: Type.STRING, description: "High, Medium, or Low" },
                problem: { type: Type.STRING },
                whyItMatters: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                evidence: { type: Type.STRING, description: "Cite specific evidence from the provided context facts" },
                example: { type: Type.STRING }
              }
            }
          },
          suggestedRewrites: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalText: { type: Type.STRING },
                suggestedText: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              }
            }
          },
          references: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of experienceIds that were explicitly cited in your analysis."
          }
        }
      };

      const response = await geminiClient.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.2, // Low temperature for consistent, analytical output
        }
      });

      let jsonString = response.text;
      
      const parsedResponse = JSON.parse(jsonString);
      
      // Basic validation to ensure schema was adhered to
      if (!parsedResponse.overallAssessment || !parsedResponse.scores) {
         throw new Error("Invalid schema structure returned from Gemini");
      }
      
      logger.info('Successfully generated structured analysis from Gemini');
      return parsedResponse;
    } catch (error) {
      if (retries > 0) {
        logger.warn('Gemini parsing or validation failed, retrying...', { error: error.message });
        return this.generateStructuredAnalysis(prompt, retries - 1);
      }
      logger.error('Failed to generate analysis from Gemini after retries', { error: error.message, stack: error.stack });
      throw new Error('AI Analysis failed due to invalid output format. Please try again.');
    }
  }
}
