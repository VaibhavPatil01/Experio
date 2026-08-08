import { QdrantRepository } from '../../../repositories/qdrantRepository.js';
import { EmbeddingService } from '../../../ai/embeddingService.js';
import { Post } from '../../../models/Post.js';
import logger from '../../../utils/logger.js';
import crypto from 'crypto';
import NodeCache from 'node-cache';

// Cache generated embeddings for 24 hours to reduce Gemini API costs and latency
const embeddingCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

export default class ResumeAnalysisRetrievalService {
  /**
   * Retrieves a highly targeted, diverse set of interview experiences.
   * Uses parallel queries targeting both the job requirements and the candidate's background.
   *
   * @param {Object} targetFacts { role, company, jobDescription }
   * @param {Object} candidateFacts { profile: { skills, ... } }
   * @returns {Promise<Object>} Object containing { isUnavailable: boolean, experiences: Array }
   */
  static async retrieveRelevantExperiences(targetFacts, candidateFacts) {
    const startTime = performance.now();
    try {
      // 1. Build Query Strings
      const targetQuery = this._buildTargetQuery(targetFacts);
      const candidateQuery = this._buildCandidateQuery(candidateFacts, targetFacts.role);

      // 2. Generate Embeddings Concurrently (with Cache)
      const embedStartTime = performance.now();
      const [targetVector, candidateVector] = await Promise.all([
        this._getCachedEmbedding(targetQuery),
        this._getCachedEmbedding(candidateQuery)
      ]);
      const embedDuration = performance.now() - embedStartTime;

      // 3. Build Filters
      let targetFilter = null;
      if (targetFacts.company) {
        targetFilter = {
          must: [
            { key: 'company', match: { text: targetFacts.company } }
          ]
        };
      }

      // 4. Perform Qdrant Searches Concurrently
      const qdrantStartTime = performance.now();
      const [targetResults, candidateResults] = await Promise.all([
        QdrantRepository.searchPosts(targetVector, 5, targetFilter),
        QdrantRepository.searchPosts(candidateVector, 3, null) // No filter to find diverse similar candidates
      ]);
      const qdrantDuration = performance.now() - qdrantStartTime;

      // 5. Deduplicate and Threshold
      // Using a Map to deduplicate by mongoId.
      const uniqueResults = new Map();
      const RELEVANCE_THRESHOLD = 0.65; // Adjust based on embedding model baseline

      const processResults = (results, source) => {
        results.forEach(result => {
          if (result.score >= RELEVANCE_THRESHOLD) {
            const mongoId = result.payload.mongoId;
            if (!uniqueResults.has(mongoId)) {
              uniqueResults.set(mongoId, {
                score: result.score,
                payload: result.payload,
                source
              });
            } else if (result.score > uniqueResults.get(mongoId).score) {
               uniqueResults.get(mongoId).score = result.score; // Keep highest score
            }
          }
        });
      };

      processResults(targetResults, 'target_match');
      processResults(candidateResults, 'candidate_match');

      const deduplicated = Array.from(uniqueResults.values());
      
      // Sort by score descending and cap at 5
      deduplicated.sort((a, b) => b.score - a.score);
      const top5Results = deduplicated.slice(0, 5);

      if (top5Results.length === 0) {
        return { isUnavailable: false, experiences: [] };
      }

      // 6. Fetch Full Citations from MongoDB
      const mongoIds = top5Results.map(r => r.payload.mongoId);
      const posts = await Post.find({ _id: { $in: mongoIds } }).lean();

      // Map MongoDB posts back to structured citations
      const structuredCitations = posts.map(post => {
        const qdrantData = uniqueResults.get(post._id.toString());
        return {
          experienceId: post._id.toString(),
          title: post.title || 'Untitled Experience',
          company: post.company,
          role: post.role,
          technologies: post.technologies || [],
          rounds: (post.rounds || []).map(r => ({
            type: r.roundType,
            questions: (r.questionsAsked || []).slice(0, 3) // Limit to top 3 questions
          })),
          candidateAdvice: post.overallTips ? post.overallTips.substring(0, 200) + '...' : null, // Limit text
          retrievalMetadata: {
            score: qdrantData ? qdrantData.score : 0,
            matchSource: qdrantData ? qdrantData.source : 'unknown'
          }
        };
      });

      const totalDuration = performance.now() - startTime;
      
      logger.info('Resume Analysis RAG retrieval completed', {
        totalDurationMs: Math.round(totalDuration),
        embedDurationMs: Math.round(embedDuration),
        qdrantDurationMs: Math.round(qdrantDuration),
        retrievedCount: targetResults.length + candidateResults.length,
        retainedCount: structuredCitations.length
      });

      return {
        isUnavailable: false,
        experiences: structuredCitations
      };

    } catch (error) {
      logger.error('Failed to retrieve relevant experiences for Resume Analyzer', { error: error.message });
      return {
        isUnavailable: true,
        fallbackNote: "Platform knowledge retrieval failed or is unavailable. Proceed with general industry knowledge.",
        experiences: []
      };
    }
  }

  static _buildTargetQuery(targetFacts) {
    let query = `Interview experience for ${targetFacts.role || 'Software Engineer'}`;
    if (targetFacts.company) {
      query += ` at ${targetFacts.company}`;
    }
    if (targetFacts.jobDescription) {
      // Truncate JD to keep embedding focused on core keywords
      query += `. Requirements: ${targetFacts.jobDescription.substring(0, 400)}`;
    }
    return query;
  }

  static _buildCandidateQuery(candidateFacts, role) {
    let query = `Interview experience for ${role || 'candidate'}`;
    if (candidateFacts.profile && candidateFacts.profile.skills && candidateFacts.profile.skills.length > 0) {
      query += ` with skills in ${candidateFacts.profile.skills.slice(0, 10).join(', ')}`;
    }
    return query;
  }

  static async _getCachedEmbedding(query) {
    const hash = crypto.createHash('md5').update(query).digest('hex');
    const cacheKey = `embed_${hash}`;
    const cachedVector = embeddingCache.get(cacheKey);
    
    if (cachedVector) {
      return cachedVector;
    }

    const vector = await EmbeddingService.generateEmbedding(query);
    embeddingCache.set(cacheKey, vector);
    return vector;
  }
}
