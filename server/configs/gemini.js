import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default geminiClient;
