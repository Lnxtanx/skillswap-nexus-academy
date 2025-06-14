
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Target, Code, Apple } from 'lucide-react';
import FruitCuttingGame from '@/components/games/FruitCuttingGame';
import CodeCuttingGame from '@/components/games/CodeCuttingGame';
import GameStats from '@/components/games/GameStats';

const Play: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'fruit' | 'code' | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleGameSelect = (gameType: 'fruit' | 'code') => {
    setSelectedGame(gameType);
    setShowStats(false);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
    setShowStats(false);
  };

  const handleShowStats = () => {
    setShowStats(true);
    setSelectedGame(null);
  };

  if (showStats) {
    return <GameStats onBack={handleBackToMenu} />;
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-black pt-20">
        {selectedGame === 'fruit' ? (
          <FruitCuttingGame onBack={handleBackToMenu} />
        ) : (
          <CodeCuttingGame onBack={handleBackToMenu} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Game Arena
          </h1>
          <p className="text-gray-400 text-lg">
            Test your reflexes and skills with our interactive games
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Fruit Cutting Game */}
          <Card className="bg-gray-900 border-gray-800 hover:border-orange-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Apple className="mr-2 h-6 w-6 text-orange-500" />
                Fruit Ninja Style
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg flex items-center justify-center">
                <Apple className="h-16 w-16 text-orange-400" />
              </div>
              <p className="text-gray-400">
                Cut flying fruits and colorful particles with mouse movements. 
                Follow AI voice commands to target specific colors and earn points!
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">5 Levels</Badge>
                <Badge variant="secondary">Voice Commands</Badge>
                <Badge variant="secondary">Color Targeting</Badge>
              </div>
              <Button 
                onClick={() => handleGameSelect('fruit')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Start Fruit Game
              </Button>
            </CardContent>
          </Card>

          {/* Code Cutting Game */}
          <Card className="bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="mr-2 h-6 w-6 text-blue-500" />
                Code Slice Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center">
                <Code className="h-16 w-16 text-blue-400" />
              </div>
              <p className="text-gray-400">
                Slice through flying code snippets and programming elements. 
                AI will guide you to cut specific code patterns and syntax!
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">5 Levels</Badge>
                <Badge variant="secondary">Code Patterns</Badge>
                <Badge variant="secondary">Programming Practice</Badge>
              </div>
              <Button 
                onClick={() => handleGameSelect('code')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Start Code Game
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Button */}
        <div className="text-center mt-8">
          <Button 
            onClick={handleShowStats}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Trophy className="mr-2 h-4 w-4" />
            View Game Statistics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Play;
