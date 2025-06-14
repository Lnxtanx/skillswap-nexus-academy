
-- Create tutor_sessions table
CREATE TABLE IF NOT EXISTS public.tutor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id TEXT,
  persona_id TEXT NOT NULL,
  replica_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  conversation_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_history table
CREATE TABLE IF NOT EXISTS public.conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.tutor_sessions(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'ai')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_user ON public.tutor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_course ON public.tutor_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_status ON public.tutor_sessions(status);
CREATE INDEX IF NOT EXISTS idx_conversation_history_session ON public.conversation_history(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_timestamp ON public.conversation_history(timestamp);

-- Enable Row Level Security
ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tutor_sessions
CREATE POLICY "Users can view their own tutor sessions" ON public.tutor_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tutor sessions" ON public.tutor_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tutor sessions" ON public.tutor_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tutor sessions" ON public.tutor_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for conversation_history
CREATE POLICY "Users can view their own conversation history" ON public.conversation_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions 
      WHERE tutor_sessions.id = conversation_history.session_id 
      AND tutor_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own conversation history" ON public.conversation_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions 
      WHERE tutor_sessions.id = conversation_history.session_id 
      AND tutor_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own conversation history" ON public.conversation_history
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions 
      WHERE tutor_sessions.id = conversation_history.session_id 
      AND tutor_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own conversation history" ON public.conversation_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions 
      WHERE tutor_sessions.id = conversation_history.session_id 
      AND tutor_sessions.user_id = auth.uid()
    )
  );
