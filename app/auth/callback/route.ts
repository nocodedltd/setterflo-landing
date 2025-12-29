import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth Callback Handler
 * Handles email verification and OAuth callbacks from Supabase
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${error.message}`);
    }
    
    // Check if user needs onboarding
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();
      
      if (profile && !profile.onboarding_completed) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
