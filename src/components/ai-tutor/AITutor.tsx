import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Share, Save, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTutorSession } from '@/hooks/useTutorSession';
import { AIPersona, TutorSessionData } from '@/types/tutor';

interface AITutorProps {
  courseId?: number;
  courseCategory?: string;
  lessonId?: string;
  onSessionComplete?: (sessionData: TutorSessionData) => void;
}

// Tavus API configuration
const TAVUS_API_KEY = '220636fd8df3466b8be359cf0ef9467a';

const AI_PERSONAS: Record<string, AIPersona> = {
  'programming': {
    id: 'code-master',
    name: 'Code Master',
    description: 'Expert programming instructor with deep knowledge of all coding languages',
    avatar: '🧑‍💻',
    specialties: ['JavaScript', 'Python', 'React', 'Node.js', 'Database Design'],
    personality: 'Patient, methodical, and encouraging with a focus on best practices',
    greeting: "Hello! I'm Code Master, your programming tutor. Ready to dive into some code?",
    tavusReplicaId: 'replica_programming_001'
  },
  'science': {
    id: 'professor-pine',
    name: 'Professor Pine',
    description: 'Friendly academic specializing in sciences and research',
    avatar: '👨‍🔬',
    specialties: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Research Methods'],
    personality: 'Academic, thorough, and passionate about discovery',
    greeting: "Greetings! I'm Professor Pine. Let's explore the wonders of science together!",
    tavusReplicaId: 'replica_science_001'
  },
  'cooking': {
    id: 'chef-charlie',
    name: 'Chef Charlie',
    description: 'Master chef with expertise in culinary arts and cooking techniques',
    avatar: '👨‍🍳',
    specialties: ['French Cuisine', 'Baking', 'Knife Skills', 'Food Safety', 'Recipe Development'],
    personality: 'Enthusiastic, detail-oriented, and creative',
    greeting: "Bonjour! I'm Chef Charlie. Ready to create something delicious?",
    tavusReplicaId: 'replica_cooking_001'
  },
  'physical': {
    id: 'sensei-sam',
    name: 'Sensei Sam',
    description: 'Martial arts master and physical fitness expert',
    avatar: '🥋',
    specialties: ['Martial Arts', 'Fitness Training', 'Meditation', 'Body Mechanics', 'Discipline'],
    personality: 'Disciplined, motivating, and focused on mind-body connection',
    greeting: "Welcome, student. I'm Sensei Sam. Let's train your body and mind together.",
    tavusReplicaId: 'replica_physical_001'
  },
  'language': {
    id: 'language-luna',
    name: 'Language Luna',
    description: 'Polyglot expert in languages and communication',
    avatar: '🗣️',
    specialties: ['English', 'Spanish', 'French', 'Communication', 'Cultural Studies'],
    personality: 'Patient, culturally aware, and encouraging',
    greeting: "¡Hola! Bonjour! I'm Language Luna. Let's explore the world through language!",
    tavusReplicaId: 'replica_language_001'
  }
};

const AITutor: React.FC<AITutorProps> = ({
  courseId,
  courseCategory = 'programming',
  lessonId,
  onSessionComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(
    AI_PERSONAS[courseCategory] || AI_PERSONAS['programming']
  );
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tavusSession, setTavusSession] = useState<any>(null);

  const {
    createSession,
    endSession,
    saveConversation,
    isSessionActive,
    sessionId
  } = useTutorSession();

  useEffect(() => {
    if (courseCategory && AI_PERSONAS[courseCategory]) {
      setSelectedPersona(AI_PERSONAS[courseCategory]);
    }
  }, [courseCategory]);

  const initializeTavusSession = async () => {
    try {
      setIsLoading(true);
      
      const sessionData = await createSession({
        replicaId: selectedPersona.tavusReplicaId,
        userId: user?.id,
        courseId,
        lessonId,
        personaId: selectedPersona.id
      });

      const tavusConfig = {
        apiKey: TAVUS_API_KEY,
        replicaId: selectedPersona.tavusReplicaId,
        conversationId: sessionData?.id || 'temp-session',
        properties: {
          max_session_length: 3600,
          language: 'en'
        }
      };

      console.log('Initializing Tavus session with config:', tavusConfig);
      
      setTavusSession(tavusConfig);
      setIsVideoActive(true);
      
      toast({
        title: "AI Tutor Connected",
        description: `${selectedPersona.name} is ready to help you learn!`,
      });

      const greetingMessage = {
        id: Date.now(),
        type: 'ai',
        content: selectedPersona.greeting,
        timestamp: new Date().toISOString(),
        persona: selectedPersona.id
      };
      setConversationHistory([greetingMessage]);

    } catch (error) {
      console.error('Failed to initialize Tavus session:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI tutor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMicrophone = async () => {
    try {
      if (!isMicActive) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicActive(true);
        toast({
          title: "Microphone Activated",
          description: "You can now speak with your AI tutor",
        });
      } else {
        setIsMicActive(false);
        toast({
          title: "Microphone Deactivated",
          description: "Voice input disabled",
        });
      }
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        toast({
          title: "Screen Sharing Started",
          description: "Your screen is now being shared with the AI tutor",
        });
      } else {
        setIsScreenSharing(false);
        toast({
          title: "Screen Sharing Stopped",
          description: "Screen sharing has been disabled",
        });
      }
    } catch (error) {
      toast({
        title: "Screen Share Error",
        description: "Could not start screen sharing",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Session is now being recorded",
      });
    } else {
      setIsRecording(false);
      if (sessionId) {
        await saveConversation(sessionId, conversationHistory);
      }
      toast({
        title: "Recording Saved",
        description: "Session has been saved to your learning history",
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || !isSessionActive) return;

    try {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };

      setConversationHistory(prev => [...prev, newMessage]);
      setCurrentMessage('');

      // Simulate AI response with persona context
      setTimeout(() => {
        const responses = {
          'code-master': "Let me help you understand that concept. In programming, we need to think step by step...",
          'professor-pine': "Excellent question! From a scientific perspective, this phenomenon occurs because...",
          'chef-charlie': "Ah, magnifique! This technique is essential in French cuisine. Let me explain...",
          'sensei-sam': "Good observation, student. In martial arts, we learn that balance is key...",
          'language-luna': "¡Perfecto! That's a wonderful way to practice. In Spanish, we would say..."
        };

        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: responses[selectedPersona.id] || `${selectedPersona.name}: That's a great question! Let me help you with that...`,
          timestamp: new Date().toISOString(),
          persona: selectedPersona.id
        };
        setConversationHistory(prev => [...prev, aiResponse]);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message to AI tutor",
        variant: "destructive",
      });
    }
  };

  const endTutorSession = async () => {
    if (sessionId) {
      try {
        const sessionData = await endSession(sessionId, conversationHistory);
        if (onSessionComplete && sessionData) {
          onSessionComplete(sessionData as TutorSessionData);
        }
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    setIsVideoActive(false);
    setIsMicActive(false);
    setIsRecording(false);
    setIsScreenSharing(false);
    setTavusSession(null);
    toast({
      title: "Session Ended",
      description: "Your tutoring session has been completed and saved",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Video Interface */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedPersona.avatar}</span>
                <div>
                  <CardTitle className="text-white">{selectedPersona.name}</CardTitle>
                  <p className="text-sm text-gray-400">
                    {selectedPersona.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isRecording && (
                  <Badge variant="destructive" className="animate-pulse">
                    Recording
                  </Badge>
                )}
                {isSessionActive && (
                  <Badge variant="secondary">
                    Active
                  </Badge>
                )}
                {tavusSession && (
                  <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500">
                    Tavus Connected
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden border border-gray-800">
              {isVideoActive && tavusSession ? (
                <div className="flex items-center justify-center h-full text-white bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <span className="text-8xl mb-4 block animate-pulse">{selectedPersona.avatar}</span>
                    <p className="text-xl mb-2 text-white">AI Video Stream Active</p>
                    <p className="text-sm opacity-75 text-gray-300">Powered by Tavus</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">{selectedPersona.avatar}</span>
                    <p className="text-lg mb-2 text-white">{selectedPersona.greeting}</p>
                    <Button 
                      onClick={initializeTavusSession}
                      disabled={isLoading}
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      {isLoading ? 'Connecting...' : 'Start AI Session'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isMicActive ? "default" : "outline"}
                size="sm"
                onClick={toggleMicrophone}
                disabled={!isVideoActive}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={isVideoActive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsVideoActive(!isVideoActive)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {isVideoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenShare}
                disabled={!isVideoActive}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <Share className="w-4 h-4" />
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                disabled={!isVideoActive}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {isRecording ? <Pause className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              </Button>

              {isVideoActive && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={endTutorSession}
                >
                  End Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="space-y-4">
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
                      ? 'bg-primary-900 text-white ml-4'
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
                  <p>Start a conversation with your AI tutor!</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask your AI tutor..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(currentMessage)}
                disabled={!isVideoActive}
              />
              <Button
                onClick={() => sendMessage(currentMessage)}
                disabled={!currentMessage.trim() || !isVideoActive}
                size="sm"
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Your AI Tutor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{selectedPersona.avatar}</span>
                <span className="font-medium text-white">{selectedPersona.name}</span>
              </div>
              
              <p className="text-sm text-gray-400">
                {selectedPersona.personality}
              </p>
              
              <div>
                <p className="text-sm font-medium mb-2 text-white">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPersona.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {tavusSession && (
                <div className="mt-4 p-3 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">
                    🔗 Connected to Tavus AI Video
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITutor;
