/**
 * Instagram Conversations & Messages Management
 * 
 * Helper functions for managing Instagram DM conversations and messages
 * in a multi-tenant architecture.
 */

import { createClient } from '@/lib/supabase/server';
import { decryptToken } from '@/lib/oauth/encryption';

export interface Conversation {
  id: string;
  user_id: string;
  instagram_account_id_text: string | null; // TEXT column for Instagram Business Account ID
  oauth_connection_id: string | null;
  instagram_user_id: string | null; // TEXT column for Instagram user ID
  instagram_username: string | null;
  instagram_name: string | null;
  instagram_thread_id: string | null;
  status: 'active' | 'archived' | 'closed' | 'snoozed';
  unread_count: number;
  ai_enabled: boolean;
  ai_paused_at: string | null;
  ai_paused_reason: string | null;
  qualification_state: 'new' | 'qualifying' | 'qualified' | 'booking' | 'not_interested' | 'booked' | 'closed' | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  first_contact_at: string | null;
  created_at: string;
  updated_at: string;
  // Legacy columns (may exist in existing schema)
  ig_user_id?: string; // UUID reference to instagram_profiles
  instagram_account_id?: string; // UUID reference (legacy)
}

export interface Message {
  id: string;
  conversation_id: string;
  text: string;
  sender: 'lead' | 'user' | 'ai';
  message_type: 'text' | 'image' | 'video' | 'voice' | 'story_reply' | 'story_mention' | 'reaction';
  instagram_message_id: string | null;
  instagram_timestamp: string | null;
  is_read: boolean;
  read_at: string | null;
  generated_by_ai: boolean;
  ai_model: string | null;
  ai_confidence: number | null;
  ai_prompt: string | null;
  ai_tools_used: any[] | null;
  media_url: string | null;
  media_type: string | null;
  media_thumbnail_url: string | null;
  send_error: string | null;
  send_retry_count: number;
  sent_at: string;
  created_at: string;
}

/**
 * Find the SetterFlo user who owns an Instagram account
 * @param instagramAccountId - Instagram Business Account ID (from webhook recipient.id)
 * @returns User ID and OAuth connection details, or null if not found
 */
export async function findUserByInstagramAccount(
  instagramAccountId: string
): Promise<{ userId: string; connectionId: string; accessToken: string } | null> {
  const supabase = await createClient();
  
  // Find the OAuth connection for this Instagram account
  const { data: connection, error } = await supabase
    .from('oauth_connections')
    .select('id, user_id, access_token, metadata')
    .eq('platform', 'instagram')
    .eq('platform_user_id', instagramAccountId)
    .eq('status', 'connected')
    .single();
  
  if (error || !connection) {
    console.error('❌ No Instagram connection found for account:', instagramAccountId, error);
    return null;
  }
  
  // Decrypt the access token
  try {
    const decryptedToken = decryptToken(connection.access_token);
    return {
      userId: connection.user_id,
      connectionId: connection.id,
      accessToken: decryptedToken,
    };
  } catch (error) {
    console.error('❌ Failed to decrypt access token:', error);
    return null;
  }
}

/**
 * Get or create a conversation for an Instagram user
 * @param userId - SetterFlo user ID
 * @param instagramAccountId - Instagram Business Account ID
 * @param instagramUserId - Instagram user ID (the lead messaging us)
 * @param instagramUsername - Instagram username (optional)
 * @param instagramName - Instagram display name (optional)
 * @param threadId - Instagram thread ID (optional)
 */
export async function getOrCreateConversation(
  userId: string,
  instagramAccountId: string,
  instagramUserId: string,
  instagramUsername?: string,
  instagramName?: string,
  threadId?: string,
  oauthConnectionId?: string
): Promise<Conversation> {
  const supabase = await createClient();
  
  // Try to find existing conversation using the new TEXT columns
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('instagram_account_id_text', instagramAccountId)
    .eq('instagram_user_id', instagramUserId)
    .single();
  
  if (existing) {
    return existing as Conversation;
  }
  
  // Create new conversation
  const { data: newConversation, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      instagram_account_id_text: instagramAccountId, // Use TEXT column
      instagram_user_id: instagramUserId,
      instagram_username: instagramUsername || null,
      instagram_name: instagramName || null,
      instagram_thread_id: threadId || null,
      oauth_connection_id: oauthConnectionId || null,
      status: 'active',
      qualification_state: 'new',
      first_contact_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Failed to create conversation:', error);
    throw new Error('Failed to create conversation');
  }
  
  return newConversation as Conversation;
}

/**
 * Create a new message in a conversation
 */
export async function createMessage(
  conversationId: string,
  text: string,
  sender: 'lead' | 'user' | 'ai',
  options?: {
    messageType?: Message['message_type'];
    instagramMessageId?: string;
    instagramTimestamp?: string;
    mediaUrl?: string;
    mediaType?: string;
    generatedByAi?: boolean;
    aiModel?: string;
    aiConfidence?: number;
    aiPrompt?: string;
    aiToolsUsed?: any[];
  }
): Promise<Message> {
  const supabase = await createClient();
  
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      text,
      sender,
      message_type: options?.messageType || 'text',
      instagram_message_id: options?.instagramMessageId || null,
      instagram_timestamp: options?.instagramTimestamp || new Date().toISOString(),
      generated_by_ai: options?.generatedByAi || false,
      ai_model: options?.aiModel || null,
      ai_confidence: options?.aiConfidence || null,
      ai_prompt: options?.aiPrompt || null,
      ai_tools_used: options?.aiToolsUsed || null,
      media_url: options?.mediaUrl || null,
      media_type: options?.mediaType || null,
      sent_at: options?.instagramTimestamp || new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Failed to create message:', error);
    throw new Error('Failed to create message');
  }
  
  return message as Message;
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  const supabase = await createClient();
  
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('❌ Failed to fetch messages:', error);
    throw new Error('Failed to fetch messages');
  }
  
  return (messages || []) as Message[];
}

/**
 * Get conversations for a user
 */
export async function getUserConversations(
  userId: string,
  status?: Conversation['status'],
  limit: number = 50
): Promise<Conversation[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .limit(limit);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data: conversations, error } = await query;
  
  if (error) {
    console.error('❌ Failed to fetch conversations:', error);
    throw new Error('Failed to fetch conversations');
  }
  
  return (conversations || []) as Conversation[];
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(
  conversationId: string,
  status: Conversation['status']
): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId);
  
  if (error) {
    console.error('❌ Failed to update conversation status:', error);
    throw new Error('Failed to update conversation status');
  }
}

/**
 * Update conversation qualification state
 */
export async function updateConversationQualificationState(
  conversationId: string,
  state: Conversation['qualification_state']
): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('conversations')
    .update({ qualification_state: state })
    .eq('id', conversationId);
  
  if (error) {
    console.error('❌ Failed to update qualification state:', error);
    throw new Error('Failed to update qualification state');
  }
}

/**
 * Mark conversation messages as read
 */
export async function markConversationAsRead(conversationId: string): Promise<number> {
  const supabase = await createClient();
  
  // Update messages
  const { data: updatedMessages } = await supabase
    .from('messages')
    .update({ 
      is_read: true, 
      read_at: new Date().toISOString() 
    })
    .eq('conversation_id', conversationId)
    .eq('is_read', false)
    .eq('sender', 'lead')
    .select();
  
  const updatedCount = updatedMessages?.length || 0;
  
  // Reset unread count
  await supabase
    .from('conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId);
  
  return updatedCount;
}
