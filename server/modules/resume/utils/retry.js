/**
 * Retries a promise-returning function with exponential backoff and jitter.
 * 
 * @param {Function} fn Function returning a promise to execute.
 * @param {Object} options Configuration options.
 * @param {number} options.maxRetries Maximum number of retries (default 3).
 * @param {number} options.baseDelayMs Base delay in milliseconds (default 1000).
 * @param {number} options.maxDelayMs Maximum delay in milliseconds (default 10000).
 * @param {Function} options.shouldRetry Optional function (error) => boolean to determine if error is transient.
 * @returns {Promise<any>} The result of the function.
 */
export const withExponentialBackoff = async (
  fn,
  {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    shouldRetry = () => true
  } = {}
) => {
  let attempt = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      attempt++;
      
      // Calculate delay: baseDelay * 2^(attempt-1)
      const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
      
      // Add jitter: randomize between 50% and 100% of the calculated delay
      const jitter = 0.5 + Math.random() * 0.5;
      const delayMs = Math.min(maxDelayMs, exponentialDelay * jitter);
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};
