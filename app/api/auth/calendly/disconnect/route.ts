/**
 * Calendly OAuth - Disconnect
 * 
 * Removes Calendly connection from database
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
    await deleteConnection('calendly', user.id);

    console.log('✅ Calendly connection deleted for user:', user.id);

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Calendly disconnected successfully',
    });

  } catch (error) {
    console.error('❌ Calendly disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Calendly' },
      { status: 500 }
    );
  }
}
