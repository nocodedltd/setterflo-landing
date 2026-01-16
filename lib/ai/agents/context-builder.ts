/**
 * Context Builder
 * 
 * Builds conversation context for AI agents by:
 * - Fetching user's connected integrations
 * - Loading conversation history
 * - Preparing context object
 */

import { ConversationContext, UserConnections } from './types';
import { getUserConnections } from '@/lib/oauth/connections';
import { getConversationMessages } from '@/lib/instagram/conversations';
import type { Platform } from '@/lib/oauth/connections';

export async function buildConversationContext(
  userId: string,
  conversationId: string,
  instagramUserId: string,
  instagramAccountId: string,
  qualificationState: string
): Promise<ConversationContext> {
  // Fetch user's OAuth connections
  const connections = await getUserConnections(userId);
  
  // Build user connections object
  const userConnections: UserConnections = {};
  
  // Find CRM connection
  const crmPlatforms: Platform[] = ['hubspot', 'gohighlevel', 'pipedrive', 'activecampaign', 'salesforce', 'monday'];
  const crmConnection = connections.find(c => 
    crmPlatforms.includes(c.platform as Platform) && c.status === 'connected'
  );
  
  if (crmConnection) {
    userConnections.crm = {
      platform: crmConnection.platform as any,
      connectionId: crmConnection.id,
      accessToken: crmConnection.access_token,
      metadata: crmConnection.metadata || {},
    };
  }
  
  // Find calendar connection
  const calendarPlatforms: Platform[] = ['calendly', 'calcom'];
  const calendarConnection = connections.find(c => 
    calendarPlatforms.includes(c.platform as Platform) && c.status === 'connected'
  );
  
  if (calendarConnection) {
    userConnections.calendar = {
      platform: calendarConnection.platform as any,
      connectionId: calendarConnection.id,
      accessToken: calendarConnection.access_token,
      metadata: calendarConnection.metadata || {},
    };
  }
  
  // Find Instagram connection
  const instagramConnection = connections.find(c => 
    c.platform === 'instagram' && c.status === 'connected'
  );
  
  if (instagramConnection) {
    userConnections.instagram = {
      connectionId: instagramConnection.id,
      accessToken: instagramConnection.access_token,
      metadata: instagramConnection.metadata || {},
    };
  }
  
  // Fetch conversation message history (last 20 messages)
  const messageHistory = await getConversationMessages(conversationId, 20);
  
  // Build context
  const context: ConversationContext = {
    conversationId,
    userId,
    instagramUserId,
    instagramAccountId,
    qualificationState: qualificationState as any,
    messageHistory: messageHistory.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      sent_at: msg.sent_at,
      message_type: msg.message_type,
    })),
    userConnections,
  };
  
  return context;
}
