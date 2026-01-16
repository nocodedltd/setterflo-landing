/**
 * OAuth Connection Management
 * 
 * Helper functions for managing OAuth connections in Supabase
 */

import { createClient } from '@/lib/supabase/server';
import { encryptToken, decryptToken } from './encryption';

export type Platform = 'instagram' | 'calendly' | 'calcom' | 'gohighlevel' | 'hubspot' | 'pipedrive' | 'activecampaign' | 'salesforce' | 'monday';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'expired';

export interface OAuthConnection {
  id: string;
  user_id: string;
  platform: Platform;
  platform_user_id: string | null;
  platform_account_name: string | null;
  platform_account_email: string | null;
  access_token: string; // Decrypted
  refresh_token: string | null; // Decrypted
  token_expires_at: string | null;
  metadata: Record<string, any>;
  scopes: string[] | null;
  status: ConnectionStatus;
  last_synced_at: string | null;
  error_message: string | null;
  error_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get all OAuth connections for the current user
 */
export async function getUserConnections(userId?: string): Promise<OAuthConnection[]> {
  const supabase = await createClient();
  
  // If userId not provided, get from auth
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    targetUserId = user.id;
  }

  const { data, error } = await supabase
    .from('oauth_connections')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Failed to fetch user connections:', error);
    throw new Error('Failed to fetch connections');
  }

  // Decrypt tokens before returning
  return (data || []).map(conn => ({
    ...conn,
    access_token: conn.access_token ? decryptToken(conn.access_token) : '',
    refresh_token: conn.refresh_token ? decryptToken(conn.refresh_token) : null,
  }));
}

/**
 * Get connection for a specific platform
 * @param platform - Platform identifier
 * @param userId - Optional user ID (defaults to current user)
 * @returns Connection object or null if not found
 */
export async function getConnectionByPlatform(
  platform: Platform,
  userId?: string
): Promise<OAuthConnection | null> {
  const supabase = await createClient();
  
  // Get user ID if not provided
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    targetUserId = user.id;
  }

  const { data, error } = await supabase
    .from('oauth_connections')
    .select('*')
    .eq('user_id', targetUserId)
    .eq('platform', platform)
    .eq('status', 'connected')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error(`❌ Failed to fetch ${platform} connection:`, error);
    throw new Error(`Failed to fetch ${platform} connection`);
  }

  if (!data) {
    return null;
  }

  // Decrypt tokens
  return {
    ...data,
    access_token: data.access_token ? decryptToken(data.access_token) : '',
    refresh_token: data.refresh_token ? decryptToken(data.refresh_token) : null,
  };
}

/**
 * Create or update an OAuth connection
 */
export async function upsertConnection(params: {
  platform: Platform;
  platform_user_id: string;
  platform_account_name: string;
  platform_account_email?: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: Date;
  metadata?: Record<string, any>;
  scopes?: string[];
  userId?: string;
}): Promise<OAuthConnection> {
  const supabase = await createClient();
  
  // Get user ID if not provided
  let userId = params.userId;
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    userId = user.id;
  }

  // Encrypt tokens before storing
  const encryptedAccessToken = encryptToken(params.access_token);
  const encryptedRefreshToken = params.refresh_token ? encryptToken(params.refresh_token) : null;

  const connectionData = {
    user_id: userId,
    platform: params.platform,
    platform_user_id: params.platform_user_id,
    platform_account_name: params.platform_account_name,
    platform_account_email: params.platform_account_email || null,
    access_token: encryptedAccessToken,
    refresh_token: encryptedRefreshToken,
    token_expires_at: params.token_expires_at?.toISOString() || null,
    metadata: params.metadata || {},
    scopes: params.scopes || [],
    status: 'connected' as ConnectionStatus,
    last_synced_at: new Date().toISOString(),
    error_message: null,
    error_count: 0,
  };

  // Upsert (insert or update if exists)
  const { data, error } = await supabase
    .from('oauth_connections')
    .upsert(connectionData, {
      onConflict: 'user_id,platform,platform_user_id',
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Failed to upsert connection:', error);
    throw new Error('Failed to save connection');
  }

  return {
    ...data,
    access_token: params.access_token, // Return decrypted
    refresh_token: params.refresh_token || null,
  };
}

/**
 * Update connection status
 */
export async function updateConnectionStatus(
  connectionId: string,
  status: ConnectionStatus,
  errorMessage?: string
): Promise<void> {
  const supabase = await createClient();

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (errorMessage) {
    updates.error_message = errorMessage;
    updates.error_count = (await supabase
      .from('oauth_connections')
      .select('error_count')
      .eq('id', connectionId)
      .single()).data?.error_count || 0 + 1;
  } else {
    updates.error_message = null;
    updates.error_count = 0;
  }

  const { error } = await supabase
    .from('oauth_connections')
    .update(updates)
    .eq('id', connectionId);

  if (error) {
    console.error('❌ Failed to update connection status:', error);
    throw new Error('Failed to update connection status');
  }
}

/**
 * Delete an OAuth connection
 */
export async function deleteConnection(
  platform: Platform,
  userId?: string
): Promise<void> {
  const supabase = await createClient();
  
  // Get user ID if not provided
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    targetUserId = user.id;
  }

  const { error } = await supabase
    .from('oauth_connections')
    .delete()
    .eq('user_id', targetUserId)
    .eq('platform', platform);

  if (error) {
    console.error(`❌ Failed to delete ${platform} connection:`, error);
    throw new Error(`Failed to delete ${platform} connection`);
  }
}

/**
 * Check if a connection needs token refresh
 * Returns true if token expires within 5 minutes
 */
export function needsTokenRefresh(connection: OAuthConnection): boolean {
  if (!connection.token_expires_at) {
    return false;
  }

  const expiresAt = new Date(connection.token_expires_at);
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

  return expiresAt <= fiveMinutesFromNow;
}

/**
 * Get connection status summary for all platforms
 * Useful for showing integration status in UI
 */
export async function getConnectionStatusSummary(userId?: string): Promise<Record<Platform, {
  connected: boolean;
  account_name: string | null;
  status: ConnectionStatus;
  connectionId: string | null;
}>> {
  const connections = await getUserConnections(userId);
  
  const platforms: Platform[] = ['instagram', 'calendly', 'gohighlevel', 'hubspot', 'pipedrive', 'activecampaign', 'salesforce'];
  
  const summary: any = {};
  
  for (const platform of platforms) {
    const conn = connections.find(c => c.platform === platform && c.status === 'connected');
    summary[platform] = {
      connected: !!conn,
      account_name: conn?.platform_account_name || null,
      status: conn?.status || 'disconnected',
      connectionId: conn?.id || null,
    };
  }
  
  return summary;
}
