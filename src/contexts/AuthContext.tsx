import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // If user exists but no profile, create one
        if (initialSession?.user) {
          await ensureUserProfile(initialSession.user);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle sign in - create profile if needed
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserProfile(session.user);
          toast.success('Successfully signed in!');
          
          // Redirect to goal selection if it's a new user
          const { data: profile } = await supabase
            .from('profiles')
            .select('target_exam, grade')
            .eq('id', session.user.id)
            .single();
          
          if (!profile?.target_exam || !profile?.grade) {
            window.location.href = '/goal-selection';
          } else {
            window.location.href = '/dashboard';
          }
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out');
          window.location.href = '/';
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking profile:', fetchError);
        return;
      }

      // Create profile if it doesn't exist
      if (!existingProfile) {
        const profileData = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          mobile_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast.error('Failed to create user profile');
          return;
        }

        // Initialize user stats
        const { error: statsError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_questions: 0,
            correct_answers: 0,
            total_points: 0,
            streak: 0,
            accuracy: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (statsError) {
          console.error('Error creating user stats:', statsError);
        }

        console.log('✅ User profile and stats created successfully');
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Google sign in exception:', error);
      return { error: error.message || 'Authentication failed' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Sign out exception:', error);
      throw error;
    }
  };

  const updateProfile = async (data: any): Promise<void> => {
    try {
      if (!user) throw new Error('No user signed in');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Update profile exception:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}