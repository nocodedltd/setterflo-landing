/**
 * HubSpot OAuth - Handle Callback
 * 
 * Receives authorization code from HubSpot OAuth and exchanges for access token
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
      console.error('❌ HubSpot OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/dashboard/settings?oauth_error=HubSpot: ${errorDescription || error}`, request.url)
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
    const savedState = cookieStore.get('hubspot_oauth_state')?.value;
    
    if (!savedState || savedState !== state) {
      console.error('❌ State mismatch:', { savedState, receivedState: state });
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Security check failed', request.url)
      );
    }

    // Clear state cookie
    cookieStore.delete('hubspot_oauth_state');

    // Check user authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthenticated&redirect=/dashboard/settings', request.url)
      );
    }

    // Get OAuth credentials
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/hubspot/callback`;

    if (!clientId || !clientSecret) {
      console.error('❌ HubSpot OAuth credentials not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=HubSpot app not configured', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://api.hubapi.com/oauth/v1/token';
    
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
    const expiresIn = tokenData.expires_in; // 6 hours (21600 seconds)

    if (!accessToken) {
      console.error('❌ No access token in response');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=No access token received', request.url)
      );
    }

    console.log('✅ Access token obtained');

    // Get HubSpot account details
    const accountResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + accessToken, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!accountResponse.ok) {
      console.error('❌ Failed to fetch HubSpot account details');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Failed to fetch HubSpot account', request.url)
      );
    }

    const accountData = await accountResponse.json();
    const hubId = accountData.hub_id?.toString();
    const hubDomain = accountData.hub_domain;
    const appId = accountData.app_id;

    console.log('✅ HubSpot account details fetched:', hubDomain);

    // Store connection in database
    await upsertConnection({
      platform: 'hubspot',
      platform_user_id: hubId,
      platform_account_name: hubDomain,
      platform_account_email: accountData.user || hubDomain,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: new Date(Date.now() + expiresIn * 1000),
      metadata: {
        hub_id: hubId,
        hub_domain: hubDomain,
        app_id: appId,
        token_type: accountData.token_type,
        scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
      },
      scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
      userId: user.id,
    });

    console.log('✅ HubSpot connection saved');

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(`/dashboard/settings?oauth_success=HubSpot connected successfully! (${hubDomain})`, request.url)
    );

  } catch (error) {
    console.error('❌ HubSpot OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to complete HubSpot connection', request.url)
    );
  }
}
