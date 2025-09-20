// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMobileVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireMobileVerification = true 
}) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If mobile verification is required and user hasn't verified mobile
  if (requireMobileVerification && (!profile?.mobile || !profile?.mobile_verified)) {
    // Don't redirect if already on mobile verification page
    if (location.pathname !== '/verify-mobile') {
      return <Navigate to="/verify-mobile" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
