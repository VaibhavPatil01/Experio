import logger from '../utils/logger.js';

/**
 * Express middleware to track HTTP request/response metrics.
 * Measures exact latency via performance.now() and logs securely
 * without exposing sensitive request bodies.
 */
export const httpLogger = (req, res, next) => {
  const start = performance.now();

  // Listen for the response to finish emitting
  res.on('finish', () => {
    const duration = performance.now() - start;

    // Log all main API routes (ignore static assets or internal health checks)
    const url = req.originalUrl;
    if (url.startsWith('/api') || url.startsWith('/posts') || url.startsWith('/user') || url.startsWith('/recommendations')) {
      logger.info('API Request completed', {
        category: 'http',
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        latencyMs: Math.round(duration),
        ip: req.ip
        // We strictly omit req.body to prevent logging passwords/prompts
      });
    }
  });

  next();
};
