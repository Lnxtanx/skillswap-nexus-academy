
import React from 'react';
import { Book, Clock, Trophy, Target } from 'lucide-react';

interface Enrollment {
  id: string;
  progress_percentage: number | null;
  completed_at: string | null;
  course: {
    title: string;
    duration: number;
  };
}

interface LearningStatsProps {
  enrollments: Enrollment[];
}

const LearningStats: React.FC<LearningStatsProps> = ({ enrollments }) => {
  const stats = {
    coursesEnrolled: enrollments.length,
    hoursLearned: Math.round(
      enrollments.reduce((total, enrollment) => {
        const progress = enrollment.progress_percentage || 0;
        const courseDuration = enrollment.course.duration || 0;
        return total + (courseDuration * progress / 100);
      }, 0) / 60
    ),
    achievements: enrollments.filter(e => e.completed_at).length,
    goalsCompleted: enrollments.filter(e => (e.progress_percentage || 0) >= 75).length,
  };

  const statItems = [
    { icon: Book, label: 'Courses Enrolled', value: stats.coursesEnrolled.toString(), color: 'text-blue-400' },
    { icon: Clock, label: 'Hours Learned', value: stats.hoursLearned.toString(), color: 'text-green-400' },
    { icon: Trophy, label: 'Achievements', value: stats.achievements.toString(), color: 'text-yellow-400' },
    { icon: Target, label: 'Goals Completed', value: stats.goalsCompleted.toString(), color: 'text-purple-400' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statItems.map((stat, index) => (
        <div key={index} className="ai-card text-center">
          <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
          <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default LearningStats;
