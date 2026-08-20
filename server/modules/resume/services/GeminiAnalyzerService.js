import { Type } from '@google/genai';
import geminiClient from '../../../configs/gemini.js';
import logger from '../../../utils/logger.js';
import ResumeAnalysisError, { ErrorCategories } from '../errors/ResumeAnalysisError.js';
import { withExponentialBackoff } from '../utils/retry.js';

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
      logger.info('Calling Gemini 3.5 Flash for Resume Analysis');
      
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
            },
            required: ["overallScore", "roleAlignmentScore", "technicalSkillScore"]
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
              },
              required: ["projectName", "feedback"]
            }
          },
          experienceFeedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                roleTitle: { type: Type.STRING },
                feedback: { type: Type.STRING }
              },
              required: ["roleTitle", "feedback"]
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
                example: { type: Type.STRING },
                sourceType: { type: Type.STRING, description: "Must be one of: 'resume', 'profile', 'job-description', 'platform', or 'general'" }
              },
              required: ["title", "priority", "problem", "whyItMatters", "recommendation", "evidence", "sourceType"]
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
              },
              required: ["originalText", "suggestedText", "reasoning"]
            }
          },
          references: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of experienceIds that were explicitly cited in your analysis."
          }
        },
        required: [
          "overallAssessment",
          "scores",
          "strengths",
          "improvements",
          "skillAnalysis",
          "jobDescriptionAnalysis",
          "roleAnalysis",
          "companyAnalysis",
          "projectFeedback",
          "experienceFeedback",
          "summaryFeedback",
          "priorityRecommendations",
          "suggestedRewrites",
          "references"
        ]
      };

      let response;
      try {
        response = await withExponentialBackoff(
          async () => {
            return await geminiClient.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: contents,
              config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2,
              }
            });
          },
          {
            maxRetries: 3,
            baseDelayMs: 2000,
            shouldRetry: (error) => {
              const msg = error.message.toLowerCase();
              // Do not retry 400 errors (bad request, invalid schema, prompt too large)
              if (msg.includes('400') || msg.includes('bad request') || msg.includes('schema')) {
                return false;
              }
              // Retry on 5xx, 429, timeouts, network drops
              return true;
            }
          }
        );
      } catch (geminiError) {
        throw new ResumeAnalysisError(
          ErrorCategories.GEMINI_ERROR,
          'Failed to connect to the AI analysis engine after multiple attempts. Please try again later.',
          { originalError: geminiError.message }
        );
      }

      if (!response || !response.text) {
        throw new ResumeAnalysisError(
          ErrorCategories.OUTPUT_VALIDATION_ERROR,
          'The AI analysis engine returned an empty response.'
        );
      }

      try {
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
        }
        const parsedResponse = JSON.parse(cleanText);
        // Basic validation to ensure schema was adhered to
        if (!parsedResponse.overallAssessment || !parsedResponse.scores) {
           throw new Error("Invalid schema structure returned from Gemini");
        }
        
        logger.info('Successfully generated structured analysis from Gemini');
        return parsedResponse;
      } catch (jsonError) {
        throw new ResumeAnalysisError(
          ErrorCategories.OUTPUT_VALIDATION_ERROR,
          'The AI analysis engine returned malformed data that could not be parsed.',
          { originalError: jsonError.message }
        );
      }
    } catch (error) {
      if (error instanceof ResumeAnalysisError) {
        throw error;
      }
      
      throw new ResumeAnalysisError(
        ErrorCategories.GEMINI_ERROR,
        'An unexpected error occurred during AI generation.',
        { originalError: error.message }
      );
    }
  }
}
