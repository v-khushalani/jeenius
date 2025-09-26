// src/contexts/AuthContext.tsx - Enhanced with profile creation
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  createUserProfile: (userData: any) => Promise<{ error?: string }>;
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
    signInWithGoogle,
    signOut,
    createUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// src/pages/auth/CallbackPage.tsx - Handle OAuth callback
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (data.session) {
          console.log('✅ Authentication successful');
          
          // Check if user has completed goal selection
          const { data: profile } = await supabase
            .from('profiles')
            .select('goals_set, target_exam, grade')
            .eq('id', data.session.user.id)
            .single();

          if (profile?.goals_set && profile?.target_exam && profile?.grade) {
            navigate('/dashboard');
          } else {
            navigate('/goal-selection');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        navigate('/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Completing sign-in...</h2>
        <p className="text-gray-500 mt-2">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

// Updated GoalSelectionPage.tsx - Better error handling
const GoalSelectionPage = () => {
  // ... existing code ...

  const confirmStartJourney = async () => {
    setIsStartingJourney(true);
    
    try {
      // Auto-select all subjects for the chosen goal
      const selectedSubjects = subjects[selectedGoal] || [];
      
      const userGoals = {
        grade: selectedGrade,
        goal: selectedGoal,
        subjects: selectedSubjects,
        daysRemaining: daysRemaining,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage first (immediate backup)
      localStorage.setItem('userGoals', JSON.stringify(userGoals));
      console.log('✅ Goals saved to localStorage');
      
      if (user?.id) {
        // Try to update profile with retry logic
        let retries = 3;
        let profileError = null;
        
        while (retries > 0) {
          try {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                target_exam: selectedGoal,
                grade: parseInt(selectedGrade),
                subjects: selectedSubjects,
                daily_goal: selectedSubjects.length * 10,
                goals_set: true,
                updated_at: new Date().toISOString()
              });

            if (!error) {
              console.log('✅ Profile updated successfully');
              profileError = null;
              break;
            } else {
              profileError = error;
              console.warn(`Profile update attempt ${4-retries} failed:`, error);
            }
          } catch (err) {
            profileError = err;
            console.warn(`Profile update attempt ${4-retries} error:`, err);
          }
          
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
        
        if (profileError) {
          console.error('❌ All profile update attempts failed:', profileError);
          // Don't block navigation, goals are saved in localStorage
        }
      }
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate regardless of profile update status
      console.log('🚀 Navigating to dashboard...');
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('❌ Error in goal setup:', error);
      // Still navigate - we have localStorage backup
      navigate('/dashboard', { replace: true });
    } finally {
      setIsStartingJourney(false);
    }
  };

  // ... rest of existing code ...
};

// Database Migration - Add to your Supabase SQL editor
/*
-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  grade INTEGER,
  target_exam TEXT,
  subjects JSONB DEFAULT '[]',
  daily_goal INTEGER DEFAULT 30,
  goals_set BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
*/
