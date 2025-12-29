/**
 * Calendly OAuth - Handle Callback
 * 
 * Receives authorization code from Calendly OAuth and exchanges for access token
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upsertConnection } from '@/lib/oauth/connections';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('❌ Calendly OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/dashboard/settings?oauth_error=Calendly: ${errorDescription || error}`, request.url)
      );
    }

    // Verify required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Invalid OAuth callback', request.url)
      );
    }

    // Verify state parameter (CSRF protection)
    const cookieStore = await cookies();
    const savedState = cookieStore.get('calendly_oauth_state')?.value;
    
    if (!savedState || savedState !== state) {
      console.error('❌ State mismatch:', { savedState, receivedState: state });
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Security check failed', request.url)
      );
    }

    // Clear state cookie
    cookieStore.delete('calendly_oauth_state');

    // Check user authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthenticated&redirect=/dashboard/settings', request.url)
      );
    }

    // Get OAuth credentials
    const clientId = process.env.CALENDLY_CLIENT_ID;
    const clientSecret = process.env.CALENDLY_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/calendly/callback`;

    if (!clientId || !clientSecret) {
      console.error('❌ Calendly OAuth credentials not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Calendly app not configured', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://auth.calendly.com/oauth/token';
    
    console.log('🔄 Exchanging code for access token...');

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Failed to get access token', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in; // Typically not provided by Calendly (tokens don't expire)

    if (!accessToken) {
      console.error('❌ No access token in response');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=No access token received', request.url)
      );
    }

    console.log('✅ Access token obtained');

    // Get user's Calendly profile
    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      console.error('❌ Failed to fetch Calendly user profile');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Failed to fetch Calendly profile', request.url)
      );
    }

    const userData = await userResponse.json();
    const calendlyUser = userData.resource;
    
    const calendlyUserId = calendlyUser.uri.split('/').pop(); // Extract ID from URI
    const calendlyUserName = calendlyUser.name;
    const calendlyUserEmail = calendlyUser.email;
    const calendlySlug = calendlyUser.slug; // e.g., "nocodedltd"

    console.log('✅ Calendly user profile fetched:', calendlyUserName);

    // Store connection in database
    await upsertConnection({
      platform: 'calendly',
      platform_user_id: calendlyUserId,
      platform_account_name: calendlyUserName,
      platform_account_email: calendlyUserEmail,
      access_token: accessToken,
      refresh_token: refreshToken,
      // Calendly tokens don't expire, but set to 1 year for consistency
      token_expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
      metadata: {
        calendly_user_uri: calendlyUser.uri,
        slug: calendlySlug,
        scheduling_url: calendlyUser.scheduling_url,
        timezone: calendlyUser.timezone,
      },
      scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
      userId: user.id,
    });

    console.log('✅ Calendly connection saved');

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(`/dashboard/settings?oauth_success=Calendly connected successfully! (${calendlyUserName})`, request.url)
    );

  } catch (error) {
    console.error('❌ Calendly OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to complete Calendly connection', request.url)
    );
  }
}
