import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TestGenerationParams {
  testType: 'subject' | 'chapter' | 'mock' | 'practice';
  subject?: string;
  chapter?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  duration: number;
  title: string;
  description?: string;
}

interface TestGenerationResult {
  success: boolean;
  testSeries?: any;
  aiAnalysis?: {
    reasoning: string;
    difficultyDistribution: Record<string, number>;
    topicDistribution: Record<string, number>;
    selectedQuestions: number;
  };
  error?: string;
}

export const useTestGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const generateTest = async (params: TestGenerationParams): Promise<TestGenerationResult> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to generate tests');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-test', {
        body: params
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate test');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate test';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSubjects = async () => {
    try {
      // Use secure function instead of direct table access
      const { data, error } = await supabase.rpc('get_questions_for_test', {
        question_count: 1000  // Large number to get all subjects
      });

      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }

      // Get unique subjects
      const uniqueSubjects = [...new Set((data || []).map((item: any) => item.subject))];
      return uniqueSubjects.filter(Boolean);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      return [];
    }
  };

  const getAvailableChapters = async (subject?: string) => {
    try {
      // Use secure function instead of direct table access
      const { data, error } = await supabase.rpc('get_questions_for_test', {
        subject_filter: subject || null,
        question_count: 1000  // Large number to get all topics
      });

      if (error) {
        console.error('Error fetching chapters:', error);
        return [];
      }

      // Filter by subject if provided
      const filtered = subject 
        ? (data || []).filter((item: any) => item.subject === subject)
        : (data || []);

      // Get unique topics with their subjects
      const chapters = filtered.map((item: any) => ({
        chapter: item.topic, // Using topic as chapter
        subject: item.subject
      }));

      // Remove duplicates
      return chapters.filter((item: any, index: number, self: any[]) =>
        index === self.findIndex(t => t.chapter === item.chapter && t.subject === item.subject)
      );
    } catch (err) {
      console.error('Error fetching chapters:', err);
      return [];
    }
  };

  const getQuestionCount = async (subject?: string, chapter?: string) => {
    try {
      // Use secure function to get count
      const { data, error } = await supabase.rpc('get_questions_for_test', {
        subject_filter: subject || null,
        topic_filter: chapter || null,
        question_count: 10000  // Large number to get accurate count
      });

      if (error) {
        console.error('Error getting question count:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (err) {
      console.error('Error getting question count:', err);
      return 0;
    }
  };

  return {
    generateTest,
    getAvailableSubjects,
    getAvailableChapters,
    getQuestionCount,
    loading,
    error
  };
};