/**
 * GoHighLevel OAuth - Initiate Connection
 * 
 * Redirects user to GoHighLevel OAuth consent screen
 * Note: Using /crm/ path to comply with white-label policy
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

    // Get GoHighLevel OAuth credentials from environment
    const clientId = process.env.GOHIGHLEVEL_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/crm/callback`;

    if (!clientId) {
      console.error('❌ GOHIGHLEVEL_CLIENT_ID not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=GoHighLevel app not configured', request.url)
      );
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Store state in cookie for verification in callback
    const cookieStore = await cookies();
    cookieStore.set('ghl_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // GoHighLevel scopes
    const scopes = [
      'contacts.readonly',
      'contacts.write',
      'opportunities.readonly',
      'opportunities.write',
      'locations.readonly',
    ];

    // Build GoHighLevel OAuth authorization URL
    const authUrl = new URL('https://marketplace.gohighlevel.com/oauth/chooselocation');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scopes.join(' '));
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');

    console.log('🔗 Redirecting to GoHighLevel OAuth:', authUrl.toString());

    // Redirect to GoHighLevel OAuth consent screen
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('❌ GoHighLevel OAuth connect error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to initiate GoHighLevel connection', request.url)
    );
  }
}
