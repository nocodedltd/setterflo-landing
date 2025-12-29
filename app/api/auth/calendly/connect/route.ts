/**
 * Calendly OAuth - Initiate Connection
 * 
 * Redirects user to Calendly OAuth consent screen
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

    // Get Calendly OAuth credentials from environment
    const clientId = process.env.CALENDLY_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/calendly/callback`;

    if (!clientId) {
      console.error('❌ CALENDLY_CLIENT_ID not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Calendly app not configured', request.url)
      );
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Store state in cookie for verification in callback
    const cookieStore = await cookies();
    cookieStore.set('calendly_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Build Calendly OAuth authorization URL
    const authUrl = new URL('https://auth.calendly.com/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');

    console.log('🔗 Redirecting to Calendly OAuth:', authUrl.toString());

    // Redirect to Calendly OAuth consent screen
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('❌ Calendly OAuth connect error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to initiate Calendly connection', request.url)
    );
  }
}
