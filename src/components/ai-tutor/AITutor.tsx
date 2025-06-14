
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Share, Save, Play, Pause, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTutorSession } from '@/hooks/useTutorSession';
import { AIPersona, TutorSessionData } from '@/types/tutor';
import { supabase } from '@/integrations/supabase/client';

interface AITutorProps {
  courseId?: number;
  courseCategory?: string;
  lessonId?: string;
  onSessionComplete?: (sessionData: TutorSessionData) => void;
}

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
  
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(
    AI_PERSONAS[courseCategory] || AI_PERSONAS['programming']
  );
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);

  const {
    createSession,
    endSession,
    saveConversation,
    sessionId
  } = useTutorSession();

  useEffect(() => {
    if (courseCategory && AI_PERSONAS[courseCategory]) {
      setSelectedPersona(AI_PERSONAS[courseCategory]);
    }
  }, [courseCategory]);

  const startTutorSession = async () => {
    try {
      setIsLoading(true);
      
      const sessionData = await createSession({
        replicaId: selectedPersona.tavusReplicaId,
        userId: user?.id,
        courseId,
        lessonId,
        personaId: selectedPersona.id
      });

      setIsSessionActive(true);
      
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
      console.error('Failed to start tutor session:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI tutor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      setIsAIResponding(true);

      // Send message to Gemini API
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: message,
          context: {
            persona: selectedPersona.name,
            personality: selectedPersona.personality,
            course: `Course ID: ${courseId}`,
            category: courseCategory,
            lesson: lessonId ? `Lesson ${lessonId}` : 'Introduction'
          }
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date().toISOString(),
        persona: selectedPersona.id
      };
      
      setConversationHistory(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
        persona: selectedPersona.id
      };
      setConversationHistory(prev => [...prev, errorResponse]);
      
      toast({
        title: "Message Error",
        description: "Failed to get response from AI tutor",
        variant: "destructive",
      });
    } finally {
      setIsAIResponding(false);
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
    setIsSessionActive(false);
    setIsMicActive(false);
    setIsRecording(false);
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden border border-gray-800">
              {isSessionActive ? (
                <div className="flex items-center justify-center h-full text-white bg-gradient-to-br from-blue-900 to-purple-900">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <span className="text-8xl block animate-bounce">{selectedPersona.avatar}</span>
                      {isAIResponding && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xl mb-2 text-white">{selectedPersona.name} is here!</p>
                    <p className="text-sm opacity-75 text-gray-300">Ready to teach you about {courseCategory}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">{selectedPersona.avatar}</span>
                    <p className="text-lg mb-4 text-white">Meet your AI tutor for {courseCategory}</p>
                    <Button 
                      onClick={startTutorSession}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? 'Connecting...' : 'Start Learning Session'}
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
                disabled={!isSessionActive}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                disabled={!isSessionActive}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {isRecording ? <Pause className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              </Button>

              {isSessionActive && (
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
            <CardTitle className="text-white">Chat with {selectedPersona.name}</CardTitle>
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
              {isAIResponding && (
                <div className="bg-gray-800 text-white mr-4 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{selectedPersona.name} is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              {conversationHistory.length === 0 && !isSessionActive && (
                <div className="text-center text-gray-400 py-8">
                  <p>Start a session to chat with your AI tutor!</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder={isSessionActive ? `Ask ${selectedPersona.name} about ${courseCategory}...` : "Start a session to chat"}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(currentMessage)}
                disabled={!isSessionActive || isAIResponding}
              />
              <Button
                onClick={() => sendMessage(currentMessage)}
                disabled={!currentMessage.trim() || !isSessionActive || isAIResponding}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4" />
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITutor;
