import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import GameCanvas, { GameCanvasRef } from './fruit/GameCanvas';
import { Particle, MouseTrail, GameState } from './fruit/types';
import { COLORS, COLOR_NAMES, DIRECTIONS, LEVELS } from './fruit/constants';
import { createParticle, checkDirectionMatch } from './fruit/gameLogic';
import { speakInstruction } from './fruit/voiceCommands';

interface FruitCuttingGameProps {
  onBack: () => void;
}

const FruitCuttingGame: React.FC<FruitCuttingGameProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<GameCanvasRef>(null);
  const animationRef = useRef<number>();
  
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    isPlaying: false,
    isFullscreen: false,
    score: 0,
    particles: [],
    mouseTrails: [],
    targetColor: '',
    targetColorName: '',
    targetDirection: '',
    timeLeft: 120,
    particlesCut: 0,
    particlesMissed: 0,
    gameStartTime: 0
  });

  const levelConfig = LEVELS[gameState.currentLevel - 1];

  // Generate new target with direction commands
  const generateNewTarget = useCallback(() => {
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    const newColor = COLORS[colorIndex];
    const newColorName = COLOR_NAMES[colorIndex];
    const shouldAddDirection = Math.random() < 0.4;
    const direction = shouldAddDirection ? DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] : '';
    
    setGameState(prev => ({
      ...prev,
      targetColor: newColor,
      targetColorName: newColorName,
      targetDirection: direction
    }));
    
    const instruction = direction 
      ? `Cut ${newColorName} fruits from the ${direction}!`
      : `Cut the ${newColorName} fruits!`;
    
    speakInstruction(instruction);
  }, []);

  // Enhanced game loop with MASSIVE particle generation
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    setGameState(prev => {
      // Update mouse trails
      const updatedTrails = prev.mouseTrails.map(trail => ({
        ...trail,
        life: trail.life - 0.015
      })).filter(trail => trail.life > 0);

      // Update particles with enhanced movement
      const updatedParticles = prev.particles.map(particle => {
        if (!particle.cut) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Minimal gravity for natural movement
          particle.vy += 0.005;
          
          // Strong center attraction to keep particles in play
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 120) {
            particle.vx += (dx / distance) * 0.015;
            particle.vy += (dy / distance) * 0.015;
          }
        }
        return particle;
      }).filter(particle => {
        // Very generous boundaries to keep particles longer
        if (particle.x < -600 || particle.x > canvas.width + 600 || 
            particle.y < -600 || particle.y > canvas.height + 600) {
          if (!particle.cut && particle.color === prev.targetColor && 
              checkDirectionMatch(particle, prev.targetDirection, canvas)) {
            return false; // Will increment missed count
          }
          return false;
        }
        return true;
      });

      // MASSIVE particle generation - maintain very high count
      const targetCount = levelConfig.particleCount * 3; // Triple the base count
      const currentCount = updatedParticles.length;
      const particlesToAdd = Math.max(0, targetCount - currentCount);
      
      // Add particles to reach target count
      for (let i = 0; i < particlesToAdd; i++) {
        updatedParticles.push(createParticle(canvas, levelConfig));
      }

      // Add continuous stream of extra particles for abundance
      const extraParticles = Math.floor(Math.random() * 15) + 10; // 10-24 extra particles per frame
      for (let i = 0; i < extraParticles; i++) {
        if (updatedParticles.length < targetCount * 2) { // Allow up to 2x target count
          updatedParticles.push(createParticle(canvas, levelConfig));
        }
      }

      console.log('Particle count:', updatedParticles.length, 'Target:', targetCount);

      return {
        ...prev,
        particles: updatedParticles,
        mouseTrails: updatedTrails
      };
    });

    if (gameState.isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.isPlaying, levelConfig]);

  // Enhanced mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Enhanced mouse trail generation
    for (let i = 0; i < 8; i++) {
      setGameState(prev => ({
        ...prev,
        mouseTrails: [
          ...prev.mouseTrails.slice(-60),
          {
            x: mouseX + (Math.random() - 0.5) * 20,
            y: mouseY + (Math.random() - 0.5) * 20,
            color: `hsl(${Date.now() % 360}, 100%, 60%)`,
            life: 1.2
          }
        ]
      }));
    }

    if (!gameState.isPlaying) return;

    setGameState(prev => {
      const updatedParticles = prev.particles.map(particle => {
        if (!particle.cut) {
          const distance = Math.sqrt(
            Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2)
          );

          if (distance < particle.size + 35) {
            particle.cut = true;
            
            const isValidTarget = particle.color === prev.targetColor && 
                                checkDirectionMatch(particle, prev.targetDirection, canvas);
            
            if (isValidTarget) {
              // Add explosion effect
              for (let i = 0; i < 50; i++) {
                const explosionTrail = {
                  x: particle.x + (Math.random() - 0.5) * 150,
                  y: particle.y + (Math.random() - 0.5) * 150,
                  color: particle.color,
                  life: 2.0
                };
                prev.mouseTrails.push(explosionTrail);
              }
              
              return {
                ...prev,
                score: prev.score + 10,
                particlesCut: prev.particlesCut + 1,
                particles: updatedParticles
              };
            } else {
              return {
                ...prev,
                score: Math.max(0, prev.score - 3),
                particles: updatedParticles
              };
            }
          }
        }
        return particle;
      });
      
      return {
        ...prev,
        particles: updatedParticles
      };
    });
  }, [gameState.isPlaying, gameState.targetColor, gameState.targetDirection]);

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.isPlaying) {
      endGame();
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Target color change effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.targetColor) {
      const interval = setInterval(() => {
        generateNewTarget();
      }, 6000); // Faster target changes
      return () => clearInterval(interval);
    }
  }, [gameState.isPlaying, generateNewTarget, gameState.targetColor]);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  // Initialize particles when game starts
  useEffect(() => {
    if (gameState.isPlaying && gameState.particles.length === 0) {
      console.log('Initializing massive particle count...');
      const initialParticles = [];
      const canvas = canvasRef.current?.getCanvas();
      if (canvas) {
        const initialCount = levelConfig.particleCount * 2; // Double initial count
        for (let i = 0; i < initialCount; i++) {
          initialParticles.push(createParticle(canvas, levelConfig));
        }
        setGameState(prev => ({ ...prev, particles: initialParticles }));
        console.log('Initialized particles:', initialParticles.length);
      }
    }
  }, [gameState.isPlaying, levelConfig.particleCount]);

  const toggleFullscreen = () => {
    setGameState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const startGame = () => {
    console.log('Starting game with enhanced particle system...');
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      score: 0,
      particlesCut: 0,
      particlesMissed: 0,
      timeLeft: levelConfig.timeLimit,
      gameStartTime: Date.now(),
      particles: [],
      mouseTrails: [],
      isFullscreen: true
    }));
    generateNewTarget();
    speakInstruction(`Level ${gameState.currentLevel} starting! Get ready to cut fruits!`);
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  const endGame = async () => {
    setGameState(prev => ({ ...prev, isPlaying: false, isFullscreen: false }));
    const timeTaken = Math.round((Date.now() - gameState.gameStartTime) / 1000);
    const accuracy = gameState.particlesCut > 0 ? 
      (gameState.particlesCut / (gameState.particlesCut + gameState.particlesMissed)) * 100 : 0;

    if (user) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'fruit',
          level: gameState.currentLevel,
          score: gameState.score,
          accuracy,
          time_taken: timeTaken,
          particles_cut: gameState.particlesCut,
          particles_missed: gameState.particlesMissed
        });

        toast({
          title: "Game Complete!",
          description: `Score: ${gameState.score} | Accuracy: ${accuracy.toFixed(1)}%`,
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }

    speakInstruction(`Game over! Your score is ${gameState.score} points!`);
  };

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      isPlaying: false,
      isFullscreen: false,
      score: 0,
      particles: [],
      mouseTrails: [],
      targetColor: '',
      targetColorName: '',
      targetDirection: '',
      timeLeft: 120,
      particlesCut: 0,
      particlesMissed: 0,
      gameStartTime: 0
    });
  };
  
  const setCurrentLevel = (level: number) => {
    setGameState(prev => ({ ...prev, currentLevel: level }));
  };

  const checkDirectionMatchWrapper = useCallback((particle: Particle) => {
    return checkDirectionMatch(particle, gameState.targetDirection, canvasRef.current?.getCanvas()!);
  }, [gameState.targetDirection]);

  if (gameState.isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="flex items-center space-x-4">
            <Button onClick={() => setGameState(prev => ({ ...prev, isFullscreen: false }))} 
                    className="bg-gray-700 hover:bg-gray-600 text-white">
              <Minimize className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Fruit Cutting Game</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {gameState.targetColor && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: gameState.targetColor }}
                ></div>
                <span className="text-white font-bold">
                  Cut {gameState.targetColorName}{gameState.targetDirection && ` from ${gameState.targetDirection}`}!
                </span>
              </div>
            )}
            <Badge variant="outline" className="text-white">Score: {gameState.score}</Badge>
            <Badge variant="secondary">Time: {gameState.timeLeft}s</Badge>
            <Badge variant="outline" className="text-green-400">Particles: {gameState.particles.length}</Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => setGameState(prev => ({ ...prev, isPlaying: false }))}
              disabled={!gameState.isPlaying}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <GameCanvas
            ref={canvasRef}
            particles={gameState.particles}
            mouseTrails={gameState.mouseTrails}
            targetColor={gameState.targetColor}
            targetDirection={gameState.targetDirection}
            isFullscreen={gameState.isFullscreen}
            onMouseMove={handleMouseMove}
            checkDirectionMatch={checkDirectionMatchWrapper}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} className="bg-gray-800 hover:bg-gray-700 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>
        <h1 className="text-2xl font-bold gradient-text">Fruit Cutting Game</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Level {gameState.currentLevel}</Badge>
          <Badge variant="outline" className="text-white">Score: {gameState.score}</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm">Game Area</span>
                <Button
                  onClick={toggleFullscreen}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
              <GameCanvas
                ref={canvasRef}
                particles={gameState.particles}
                mouseTrails={gameState.mouseTrails}
                targetColor={gameState.targetColor}
                targetDirection={gameState.targetDirection}
                isFullscreen={gameState.isFullscreen}
                onMouseMove={handleMouseMove}
                checkDirectionMatch={checkDirectionMatchWrapper}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={startGame}
                  disabled={gameState.isPlaying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
                <Button
                  onClick={pauseGame}
                  disabled={!gameState.isPlaying}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button
                  onClick={resetGame}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Current Target</CardTitle>
            </CardHeader>
            <CardContent>
              {gameState.targetColor && (
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white shadow-lg"
                    style={{ backgroundColor: gameState.targetColor }}
                  ></div>
                  <p className="text-white font-bold">
                    Cut {gameState.targetColorName} fruits{gameState.targetDirection && ` from ${gameState.targetDirection}`}!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">{gameState.timeLeft}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Particles:</span>
                <span className="text-blue-400">{gameState.particles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cut:</span>
                <span className="text-green-400">{gameState.particlesCut}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Missed:</span>
                <span className="text-red-400">{gameState.particlesMissed}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Level Select</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((level) => (
                  <Button
                    key={level.level}
                    size="sm"
                    onClick={() => setCurrentLevel(level.level)}
                    disabled={gameState.isPlaying}
                    className={`${gameState.currentLevel === level.level 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    {level.level}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FruitCuttingGame;
