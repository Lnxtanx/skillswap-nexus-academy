
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CodeParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  code: string;
  category: string;
  size: number;
  cut: boolean;
}

interface MouseTrail {
  x: number;
  y: number;
  color: string;
  life: number;
}

interface CodeCuttingGameProps {
  onBack: () => void;
}

const CODE_SNIPPETS = {
  'function': ['function()', 'const fn = ()', 'arrow => {}', 'def func():', 'func()'],
  'variable': ['let x =', 'const y =', 'var z =', 'int x =', 'string y ='],
  'loop': ['for()', 'while()', 'forEach()', 'map()', 'filter()'],
  'condition': ['if()', 'else', 'switch', 'case:', '? :'],
  'keyword': ['return', 'break', 'continue', 'import', 'export']
};

const CATEGORIES = Object.keys(CODE_SNIPPETS);
const DIRECTIONS = ['left', 'right', 'top', 'bottom'];
const LEVELS = [
  { level: 1, speed: 0.5, particleCount: 12, timeLimit: 120 },
  { level: 2, speed: 0.7, particleCount: 15, timeLimit: 150 },
  { level: 3, speed: 0.9, particleCount: 18, timeLimit: 180 },
  { level: 4, speed: 1.1, particleCount: 22, timeLimit: 200 },
  { level: 5, speed: 1.3, particleCount: 25, timeLimit: 240 }
];

const CodeCuttingGame: React.FC<CodeCuttingGameProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<CodeParticle[]>([]);
  const [mouseTrails, setMouseTrails] = useState<MouseTrail[]>([]);
  const [targetCategory, setTargetCategory] = useState<string>('');
  const [targetDirection, setTargetDirection] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [particlesCut, setParticlesCut] = useState(0);
  const [particlesMissed, setParticlesMissed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);

  const levelConfig = LEVELS[currentLevel - 1];

  // Voice instruction function with better error handling
  const speakInstruction = useCallback(async (text: string) => {
    try {
      console.log('Speaking:', text);
      
      // Try browser speech synthesis first (more reliable)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.volume = 0.8;
        utterance.pitch = 1.0;
        
        // Use a more suitable voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.includes('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        return;
      }

      // Fallback to ElevenLabs API
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voice: 'alloy'
        }
      });

      if (error) {
        console.error('TTS API error:', error);
        return;
      }

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.volume = 0.7;
        await audio.play();
      }
    } catch (error) {
      console.error('Voice instruction failed:', error);
    }
  }, []);

  // Generate new target with direction commands
  const generateNewTarget = useCallback(() => {
    const newCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const shouldAddDirection = Math.random() < 0.4; // 40% chance for direction
    const direction = shouldAddDirection ? DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] : '';
    
    setTargetCategory(newCategory);
    setTargetDirection(direction);
    
    const instruction = direction 
      ? `Cut ${newCategory} code from the ${direction}!`
      : `Cut all ${newCategory} code snippets!`;
    
    speakInstruction(instruction);
  }, [speakInstruction]);

  // Create new code particle with random category
  const createCodeParticle = useCallback((): CodeParticle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as CodeParticle;

    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    switch (side) {
      case 0: // top
        x = Math.random() * canvas.width;
        y = -50;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 1.5 + 1;
        break;
      case 1: // right
        x = canvas.width + 50;
        y = Math.random() * canvas.height;
        vx = -(Math.random() * 1.5 + 1);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 50;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 1.5 + 1);
        break;
      default: // left
        x = -50;
        y = Math.random() * canvas.height;
        vx = Math.random() * 1.5 + 1;
        vy = (Math.random() - 0.5) * 2;
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
      size: 50,
      cut: false
    };
  }, [levelConfig.speed]);

  // Check if particle matches direction requirement
  const checkDirectionMatch = useCallback((particle: CodeParticle) => {
    if (!targetDirection) return true;
    
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (targetDirection) {
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
  }, [targetDirection]);

  // Game loop with mouse trails
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw mouse trails
    setMouseTrails(prevTrails => {
      const updatedTrails = prevTrails.map(trail => ({
        ...trail,
        life: trail.life - 0.02
      })).filter(trail => trail.life > 0);

      // Draw trails with beautiful boiling colors
      updatedTrails.forEach((trail, index) => {
        ctx.globalAlpha = trail.life;
        
        // Create boiling effect with multiple circles
        for (let i = 0; i < 3; i++) {
          const offset = i * 3;
          const size = (8 - i * 2) * trail.life;
          const hue = (Date.now() * 0.1 + offset + 180) % 360; // Different color spectrum
          ctx.fillStyle = `hsl(${hue}, 100%, ${60 + i * 10}%)`;
          ctx.beginPath();
          ctx.arc(trail.x + Math.sin(Date.now() * 0.01 + offset) * 2, 
                  trail.y + Math.cos(Date.now() * 0.01 + offset) * 2, 
                  size, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      return updatedTrails;
    });

    // Update and draw particles
    setParticles(prevParticles => {
      const updatedParticles = prevParticles.map(particle => {
        if (!particle.cut) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.1; // gravity
        }

        // Draw code particle
        const isTarget = particle.category === targetCategory;
        const isDirectionMatch = checkDirectionMatch(particle);
        const isValidTarget = isTarget && isDirectionMatch;
        
        // Strong glow effect for valid target particles
        if (isValidTarget && !particle.cut) {
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 20;
          
          // Extra glow ring
          ctx.fillStyle = '#00ff0040';
          ctx.fillRect(particle.x - particle.size - 5, particle.y - 20, particle.size * 2 + 10, 40);
        }
        
        // Background
        ctx.fillStyle = particle.cut ? '#333' : (isValidTarget ? '#0066cc' : '#4a5568');
        ctx.fillRect(particle.x - particle.size, particle.y - 15, particle.size * 2, 30);
        
        // Border with glow for target
        ctx.strokeStyle = isValidTarget ? '#00ff00' : '#9ca3af';
        ctx.lineWidth = isValidTarget ? 4 : 1;
        ctx.strokeRect(particle.x - particle.size, particle.y - 15, particle.size * 2, 30);
        
        // Text
        ctx.fillStyle = particle.cut ? '#666' : '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(particle.code, particle.x, particle.y + 3);
        
        // Reset shadow
        ctx.shadowBlur = 0;

        return particle;
      }).filter(particle => {
        // Remove particles that are off screen
        if (particle.x < -100 || particle.x > canvas.width + 100 || 
            particle.y < -100 || particle.y > canvas.height + 100) {
          if (!particle.cut && particle.category === targetCategory && checkDirectionMatch(particle)) {
            setParticlesMissed(prev => prev + 1);
          }
          return false;
        }
        return true;
      });

      // Add new particles continuously
      while (updatedParticles.length < levelConfig.particleCount) {
        updatedParticles.push(createCodeParticle());
      }

      return updatedParticles;
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isPlaying, targetCategory, levelConfig.particleCount, createCodeParticle, checkDirectionMatch]);

  // Handle mouse move for cutting and trails
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Add spectacular boiling colorful mouse trail
    setMouseTrails(prev => [
      ...prev.slice(-40), // Keep more trails for better effect
      {
        x: mouseX,
        y: mouseY,
        color: `hsl(${(Date.now() + 180) % 360}, 100%, 60%)`,
        life: 1.0
      }
    ]);

    if (!isPlaying) return;

    setParticles(prevParticles => 
      prevParticles.map(particle => {
        if (!particle.cut) {
          const distance = Math.sqrt(
            Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2)
          );

          if (distance < particle.size) {
            particle.cut = true;
            
            const isValidTarget = particle.category === targetCategory && checkDirectionMatch(particle);
            
            if (isValidTarget) {
              setScore(prev => prev + 15);
              setParticlesCut(prev => prev + 1);
              // Add spectacular explosion effect
              for (let i = 0; i < 20; i++) {
                setMouseTrails(prev => [...prev, {
                  x: particle.x + (Math.random() - 0.5) * 80,
                  y: particle.y + (Math.random() - 0.5) * 80,
                  color: '#00ff00',
                  life: 1.0
                }]);
              }
            } else {
              setScore(prev => Math.max(0, prev - 3));
            }
          }
        }
        return particle;
      })
    );
  }, [isPlaying, targetCategory, checkDirectionMatch]);

  // Timer effect
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
  }, [isPlaying, timeLeft]);

  // Target category change effect
  useEffect(() => {
    if (isPlaying && targetCategory) {
      const interval = setInterval(() => {
        generateNewTarget();
      }, 8000); // Change target every 8 seconds
      return () => clearInterval(interval);
    }
  }, [isPlaying, generateNewTarget, targetCategory]);

  // Game loop effect
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameLoop]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setParticlesCut(0);
    setParticlesMissed(0);
    setTimeLeft(levelConfig.timeLimit);
    setGameStartTime(Date.now());
    setParticles([]);
    setMouseTrails([]);
    setIsFullscreen(true); // Auto fullscreen when game starts
    generateNewTarget();
    speakInstruction(`Level ${currentLevel} starting! Get ready to slice code!`);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsFullscreen(false); // Exit fullscreen when game ends
    const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
    const accuracy = particlesCut > 0 ? (particlesCut / (particlesCut + particlesMissed)) * 100 : 0;

    // Save score to database
    if (user) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'code',
          level: currentLevel,
          score,
          accuracy,
          time_taken: timeTaken,
          particles_cut: particlesCut,
          particles_missed: particlesMissed
        });

        toast({
          title: "Game Complete!",
          description: `Score: ${score} | Accuracy: ${accuracy.toFixed(1)}%`,
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }

    speakInstruction(`Coding challenge complete! Your score is ${score} points with ${accuracy.toFixed(1)} percent accuracy!`);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setIsFullscreen(false);
    setScore(0);
    setParticlesCut(0);
    setParticlesMissed(0);
    setTimeLeft(levelConfig.timeLimit);
    setParticles([]);
    setMouseTrails([]);
    setTargetCategory('');
    setTargetDirection('');
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="flex items-center space-x-4">
            <Button onClick={toggleFullscreen} className="bg-gray-700 hover:bg-gray-600 text-white">
              <Minimize className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Code Cutting Game</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {targetCategory && (
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-600 text-white">
                  {targetCategory}
                </Badge>
                <span className="text-white font-bold">
                  Cut {targetCategory}{targetDirection && ` from ${targetDirection}`}!
                </span>
              </div>
            )}
            <Badge variant="outline" className="text-white">Score: {score}</Badge>
            <Badge variant="secondary">Time: {timeLeft}s</Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={pauseGame}
              disabled={!isPlaying}
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

        {/* Fullscreen Canvas */}
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
          <Badge variant="secondary">Level {currentLevel}</Badge>
          <Badge variant="outline" className="text-white">Score: {score}</Badge>
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
                  disabled={isPlaying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
                <Button
                  onClick={pauseGame}
                  disabled={!isPlaying}
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
              {targetCategory && (
                <div className="text-center">
                  <Badge className="bg-blue-600 text-white mb-2 text-lg px-4 py-2 shadow-lg">
                    {targetCategory}
                  </Badge>
                  <p className="text-white font-bold">Cut {targetCategory} snippets!</p>
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
                <span className="text-white">{timeLeft}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cut:</span>
                <span className="text-green-400">{particlesCut}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Missed:</span>
                <span className="text-red-400">{particlesMissed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-blue-400">
                  {particlesCut > 0 ? ((particlesCut / (particlesCut + particlesMissed)) * 100).toFixed(1) : 0}%
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
                    onClick={() => setCurrentLevel(level.level)}
                    disabled={isPlaying}
                    className={`${currentLevel === level.level 
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
