/**
 * HubSpot OAuth - Disconnect
 * 
 * Removes HubSpot connection from database
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteConnection } from '@/lib/oauth/connections';

export async function POST() {
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

    // Delete the connection
    await deleteConnection('hubspot', user.id);

    console.log('✅ HubSpot connection deleted for user:', user.id);

    // Return success
    return NextResponse.json({
      success: true,
      message: 'HubSpot disconnected successfully',
    });

  } catch (error) {
    console.error('❌ HubSpot disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect HubSpot' },
      { status: 500 }
    );
  }
}
