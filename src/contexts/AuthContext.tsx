// Local Auth Context without Supabase
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  mobile_verified?: boolean;
  avatar_url?: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users storage
  const getStoredUsers = () => {
    const stored = localStorage.getItem('mockUsers');
    return stored ? JSON.parse(stored) : [];
  };

  const getStoredProfiles = () => {
    const stored = localStorage.getItem('mockProfiles');
    return stored ? JSON.parse(stored) : [];
  };

  const saveUser = (user: User) => {
    const users = getStoredUsers();
    const existingIndex = users.findIndex((u: User) => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('mockUsers', JSON.stringify(users));
  };

  const saveProfile = (profile: UserProfile) => {
    const profiles = getStoredProfiles();
    const existingIndex = profiles.findIndex((p: UserProfile) => p.id === profile.id);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem('mockProfiles', JSON.stringify(profiles));
  };

  // Initialize auth state
  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      const users = getStoredUsers();
      const profiles = getStoredProfiles();
      const currentUser = users.find((u: User) => u.id === currentUserId);
      const currentProfile = profiles.find((p: UserProfile) => p.id === currentUserId);
      
      if (currentUser) {
        setUser(currentUser);
        setProfile(currentProfile || null);
      }
    }
    setIsLoading(false);
  }, []);

  const createProfile = (user: User): UserProfile => {
    const names = (user.user_metadata?.full_name || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    return {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      avatar_url: user.user_metadata?.avatar_url || null,
      mobile: null,
      mobile_verified: false,
      created_at: new Date().toISOString(),
    };
  };

  const signInWithGoogle = async () => {
    try {
      // Simulate Google OAuth
      const mockUser: User = {
        id: 'google_user_' + Date.now(),
        email: 'user@gmail.com',
        user_metadata: {
          full_name: 'Google User',
          avatar_url: 'https://via.placeholder.com/100'
        }
      };

      const mockProfile = createProfile(mockUser);
      
      saveUser(mockUser);
      saveProfile(mockProfile);
      localStorage.setItem('currentUserId', mockUser.id);
      
      setUser(mockUser);
      setProfile(mockProfile);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // Check if user exists
      const users = getStoredUsers();
      const existingUser = users.find((u: User) => u.email === email);
      
      if (!existingUser) {
        return { error: new Error('User not found') };
      }

      const profiles = getStoredProfiles();
      const userProfile = profiles.find((p: UserProfile) => p.id === existingUser.id);
      
      localStorage.setItem('currentUserId', existingUser.id);
      setUser(existingUser);
      setProfile(userProfile || null);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      // Check if user already exists
      const users = getStoredUsers();
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        return { error: new Error('User already exists') };
      }

      const mockUser: User = {
        id: 'email_user_' + Date.now(),
        email,
        user_metadata: {
          full_name: fullName,
        }
      };

      const mockProfile = createProfile(mockUser);
      
      saveUser(mockUser);
      saveProfile(mockProfile);
      localStorage.setItem('currentUserId', mockUser.id);
      
      setUser(mockUser);
      setProfile(mockProfile);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('currentUserId');
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) {
      return { error: new Error('No user logged in') };
    }

    try {
      const updatedProfile = { ...profile, ...updates };
      saveProfile(updatedProfile);
      setProfile(updatedProfile);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profiles = getStoredProfiles();
      const userProfile = profiles.find((p: UserProfile) => p.id === user.id);
      setProfile(userProfile || null);
    }
  };

  const value = {
    user,
    profile,
    session: user ? { user } : null,
    isAuthenticated: !!user,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};