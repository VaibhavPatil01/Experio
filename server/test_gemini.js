import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = geminiClient.getGenerativeModel({ model: "gemini-embedding-001" });
  const response = await model.embedContent("Hello world");
  console.log("Vector length:", response.embedding.values.length);
}

test().catch(console.error);
