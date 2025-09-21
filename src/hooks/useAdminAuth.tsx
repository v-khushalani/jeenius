import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// Removed Supabase - using mock admin check

export const useAdminAuth = () => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock admin check - for demo, make any authenticated user an admin
    if (!isAuthenticated || !user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // For demo purposes, any authenticated user is considered admin
    setIsAdmin(true);
    setLoading(false);
  }, [user, isAuthenticated]);

  return { isAdmin, loading };
};
