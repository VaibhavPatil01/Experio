import dotenv from 'dotenv';
dotenv.config();

import { Type } from '@google/genai';
import geminiClient from './configs/gemini.js';

async function testGemini() {
  console.log('Testing Gemini API with gemini-2.5-flash...');
  
  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: "Analyze this simple resume: I am a software engineer.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
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
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["overallAssessment", "scores", "strengths", "improvements"]
        },
        temperature: 0.2,
      }
    });
    console.log('SUCCESS!');
    console.log(response.text);
  } catch (error) {
    console.error('ERROR!');
    console.error(error.message);
  }
}

testGemini();
