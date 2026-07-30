import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default geminiClient;
