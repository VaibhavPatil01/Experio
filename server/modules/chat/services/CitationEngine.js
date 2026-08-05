import logger from '../../../utils/logger.js';

/**
 * CitationEngine guarantees anti-hallucination of references.
 * It parses the final LLM response and strictly maps recognized 
 * citation tags back to the exact source documents provided.
 */
export default class CitationEngine {
  
  /**
   * Extracts valid citations from the generated text and maps them to metadata.
   * 
   * @param {string} aiResponse - The final text string streamed back from Gemini
   * @param {Array} retrievedDocuments - The original array of documents fed into the prompt
   * @returns {Array} Array of validated CitationSchema objects
   */
  static extractCitations(aiResponse, retrievedDocuments) {
    if (!aiResponse || !retrievedDocuments || retrievedDocuments.length === 0) {
      return [];
    }

    try {
      // Regex to find patterns like [Source 1], [Source 2], etc.
      const regex = /\[Source\s+(\d+)\]/gi;
      const matches = [...aiResponse.matchAll(regex)];

      // Set to hold unique source indices found in the text
      const extractedIndices = new Set();
      
      for (const match of matches) {
        // match[1] captures the digit
        const indexStr = match[1];
        const indexNum = parseInt(indexStr, 10);
        
        // Anti-Hallucination Guard:
        // The index in the text is 1-based (e.g., [Source 1]).
        // We ensure the requested index actually exists in our retrievedDocuments array.
        const arrayIndex = indexNum - 1;
        
        if (arrayIndex >= 0 && arrayIndex < retrievedDocuments.length) {
          extractedIndices.add(arrayIndex);
        } else {
          logger.warn('AI hallucinated a citation index', { indexNum, maxDocs: retrievedDocuments.length });
        }
      }

      // Map the validated indices back to the source objects
      const validatedCitations = Array.from(extractedIndices).map(arrayIndex => {
        const doc = retrievedDocuments[arrayIndex];
        
        return {
          sourceId: doc.id,
          company: doc.company,
          role: doc.role,
          title: doc.title,
          url: doc.url,
          confidenceScore: doc.score,
          // Extract a small snippet surrounding the first occurrence of the citation in the text for context
          snippet: this.extractSnippet(aiResponse, `[Source ${arrayIndex + 1}]`)
        };
      });

      return validatedCitations;

    } catch (error) {
      logger.error('Error in CitationEngine extraction', { error: error.message });
      return []; // Fail gracefully, better no citations than broken ones
    }
  }

  /**
   * Extracts a brief snippet of text surrounding the citation marker.
   */
  static extractSnippet(fullText, marker) {
    const markerIndex = fullText.indexOf(marker);
    if (markerIndex === -1) return '';

    // Take roughly 50 chars before and after for context
    const start = Math.max(0, markerIndex - 50);
    const end = Math.min(fullText.length, markerIndex + marker.length + 50);
    
    let snippet = fullText.substring(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < fullText.length) snippet = snippet + '...';
    
    return snippet;
  }
}
