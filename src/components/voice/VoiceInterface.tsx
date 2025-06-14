
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  BookOpen,
  Settings,
  Headphones,
  Languages,
  Accessibility
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface VoiceInterfaceProps {
  courseContent?: string;
  currentLesson?: string;
  onVoiceCommand?: (command: string) => void;
  isHandsFreeMode?: boolean;
  disabled?: boolean;
}

// Voice configurations for different personas
const VOICE_PERSONAS = {
  'code-master': {
    name: 'Code Master',
    accent: 'British',
    personality: 'Professional, methodical'
  },
  'professor-pine': {
    name: 'Professor Pine',
    accent: 'American',
    personality: 'Academic, enthusiastic'
  },
  'chef-charlie': {
    name: 'Chef Charlie',
    accent: 'French',
    personality: 'Warm, encouraging'
  },
  'sensei-sam': {
    name: 'Sensei Sam',
    accent: 'Japanese-English',
    personality: 'Disciplined, motivating'
  },
  'language-luna': {
    name: 'Language Luna',
    accent: 'Multilingual',
    personality: 'Patient, culturally aware'
  }
};

const VOICE_COMMANDS = [
  'next lesson',
  'previous lesson',
  'repeat that',
  'quiz me',
  'take notes',
  'pause',
  'resume',
  'slower',
  'faster',
  'explain this',
  'summary',
  'help'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' }
];

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  courseContent = '',
  currentLesson = '',
  onVoiceCommand,
  isHandsFreeMode = false,
  disabled = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('code-master');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [speechSpeed, setSpeechSpeed] = useState([1]);
  const [volume, setVolume] = useState([0.7]);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  
  // Voice recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage;
        
        recognitionRef.current.onresult = handleSpeechResult;
        recognitionRef.current.onerror = handleSpeechError;
        recognitionRef.current.onend = () => {
          if (isListening && !disabled) {
            startListening();
          }
        };
      }
    }

    speechSynthesisRef.current = window.speechSynthesis;
    
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [selectedLanguage, isListening, disabled]);

  // Audio context for noise cancellation
  useEffect(() => {
    if (noiseCancellation) {
      initializeAudioContext();
    }
  }, [noiseCancellation]);

  const initializeAudioContext = async () => {
    try {
      audioContextRef.current = new AudioContext();
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  };

  const handleSpeechResult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ')
      .toLowerCase()
      .trim();

    if (event.results[event.results.length - 1].isFinal) {
      processVoiceCommand(transcript);
    }
  };

  const handleSpeechError = (event: SpeechRecognitionErrorEvent) => {
    toast({
      title: "Speech Recognition Error",
      description: `Error: ${event.error}`,
      variant: "destructive",
    });
    setIsListening(false);
  };

  const processVoiceCommand = async (transcript: string) => {
    const command = transcript.toLowerCase();
    
    // Check for predefined commands
    for (const cmd of VOICE_COMMANDS) {
      if (command.includes(cmd)) {
        handlePredefinedCommand(cmd);
        onVoiceCommand?.(cmd);
        return;
      }
    }

    // Fallback response for unrecognized commands
    speakText(`I heard: ${transcript}. Let me help you with that.`);
  };

  const handlePredefinedCommand = (command: string) => {
    switch (command) {
      case 'next lesson':
        speakText('Moving to the next lesson');
        break;
      case 'previous lesson':
        speakText('Going back to the previous lesson');
        break;
      case 'repeat that':
        if (courseContent) {
          speakText(courseContent);
        }
        break;
      case 'quiz me':
        speakText('Starting a quick quiz. Are you ready?');
        break;
      case 'take notes':
        speakText('Note taking mode activated. Please dictate your notes.');
        break;
      case 'pause':
        stopSpeaking();
        speakText('Paused');
        break;
      case 'resume':
        speakText('Resuming');
        break;
      case 'slower':
        setSpeechSpeed([Math.max(0.5, speechSpeed[0] - 0.1)]);
        speakText('Speaking slower');
        break;
      case 'faster':
        setSpeechSpeed([Math.min(2.0, speechSpeed[0] + 0.1)]);
        speakText('Speaking faster');
        break;
      case 'explain this':
        speakText(`Let me explain this topic in more detail: ${currentLesson}`);
        break;
      case 'summary':
        speakText('Here is a summary of what we have covered so far');
        break;
      case 'help':
        speakText(`Available voice commands: ${VOICE_COMMANDS.join(', ')}`);
        break;
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechSpeed[0];
    utterance.volume = volume[0];
    utterance.lang = selectedLanguage;
    
    // Set voice based on selected persona
    const voices = speechSynthesisRef.current.getVoices();
    const selectedVoice = voices.find(voice => 
      voice.name.includes(VOICE_PERSONAS[selectedPersona].accent) ||
      voice.lang.startsWith(selectedLanguage)
    );
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to speak text",
        variant: "destructive",
      });
    };

    speechSynthesisRef.current.speak(utterance);
  };

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || disabled) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      setIsListening(true);
      
      if (accessibilityMode) {
        speakText('Voice recognition started. I am listening.');
      }
      
      toast({
        title: "Voice Recognition Started",
        description: "Speak your commands or questions",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features",
        variant: "destructive",
      });
    }
  }, [disabled, accessibilityMode]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (accessibilityMode) {
      speakText('Voice recognition stopped.');
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Voice Controls */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Headphones className="mr-2 h-5 w-5 text-blue-400" />
              Voice AI Assistant
            </CardTitle>
            <div className="flex items-center space-x-2">
              {isListening && (
                <Badge variant="secondary" className="animate-pulse bg-red-900 text-red-300">
                  Listening
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="secondary" className="animate-pulse bg-blue-900 text-blue-300">
                  Speaking
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Control Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={disabled}
              className={`${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>

            <Button
              onClick={isSpeaking ? stopSpeaking : () => speakText(courseContent || 'Hello, I am your AI voice assistant')}
              disabled={disabled}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSpeaking ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              {isSpeaking ? 'Stop Speaking' : 'Test Voice'}
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              size="sm"
              onClick={() => processVoiceCommand('quiz me')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <BookOpen className="mr-1 h-3 w-3" />
              Quiz Me
            </Button>
            <Button
              size="sm"
              onClick={() => processVoiceCommand('repeat that')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Repeat
            </Button>
            <Button
              size="sm"
              onClick={() => processVoiceCommand('next lesson')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <SkipForward className="mr-1 h-3 w-3" />
              Next
            </Button>
            <Button
              size="sm"
              onClick={() => processVoiceCommand('help')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Help
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="mr-2 h-5 w-5 text-gray-400" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Persona Selection */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">AI Voice Persona</label>
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {Object.entries(VOICE_PERSONAS).map(([key, persona]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                    {persona.name} ({persona.accent})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block flex items-center">
              <Languages className="mr-1 h-4 w-4" />
              Language
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speech Speed */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Speech Speed: {speechSpeed[0].toFixed(1)}x
            </label>
            <Slider
              value={speechSpeed}
              onValueChange={setSpeechSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Volume: {Math.round(volume[0] * 100)}%
            </label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Audio-Only Mode</span>
              <Button
                size="sm"
                variant={isAudioOnly ? "default" : "outline"}
                onClick={() => setIsAudioOnly(!isAudioOnly)}
                className={isAudioOnly ? "bg-blue-600 text-white" : "border-gray-600 text-gray-400"}
              >
                {isAudioOnly ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Noise Cancellation</span>
              <Button
                size="sm"
                variant={noiseCancellation ? "default" : "outline"}
                onClick={() => setNoiseCancellation(!noiseCancellation)}
                className={noiseCancellation ? "bg-blue-600 text-white" : "border-gray-600 text-gray-400"}
              >
                {noiseCancellation ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 flex items-center">
                <Accessibility className="mr-1 h-4 w-4" />
                Accessibility Mode
              </span>
              <Button
                size="sm"
                variant={accessibilityMode ? "default" : "outline"}
                onClick={() => setAccessibilityMode(!accessibilityMode)}
                className={accessibilityMode ? "bg-blue-600 text-white" : "border-gray-600 text-gray-400"}
              >
                {accessibilityMode ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands Help */}
      {accessibilityMode && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Available Voice Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-400">
              {VOICE_COMMANDS.map((command) => (
                <div key={command} className="bg-gray-800 px-2 py-1 rounded">
                  "{command}"
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceInterface;
