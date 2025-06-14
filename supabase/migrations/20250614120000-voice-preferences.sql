
-- Create user voice preferences table
CREATE TABLE IF NOT EXISTS public.user_voice_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_persona TEXT NOT NULL DEFAULT 'code-master',
  selected_language TEXT NOT NULL DEFAULT 'en',
  speech_speed DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  volume DECIMAL(3,1) NOT NULL DEFAULT 0.7,
  noise_cancellation BOOLEAN NOT NULL DEFAULT true,
  accessibility_mode BOOLEAN NOT NULL DEFAULT false,
  auto_play BOOLEAN NOT NULL DEFAULT false,
  hands_free_mode BOOLEAN NOT NULL DEFAULT false,
  preferred_voice_id TEXT NOT NULL DEFAULT 'N2lVS1w4EtoT3dr4eOWO',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Create RLS policies
ALTER TABLE public.user_voice_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own voice preferences"
  ON public.user_voice_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own voice preferences"
  ON public.user_voice_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice preferences"
  ON public.user_voice_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice preferences"
  ON public.user_voice_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_voice_preferences_updated_at
  BEFORE UPDATE ON public.user_voice_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
