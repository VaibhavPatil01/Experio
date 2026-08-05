export const CHAT_CONSTANTS = {
  MODELS: {
    FAST_TEXT: 'gemini-1.5-flash-latest',
    EMBEDDING: 'gemini-embedding-001',
    REASONING: 'gemini-1.5-pro-latest'
  },
  MEMORY: {
    SUMMARY_THRESHOLD: 15, // Trigger summarization after this many new messages
    RECENT_PRESERVE: 4 // Number of recent messages to keep unsummarized
  },
  RETRIEVAL: {
    DEFAULT_TOP_K: 5,
    PROFILE_CACHE_TTL: 300, // 5 minutes
    EMBEDDING_CACHE_TTL: 3600 // 1 hour
  },
  PAGINATION: {
    DEFAULT_LIMIT: 50
  }
};
