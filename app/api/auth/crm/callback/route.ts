/**
 * GoHighLevel OAuth - Handle Callback
 * 
 * Receives authorization code from GoHighLevel OAuth and exchanges for access token
 * Note: Using /crm/ path to comply with white-label policy
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
      console.error('❌ GoHighLevel OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/dashboard/settings?oauth_error=GoHighLevel: ${errorDescription || error}`, request.url)
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
    const savedState = cookieStore.get('ghl_oauth_state')?.value;
    
    if (!savedState || savedState !== state) {
      console.error('❌ State mismatch:', { savedState, receivedState: state });
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=Security check failed', request.url)
      );
    }

    // Clear state cookie
    cookieStore.delete('ghl_oauth_state');

    // Check user authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthenticated&redirect=/dashboard/settings', request.url)
      );
    }

    // Get OAuth credentials
    const clientId = process.env.GOHIGHLEVEL_CLIENT_ID;
    const clientSecret = process.env.GOHIGHLEVEL_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/crm/callback`;

    if (!clientId || !clientSecret) {
      console.error('❌ GoHighLevel OAuth credentials not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=GoHighLevel app not configured', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://services.leadconnectorhq.com/oauth/token';
    
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
    const locationId = tokenData.locationId; // The selected location
    const companyId = tokenData.companyId;
    const userId = tokenData.userId;

    if (!accessToken) {
      console.error('❌ No access token in response');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=No access token received', request.url)
      );
    }

    console.log('✅ Access token obtained for location:', locationId);

    // Get location details
    let locationName = locationId;
    let locationEmail = '';
    
    try {
      const locationResponse = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Version': '2021-07-28',
        },
      });

      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        locationName = locationData.location?.name || locationId;
        locationEmail = locationData.location?.email || '';
        console.log('✅ Location details fetched:', locationName);
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch location details, using ID:', err);
    }

    // Store connection in database
    await upsertConnection({
      platform: 'gohighlevel',
      platform_user_id: locationId,
      platform_account_name: locationName,
      platform_account_email: locationEmail,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: new Date(Date.now() + expiresIn * 1000),
      metadata: {
        location_id: locationId,
        company_id: companyId,
        user_id: userId,
        scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
      },
      scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
      userId: user.id,
    });

    console.log('✅ GoHighLevel connection saved');

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(`/dashboard/settings?oauth_success=GoHighLevel connected successfully! (${locationName})`, request.url)
    );

  } catch (error) {
    console.error('❌ GoHighLevel OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to complete GoHighLevel connection', request.url)
    );
  }
}
