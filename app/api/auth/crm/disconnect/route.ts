/**
 * GoHighLevel OAuth - Disconnect
 * 
 * Removes GoHighLevel connection from database
 * Note: Using /crm/ path to comply with white-label policy
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

    // Delete the connection (stored as 'gohighlevel' in database)
    await deleteConnection('gohighlevel', user.id);

    console.log('✅ GoHighLevel connection deleted for user:', user.id);

    // Return success
    return NextResponse.json({
      success: true,
      message: 'GoHighLevel disconnected successfully',
    });

  } catch (error) {
    console.error('❌ GoHighLevel disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect GoHighLevel' },
      { status: 500 }
    );
  }
}
