
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface Enrollment {
  id: string;
  progress_percentage: number | null;
  last_accessed: string | null;
  course: {
    id: number;
    title: string;
    description: string;
    instructor: {
      full_name: string;
    } | null;
  };
}

interface ActiveCoursesProps {
  enrollments: Enrollment[];
}

const ActiveCourses: React.FC<ActiveCoursesProps> = ({ enrollments }) => {
  const activeCourses = enrollments
    .filter(enrollment => (enrollment.progress_percentage || 0) < 100)
    .slice(0, 3); // Show top 3 active courses

  if (activeCourses.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold gradient-text mb-6">Continue Learning</h2>
        <div className="ai-card text-center">
          <p className="text-gray-400 mb-4">No active courses found</p>
          <Link to="/courses">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold gradient-text mb-6">Continue Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCourses.map((enrollment) => {
          const progress = enrollment.progress_percentage || 0;
          const timeRemaining = Math.max(1, Math.ceil((100 - progress) / 20)); // Estimate remaining hours
          
          return (
            <div key={enrollment.id} className="ai-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white truncate">{enrollment.course.title}</h3>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded text-xs">
                  AI Tutor
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                {enrollment.course.instructor?.full_name || 'AI Instructor'} 🧑‍💻
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="gradient-text font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Next Session:</p>
                <p className="text-white font-medium truncate">{enrollment.course.description}</p>
                <p className="text-xs text-gray-500">{timeRemaining} hours remaining</p>
              </div>
              <Link to={`/tutor/${enrollment.course.id}`}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                  Continue Learning
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveCourses;
