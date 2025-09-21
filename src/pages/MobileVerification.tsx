import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
// Removed Supabase - using mock verification

const MobileVerification = () => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobile(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    setIsLoading(true);
    setMobileError('');

    try {
      // Mock check - always allow for demo
      await new Promise(resolve => setTimeout(resolve, 500));

      // Send OTP via your SMS service (you'll need to implement this)
      // For now, we'll simulate it
      const response = await sendOTP(mobile);
      
      if (response.success) {
        setOtpSent(true);
        setStep('otp');
        toast({
          title: "OTP Sent!",
          description: `Verification code sent to +91-${mobile}`,
        });
      } else {
        setMobileError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMobileError('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      // Verify OTP (you'll need to implement this)
      const response = await verifyOTP(mobile, otp);
      
      if (response.success) {
        // Mock profile update - store in localStorage
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        userProfile.mobile = mobile;
        userProfile.mobile_verified = true;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        toast({
          title: "Mobile Verified!",
          description: "Your mobile number has been successfully verified.",
        });
        
        navigate('/goal-selection');
      } else {
        setOtpError('Invalid OTP. Please check and try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Failed to verify OTP. Please try again.');
    }

    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setOtpError('');
    
    try {
      const response = await sendOTP(mobile);
      
      if (response.success) {
        toast({
          title: "OTP Resent!",
          description: `New verification code sent to +91-${mobile}`,
        });
      } else {
        setOtpError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setOtpError('Something went wrong. Please try again.');
    }
    
    setIsResending(false);
  };

  // Mock functions - you'll need to implement these with your SMS service
  const sendOTP = async (mobile: string) => {
    // Implement with your SMS service (Twilio, AWS SNS, etc.)
    // For demo purposes, always return success
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const verifyOTP = async (mobile: string, otp: string) => {
    // Implement OTP verification logic
    // For demo purposes, accept "123456" as valid OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: otp === '123456' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {step === 'mobile' ? (
              <Phone className="w-8 h-8 text-blue-600" />
            ) : (
              <Shield className="w-8 h-8 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === 'mobile' ? 'Verify Mobile Number' : 'Enter OTP'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {step === 'mobile' 
              ? 'Mobile verification is mandatory for account security'
              : `We've sent a 6-digit code to +91-${mobile}`
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {user && (
            <div className="bg-blue-50 p-3 rounded-lg mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-blue-700">
                  Signed in as <strong>{user.email}</strong>
                </span>
              </div>
            </div>
          )}

          {step === 'mobile' ? (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    +91
                  </div>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setMobile(value);
                      if (mobileError) setMobileError('');
                    }}
                    className="pl-12 h-12 text-lg"
                    maxLength={10}
                  />
                </div>
                {mobileError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{mobileError}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading || mobile.length !== 10}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    if (otpError) setOtpError('');
                  }}
                  className="h-12 text-lg text-center tracking-widest"
                  maxLength={6}
                />
                {otpError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </Button>

              <div className="flex justify-between items-center text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('mobile')}
                  className="text-gray-600 p-0 h-auto"
                >
                  ← Change Number
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-blue-600 p-0 h-auto"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Demo Note */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-xs text-yellow-800">
              <strong>Demo Mode:</strong> Use OTP "123456" for testing
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileVerification;
