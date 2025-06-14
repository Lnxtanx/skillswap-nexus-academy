
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Car,
  Utensils,
  Dumbbell,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceInterface from './VoiceInterface';

interface HandsFreeLearningProps {
  courseContent: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  title: string;
}

const HANDS_FREE_MODES = {
  cooking: {
    icon: Utensils,
    name: 'Cooking Mode',
    description: 'Learn while cooking with voice-only interaction',
    features: ['Pause-friendly', 'Repeat instructions', 'Timer integration']
  },
  exercise: {
    icon: Dumbbell,
    name: 'Exercise Mode', 
    description: 'Learn during workouts with motivational coaching',
    features: ['Rest period learning', 'Short bursts', 'Motivation prompts']
  },
  commute: {
    icon: Car,
    name: 'Commute Mode',
    description: 'Perfect for learning while traveling',
    features: ['Continuous play', 'Traffic-aware pausing', 'Hands-free navigation']
  },
  accessibility: {
    icon: Eye,
    name: 'Accessibility Mode',
    description: 'Optimized for visually impaired learners',
    features: ['Detailed audio descriptions', 'Screen reader friendly', 'Voice navigation']
  }
};

const HandsFreeLearning: React.FC<HandsFreeLearningProps> = ({
  courseContent,
  currentIndex,
  onIndexChange,
  title
}) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMode, setSelectedMode] = useState<keyof typeof HANDS_FREE_MODES>('commute');
  const [isScreenOff, setIsScreenOff] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [pauseOnInteraction, setPauseOnInteraction] = useState(true);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && courseContent[currentIndex]) {
      speakContent(courseContent[currentIndex]);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentIndex, courseContent]);

  const speakContent = (content: string) => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(content);
    
    // Adjust settings based on mode
    switch (selectedMode) {
      case 'cooking':
        utterance.rate = 0.8; // Slower for cooking
        utterance.volume = 0.9; // Louder for kitchen noise
        break;
      case 'exercise':
        utterance.rate = 1.1; // Slightly faster, more energetic
        utterance.volume = 1.0;
        break;
      case 'commute':
        utterance.rate = 1.0; // Normal pace
        utterance.volume = 0.8;
        break;
      case 'accessibility':
        utterance.rate = 0.7; // Slower for comprehension
        utterance.volume = 0.9;
        break;
    }

    utterance.onend = () => {
      if (autoAdvance && currentIndex < courseContent.length - 1) {
        // Add pause between content based on mode
        const pauseDuration = getPauseDuration();
        timeoutRef.current = setTimeout(() => {
          onIndexChange(currentIndex + 1);
        }, pauseDuration);
      } else if (currentIndex >= courseContent.length - 1) {
        setIsPlaying(false);
        toast({
          title: "Lesson Complete",
          description: "You've finished this hands-free learning session!",
        });
      }
    };

    utterance.onerror = () => {
      toast({
        title: "Speech Error",
        description: "There was an issue with text-to-speech",
        variant: "destructive"
      });
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const getPauseDuration = (): number => {
    switch (selectedMode) {
      case 'cooking':
        return 3000; // 3 seconds for processing while cooking
      case 'exercise':
        return 5000; // 5 seconds for rest periods
      case 'commute':
        return 1000; // 1 second for continuous flow
      case 'accessibility':
        return 4000; // 4 seconds for comprehension
      default:
        return 2000;
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    toast({
      title: "Hands-Free Learning Started",
      description: `${HANDS_FREE_MODES[selectedMode].name} activated`,
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleNext = () => {
    if (currentIndex < courseContent.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'next lesson':
        handleNext();
        break;
      case 'previous lesson':
        handlePrevious();
        break;
      case 'pause':
        handlePause();
        break;
      case 'resume':
        handlePlay();
        break;
      case 'repeat that':
        if (isPlaying) {
          window.speechSynthesis.cancel();
          speakContent(courseContent[currentIndex]);
        }
        break;
    }
  };

  const toggleScreenMode = () => {
    setIsScreenOff(!isScreenOff);
    if (!isScreenOff) {
      toast({
        title: "Screen Off Mode",
        description: "UI minimized for hands-free learning",
      });
    }
  };

  return (
    <div className={`space-y-6 ${isScreenOff ? 'opacity-20 pointer-events-none' : ''}`}>
      {/* Mode Selection */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Hands-Free Learning Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {Object.entries(HANDS_FREE_MODES).map(([key, mode]) => {
              const IconComponent = mode.icon;
              return (
                <Button
                  key={key}
                  onClick={() => setSelectedMode(key as keyof typeof HANDS_FREE_MODES)}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedMode === key 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  } text-white`}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm">{mode.name}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-2">{HANDS_FREE_MODES[selectedMode].description}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {HANDS_FREE_MODES[selectedMode].features.map((feature) => (
                <Badge key={feature} variant="secondary" className="bg-gray-800 text-gray-300">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playback Controls */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-600 text-white">
                {currentIndex + 1} / {courseContent.length}
              </Badge>
              {isPlaying && (
                <Badge className="bg-green-600 text-white animate-pulse">
                  Playing
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Large Playback Controls */}
          <div className="flex justify-center items-center space-x-6 mb-6">
            <Button
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-gray-800 hover:bg-gray-700 text-white h-16 w-16"
            >
              <SkipBack className="h-8 w-8" />
            </Button>
            
            <Button
              size="lg"
              onClick={isPlaying ? handlePause : handlePlay}
              className={`h-20 w-20 ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
            </Button>
            
            <Button
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === courseContent.length - 1}
              className="bg-gray-800 hover:bg-gray-700 text-white h-16 w-16"
            >
              <SkipForward className="h-8 w-8" />
            </Button>
          </div>

          {/* Content Preview */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-gray-300 text-center">
              {courseContent[currentIndex] || 'No content available'}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="sm"
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`${
                autoAdvance 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white`}
            >
              Auto Advance: {autoAdvance ? 'On' : 'Off'}
            </Button>
            
            <Button
              size="sm"
              onClick={() => setPauseOnInteraction(!pauseOnInteraction)}
              className={`${
                pauseOnInteraction 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white`}
            >
              Smart Pause: {pauseOnInteraction ? 'On' : 'Off'}
            </Button>
            
            <Button
              size="sm"
              onClick={toggleScreenMode}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isScreenOff ? <Eye className="mr-1 h-4 w-4" /> : <EyeOff className="mr-1 h-4 w-4" />}
              {isScreenOff ? 'Show Screen' : 'Hide Screen'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Interface */}
      <VoiceInterface
        courseContent={courseContent[currentIndex]}
        currentLesson={title}
        onVoiceCommand={handleVoiceCommand}
        isHandsFreeMode={true}
        disabled={false}
      />

      {/* Screen Off Overlay */}
      {isScreenOff && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <Volume2 className="h-16 w-16 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Audio Learning Mode</h2>
            <p className="text-gray-400 mb-4">Hands-free learning in progress</p>
            <Button onClick={toggleScreenMode} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" />
              Show Interface
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandsFreeLearning;
