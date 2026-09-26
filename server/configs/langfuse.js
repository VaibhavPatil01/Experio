import dotenv from 'dotenv';
import { LangfuseSpanProcessor } from '@langfuse/otel';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { LangfuseClient } from '@langfuse/client';

dotenv.config({ quiet: true });

// Exported for force flushing when needed
export const langfuseSpanProcessor = new LangfuseSpanProcessor();

const tracerProvider = new NodeTracerProvider({
  spanProcessors: [langfuseSpanProcessor],
});
tracerProvider.register();

// REST Client for scores, prompts, etc.
export const langfuseClient = new LangfuseClient({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL || 'https://us.cloud.langfuse.com'
});
