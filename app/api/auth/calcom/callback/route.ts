/**
 * Cal.com OAuth - Handle Callback
 * 
 * Receives authorization code from Cal.com OAuth and exchanges for access token
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
      console.error('❌ Cal.com OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/dashboard/settings?oauth_error=Cal.com: ${errorDescription || error}`, request.url)
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
    const savedState = cookieStore.get('calcom_oauth_state')?.value;
    
    if (!savedState || savedState !== state) {
      console.error('❌ State mismatch:', { savedState, receivedState: state });
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Security check failed', request.url)
      );
    }

    // Clear state cookie
    cookieStore.delete('calcom_oauth_state');

    // Check user authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthenticated&redirect=/dashboard/settings', request.url)
      );
    }

    // Get OAuth credentials
    const clientId = process.env.CALCOM_CLIENT_ID;
    const clientSecret = process.env.CALCOM_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/calcom/callback`;

    if (!clientId || !clientSecret) {
      console.error('❌ Cal.com OAuth credentials not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Cal.com app not configured', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://app.cal.com/api/v2/oauth/token';
    
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
    const expiresIn = tokenData.expires_in;

    if (!accessToken) {
      console.error('❌ No access token in response');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=No access token received', request.url)
      );
    }

    console.log('✅ Access token obtained');

    // Get user's Cal.com profile
    const userResponse = await fetch('https://app.cal.com/api/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      console.error('❌ Failed to fetch Cal.com user profile');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Failed to fetch Cal.com profile', request.url)
      );
    }

    const userData = await userResponse.json();
    const calcomUser = userData.data || userData;
    
    const calcomUserId = calcomUser.id?.toString();
    const calcomUserName = calcomUser.name || calcomUser.username;
    const calcomUserEmail = calcomUser.email;
    const calcomUsername = calcomUser.username;

    console.log('✅ Cal.com user profile fetched:', calcomUserName);

    // Store connection in database
    await upsertConnection({
      platform: 'calcom',
      platform_user_id: calcomUserId,
      platform_account_name: calcomUserName,
      platform_account_email: calcomUserEmail,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
      metadata: {
        username: calcomUsername,
        booking_url: `https://cal.com/${calcomUsername}`,
        user_data: calcomUser,
      },
      scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
      userId: user.id,
    });

    console.log('✅ Cal.com connection saved');

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(`/dashboard/settings?oauth_success=Cal.com connected successfully! (${calcomUserName})`, request.url)
    );

  } catch (error) {
    console.error('❌ Cal.com OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to complete Cal.com connection', request.url)
    );
  }
}
