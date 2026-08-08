import dotenv from 'dotenv';
dotenv.config();

import { Type } from '@google/genai';
import geminiClient from './configs/gemini.js';

async function testGemini() {
  console.log('Testing Gemini API with gemini-3.5-flash and FULL schema...');
  
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

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: "Analyze this simple resume: I am a software engineer. My target is an SDE role at Amazon.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });
    console.log('SUCCESS!');
    const data = JSON.parse(response.text);
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('ERROR!');
    console.error(error.message);
  }
}

testGemini();
