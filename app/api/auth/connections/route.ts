/**
 * OAuth Connections API
 * 
 * Get all OAuth connections for the current user
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getConnectionStatusSummary } from '@/lib/oauth/connections';

export async function GET() {
  try {
    // Check user authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get connection status summary
    const connections = await getConnectionStatusSummary(user.id);

    return NextResponse.json({
      success: true,
      connections,
    });

  } catch (error) {
    console.error('❌ Failed to fetch connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}
