/**
 * AI Agent Orchestrator
 * 
 * Coordinates multiple AI agents to process Instagram DMs:
 * 1. Conversation Agent - Analyzes messages and determines qualification
 * 2. Data Agent - Fetches data from CRM/Calendar
 * 3. Operations Agent - Executes actions (send DM, create deal, book calendar)
 */

import { ConversationContext, AIResponse, AgentResult } from './types';
import { ConversationAgent } from './conversation-agent';
import { DataAgent } from './data-agent';
import { OperationsAgent } from './operations-agent';

export class AIOrchestrator {
  private conversationAgent: ConversationAgent;
  private dataAgent: DataAgent;
  private operationsAgent: OperationsAgent;

  constructor() {
    this.conversationAgent = new ConversationAgent();
    this.dataAgent = new DataAgent();
    this.operationsAgent = new OperationsAgent();
  }

  /**
   * Main entry point: Process an Instagram DM message
   */
  async processMessage(
    context: ConversationContext,
    newMessage: string
  ): Promise<AIResponse> {
    console.log('🤖 AI Orchestrator: Processing message', {
      conversationId: context.conversationId,
      qualificationState: context.qualificationState,
      messageLength: newMessage.length,
    });

    try {
      // Step 1: Conversation Agent - Analyze message and determine next state
      const conversationResult = await this.conversationAgent.analyze(
        context,
        newMessage
      );

      console.log('💬 Conversation Agent result:', {
        nextState: conversationResult.nextQualificationState,
        shouldReply: !!conversationResult.reply,
        shouldBook: conversationResult.shouldBook,
        shouldCreateDeal: conversationResult.shouldCreateDeal,
      });

      // Step 2: Data Agent - Fetch relevant data if needed
      let dataResult: AgentResult | null = null;
      if (conversationResult.shouldCreateDeal || conversationResult.shouldBook) {
        dataResult = await this.dataAgent.fetchRelevantData(
          context,
          conversationResult
        );
        console.log('📊 Data Agent result:', {
          success: dataResult.success,
          toolsUsed: dataResult.toolsUsed,
        });
      }

      // Step 3: Operations Agent - Execute actions
      let operationsResult: AgentResult | null = null;
      if (conversationResult.action !== 'none') {
        operationsResult = await this.operationsAgent.execute(
          context,
          conversationResult,
          dataResult
        );
        console.log('⚙️ Operations Agent result:', {
          success: operationsResult.success,
          toolsUsed: operationsResult.toolsUsed,
        });
      }

      // Combine results
      const finalResponse: AIResponse = {
        action: conversationResult.action,
        reply: conversationResult.reply,
        nextQualificationState: conversationResult.nextQualificationState,
        shouldBook: conversationResult.shouldBook,
        shouldCreateDeal: conversationResult.shouldCreateDeal,
        dealData: conversationResult.dealData,
        calendarData: conversationResult.calendarData,
        toolsUsed: [
          ...(conversationResult.toolsUsed || []),
          ...(dataResult?.toolsUsed || []),
          ...(operationsResult?.toolsUsed || []),
        ],
        confidence: conversationResult.confidence,
      };

      return finalResponse;
    } catch (error) {
      console.error('❌ AI Orchestrator error:', error);
      
      // Return safe fallback response
      return {
        action: 'send_dm',
        reply: "Thanks for your message! I'll get back to you shortly.",
        nextQualificationState: context.qualificationState,
        shouldBook: false,
        shouldCreateDeal: false,
      };
    }
  }
}
