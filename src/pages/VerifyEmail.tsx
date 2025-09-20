import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const resendVerification = async () => {
    if (user?.email) {
      setIsResending(true);
      try {
        await supabase.auth.resend({
          type: 'signup',
          email: user.email,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        setResent(true);
      } catch (error) {
        console.error('Error resending verification:', error);
      }
      setIsResending(false);
    }
  };

  const checkVerificationStatus = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser?.email_confirmed_at) {
      navigate('/goal-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              📧 <strong>{user?.email}</strong>
            </p>
          </div>
          
          {resent && (
            <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Verification email sent!</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={resendVerification} 
              variant="outline" 
              className="w-full"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
            
            <Button 
              onClick={checkVerificationStatus}
              className="w-full"
            >
              I've Verified My Email
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Don't see the email? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
