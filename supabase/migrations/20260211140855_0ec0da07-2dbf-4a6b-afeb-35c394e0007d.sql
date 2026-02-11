
-- Quiz sessions table (no auth required - frictionless experience)
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code TEXT UNIQUE NOT NULL,
  
  partner_a_name TEXT NOT NULL,
  partner_a_gender TEXT NOT NULL DEFAULT 'male',
  partner_b_name TEXT NOT NULL,
  partner_b_gender TEXT NOT NULL DEFAULT 'female',
  
  relationship_status TEXT NOT NULL DEFAULT 'dating',
  
  partner_a_answers JSONB,
  partner_b_answers JSONB,
  
  ai_result JSONB,
  
  partner_a_score INTEGER,
  partner_b_score INTEGER,
  
  status TEXT NOT NULL DEFAULT 'partner_a_in_progress',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  partner_a_completed_at TIMESTAMPTZ,
  partner_b_completed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone with the share code can view)
CREATE POLICY "Anyone can read quiz sessions"
ON public.quiz_sessions
FOR SELECT
USING (true);

-- Public insert (no auth required for frictionless experience)
CREATE POLICY "Anyone can create quiz sessions"
ON public.quiz_sessions
FOR INSERT
WITH CHECK (true);

-- Public update (needed for partner B to submit answers)
CREATE POLICY "Anyone can update quiz sessions"
ON public.quiz_sessions
FOR UPDATE
USING (true);

-- Indexes
CREATE INDEX idx_quiz_sessions_share_code ON public.quiz_sessions(share_code);
CREATE INDEX idx_quiz_sessions_created ON public.quiz_sessions(created_at DESC);

-- Enable realtime for waiting screen
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_sessions;
