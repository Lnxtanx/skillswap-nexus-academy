
-- Create game_scores table to store user game performance
CREATE TABLE public.game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  game_type TEXT NOT NULL, -- 'fruit' or 'code'
  level INTEGER NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00, -- percentage
  time_taken INTEGER NOT NULL DEFAULT 0, -- in seconds
  particles_cut INTEGER NOT NULL DEFAULT 0,
  particles_missed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for game scores
CREATE POLICY "Users can view their own game scores" 
  ON public.game_scores 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game scores" 
  ON public.game_scores 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game scores" 
  ON public.game_scores 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_game_scores
  BEFORE UPDATE ON public.game_scores
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_game_scores_user_id ON public.game_scores(user_id);
CREATE INDEX idx_game_scores_level ON public.game_scores(level);
CREATE INDEX idx_game_scores_game_type ON public.game_scores(game_type);
