import LLMFactory from '../../../ai/LLMFactory.js';
import logger from '../../../utils/logger.js';

// --- In-Memory Resiliency Primitives ---

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

const circuitBreakerState = {
  state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
  failureCount: 0,
  lastFailureTime: null,
  FAILURE_THRESHOLD: 5,
  RESET_TIMEOUT_MS: 30000 // 30 seconds
};

export default class GeminiChatService {
  /**
   * Internal Rate Limiter check
   */
  static _checkRateLimit(userId) {
    const now = Date.now();
    if (!rateLimitStore.has(userId)) {
      rateLimitStore.set(userId, []);
    }
    
    const timestamps = rateLimitStore.get(userId);
    // Remove expired timestamps
    const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    
    if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      logger.warn('Rate limit exceeded', { category: 'ai', userId });
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    validTimestamps.push(now);
    rateLimitStore.set(userId, validTimestamps);
  }

  /**
   * Internal Circuit Breaker check
   */
  static _checkCircuitBreaker() {
    const now = Date.now();
    if (circuitBreakerState.state === 'OPEN') {
      if (now - circuitBreakerState.lastFailureTime > circuitBreakerState.RESET_TIMEOUT_MS) {
        // Time to test recovery
        logger.info('Circuit Breaker transitioning to HALF_OPEN', { category: 'ai' });
        circuitBreakerState.state = 'HALF_OPEN';
      } else {
        logger.warn('Circuit Breaker is OPEN. Request rejected.', { category: 'ai' });
        throw new Error('Service is currently degraded. Please try again in a few moments.');
      }
    }
  }

  static _recordFailure() {
    circuitBreakerState.failureCount += 1;
    circuitBreakerState.lastFailureTime = Date.now();
    if (circuitBreakerState.failureCount >= circuitBreakerState.FAILURE_THRESHOLD) {
      circuitBreakerState.state = 'OPEN';
      logger.error('Circuit Breaker tripped to OPEN due to consecutive failures', { category: 'ai' });
    }
  }

  static _recordSuccess() {
    if (circuitBreakerState.state === 'HALF_OPEN') {
      logger.info('Circuit Breaker transitioning to CLOSED', { category: 'ai' });
    }
    circuitBreakerState.state = 'CLOSED';
    circuitBreakerState.failureCount = 0;
  }

  /**
   * Generates a streamed chat response with strict resiliency patterns.
   * 
   * @param {string} prompt The finalized, token-safe prompt string
   * @param {string} userId The requesting user ID (for rate limiting)
   * @param {string} modelSelection The Gemini model to use (defaults to flash)
   * @returns {AsyncGenerator<Object, Object, unknown>} Yields text chunks, returns final metadata object
   */
  static async *streamChat(prompt, userId, modelSelection = 'gemini-1.5-flash') {
    this._checkRateLimit(userId);
    this._checkCircuitBreaker();

    const maxRetries = 3;
    let attempt = 0;
    let streamResult = null;
    const timeoutMs = 30000; // 30 sec strict timeout for initial connection

    while (attempt < maxRetries) {
      try {
        logger.debug('Attempting Gemini generation', { category: 'ai', attempt, modelSelection, userId });
        const startTime = performance.now();

        const model = LLMFactory.getModel(modelSelection);

        // Timeout race pattern
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API Timeout')), timeoutMs)
        );
        
        // Only race the initial connection/stream establishment
        const generatePromise = model.generateContentStream(prompt);
        streamResult = await Promise.race([generatePromise, timeoutPromise]);

        // If we get here, connection was successful
        this._recordSuccess();
        
        // Yield chunks to the consumer
        for await (const chunk of streamResult.stream) {
          const chunkText = chunk.text();
          yield { text: chunkText };
        }

        const endTime = performance.now();
        const latency = endTime - startTime;

        // Await the final response to gather exact token usage
        const finalResponse = await streamResult.response;
        const metadata = {
          tokenUsage: finalResponse.usageMetadata?.totalTokenCount || 0,
          latencyMs: Math.round(latency),
          modelUsed: modelSelection
        };

        logger.info('Gemini generation completed successfully', { 
          category: 'ai',
          latencyMs: metadata.latencyMs, 
          tokens: metadata.tokenUsage 
        });

        return metadata; // The final return of the async generator

      } catch (error) {
        attempt++;
        this._recordFailure();
        logger.error('Gemini generation failed', { 
          category: 'ai', 
          attempt, 
          error: error.message,
          stack: error.stack 
        });

        if (attempt >= maxRetries) {
          logger.error('Max retries reached. Failing gracefully.', { category: 'ai' });
          throw new Error('Failed to generate response after multiple attempts.');
        }

        // Exponential backoff: 1s, 2s, 4s...
        const backoffMs = Math.pow(2, attempt - 1) * 1000;
        await new Promise(res => setTimeout(res, backoffMs));
      }
    }
  }
}
