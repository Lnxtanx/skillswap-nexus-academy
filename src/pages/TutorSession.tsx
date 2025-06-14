
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AITutor from '@/components/ai-tutor/AITutor';
import { useCourse } from '@/hooks/useCourses';
import type { TutorSessionData } from '@/types/tutor';

const TutorSession: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(courseId ? parseInt(courseId) : 0);

  const handleSessionComplete = (sessionData: TutorSessionData) => {
    console.log('Session completed:', sessionData);
    navigate(`/learn`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Course not found
          </h1>
          <Button onClick={() => navigate('/learn')}>
            Return to Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/learn')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">AI Tutor Session</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {course.title} {lessonId && `- Lesson ${lessonId}`}
              </p>
            </div>
          </div>
        </div>

        {/* AI Tutor Component */}
        <AITutor
          courseId={course.id}
          courseCategory={course.category || 'programming'}
          lessonId={lessonId}
          onSessionComplete={handleSessionComplete}
        />
      </div>
    </div>
  );
};

export default TutorSession;
