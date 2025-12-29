/**
 * Cal.com OAuth - Disconnect
 * 
 * Removes Cal.com connection from database
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
    await deleteConnection('calcom', user.id);

    console.log('✅ Cal.com connection deleted for user:', user.id);

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Cal.com disconnected successfully',
    });

  } catch (error) {
    console.error('❌ Cal.com disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Cal.com' },
      { status: 500 }
    );
  }
}
