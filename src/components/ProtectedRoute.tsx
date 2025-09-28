// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMobileVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireMobileVerification = true 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking auth status
  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For now, skip mobile verification requirement since we removed profile from context
  // TODO: Add mobile verification logic later if needed

  return <>{children}</>;
};

export default ProtectedRoute;
