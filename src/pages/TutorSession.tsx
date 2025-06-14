
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Headphones, Eye } from 'lucide-react';
import AITutor from '@/components/ai-tutor/AITutor';
import VoiceInterface from '@/components/voice/VoiceInterface';
import { useCourse } from '@/hooks/useCourses';
import type { TutorSessionData } from '@/types/tutor';

const TutorSession: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(courseId ? parseInt(courseId) : 0);
  
  const [activeMode, setActiveMode] = useState<'visual' | 'voice'>('visual');

  const handleSessionComplete = (sessionData: TutorSessionData) => {
    console.log('Session completed:', sessionData);
    navigate(`/learn`);
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
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
              Visual Mode
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
              Voice Mode
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
          <VoiceInterface
            courseContent={`Welcome to ${course.title}. This course covers ${course.description || 'various topics in ' + course.category}.`}
            currentLesson={`${course.title} - Lesson ${lessonId || '1'}`}
            onVoiceCommand={handleVoiceCommand}
            isHandsFreeMode={false}
            disabled={false}
            courseCategory={course.category || 'programming'}
            courseTitle={course.title}
          />
        )}
      </div>
    </div>
  );
};

export default TutorSession;
