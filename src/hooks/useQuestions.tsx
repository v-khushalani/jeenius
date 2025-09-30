import { useState, useEffect } from 'react';
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

// Mock questions data
const mockQuestions: Question[] = [
  {
    id: '1',
    question_text: 'What is the derivative of x²?',
    options: { A: '2x', B: 'x²', C: '2', D: 'x' },
    correct_option: 'A',
    explanation: 'The derivative of x² is 2x using the power rule.',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty_level: 1,
    chapter: 'Derivatives'
  },
  {
    id: '2',
    question_text: 'What is the formula for kinetic energy?',
    options: { A: 'mgh', B: '½mv²', C: 'mc²', D: 'F = ma' },
    correct_option: 'B',
    explanation: 'Kinetic energy is given by KE = ½mv² where m is mass and v is velocity.',
    subject: 'Physics',
    topic: 'Mechanics',
    difficulty_level: 1,
    chapter: 'Energy'
  },
  {
    id: '3',
    question_text: 'What is the molecular formula of benzene?',
    options: { A: 'C₆H₆', B: 'C₆H₁₂', C: 'C₈H₈', D: 'C₅H₅' },
    correct_option: 'A',
    explanation: 'Benzene has the molecular formula C₆H₆ with a ring structure.',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    difficulty_level: 2,
    chapter: 'Aromatic Compounds'
  },
  {
    id: '4',
    question_text: 'What is the limit of sin(x)/x as x approaches 0?',
    options: { A: '0', B: '1', C: '∞', D: 'undefined' },
    correct_option: 'B',
    explanation: 'This is a standard limit: lim(x→0) sin(x)/x = 1.',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty_level: 3,
    chapter: 'Limits'
  },
  {
    id: '5',
    question_text: 'What is the SI unit of electric current?',
    options: { A: 'Volt', B: 'Ohm', C: 'Ampere', D: 'Watt' },
    correct_option: 'C',
    explanation: 'The SI unit of electric current is Ampere (A).',
    subject: 'Physics',
    topic: 'Electricity',
    difficulty_level: 1,
    chapter: 'Current Electricity'
  }
];

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

      let filteredQuestions = [...mockQuestions];

      // Apply filters
      if (filters?.subject) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.subject.toLowerCase() === filters.subject!.toLowerCase()
        );
      }

      if (filters?.topic) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.topic.toLowerCase() === filters.topic!.toLowerCase()
        );
      }

      if (filters?.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.difficulty_level === filters.difficulty
        );
      }

      // Apply limit
      if (filters?.limit) {
        filteredQuestions = filteredQuestions.slice(0, filters.limit);
      }

      // Correct answers are hidden by RLS - they'll be null from the database
      setQuestions(filteredQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const getRandomQuestions = async (
    subject?: string | null, 
    topic?: string | null, 
    difficulty?: number | null, 
    count: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);

      let filteredQuestions = [...mockQuestions];

      // Apply filters
      if (subject) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.subject.toLowerCase() === subject.toLowerCase()
        );
      }

      if (topic) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.topic.toLowerCase() === topic.toLowerCase()
        );
      }

      if (difficulty) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.difficulty_level === difficulty
        );
      }

      // Shuffle and take count
      const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);

      // Correct answers are hidden by RLS - they'll be null from the database
      setQuestions(selected);
      return selected;
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
  ): Promise<{ isCorrect: boolean; correctAnswer: string; explanation?: string }> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    try {
      // Use secure server-side validation function
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.rpc('validate_question_answer', {
        p_question_id: questionId,
        p_selected_answer: selectedAnswer,
        p_time_taken: timeSpent || 0
      });

      if (error) {
        console.error('Error validating answer:', error);
        throw new Error('Failed to validate answer');
      }

      // Type cast the response data
      const result = data as {
        attempt_id: string;
        is_correct: boolean;
        correct_option: string;
        explanation: string;
      };

      return { 
        isCorrect: result.is_correct,
        correctAnswer: result.correct_option,
        explanation: result.explanation
      };
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