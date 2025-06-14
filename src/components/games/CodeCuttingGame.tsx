import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CodeParticle, MouseTrail, CodeGameState } from './code/types';
import { CODE_SNIPPETS, CATEGORIES, DIRECTIONS, LEVELS } from './code/constants';
import { speakInstruction } from './fruit/voiceCommands';

interface CodeCuttingGameProps {
  onBack: () => void;
}

const CodeCuttingGame: React.FC<CodeCuttingGameProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [gameState, setGameState] = useState<CodeGameState>({
    currentLevel: 1,
    isPlaying: false,
    isFullscreen: false,
    score: 0,
    particles: [],
    mouseTrails: [],
    targetCategory: '',
    targetDirection: '',
    timeLeft: 120,
    particlesCut: 0,
    particlesMissed: 0,
    gameStartTime: 0
  });

  const levelConfig = LEVELS[gameState.currentLevel - 1];

  // Create new code particle with improved movement towards center
  const createCodeParticle = useCallback((): CodeParticle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as CodeParticle;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    // Enhanced spawn system
    switch (side) {
      case 0: // top
        x = Math.random() * canvas.width;
        y = -100;
        vx = (centerX - x) * 0.001 + (Math.random() - 0.5) * 0.4;
        vy = Math.random() * 0.7 + 1.2;
        break;
      case 1: // right
        x = canvas.width + 100;
        y = Math.random() * canvas.height;
        vx = -(Math.random() * 0.7 + 1.2);
        vy = (centerY - y) * 0.001 + (Math.random() - 0.5) * 0.4;
        break;
      case 2: // bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 100;
        vx = (centerX - x) * 0.001 + (Math.random() - 0.5) * 0.4;
        vy = -(Math.random() * 0.7 + 1.2);
        break;
      default: // left
        x = -100;
        y = Math.random() * canvas.height;
        vx = Math.random() * 0.7 + 1.2;
        vy = (centerY - y) * 0.001 + (Math.random() - 0.5) * 0.4;
    }

    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const codeSnippets = CODE_SNIPPETS[category];
    const code = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      vx: vx * levelConfig.speed,
      vy: vy * levelConfig.speed,
      code,
      category,
      size: 70,
      cut: false
    };
  }, [levelConfig.speed]);

  // Check if particle matches direction requirement
  const checkDirectionMatch = useCallback((particle: CodeParticle) => {
    if (!gameState.targetDirection) return true;
    
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (gameState.targetDirection) {
      case 'left':
        return particle.x < centerX;
      case 'right':
        return particle.x > centerX;
      case 'top':
        return particle.y < centerY;
      case 'bottom':
        return particle.y > centerY;
      default:
        return true;
    }
  }, [gameState.targetDirection]);

  // Enhanced game loop with MASSIVE particle generation
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setGameState(prev => {
      // Update mouse trails
      const updatedTrails = prev.mouseTrails.map(trail => ({
        ...trail,
        life: trail.life - 0.015
      })).filter(trail => trail.life > 0);

      // Enhanced trail rendering
      updatedTrails.forEach((trail) => {
        ctx.globalAlpha = trail.life;
        
        for (let i = 0; i < 4; i++) {
          const offset = i * 4;
          const size = (10 - i * 2) * trail.life;
          const hue = (Date.now() * 0.1 + offset + 180) % 360;
          ctx.fillStyle = `hsl(${hue}, 100%, ${70 + i * 5}%)`;
          ctx.beginPath();
          ctx.arc(
            trail.x + Math.sin(Date.now() * 0.01 + offset) * 3, 
            trail.y + Math.cos(Date.now() * 0.01 + offset) * 3, 
            size, 0, 2 * Math.PI
          );
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      // Update particles with enhanced movement
      const updatedParticles = prev.particles.map(particle => {
        if (!particle.cut) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Minimal gravity
          particle.vy += 0.008;
          
          // Strong center attraction
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 120) {
            particle.vx += (dx / distance) * 0.025;
            particle.vy += (dy / distance) * 0.025;
          }
        }

        // Enhanced rendering for code particles
        const isTarget = particle.category === prev.targetCategory;
        const isDirectionMatch = checkDirectionMatch(particle);
        const isValidTarget = isTarget && isDirectionMatch;
        
        if (isValidTarget && !particle.cut) {
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 30;
          
          const pulseSize = Math.sin(Date.now() * 0.01) * 10 + 15;
          ctx.fillStyle = '#00ff0040';
          ctx.fillRect(particle.x - particle.size - pulseSize, particle.y - 20 - pulseSize/2, 
                      particle.size * 2 + pulseSize*2, 40 + pulseSize);
        }
        
        // Background
        ctx.fillStyle = particle.cut ? '#333' : (isValidTarget ? '#0066cc' : '#4a5568');
        ctx.fillRect(particle.x - particle.size, particle.y - 15, particle.size * 2, 30);
        
        // Border with enhanced glow for target
        ctx.strokeStyle = isValidTarget ? '#00ff00' : '#9ca3af';
        ctx.lineWidth = isValidTarget ? 6 : 1;
        ctx.strokeRect(particle.x - particle.size, particle.y - 15, particle.size * 2, 30);
        
        // Text
        ctx.fillStyle = particle.cut ? '#666' : '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(particle.code, particle.x, particle.y + 3);
        
        ctx.shadowBlur = 0;

        return particle;
      }).filter(particle => {
        // Very generous boundaries
        if (particle.x < -500 || particle.x > canvas.width + 500 || 
            particle.y < -500 || particle.y > canvas.height + 500) {
          if (!particle.cut && particle.category === prev.targetCategory && checkDirectionMatch(particle)) {
            return false; // Will increment missed count
          }
          return false;
        }
        return true;
      });

      // MASSIVE particle generation - maintain very high count
      const targetCount = levelConfig.particleCount;
      const currentCount = updatedParticles.length;
      const particlesToAdd = Math.max(0, targetCount - currentCount);
      
      // Add particles to reach target count
      for (let i = 0; i < particlesToAdd; i++) {
        updatedParticles.push(createCodeParticle());
      }

      // Add continuous stream of extra particles for abundance
      const extraParticles = Math.floor(Math.random() * 10) + 6; // 6-15 extra particles per frame
      for (let i = 0; i < extraParticles; i++) {
        if (updatedParticles.length < targetCount * 2.5) { // Allow up to 2.5x target count
          updatedParticles.push(createCodeParticle());
        }
      }

      console.log('Code particle count:', updatedParticles.length, 'Target:', targetCount);

      return {
        ...prev,
        particles: updatedParticles,
        mouseTrails: updatedTrails
      };
    });

    if (gameState.isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.isPlaying, levelConfig, createCodeParticle, checkDirectionMatch]);

  // Generate new target
  const generateNewTarget = useCallback(() => {
    const newCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const shouldAddDirection = Math.random() < 0.4;
    const direction = shouldAddDirection ? DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] : '';
    
    setGameState(prev => ({
      ...prev,
      targetCategory: newCategory,
      targetDirection: direction
    }));
    
    const instruction = direction 
      ? `Cut ${newCategory} code from the ${direction}!`
      : `Cut all ${newCategory} code snippets!`;
    
    speakInstruction(instruction);
  }, []);

  // Enhanced mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Enhanced mouse trail generation
    for (let i = 0; i < 6; i++) {
      setGameState(prev => ({
        ...prev,
        mouseTrails: [
          ...prev.mouseTrails.slice(-50),
          {
            x: mouseX + (Math.random() - 0.5) * 15,
            y: mouseY + (Math.random() - 0.5) * 15,
            color: `hsl(${(Date.now() + 180) % 360}, 100%, 60%)`,
            life: 1.0
          }
        ]
      }));
    }

    if (!gameState.isPlaying) return;

    setGameState(prev => ({
      ...prev,
      particles: prev.particles.map(particle => {
        if (!particle.cut) {
          const distance = Math.sqrt(
            Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2)
          );

          if (distance < particle.size + 30) {
            particle.cut = true;
            
            const isValidTarget = particle.category === prev.targetCategory && checkDirectionMatch(particle);
            
            if (isValidTarget) {
              // Add explosion effect
              for (let i = 0; i < 50; i++) {
                const explosionTrail = {
                  x: particle.x + (Math.random() - 0.5) * 150,
                  y: particle.y + (Math.random() - 0.5) * 150,
                  color: '#00ff00',
                  life: 1.8
                };
                prev.mouseTrails.push(explosionTrail);
              }
              
              return {
                ...prev,
                score: prev.score + 15,
                particlesCut: prev.particlesCut + 1
              };
            } else {
              return {
                ...prev,
                score: Math.max(0, prev.score - 3)
              };
            }
          }
        }
        return prev;
      })
    }));
  }, [gameState.isPlaying, checkDirectionMatch]);

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.isPlaying) {
      endGame();
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Target category change effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.targetCategory) {
      const interval = setInterval(() => {
        generateNewTarget();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [gameState.isPlaying, generateNewTarget, gameState.targetCategory]);

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
      console.log('Initializing code particles...');
      const initialParticles = [];
      for (let i = 0; i < levelConfig.particleCount; i++) {
        initialParticles.push(createCodeParticle());
      }
      setGameState(prev => ({
        ...prev,
        particles: initialParticles
      }));
      console.log('Initialized code particles:', initialParticles.length);
    }
  }, [gameState.isPlaying, levelConfig.particleCount, createCodeParticle]);

  const toggleFullscreen = () => {
    setGameState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen
    }));
  };

  const startGame = () => {
    console.log('Starting code cutting game with massive particle count...');
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
    speakInstruction(`Level ${gameState.currentLevel} starting! Get ready to slice code!`);
  };

  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const endGame = async () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isFullscreen: false
    }));
    const timeTaken = Math.round((Date.now() - prev.gameStartTime) / 1000);
    const accuracy = gameState.particlesCut > 0 ? (gameState.particlesCut / (gameState.particlesCut + gameState.particlesMissed)) * 100 : 0;

    if (user) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'code',
          level: gameState.currentLevel,
          score,
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

    speakInstruction(`Coding challenge complete! Your score is ${gameState.score} points with ${accuracy.toFixed(1)} percent accuracy!`);
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isFullscreen: false,
      score: 0,
      particlesCut: 0,
      particlesMissed: 0,
      timeLeft: levelConfig.timeLimit,
      particles: [],
      mouseTrails: [],
      targetCategory: '',
      targetDirection: ''
    }));
  };

  if (gameState.isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="flex items-center space-x-4">
            <Button onClick={toggleFullscreen} className="bg-gray-700 hover:bg-gray-600 text-white">
              <Minimize className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Code Cutting Game</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {gameState.targetCategory && (
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-600 text-white">
                  {gameState.targetCategory}
                </Badge>
                <span className="text-white font-bold">
                  Cut {gameState.targetCategory}{gameState.targetDirection && ` from ${gameState.targetDirection}`}!
                </span>
              </div>
            )}
            <Badge variant="outline" className="text-white">Score: {gameState.score}</Badge>
            <Badge variant="secondary">Time: {gameState.timeLeft}s</Badge>
            <Badge variant="outline" className="text-green-400">Particles: {gameState.particles.length}</Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={pauseGame}
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
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight - 80}
            className="w-full h-full bg-gradient-to-b from-gray-900/50 to-black/50 cursor-crosshair"
            onMouseMove={handleMouseMove}
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
        <h1 className="text-2xl font-bold gradient-text">Code Cutting Game</h1>
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
                <span className="text-white text-sm">Code Arena</span>
                <Button
                  onClick={toggleFullscreen}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full bg-gradient-to-b from-gray-900/50 to-black/50 rounded-lg cursor-crosshair border-2 border-gray-700"
                onMouseMove={handleMouseMove}
                style={{ maxWidth: '100%', height: 'auto' }}
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
              <CardTitle className="text-white">Target Code Type</CardTitle>
            </CardHeader>
            <CardContent>
              {gameState.targetCategory && (
                <div className="text-center">
                  <Badge className="bg-blue-600 text-white mb-2 text-lg px-4 py-2 shadow-lg">
                    {gameState.targetCategory}
                  </Badge>
                  <p className="text-white font-bold">Cut {gameState.targetCategory} snippets!</p>
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
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-blue-400">
                  {gameState.particlesCut > 0 ? ((gameState.particlesCut / (gameState.particlesCut + gameState.particlesMissed)) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Level Select</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((level, index) => (
                  <Button
                    key={level.level}
                    size="sm"
                    onClick={() => setGameState(prev => ({
                      ...prev,
                      currentLevel: level.level
                    }))}
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

export default CodeCuttingGame;
