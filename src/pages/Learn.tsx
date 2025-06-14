
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Learn = () => {
  const navigate = useNavigate();

  // AI-powered enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Complete React Development with AI Tutor",
      instructor: "Code Master 🧑‍💻",
      price: "Enrolled",
      level: "Intermediate" as const,
      rating: 4.9,
      students: 2341,
      duration: "8 weeks",
      category: "programming",
      progress: 65
    },
    {
      id: 2,
      title: "Physics & Chemistry Mastery",
      instructor: "Professor Pine 👨‍🔬",
      price: "Enrolled",
      level: "Beginner" as const,
      rating: 4.9,
      students: 1203,
      duration: "10 weeks",
      category: "science",
      progress: 30
    }
  ];

  const aiPersonas = [
    {
      id: 'code-master',
      name: 'Code Master',
      avatar: '🧑‍💻',
      specialty: 'Programming & Tech',
      description: 'Expert in JavaScript, Python, React, and more',
      courses: 2,
      category: 'programming'
    },
    {
      id: 'professor-pine',
      name: 'Professor Pine',
      avatar: '👨‍🔬',
      specialty: 'Sciences',
      description: 'Physics, Chemistry, Biology, and Mathematics',
      courses: 1,
      category: 'science'
    },
    {
      id: 'chef-charlie',
      name: 'Chef Charlie',
      avatar: '👨‍🍳',
      specialty: 'Culinary Arts',
      description: 'French cuisine, baking, and cooking techniques',
      courses: 1,
      category: 'cooking'
    },
    {
      id: 'sensei-sam',
      name: 'Sensei Sam',
      avatar: '🥋',
      specialty: 'Physical Training',
      description: 'Martial arts, fitness, and mind-body connection',
      courses: 1,
      category: 'physical'
    },
    {
      id: 'language-luna',
      name: 'Language Luna',
      avatar: '🗣️',
      specialty: 'Languages',
      description: 'Multilingual communication and cultural studies',
      courses: 1,
      category: 'language'
    }
  ];

  const handleStartAITutor = (courseId: number) => {
    navigate(`/tutor/${courseId}`);
  };

  const handleExplorePersona = (category: string) => {
    navigate(`/courses?category=${category}`);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Your AI Learning Journey
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Continue your progress with personalized AI tutors and discover new skills
            </p>
          </div>
        </div>
      </section>

      {/* Learning Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'AI Courses Enrolled', value: '6', icon: '🤖' },
              { label: 'Hours with AI Tutors', value: '156', icon: '⏱️' },
              { label: 'AI Certificates Earned', value: '8', icon: '🏆' },
              { label: 'Learning Streak', value: '23', icon: '🔥' }
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

      {/* AI Tutors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
            Meet Your AI Tutors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {aiPersonas.map((persona) => (
              <div key={persona.id} className="glass-card p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{persona.avatar}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {persona.name}
                  </h3>
                  <p className="text-primary-500 font-medium">{persona.specialty}</p>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center">
                  {persona.description}
                </p>
                
                <div className="text-center mb-4">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm">
                    {persona.courses} Course{persona.courses > 1 ? 's' : ''} Available
                  </span>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  onClick={() => handleExplorePersona(persona.category)}
                >
                  Start Learning
                </Button>
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
              Continue Learning with AI
            </h2>
            <Button variant="outline" className="glass border-white/30 hover:bg-white/10">
              View All Progress
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="relative">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{course.instructor.split(' ').pop()}</span>
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      AI Tutor
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold gradient-text">{course.price}</span>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>⭐ {course.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{course.students} students</span>
                    <span className="mx-2">•</span>
                    <span>{course.level}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 mb-4"
                    onClick={() => handleStartAITutor(course.id)}
                  >
                    Continue with AI Tutor
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 glass rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's AI Study Plan */}
          <div className="glass-card mb-12">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Today's AI Learning Plan
            </h3>
            <div className="space-y-4">
              {[
                { course: 'React Development', lesson: 'State Management with AI Guidance', duration: '45 min', tutor: '🧑‍💻', completed: false },
                { course: 'Physics Mastery', lesson: 'Quantum Mechanics with Professor Pine', duration: '30 min', tutor: '👨‍🔬', completed: true },
                { course: 'React Development', lesson: 'Testing Components with AI', duration: '35 min', tutor: '🧑‍💻', completed: false }
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
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.tutor}</span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {item.lesson}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.course} • {item.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!item.completed && (
                    <Button size="sm" className="bg-gradient-to-r from-primary-500 to-secondary-500">
                      Start with AI
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;
