export default class ResumeAnalysisError extends Error {
  constructor(category, userMessage, internalDetails = null) {
    super(userMessage);
    this.name = 'ResumeAnalysisError';
    this.category = category;
    this.userMessage = userMessage;
    this.internalDetails = internalDetails;
    this.requestId = null;
    this.analysisId = null;
  }

  setRequestContext(requestId, analysisId = null) {
    this.requestId = requestId;
    this.analysisId = analysisId;
    return this;
  }
}

export const ErrorCategories = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_PROCESSING_ERROR: 'FILE_PROCESSING_ERROR',
  PROFILE_CONTEXT_ERROR: 'PROFILE_CONTEXT_ERROR',
  EMBEDDING_ERROR: 'EMBEDDING_ERROR',
  QDRANT_ERROR: 'QDRANT_ERROR',
  GEMINI_ERROR: 'GEMINI_ERROR',
  OUTPUT_VALIDATION_ERROR: 'OUTPUT_VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR'
};
