import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Auth Utility Functions
 * Helper functions for authentication operations
 */

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Get profile error:', error);
    throw error;
  }
  
  return data;
}

export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Update profile error:', error);
    throw error;
  }
  
  return data;
}

export async function isUserAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
