import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TestSeries {
  id: string;
  title: string;
  description: string;
  test_type: string;
  total_questions: number;
  duration_minutes: number;
  max_marks: number;
  scheduled_date: string;
  registration_deadline: string;
  is_active: boolean;
  created_at: string;
}

export interface TestAttempt {
  id: string;
  test_series_id: string;
  user_id: string;
  score: number;
  max_score: number;
  percentage: number;
  percentile: number | null;
  time_taken_minutes: number | null;
  started_at: string;
  submitted_at: string;
  all_india_rank: number | null;
  state_rank: number | null;
}

export interface TestRegistration {
  id: string;
  user_id: string;
  test_series_id: string;
  registered_at: string;
}

export const useTestSeries = () => {
  const { user, isAuthenticated } = useAuth();
  const [tests, setTests] = useState<TestSeries[]>([]);
  const [userAttempts, setUserAttempts] = useState<TestAttempt[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<TestRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
    if (isAuthenticated && user) {
      fetchUserAttempts();
      fetchUserRegistrations();
    }
  }, [isAuthenticated, user]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_series')
        .select('*')
        .eq('is_active', true)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setTests(data || []);
    } catch (err) {
      console.error('Error fetching test series:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_test_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setUserAttempts(data || []);
    } catch (err) {
      console.error('Error fetching user attempts:', err);
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_test_registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching user registrations:', err);
    }
  };

  const registerForTest = async (testId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('user_test_registrations')
        .insert({
          user_id: user.id,
          test_series_id: testId
        });

      if (error) throw error;
      
      // Refresh registrations
      await fetchUserRegistrations();
    } catch (err) {
      console.error('Error registering for test:', err);
      throw err;
    }
  };

  return {
    tests,
    userAttempts,
    userRegistrations,
    loading,
    error,
    registerForTest,
    refetch: () => {
      fetchTests();
      if (isAuthenticated && user) {
        fetchUserAttempts();
        fetchUserRegistrations();
      }
    }
  };
};