/**
 * Instagram OAuth - Initiate Connection
 * 
 * Redirects user to Meta OAuth consent screen
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthenticated&redirect=/dashboard/settings', request.url)
      );
    }

    // Get Instagram OAuth credentials from environment
    const clientId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/instagram/callback`;

    if (!clientId) {
      console.error('❌ INSTAGRAM_APP_ID not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Instagram app not configured', request.url)
      );
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Store state in cookie for verification in callback
    const cookieStore = await cookies();
    cookieStore.set('instagram_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Build Meta OAuth authorization URL
    // Using Facebook Login for Business to get Instagram access
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');
    
    // Request Instagram-specific permissions
    authUrl.searchParams.set('scope', [
      'instagram_basic',
      'instagram_manage_messages',
      'pages_messaging',
      'pages_read_engagement',
      'pages_manage_metadata', // To get Instagram Business Account
    ].join(','));

    // Optional: Add display=popup for better UX
    // authUrl.searchParams.set('display', 'popup');

    console.log('🔗 Redirecting to Instagram OAuth:', authUrl.toString());

    // Redirect to Meta OAuth consent screen
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('❌ Instagram OAuth connect error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to initiate Instagram connection', request.url)
    );
  }
}
