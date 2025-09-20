import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Zap, Brain, AlertCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { securityLogger } from '@/lib/security-logger';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Rate limiting - max 5 attempts per 15 minutes
  const { isRateLimited, checkRateLimit, recordAttempt, remainingAttempts } = useRateLimit({
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many login attempts. Please wait 15 minutes before trying again."
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
  if (checkRateLimit()) {
    securityLogger.log('rate_limit_exceeded', { 
      action: 'google_login',
      remainingAttempts 
    });
    return;
  }

  setIsGoogleLoading(true);
  recordAttempt();
  
  securityLogger.log('google_login_attempt', { 
    timestamp: Date.now() 
  });
  
  // Simple redirect - let Supabase handle everything
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Just redirect to home, AuthContext will handle routing
    }
  });
  
  if (error) {
    securityLogger.log('google_login_failure', { 
      error: error.message,
      timestamp: Date.now()
    });
    
    toast({
      title: "Login Failed",
      description: error.message,
      variant: "destructive"
    });
    
    setIsGoogleLoading(false);
  } else {
    securityLogger.log('google_login_success', { 
      timestamp: Date.now()
    });
  }
  // Don't set loading to false on success - redirect will happen
};
  
  const demoStats = [
    { icon: Trophy, value: '50K+', label: 'JEEnius Points Earned', color: 'text-yellow-500' },
    { icon: Zap, value: '15K+', label: 'Questions Solved', color: 'text-blue-500' },
    { icon: Brain, value: '98%', label: 'Success Rate', color: 'text-green-500' },
  ];

  const features = [
    { icon: Mail, title: 'Email Verification', desc: 'Secure account with email OTP' },
    { icon: Phone, title: 'Mobile Verification', desc: 'Mandatory mobile number for account security' },
    { icon: Brain, title: 'AI-Powered Learning', desc: 'Personalized study experience' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50">
      <Header />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center py-8 lg:py-16">
              
              {/* Left Side - Login Form */}
              <div className="order-2 lg:order-1">
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm max-w-md mx-auto">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <img src="/logo.png" alt="JEEnius Logo" className="w-16 h-16" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Welcome to JEEnius!
                    </CardTitle>
                    <p className="text-gray-600">
                      Sign in with Google to start your journey
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Google Login Button */}
                    <Button
                      type="button"
                      className="w-full h-14 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold text-base shadow-lg"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading || isRateLimited}
                    >
                      {isGoogleLoading ? (
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent"></div>
                          <span>Signing in with Google...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Continue with Google</span>
                        </div>
                      )}
                    </Button>

                    {isRateLimited && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-red-800 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Too many attempts. Please wait before trying again.</span>
                        </div>
                      </div>
                    )}

                    {/* Security Features */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Account Security Steps
                      </h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Sign in with Google (secure authentication)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Email verification with OTP</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Mobile number verification (mandatory)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                      By continuing, you agree to our{' '}
                      <Button variant="link" className="text-primary p-0 h-auto text-xs">
                        Terms of Service
                      </Button>{' '}
                      and{' '}
                      <Button variant="link" className="text-primary p-0 h-auto text-xs">
                        Privacy Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Features & Benefits */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      Transform Your
                      <span className="text-primary block">JEE Preparation!</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600">
                      AI-powered learning platform trusted by thousands of JEE aspirants
                    </p>
                  </div>

                  {/* Demo Stats */}
                  <div className="grid gap-4">
                    {demoStats.map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm"
                      >
                        <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 bg-white/40 backdrop-blur-sm rounded-lg p-3"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <feature.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">🎉 Free Trial Available!</h3>
                    <p className="text-white/90">
                      Get <span className="font-bold">30 days completely FREE</span> when you join today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
