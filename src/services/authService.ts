import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[authService] signInWithEmail failed:', error.message);
      return { user: null, error };
    }

    console.log('[authService] User signed in:', data.user?.email);
    return { user: data.user, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[authService] signInWithEmail exception:', error.message);
    return { user: null, error };
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('[authService] signUp failed:', error.message);
      return { user: null, error };
    }

    console.log('[authService] User signed up:', data.user?.email);
    return { user: data.user, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[authService] signUp exception:', error.message);
    return { user: null, error };
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[authService] signOut failed:', error.message);
      return { error };
    }

    console.log('[authService] User signed out');
    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[authService] signOut exception:', error.message);
    return { error };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('[authService] getCurrentUser failed:', error.message);
      return null;
    }

    return data.user || null;
  } catch (err) {
    console.error('[authService] getCurrentUser exception:', err);
    return null;
  }
};

/**
 * Listen to auth state changes
 * Returns unsubscribe function
 */
export const onAuthStateChange = (
  callback: (event: string, session: any) => void
): (() => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('[authService] Auth state changed:', event);
    callback(event, session);
  });

  // Return unsubscribe function
  return () => {
    if (data?.subscription) {
      data.subscription.unsubscribe();
    }
  };
};

/**
 * Get session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[authService] getSession failed:', error.message);
    return null;
  }

  return data.session;
};
