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
  updateProfile: (profileData: any) => Promise<{ error?: string }>;
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
  const listenerRef = React.useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    console.log("🚀 Setting up Supabase Auth listener (runs once)");
  
    const updateAuthState = (session: Session | null) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
  
    // 1️⃣ Fetch initial session FIRST
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error("❌ Initial session error:", error);
      console.log("🔍 Initial session check:", session?.user?.id || "none");
      updateAuthState(session);
    });
  
    // 2️⃣ Remove any existing listener before creating a new one
    if (listenerRef.current) {
      console.log("🧹 Removing old auth listener...");
      listenerRef.current.subscription.unsubscribe();
    }
  
    // 3️⃣ Listen for subsequent auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("📢 Auth event:", event, session?.user?.id || "none");
        updateAuthState(session);
  
        if (event === "SIGNED_IN" && session?.user) {
          setTimeout(() => createUserProfileIfNeeded(session.user), 0);
        }
  
        if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
        }
      }
    );
  
    listenerRef.current = listener; // ✅ store listener reference
  
    return () => {
      mounted = false;
      if (listenerRef.current) {
        console.log("🧹 Cleaning up Supabase listener on unmount");
        listenerRef.current.subscription.unsubscribe();
        listenerRef.current = null;
      }
    };
  }, []);

  
  const createUserProfileIfNeeded = async (user: User) => {
    try {
      console.log('🔍 Checking profile for user:', user.id);
      
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('📝 Creating new profile...');
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Student',
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('❌ Profile creation failed:', insertError);
        } else {
          console.log('✅ Profile created successfully');
        }
      }
    } catch (error) {
      console.error('❌ Profile check/creation error:', error);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting Google OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // ✅ FIXED: Correct redirect URL
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        setIsLoading(false);
        return { error: error.message };
      }

      console.log('✅ OAuth initiated successfully');
      // Don't set loading to false here - redirect will happen
      return {};
    } catch (error: any) {
      console.error('❌ Sign-in error:', error);
      setIsLoading(false);
      return { error: error.message || 'Failed to sign in' };
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    console.log('👋 Signing out...');

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
    }

    // Clear localStorage
    localStorage.removeItem('userGoals');
    localStorage.removeItem('studyProgress');

    // Immediately clear auth state to update UI
    setUser(null);
    setSession(null);

    setIsLoading(false);
    console.log('✅ Signed out successfully');
  };

  const updateProfile = async (profileData: any): Promise<{ error?: string }> => {
    if (!user) return { error: 'No user found' };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) {
        console.error('❌ Profile update error:', error);
        return { error: error.message };
      }
      
      return {};
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      return { error: error.message || 'Failed to update profile' };
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
