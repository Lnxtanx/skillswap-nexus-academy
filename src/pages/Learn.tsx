
import React from 'react';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';

const Learn = () => {
  const enrolledCourses = [
    {
      title: "Complete React Development Course",
      instructor: "Sarah Johnson",
      price: "Enrolled",
      level: "Intermediate" as const,
      rating: 4.8,
      students: 2341,
      duration: "8 weeks"
    },
    {
      title: "Python for Data Science",
      instructor: "Dr. Michael Chen",
      price: "Enrolled",
      level: "Beginner" as const,
      rating: 4.9,
      students: 1876,
      duration: "6 weeks"
    }
  ];

  const recommendedCourses = [
    {
      title: "Advanced JavaScript Concepts",
      instructor: "Alex Kim",
      price: "$119",
      level: "Advanced" as const,
      rating: 4.7,
      students: 892,
      duration: "6 weeks"
    },
    {
      title: "Machine Learning Basics",
      instructor: "Dr. Lisa Park",
      price: "$139",
      level: "Intermediate" as const,
      rating: 4.8,
      students: 1456,
      duration: "8 weeks"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Your Learning Journey
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Continue your progress and discover new skills to advance your career
            </p>
          </div>
        </div>
      </section>

      {/* Learning Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Courses Enrolled', value: '12', icon: '📚' },
              { label: 'Hours Learned', value: '156', icon: '⏱️' },
              { label: 'Certificates Earned', value: '8', icon: '🏆' },
              { label: 'Streak Days', value: '23', icon: '🔥' }
            ].map((stat, index) => (
              <div key={index} className="glass-card text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">
              Continue Learning
            </h2>
            <Button variant="outline" className="glass border-white/30 hover:bg-white/10">
              View All Progress
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {enrolledCourses.map((course, index) => (
              <div key={index} className="relative">
                <CourseCard {...course} />
                {/* Progress Bar */}
                <div className="mt-4 glass rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium">
                      {index === 0 ? '65%' : '30%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: index === 0 ? '65%' : '30%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Study Plan */}
          <div className="glass-card mb-12">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Today's Study Plan
            </h3>
            <div className="space-y-4">
              {[
                { course: 'React Development', lesson: 'State Management with Redux', duration: '45 min', completed: false },
                { course: 'Python Data Science', lesson: 'Data Visualization with Matplotlib', duration: '30 min', completed: true },
                { course: 'React Development', lesson: 'Testing React Components', duration: '35 min', completed: false }
              ].map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg glass ${item.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.completed 
                        ? 'bg-secondary-500 border-secondary-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {item.completed && '✓'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {item.lesson}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.course} • {item.duration}
                      </div>
                    </div>
                  </div>
                  {!item.completed && (
                    <Button size="sm" className="bg-gradient-to-r from-primary-500 to-secondary-500">
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold gradient-text mb-8">
            Recommended for You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommendedCourses.map((course, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;
