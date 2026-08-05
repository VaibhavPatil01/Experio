import logger from '../utils/logger.js';

/**
 * Centralized Global Error Handler Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  logger.error('Unhandled Exception caught by Global Error Handler', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  // Default to 500
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle known error messages thrown by services
  if (err.message === 'Unauthorized or session not found') {
    statusCode = 404;
    message = err.message;
  } else if (err.message.includes('Validation') || err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.message.includes('Rate limit exceeded')) {
    statusCode = 429;
    message = err.message;
  } else if (err.message.includes('Service is currently degraded')) {
    statusCode = 503;
    message = err.message;
  }

  // Prevent MongoDB / Qdrant driver internals from leaking to the frontend
  if (process.env.NODE_ENV === 'production') {
    if (message.includes('Mongo') || message.includes('Qdrant') || message.includes('ECONNREFUSED')) {
      message = 'Internal Server Error';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
