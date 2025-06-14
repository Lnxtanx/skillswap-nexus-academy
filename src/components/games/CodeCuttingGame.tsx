import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
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
const LEVELS = [
  { level: 1, speed: 1, particleCount: 3, timeLimit: 30 },
  { level: 2, speed: 1.5, particleCount: 4, timeLimit: 45 },
  { level: 3, speed: 2, particleCount: 5, timeLimit: 60 },
  { level: 4, speed: 2.5, particleCount: 6, timeLimit: 75 },
  { level: 5, speed: 3, particleCount: 8, timeLimit: 90 }
];

const CodeCuttingGame: React.FC<CodeCuttingGameProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<CodeParticle[]>([]);
  const [mouseTrails, setMouseTrails] = useState<MouseTrail[]>([]);
  const [targetCategory, setTargetCategory] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);
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

      // Fallback to API
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voice: 'alloy',
          model: 'tts-1'
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

  // Generate new target category and give voice instruction
  const generateNewTarget = useCallback(() => {
    const newCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setTargetCategory(newCategory);
    speakInstruction(`Cut all ${newCategory} code snippets!`);
  }, [speakInstruction]);

  // Create new code particle
  const createCodeParticle = useCallback((): CodeParticle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as CodeParticle;

    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    switch (side) {
      case 0: // top
        x = Math.random() * canvas.width;
        y = -50;
        vx = (Math.random() - 0.5) * 3;
        vy = Math.random() * 2 + 1.5;
        break;
      case 1: // right
        x = canvas.width + 50;
        y = Math.random() * canvas.height;
        vx = -(Math.random() * 2 + 1.5);
        vy = (Math.random() - 0.5) * 3;
        break;
      case 2: // bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 50;
        vx = (Math.random() - 0.5) * 3;
        vy = -(Math.random() * 2 + 1.5);
        break;
      default: // left
        x = -50;
        y = Math.random() * canvas.height;
        vx = Math.random() * 2 + 1.5;
        vy = (Math.random() - 0.5) * 3;
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
      size: 50, // Bigger code blocks
      cut: false
    };
  }, [levelConfig.speed]);

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

      // Draw trails
      updatedTrails.forEach((trail, index) => {
        ctx.globalAlpha = trail.life;
        ctx.fillStyle = trail.color;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, 8 * trail.life, 0, 2 * Math.PI);
        ctx.fill();
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
          particle.vy += 0.15; // gravity
        }

        // Draw code particle
        const isTarget = particle.category === targetCategory;
        
        // Glow effect for target particles
        if (isTarget && !particle.cut) {
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 15;
        }
        
        // Background
        ctx.fillStyle = particle.cut ? '#333' : (isTarget ? '#0066cc' : '#4a5568');
        ctx.fillRect(particle.x - particle.size, particle.y - 15, particle.size * 2, 30);
        
        // Border with glow for target
        ctx.strokeStyle = isTarget ? '#00ff00' : '#9ca3af';
        ctx.lineWidth = isTarget ? 3 : 1;
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
          if (!particle.cut && particle.category === targetCategory) {
            setParticlesMissed(prev => prev + 1);
          }
          return false;
        }
        return true;
      });

      // Add new particles
      while (updatedParticles.length < levelConfig.particleCount) {
        updatedParticles.push(createCodeParticle());
      }

      return updatedParticles;
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isPlaying, targetCategory, levelConfig.particleCount, createCodeParticle]);

  // Handle mouse move for cutting and trails
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Add colorful mouse trail
    setMouseTrails(prev => [
      ...prev.slice(-20), // Keep only last 20 trails
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
            
            if (particle.category === targetCategory) {
              setScore(prev => prev + 15);
              setParticlesCut(prev => prev + 1);
              // Add explosion effect
              for (let i = 0; i < 10; i++) {
                setMouseTrails(prev => [...prev, {
                  x: particle.x + (Math.random() - 0.5) * 40,
                  y: particle.y + (Math.random() - 0.5) * 40,
                  color: '#00ff00',
                  life: 0.8
                }]);
              }
            } else {
              setScore(prev => Math.max(0, prev - 5));
            }
          }
        }
        return particle;
      })
    );
  }, [isPlaying, targetCategory]);

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
      }, 10000);
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

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setParticlesCut(0);
    setParticlesMissed(0);
    setTimeLeft(levelConfig.timeLimit);
    setGameStartTime(Date.now());
    setParticles([]);
    setMouseTrails([]);
    generateNewTarget();
    speakInstruction(`Level ${currentLevel} starting! Get ready to slice code!`);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const endGame = async () => {
    setIsPlaying(false);
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
    setScore(0);
    setParticlesCut(0);
    setParticlesMissed(0);
    setTimeLeft(levelConfig.timeLimit);
    setParticles([]);
    setMouseTrails([]);
    setTargetCategory('');
  };

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
              <canvas
                ref={canvasRef}
                width={600}
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
