import ChatRetrievalService from './ChatRetrievalService.js';
import ChatPromptBuilder from './ChatPromptBuilder.js';
import GeminiChatService from './GeminiChatService.js';
import CitationEngine from './CitationEngine.js';
import ChatMessageService from './ChatMessageService.js';
import logger from '../../../utils/logger.js';

export default class ChatPipelineService {
  constructor(
    retrievalService = new ChatRetrievalService(),
    messageService = new ChatMessageService()
  ) {
    this.retrievalService = retrievalService;
    this.messageService = messageService;
  }

  /**
   * Orchestrates the end-to-end RAG pipeline, logging execution times at each stage.
   * Yields stream chunks back to the caller (WebSocket or SSE).
   * 
   * @param {string} sessionId 
   * @param {string} userId 
   * @param {string} prompt 
   * @param {string} modelSelection 
   */
  async *executePipeline(sessionId, userId, prompt, modelSelection = 'gemini-3.5-flash') {
    const pipelineId = Math.random().toString(36).substring(7); // Unique ID for logging correlation
    logger.info(`[Pipeline ${pipelineId}] Starting RAG Pipeline`, { sessionId, userId });

    const timing = {
      start: performance.now(),
      stages: {}
    };

    let rankedContext = null;
    let finalPrompt = null;
    let fullAiResponse = '';
    let geminiMetadata = null;
    let generatedCitations = [];

    try {
      // ---------------------------------------------------------
      // STAGE 1: Store User Prompt
      // ---------------------------------------------------------
      const s1 = performance.now();
      await this.messageService.saveUserMessage(sessionId, userId, prompt);
      timing.stages.saveUserMessage = Math.round(performance.now() - s1);
      logger.info(`[Pipeline ${pipelineId}] Stage 1 Complete: User prompt saved`, { ms: timing.stages.saveUserMessage });


      // ---------------------------------------------------------
      // STAGE 2: Retrieve Context (Includes Loading Memory & Profile)
      // ---------------------------------------------------------
      const s2 = performance.now();
      rankedContext = await this.retrievalService.buildContext(userId, sessionId, prompt);
      timing.stages.retrieval = Math.round(performance.now() - s2);
      logger.info(`[Pipeline ${pipelineId}] Stage 2 Complete: Context retrieved`, { 
        ms: timing.stages.retrieval,
        docsFound: rankedContext.retrievedDocuments.length 
      });


      // ---------------------------------------------------------
      // STAGE 3: Build Prompt
      // ---------------------------------------------------------
      const s3 = performance.now();
      finalPrompt = ChatPromptBuilder.buildFinalPrompt(rankedContext);
      timing.stages.promptBuild = Math.round(performance.now() - s3);
      logger.info(`[Pipeline ${pipelineId}] Stage 3 Complete: Prompt built`, { ms: timing.stages.promptBuild });


      // ---------------------------------------------------------
      // STAGE 4: Gemini Streaming Response
      // ---------------------------------------------------------
      const s4 = performance.now();
      logger.info(`[Pipeline ${pipelineId}] Stage 4 Started: Streaming from Gemini`);
      
      const streamGenerator = GeminiChatService.streamChat(finalPrompt, userId, modelSelection);
      
      for await (const chunk of streamGenerator) {
        // streamChat yields objects: { text: "..." } or the final metadata object
        if (chunk.text) {
          fullAiResponse += chunk.text;
          // Yield chunk to the consumer (Socket/SSE)
          yield { type: 'chunk', text: chunk.text };
        } else if (chunk.tokenUsage !== undefined) {
          // This is the final metadata object returned by the generator
          geminiMetadata = chunk;
        }
      }

      timing.stages.llmGeneration = Math.round(performance.now() - s4);
      logger.info(`[Pipeline ${pipelineId}] Stage 4 Complete: Stream finished`, { ms: timing.stages.llmGeneration });


      // ---------------------------------------------------------
      // STAGE 5: Extract Citations (Anti-Hallucination)
      // ---------------------------------------------------------
      const s5 = performance.now();
      generatedCitations = CitationEngine.extractCitations(fullAiResponse, rankedContext.retrievedDocuments);
      timing.stages.citationExtraction = Math.round(performance.now() - s5);
      logger.info(`[Pipeline ${pipelineId}] Stage 5 Complete: Citations extracted`, { 
        ms: timing.stages.citationExtraction,
        citationCount: generatedCitations.length
      });


      // ---------------------------------------------------------
      // STAGE 6: Store Assistant Response
      // ---------------------------------------------------------
      const s6 = performance.now();
      const metadataPayload = {
        tokenUsage: geminiMetadata?.tokenUsage || 0,
        modelUsed: geminiMetadata?.modelUsed || modelSelection,
        citations: generatedCitations
      };
      
      const finalMessage = await this.messageService.saveAssistantMessage(sessionId, fullAiResponse, metadataPayload);
      timing.stages.saveAssistantMessage = Math.round(performance.now() - s6);
      logger.info(`[Pipeline ${pipelineId}] Stage 6 Complete: Conversation stored`, { ms: timing.stages.saveAssistantMessage });

      const totalTime = Math.round(performance.now() - timing.start);
      logger.info(`[Pipeline ${pipelineId}] RAG Pipeline Complete`, { totalTimeMs: totalTime });

      // Yield the final completion event
      yield { 
        type: 'done', 
        message: finalMessage,
        timing: timing.stages,
        totalTimeMs: totalTime
      };

    } catch (error) {
      logger.error(`[Pipeline ${pipelineId}] Pipeline Failed`, { error: error.message });
      yield { type: 'error', error: error.message };
    }
  }

  /**
   * Guest pipeline: Bypasses DB and user profile retrieval.
   * Strict system prompt is applied via ChatPromptBuilder.
   */
  async *executeGuestPipeline(prompt, history = [], modelSelection = 'gemini-3.5-flash') {
    const pipelineId = Math.random().toString(36).substring(7);
    logger.info(`[Pipeline ${pipelineId}] Starting GUEST Chat Pipeline`);

    let fullAiResponse = '';

    try {
      // Stage 1: Build Prompt with strict guest rules
      const finalPrompt = ChatPromptBuilder.buildGuestPrompt(prompt, history);
      
      // Stage 2: Stream response
      const streamGenerator = GeminiChatService.streamChat(finalPrompt, 'guest', modelSelection);
      
      for await (const chunk of streamGenerator) {
        if (chunk.text) {
          fullAiResponse += chunk.text;
          yield { type: 'chunk', text: chunk.text };
        }
      }

      logger.info(`[Pipeline ${pipelineId}] Guest Pipeline Complete`);

      yield { 
        type: 'done', 
        message: { _id: Date.now().toString(), role: 'assistant', content: fullAiResponse }
      };

    } catch (error) {
      logger.error(`[Pipeline ${pipelineId}] Guest Pipeline Failed`, { error: error.message });
      yield { type: 'error', error: error.message };
    }
  }
}
