// src/contexts/AuthContext.tsx - Enhanced with profile creation
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  createUserProfile: (userData: any) => Promise<{ error?: string }>;
  updateProfile: (userData: any) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Handle new user registration
        if (event === 'SIGNED_IN' && session?.user) {
          await handleNewUserProfile(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleNewUserProfile = async (user: User) => {
    try {
      console.log('🔍 Checking profile for user:', user.id);
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('📝 Creating new profile for user:', user.id);
        
        const profileData = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Student',
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url,
          grade: null,
          target_exam: null,
          subjects: [],
          daily_goal: 30,
          goals_set: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error('❌ Failed to create profile:', insertError);
          throw insertError;
        }

        console.log('✅ Profile created successfully');
      } else if (!checkError) {
        console.log('✅ Profile already exists');
      } else {
        console.error('❌ Error checking profile:', checkError);
        throw checkError;
      }
    } catch (error) {
      console.error('❌ Profile creation/check failed:', error);
      // Don't throw error here to prevent login failure
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        return { error: error.message };
      }

      // OAuth redirect will handle the rest
      return {};
    } catch (error: any) {
      console.error('Sign-in error:', error);
      return { error: error.message || 'Failed to sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (userData: any): Promise<{ error?: string }> => {
    try {
      if (!user?.id) {
        return { error: 'No authenticated user' };
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...userData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Profile creation error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Create profile error:', error);
      return { error: error.message || 'Failed to create profile' };
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    // Clear localStorage
    localStorage.removeItem('userGoals');
    setIsLoading(false);
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    loading: isLoading,
    signInWithGoogle,
    signOut,
    createUserProfile,
    updateProfile: createUserProfile, // Alias for compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



