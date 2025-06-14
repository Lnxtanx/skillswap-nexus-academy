
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GameScore {
  id: string;
  game_type: string;
  level: number;
  score: number;
  accuracy: number;
  time_taken: number;
  particles_cut: number;
  particles_missed: number;
  created_at: string;
}

interface GameStatsProps {
  onBack: () => void;
}

const GameStats: React.FC<GameStatsProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGameType, setSelectedGameType] = useState<'fruit' | 'code' | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadScores();
    }
  }, [user, selectedGameType]);

  const loadScores = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (selectedGameType !== 'all') {
        query = query.eq('game_type', selectedGameType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGameTypeStats = (gameType: string) => {
    const gameScores = scores.filter(score => score.game_type === gameType);
    if (gameScores.length === 0) return null;

    const totalScore = gameScores.reduce((sum, score) => sum + score.score, 0);
    const avgAccuracy = gameScores.reduce((sum, score) => sum + score.accuracy, 0) / gameScores.length;
    const bestScore = Math.max(...gameScores.map(score => score.score));
    const totalGames = gameScores.length;

    return {
      totalScore,
      avgAccuracy,
      bestScore,
      totalGames
    };
  };

  const fruitStats = getGameTypeStats('fruit');
  const codeStats = getGameTypeStats('code');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} className="bg-gray-800 hover:bg-gray-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Game Statistics</h1>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => setSelectedGameType('all')}
              className={`${selectedGameType === 'all' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              All
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedGameType('fruit')}
              className={`${selectedGameType === 'fruit' ? 'bg-orange-600' : 'bg-gray-700'} text-white`}
            >
              Fruit
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedGameType('code')}
              className={`${selectedGameType === 'code' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              Code
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {fruitStats && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-orange-500" />
                  Fruit Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400">{fruitStats.bestScore}</p>
                    <p className="text-sm text-gray-400">Best Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{fruitStats.avgAccuracy.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">Avg Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{fruitStats.totalScore}</p>
                    <p className="text-sm text-gray-400">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{fruitStats.totalGames}</p>
                    <p className="text-sm text-gray-400">Games Played</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {codeStats && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-blue-500" />
                  Code Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{codeStats.bestScore}</p>
                    <p className="text-sm text-gray-400">Best Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{codeStats.avgAccuracy.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">Avg Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{codeStats.totalScore}</p>
                    <p className="text-sm text-gray-400">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400">{codeStats.totalGames}</p>
                    <p className="text-sm text-gray-400">Games Played</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Games */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Recent Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No games played yet. Start playing to see your statistics!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scores.slice(0, 10).map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Badge className={`${score.game_type === 'fruit' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>
                        {score.game_type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-white">
                        Level {score.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span className="text-white">{score.score}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-white">{score.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{score.time_taken}s</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">
                      {new Date(score.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameStats;
