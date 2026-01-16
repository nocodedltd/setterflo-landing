/**
 * Operations Agent
 * 
 * Executes actions based on AI decisions:
 * - Send Instagram DM
 * - Create/update CRM deals
 * - Book calendar appointments
 * - Update Supabase records
 */

import { ConversationContext, AIResponse, AgentResult } from './types';
import { createMessage, updateConversationQualificationState } from '@/lib/instagram/conversations';

export class OperationsAgent {
  /**
   * Prepare actions based on AI response
   * Note: Actions are prepared but not executed - execution happens in webhook handler
   * or can be delegated to Pipedream
   */
  async execute(
    context: ConversationContext,
    aiResponse: AIResponse,
    dataResult?: AgentResult | null
  ): Promise<AgentResult> {
    const toolsUsed: string[] = [];

    try {
      // Update qualification state in database
      if (aiResponse.nextQualificationState) {
        await updateConversationQualificationState(
          context.conversationId,
          aiResponse.nextQualificationState
        );
        toolsUsed.push('update_qualification_state');
      }

      // Store AI message in database (if reply exists)
      if (aiResponse.reply) {
        await createMessage(
          context.conversationId,
          aiResponse.reply,
          'ai',
          {
            generatedByAi: true,
            aiModel: 'conversation-agent',
            aiConfidence: aiResponse.confidence,
            aiToolsUsed: aiResponse.toolsUsed,
          }
        );
        toolsUsed.push('store_ai_message');
      }

      // Prepare action data (execution happens in webhook handler or Pipedream)
      return {
        success: true,
        data: {
          actionsPrepared: {
            sendDM: aiResponse.action === 'send_dm' && !!aiResponse.reply,
            createDeal: aiResponse.shouldCreateDeal,
            bookCalendar: aiResponse.shouldBook,
          },
          dealData: aiResponse.dealData,
          calendarData: aiResponse.calendarData,
        },
        toolsUsed,
      };
    } catch (error) {
      console.error('❌ Operations Agent error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
        toolsUsed,
      };
    }
  }

  // Note: Actual action execution (send DM, create deal, book calendar) 
  // happens in the webhook handler or can be delegated to Pipedream
  // These methods are kept for future direct execution if needed
}
