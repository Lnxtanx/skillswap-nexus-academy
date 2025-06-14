
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Headphones, Eye } from 'lucide-react';
import AITutor from '@/components/ai-tutor/AITutor';
import VoiceInterface from '@/components/voice/VoiceInterface';
import HandsFreeLearning from '@/components/voice/HandsFreeLearning';
import { useCourse } from '@/hooks/useCourses';
import { useVoicePreferences } from '@/hooks/useVoicePreferences';
import type { TutorSessionData } from '@/types/tutor';

const TutorSession: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(courseId ? parseInt(courseId) : 0);
  const { preferences } = useVoicePreferences();
  
  const [activeMode, setActiveMode] = useState<'visual' | 'voice' | 'handsfree'>('visual');

  // Sample course content for hands-free mode
  const courseContent = [
    "Welcome to this lesson. Today we'll be learning about React hooks and state management.",
    "React hooks are functions that let you use state and other React features in functional components.",
    "The useState hook is the most commonly used hook for managing component state.",
    "Let's look at an example of how to use useState in a component.",
    "The useEffect hook lets you perform side effects in functional components.",
    "Remember to always include dependencies in your useEffect dependency array.",
    "This concludes our lesson on React hooks. Great job!"
  ];

  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const handleSessionComplete = (sessionData: TutorSessionData) => {
    console.log('Session completed:', sessionData);
    navigate(`/learn`);
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    switch (command) {
      case 'next lesson':
        if (currentContentIndex < courseContent.length - 1) {
          setCurrentContentIndex(currentContentIndex + 1);
        }
        break;
      case 'previous lesson':
        if (currentContentIndex > 0) {
          setCurrentContentIndex(currentContentIndex - 1);
        }
        break;
      case 'switch to hands-free':
        setActiveMode('handsfree');
        break;
      case 'switch to visual':
        setActiveMode('visual');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Course not found
          </h1>
          <Button 
            onClick={() => navigate('/learn')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/learn')}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">SkillSwap AI Tutor Session</h1>
              <p className="text-gray-400">
                {course.title} {lessonId && `- Lesson ${lessonId}`}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => setActiveMode('visual')}
              className={`${
                activeMode === 'visual' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white border border-gray-600`}
            >
              <Eye className="mr-1 h-4 w-4" />
              Visual
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveMode('voice')}
              className={`${
                activeMode === 'voice' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white border border-gray-600`}
            >
              <Headphones className="mr-1 h-4 w-4" />
              Voice
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveMode('handsfree')}
              className={`${
                activeMode === 'handsfree' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white border border-gray-600`}
            >
              <Headphones className="mr-1 h-4 w-4" />
              Hands-Free
            </Button>
          </div>
        </div>

        {/* Content Based on Active Mode */}
        {activeMode === 'visual' && (
          <AITutor
            courseId={course.id}
            courseCategory={course.category || 'programming'}
            lessonId={lessonId}
            onSessionComplete={handleSessionComplete}
          />
        )}

        {activeMode === 'voice' && (
          <div className="space-y-6">
            <VoiceInterface
              courseContent={courseContent[currentContentIndex]}
              currentLesson={`${course.title} - Lesson ${lessonId || '1'}`}
              onVoiceCommand={handleVoiceCommand}
              isHandsFreeMode={false}
              disabled={false}
            />
            
            {/* Visual AI Tutor in background for voice mode */}
            <div className="opacity-50">
              <AITutor
                courseId={course.id}
                courseCategory={course.category || 'programming'}
                lessonId={lessonId}
                onSessionComplete={handleSessionComplete}
              />
            </div>
          </div>
        )}

        {activeMode === 'handsfree' && (
          <HandsFreeLearning
            courseContent={courseContent}
            currentIndex={currentContentIndex}
            onIndexChange={setCurrentContentIndex}
            title={`${course.title} - Hands-Free Learning`}
          />
        )}
      </div>
    </div>
  );
};

export default TutorSession;
