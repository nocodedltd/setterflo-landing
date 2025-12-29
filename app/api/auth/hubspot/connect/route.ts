/**
 * HubSpot OAuth - Initiate Connection
 * 
 * Redirects user to HubSpot OAuth consent screen
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

    // Get HubSpot OAuth credentials from environment
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/hubspot/callback`;

    if (!clientId) {
      console.error('❌ HUBSPOT_CLIENT_ID not configured');
      return NextResponse.redirect(
        new URL('/dashboard/settings?oauth_error=HubSpot app not configured', request.url)
      );
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Store state in cookie for verification in callback
    const cookieStore = await cookies();
    cookieStore.set('hubspot_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // HubSpot scopes for CRM access
    const scopes = [
      'crm.objects.contacts.read',
      'crm.objects.contacts.write',
      'crm.objects.deals.read',
      'crm.objects.deals.write',
      'crm.objects.companies.read',
      'crm.objects.companies.write',
      'oauth', // For token refresh
    ];

    // Build HubSpot OAuth authorization URL (EU region)
    const authUrl = new URL('https://app-eu1.hubspot.com/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scopes.join(' '));
    authUrl.searchParams.set('state', state);

    console.log('🔗 Redirecting to HubSpot OAuth:', authUrl.toString());

    // Redirect to HubSpot OAuth consent screen
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('❌ HubSpot OAuth connect error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?oauth_error=Failed to initiate HubSpot connection', request.url)
    );
  }
}
