// Create this as src/components/OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from URL hash/query params
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          navigate('/login');
          return;
        }

        if (data.session) {
          console.log('OAuth success, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('No session found, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback handling error:', error);
        navigate('/login');
      }
    };

    // Small delay to let auth state settle
    const timer = setTimeout(handleOAuthCallback, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <img src="/logo.png" alt="JEEnius" className="w-full h-full" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing your sign-in...
        </h2>
        <p className="text-gray-600">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
