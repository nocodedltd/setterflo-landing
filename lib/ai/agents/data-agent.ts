/**
 * Data Agent
 * 
 * Fetches relevant data from CRM and Calendar integrations:
 * - Check if contact/deal already exists
 * - Get calendar availability
 * - Fetch contact information
 */

import { ConversationContext, AIResponse, AgentResult } from './types';
import { getConnectionByPlatform } from '@/lib/oauth/connections';
import type { Platform } from '@/lib/oauth/connections';

export class DataAgent {
  /**
   * Fetch relevant data based on the conversation context and AI response
   */
  async fetchRelevantData(
    context: ConversationContext,
    aiResponse: AIResponse
  ): Promise<AgentResult> {
    const toolsUsed: string[] = [];
    
    try {
      // If we need to create a deal, check if contact/deal already exists
      if (aiResponse.shouldCreateDeal && context.userConnections.crm) {
        const crmCheck = await this.checkExistingCRMRecord(context);
        if (crmCheck.success) {
          toolsUsed.push('check_existing_crm_record');
          return {
            success: true,
            data: crmCheck.data,
            toolsUsed,
          };
        }
      }

      // If we need to book calendar, get availability
      if (aiResponse.shouldBook && context.userConnections.calendar) {
        const calendarCheck = await this.getCalendarAvailability(context);
        if (calendarCheck.success) {
          toolsUsed.push('get_calendar_availability');
          return {
            success: true,
            data: calendarCheck.data,
            toolsUsed,
          };
        }
      }

      return {
        success: true,
        data: null,
        toolsUsed,
      };
    } catch (error) {
      console.error('❌ Data Agent error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        toolsUsed,
      };
    }
  }

  /**
   * Check if a contact or deal already exists in CRM
   */
  private async checkExistingCRMRecord(
    context: ConversationContext
  ): Promise<AgentResult> {
    const crm = context.userConnections.crm;
    if (!crm) {
      return { success: false, error: 'No CRM connection' };
    }

    try {
      // TODO: Implement actual CRM API calls based on platform
      // For now, return placeholder
      console.log('📊 Data Agent: Checking existing CRM record', {
        platform: crm.platform,
        instagramUserId: context.instagramUserId,
      });

      // This will be implemented per CRM platform
      return {
        success: true,
        data: {
          exists: false,
          recordId: null,
        },
        toolsUsed: ['check_crm_record'],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'CRM check failed',
      };
    }
  }

  /**
   * Get calendar availability
   */
  private async getCalendarAvailability(
    context: ConversationContext
  ): Promise<AgentResult> {
    const calendar = context.userConnections.calendar;
    if (!calendar) {
      return { success: false, error: 'No calendar connection' };
    }

    try {
      // TODO: Implement actual calendar API calls
      console.log('📅 Data Agent: Getting calendar availability', {
        platform: calendar.platform,
      });

      // This will be implemented per calendar platform
      return {
        success: true,
        data: {
          available: true,
          eventTypes: [],
        },
        toolsUsed: ['get_calendar_availability'],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Calendar check failed',
      };
    }
  }
}
