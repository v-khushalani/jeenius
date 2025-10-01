-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Users can view questions without answers" ON public.questions;

-- Create a secure view that excludes correct answers and explanations
CREATE OR REPLACE VIEW public.questions_public AS
SELECT 
  id,
  question,
  option_a,
  option_b,
  option_c,
  option_d,
  subject,
  chapter,
  topic,
  difficulty,
  year,
  created_at
FROM public.questions;

-- Grant SELECT permission on the view to authenticated users
GRANT SELECT ON public.questions_public TO authenticated;
GRANT SELECT ON public.questions_public TO anon;

-- Add restrictive RLS policy on questions table (deny direct access to sensitive columns)
CREATE POLICY "Questions table is not directly accessible"
ON public.questions
FOR SELECT
TO authenticated
USING (false);

-- Add comment explaining the security model
COMMENT ON VIEW public.questions_public IS 'Public view of questions that excludes correct_option and explanation. Answer validation must go through validate_question_answer() function.';