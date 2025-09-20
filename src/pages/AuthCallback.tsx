// src/pages/AuthCallback.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Failed",
            description: error.message,
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        if (data.session?.user) {
          // Refresh profile data
          await refreshProfile();
          
          toast({
            title: "Welcome!",
            description: "Successfully signed in with Google.",
          });

          // Small delay to ensure profile is loaded
          setTimeout(() => {
            setIsProcessing(false);
          }, 1000);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        toast({
          title: "Something went wrong",
          description: "Please try signing in again.",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast, refreshProfile]);

  useEffect(() => {
    if (!isProcessing && profile) {
      // Check if mobile verification is needed
      if (!profile.mobile || !profile.mobile_verified) {
        navigate('/verify-mobile');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isProcessing, profile, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Setting up your account...</h2>
        <p className="text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
