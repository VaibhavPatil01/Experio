/**
 * Wraps async Express routes to automatically catch errors and pass them 
 * to the centralized error handling middleware, eliminating duplicate try/catch blocks.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
