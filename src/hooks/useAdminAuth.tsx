import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role in profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          // For demo, make admin based on email domain or specific emails
          const adminEmails = ['admin@jeenius.com', 'developer@jeenius.com'];
          const isAdminUser = adminEmails.includes(profile?.email || '') || 
                            (profile?.email || '').endsWith('@jeenius.com');
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, isAuthenticated]);

  return { isAdmin, loading };
};
