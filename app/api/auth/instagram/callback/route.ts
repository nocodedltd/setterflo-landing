/**
 * Instagram OAuth - Handle Callback
 * 
 * Receives authorization code from Meta OAuth and exchanges for access token
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
      console.error('❌ Instagram OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/dashboard/settings?oauth_error=Instagram: ${errorDescription || error}`, request.url)
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
    const savedState = cookieStore.get('instagram_oauth_state')?.value;
    
    if (!savedState || savedState !== state) {
      console.error('❌ State mismatch:', { savedState, receivedState: state });
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Security check failed', request.url)
      );
    }

    // Clear state cookie
    cookieStore.delete('instagram_oauth_state');

    // Check user authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthenticated&redirect=/dashboard/settings', request.url)
      );
    }

    // Get OAuth credentials
    const clientId = process.env.INSTAGRAM_APP_ID;
    const clientSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/instagram/callback`;

    if (!clientId || !clientSecret) {
      console.error('❌ Instagram OAuth credentials not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Instagram app not configured', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
    });

    console.log('🔄 Exchanging code for access token...');

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
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

    if (!accessToken) {
      console.error('❌ No access token in response');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=No access token received', request.url)
      );
    }

    console.log('✅ Access token obtained');

    // Get user's Facebook Pages (to find Instagram Business Account)
    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`;
    const pagesResponse = await fetch(pagesUrl);

    if (!pagesResponse.ok) {
      console.error('❌ Failed to fetch Facebook Pages');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Failed to fetch Instagram account', request.url)
      );
    }

    const pagesData = await pagesResponse.json();
    const pages = pagesData.data || [];

    if (pages.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=No Facebook Page found. Connect a Facebook Page to your Instagram Business Account first.', request.url)
      );
    }

    // Get the first page (or let user choose later)
    const page = pages[0];
    const pageAccessToken = page.access_token;
    const pageId = page.id;
    const pageName = page.name;

    // Get Instagram Business Account connected to this page
    const igAccountUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`;
    const igAccountResponse = await fetch(igAccountUrl);

    if (!igAccountResponse.ok) {
      console.error('❌ Failed to fetch Instagram Business Account');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Failed to fetch Instagram Business Account', request.url)
      );
    }

    const igAccountData = await igAccountResponse.json();
    const instagramBusinessAccountId = igAccountData.instagram_business_account?.id;

    if (!instagramBusinessAccountId) {
      return NextResponse.redirect(
        new URL(`/dashboard/settings?oauth_error=No Instagram Business Account connected to ${pageName}. Please connect an Instagram Business Account to your Facebook Page.`, request.url)
      );
    }

    // Get Instagram account username
    const igUsernameUrl = `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}?fields=username,name,profile_picture_url&access_token=${pageAccessToken}`;
    const igUsernameResponse = await fetch(igUsernameUrl);

    let instagramUsername = 'Instagram Account';
    if (igUsernameResponse.ok) {
      const igData = await igUsernameResponse.json();
      instagramUsername = igData.username ? `@${igData.username}` : igData.name || instagramUsername;
    }

    console.log('✅ Instagram Business Account found:', instagramUsername);

    // Exchange short-lived token for long-lived token (60 days)
    const longLivedTokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${accessToken}`;
    const longLivedResponse = await fetch(longLivedTokenUrl);

    let finalAccessToken = accessToken;
    let expiresAt: Date | undefined;

    if (longLivedResponse.ok) {
      const longLivedData = await longLivedResponse.json();
      if (longLivedData.access_token) {
        finalAccessToken = longLivedData.access_token;
        // Long-lived tokens expire in 60 days
        expiresAt = new Date(Date.now() + (longLivedData.expires_in || 60 * 24 * 60 * 60) * 1000);
        console.log('✅ Long-lived access token obtained');
      }
    }

    // Store connection in database
    await upsertConnection({
      platform: 'instagram',
      platform_user_id: instagramBusinessAccountId,
      platform_account_name: instagramUsername,
      access_token: pageAccessToken, // Use page access token for Instagram API calls
      token_expires_at: expiresAt,
      metadata: {
        instagram_business_account_id: instagramBusinessAccountId,
        page_id: pageId,
        page_name: pageName,
        page_access_token: pageAccessToken,
        user_access_token: finalAccessToken,
      },
      scopes: [
        'instagram_basic',
        'instagram_manage_messages',
        'pages_messaging',
        'pages_read_engagement',
      ],
      userId: user.id,
    });

    console.log('✅ Instagram connection saved');

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(`/dashboard/settings?oauth_success=Instagram connected successfully! (${instagramUsername})`, request.url)
    );

  } catch (error) {
    console.error('❌ Instagram OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to complete Instagram connection', request.url)
    );
  }
}
