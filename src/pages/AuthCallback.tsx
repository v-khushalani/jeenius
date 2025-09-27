import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (data.session?.user) {
          console.log('✅ User authenticated successfully');
          
          // Check if user has completed goal selection
          const { data: profile } = await supabase
            .from('profiles')
            .select('goals_set, target_exam, grade')
            .eq('id', data.session.user.id)
            .single();

          // Also check localStorage for goals
          const savedGoals = localStorage.getItem('userGoals');
          const hasGoals = savedGoals && JSON.parse(savedGoals).goal;

          if (profile?.goals_set || hasGoals) {
            console.log('🎯 User has goals, redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('🎯 No goals found, redirecting to goal selection');
            navigate('/goal-selection');
          }
        } else {
          console.log('⚠️ No session found, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('❌ Callback handling error:', error);
        navigate('/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center" style={{backgroundColor: '#e9e9e9'}}>
      <Card className="max-w-md mx-4">
        <CardContent className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#013062'}}></div>
          <h2 className="text-xl font-semibold mb-2" style={{color: '#013062'}}>
            Completing sign-in...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
