import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export const MODELS = {
  FAST_TEXT: process.env.GEMINI_FAST_MODEL || 'gemini-3.5-flash-lite',
  EMBEDDING: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
  REASONING: process.env.GEMINI_REASONING_MODEL || 'gemini-pro-latest'
};

const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default geminiClient;
