/**
 * Instagram OAuth - Disconnect
 * 
 * Removes Instagram connection from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteConnection } from '@/lib/oauth/connections';

export async function POST(request: NextRequest) {
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
    await deleteConnection('instagram', user.id);

    console.log('✅ Instagram connection deleted for user:', user.id);

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Instagram disconnected successfully',
    });

  } catch (error) {
    console.error('❌ Instagram disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Instagram' },
      { status: 500 }
    );
  }
}
