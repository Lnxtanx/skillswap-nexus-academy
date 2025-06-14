
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
import { useVoicePreferences } from '@/hooks/useVoicePreferences';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInterfaceProps {
  courseContent?: string;
  currentLesson?: string;
  onVoiceCommand?: (command: string) => void;
  isHandsFreeMode?: boolean;
  disabled?: boolean;
  courseCategory?: string;
  courseTitle?: string;
}

// Voice configurations for different personas
const VOICE_PERSONAS = {
  'code-master': {
    name: 'Code Master',
    accent: 'British',
    personality: 'Professional, methodical programming instructor',
    introduction: 'Hello! I am Code Master, your programming instructor. I specialize in teaching coding languages and software development. What would you like to learn today?'
  },
  'professor-pine': {
    name: 'Professor Pine',
    accent: 'American',
    personality: 'Academic, enthusiastic science educator',
    introduction: 'Greetings! I am Professor Pine, your science instructor. I love exploring the wonders of physics, chemistry, and biology. Ready to discover something amazing?'
  },
  'chef-charlie': {
    name: 'Chef Charlie',
    accent: 'French',
    personality: 'Warm, encouraging culinary expert',
    introduction: 'Bonjour! I am Chef Charlie, your culinary instructor. I will teach you the art of cooking and the secrets of great cuisine. Shall we begin our culinary journey?'
  },
  'sensei-sam': {
    name: 'Sensei Sam',
    accent: 'Japanese-English',
    personality: 'Disciplined, motivating fitness trainer',
    introduction: 'Welcome, student. I am Sensei Sam, your fitness and martial arts instructor. Together we will strengthen both your body and mind. Are you ready to train?'
  },
  'language-luna': {
    name: 'Language Luna',
    accent: 'Multilingual',
    personality: 'Patient, culturally aware language teacher',
    introduction: '¡Hola! Bonjour! I am Language Luna, your language instructor. I will help you master new languages and explore different cultures. What language shall we practice today?'
  }
};

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

const WaveAnimation: React.FC<{ isListening: boolean; isSpeaking: boolean }> = ({ isListening, isSpeaking }) => {
  return (
    <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg overflow-hidden relative">
      <div className="flex items-center space-x-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full transition-all duration-200 ${
              isListening || isSpeaking ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${
                isListening 
                  ? Math.random() * 60 + 20
                  : isSpeaking 
                    ? Math.sin((Date.now() / 100) + i) * 30 + 40
                    : 20
              }px`,
              animationDelay: `${i * 50}ms`,
              animationDuration: isListening ? '0.5s' : '1s'
            }}
          />
        ))}
      </div>
      {(isListening || isSpeaking) && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />
      )}
    </div>
  );
};

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  courseContent = '',
  currentLesson = '',
  onVoiceCommand,
  disabled = false,
  courseCategory = 'programming',
  courseTitle = ''
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { preferences, updatePersona, updateLanguage, updateSpeechSpeed, updateVolume, toggleNoiseCancellation, toggleAccessibilityMode } = useVoicePreferences();
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  
  // Voice recognition
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Get current persona based on course category
  const currentPersona = VOICE_PERSONAS[courseCategory] || VOICE_PERSONAS['code-master'];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = preferences.selectedLanguage;
        
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
  }, [preferences.selectedLanguage, isListening, disabled]);

  // Introduce the AI tutor when component mounts
  useEffect(() => {
    if (!hasIntroduced && courseTitle) {
      const introduction = `${currentPersona.introduction} Today we'll be working on ${courseTitle}. How can I help you with your learning?`;
      setTimeout(() => {
        speakText(introduction);
        setHasIntroduced(true);
        setConversationHistory([{
          id: Date.now(),
          type: 'ai',
          content: introduction,
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
    }
  }, [courseTitle, hasIntroduced]);

  const handleSpeechResult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((result: any) => result[0].transcript)
      .join(' ')
      .toLowerCase()
      .trim();

    if (event.results[event.results.length - 1].isFinal) {
      processVoiceCommand(transcript);
    }
  };

  const handleSpeechError = (event: any) => {
    toast({
      title: "Speech Recognition Error",
      description: `Error: ${event.error}`,
      variant: "destructive",
    });
    setIsListening(false);
  };

  const processVoiceCommand = async (transcript: string) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: transcript,
      timestamp: new Date().toISOString()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);

    try {
      // Call Gemini API through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: transcript,
          context: {
            persona: currentPersona.name,
            personality: currentPersona.personality,
            course: courseTitle,
            category: courseCategory,
            lesson: currentLesson,
            conversationHistory: conversationHistory.slice(-5) // Last 5 messages for context
          }
        }
      });

      if (error) {
        console.error('Gemini API error:', error);
        speakText("I'm sorry, I'm having trouble processing your request right now. Please try again.");
        return;
      }

      const aiResponse = data?.response || "I didn't quite understand that. Could you please rephrase your question?";
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      setConversationHistory(prev => [...prev, aiMessage]);
      speakText(aiResponse);

    } catch (error) {
      console.error('Error processing voice command:', error);
      speakText("I'm sorry, I encountered an error. Please try asking your question again.");
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = preferences.speechSpeed;
    utterance.volume = preferences.volume;
    utterance.lang = preferences.selectedLanguage;
    
    // Set voice based on selected persona
    const voices = speechSynthesisRef.current.getVoices();
    const selectedVoice = voices.find(voice => 
      voice.name.includes(currentPersona.accent) ||
      voice.lang.startsWith(preferences.selectedLanguage)
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
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      setIsListening(true);
      
      toast({
        title: "Voice Recognition Started",
        description: "Ask me anything about your course!",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features",
        variant: "destructive",
      });
    }
  }, [disabled]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Tutor Introduction */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <span className="text-2xl mr-3">🤖</span>
              Meet Your AI Tutor: {currentPersona.name}
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
          <p className="text-gray-300">{currentPersona.personality}</p>
          
          {/* Wave Animation */}
          <WaveAnimation isListening={isListening} isSpeaking={isSpeaking} />
          
          {/* Voice Control Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={disabled}
              className={`${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-3`}
              size="lg"
            >
              {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
              {isListening ? 'Stop Listening' : 'Ask Question'}
            </Button>

            <Button
              onClick={isSpeaking ? stopSpeaking : () => speakText(currentPersona.introduction)}
              disabled={disabled}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
              size="lg"
            >
              {isSpeaking ? <VolumeX className="mr-2 h-5 w-5" /> : <Volume2 className="mr-2 h-5 w-5" />}
              {isSpeaking ? 'Stop Speaking' : 'Hear Introduction'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversation History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto mb-4 space-y-3">
            {conversationHistory.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-900 text-white ml-4'
                    : 'bg-gray-800 text-white mr-4'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {conversationHistory.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p>Click "Ask Question" to start talking with your AI tutor!</p>
              </div>
            )}
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
          {/* Language Selection */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block flex items-center">
              <Languages className="mr-1 h-4 w-4" />
              Language
            </label>
            <Select value={preferences.selectedLanguage} onValueChange={updateLanguage}>
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
              Speech Speed: {preferences.speechSpeed.toFixed(1)}x
            </label>
            <Slider
              value={[preferences.speechSpeed]}
              onValueChange={(value) => updateSpeechSpeed(value[0])}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Volume: {Math.round(preferences.volume * 100)}%
            </label>
            <Slider
              value={[preferences.volume]}
              onValueChange={(value) => updateVolume(value[0])}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceInterface;
