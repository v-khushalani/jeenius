import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Question {
  id: string;
  question_text: string;
  options: any;
  correct_option: string;
  explanation: string;
  subject: string;
  topic: string;
  difficulty_level: number;
  chapter: string;
}

export interface QuestionAttempt {
  id: string;
  question_id: string;
  user_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_taken_seconds: number;
  attempted_at: string;
}

export const useQuestions = (filters?: {
  subject?: string;
  topic?: string;
  difficulty?: number;
  limit?: number;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const difficultyString = filters?.difficulty === 1 ? 'easy' : filters?.difficulty === 2 ? 'medium' : filters?.difficulty === 3 ? 'hard' : null;

      // Use secure function that doesn't expose answers
      const { data, error } = await supabase.rpc('get_practice_questions', {
        subject_filter: filters?.subject || null,
        topic_filter: filters?.topic || null,
        difficulty_filter: difficultyString,
        question_count: filters?.limit || 10
      });

      if (error) throw error;

      // Transform data to match our interface
      const transformedQuestions: Question[] = (data || []).map((q: any) => ({
        id: q.id,
        question_text: q.question,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },
        correct_option: '', // Not exposed for security
        explanation: '', // Not exposed for security
        subject: q.subject,
        topic: q.topic,
        difficulty_level: q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3,
        chapter: q.chapter
      }));

      setQuestions(transformedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const getRandomQuestions = async (subject?: string | null, topic?: string | null, difficulty?: number | null, count: number = 10) => {
    try {
      setLoading(true);
      setError(null);

      const difficultyString = difficulty === 1 ? 'easy' : difficulty === 2 ? 'medium' : difficulty === 3 ? 'hard' : null;

      // Use secure function that doesn't expose answers
      const { data, error } = await supabase.rpc('get_practice_questions', {
        subject_filter: subject,
        topic_filter: topic,
        difficulty_filter: difficultyString,
        question_count: count
      });

      if (error) throw error;

      // Transform data to match our interface
      const transformedQuestions: Question[] = (data || []).map((q: any) => ({
        id: q.id,
        question_text: q.question,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },
        correct_option: '', // Not exposed for security
        explanation: '', // Not exposed for security
        subject: q.subject,
        topic: q.topic,
        difficulty_level: q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3,
        chapter: q.chapter
      }));

      setQuestions(transformedQuestions);
      return transformedQuestions;
    } catch (err) {
      console.error('Error fetching random questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (
    questionId: string,
    selectedAnswer: string,
    timeSpent?: number
  ): Promise<{ isCorrect: boolean; correctAnswer: string }> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    try {
      // Use secure function to check answer and get explanation
      const { data: answerData, error: answerError } = await supabase.rpc('check_question_answer', {
        question_id: questionId,
        user_answer: selectedAnswer
      });

      if (answerError) throw answerError;

      const result = Array.isArray(answerData) ? answerData[0] : answerData;
      if (!result) {
        throw new Error('No answer result returned');
      }
      const isCorrect = result.is_correct;
      const correctAnswer = result.correct_answer;
      // Record the attempt in question_attempts table
      const { error: attemptError } = await supabase
        .from('question_attempts')
        .insert({
          user_id: user.id,
          question_id: questionId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          time_taken_seconds: timeSpent || 0
        });

      if (attemptError) {
        console.error('Error recording attempt:', attemptError);
      }

      return { isCorrect, correctAnswer };
    } catch (err) {
      console.error('Error submitting answer:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (filters) {
      fetchQuestions();
    }
  }, [filters?.subject, filters?.topic, filters?.difficulty, filters?.limit]);

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    getRandomQuestions,
    submitAnswer,
    refetch: fetchQuestions
  };
};