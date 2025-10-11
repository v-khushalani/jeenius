// Replace the getRandomQuestions function in useQuestions.tsx with this:

const getRandomQuestions = async (
  subject?: string | null, 
  topic?: string | null, 
  difficulty?: number | null, 
  count: number = 10
) => {
  try {
    setLoading(true);
    setError(null);

    const { supabase } = await import('@/integrations/supabase/client');
    
    // Get already attempted question IDs
    if (isAuthenticated && user) {
      const { data: attemptedQuestions } = await supabase
        .from('question_attempts')
        .select('question_id')
        .eq('user_id', user.id);
      
      const attemptedIds = attemptedQuestions?.map(a => a.question_id) || [];
      
      let query = supabase
        .from('questions')
        .select('*');

      // Apply filters
      if (subject) {
        query = query.eq('subject', subject);
      }

      if (topic) {
        query = query.eq('topic', topic);
      }

      if (difficulty) {
        const difficultyMap = { 1: 'easy', 2: 'medium', 3: 'hard' };
        query = query.eq('difficulty', difficultyMap[difficulty as keyof typeof difficultyMap]);
      }

      // Exclude already attempted questions
      if (attemptedIds.length > 0) {
        query = query.not('id', 'in', `(${attemptedIds.join(',')})`);
      }

      // Fetch more than needed for random selection
      query = query.limit(count * 3);

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      if (!data || data.length === 0) {
        setError('No new questions available. All questions attempted!');
        return [];
      }

      // Map and shuffle
      const mappedQuestions: Question[] = (data || []).map(q => ({
        id: q.id,
        question_text: q.question,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },
        correct_option: '', // Hidden by RLS
        explanation: '', // Hidden by RLS
        subject: q.subject,
        topic: q.topic,
        difficulty_level: q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3,
        chapter: q.chapter
      }));

      // Shuffle and take count
      const shuffled = mappedQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));

      setQuestions(selected);
      return selected;
    }
    
    return [];
  } catch (err) {
    console.error('Error fetching random questions:', err);
    setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    return [];
  } finally {
    setLoading(false);
  }
};
