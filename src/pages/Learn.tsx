import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Book, Clock, Trophy, Target, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Learn = () => {
  const navigate = useNavigate();

  const learningStats = [
    { icon: Book, label: 'Courses Enrolled', value: '3', color: 'text-blue-400' },
    { icon: Clock, label: 'Hours Learned', value: '24', color: 'text-green-400' },
    { icon: Trophy, label: 'Achievements', value: '8', color: 'text-yellow-400' },
    { icon: Target, label: 'Goals Completed', value: '5', color: 'text-purple-400' }
  ];

  const currentCourses = [
    {
      title: "React Development",
      tutor: "Code Master 🧑‍💻",
      progress: 65,
      nextLesson: "State Management",
      timeLeft: "2 hours"
    },
    {
      title: "Physics Mastery",
      tutor: "Professor Pine 👨‍🔬",
      progress: 40,
      nextLesson: "Quantum Mechanics",
      timeLeft: "1.5 hours"
    },
    {
      title: "Culinary Arts",
      tutor: "Chef Charlie 👨‍🍳",
      progress: 80,
      nextLesson: "Advanced Sauces",
      timeLeft: "45 minutes"
    }
  ];

  const aiTutors = [
    { name: 'Code Master', avatar: '🧑‍💻', specialty: 'Programming', status: 'Available' },
    { name: 'Professor Pine', avatar: '👨‍🔬', specialty: 'Sciences', status: 'In Session' },
    { name: 'Chef Charlie', avatar: '👨‍🍳', specialty: 'Culinary', status: 'Available' },
    { name: 'Sensei Sam', avatar: '🥋', specialty: 'Fitness', status: 'Available' },
    { name: 'Language Luna', avatar: '🗣️', specialty: 'Languages', status: 'Available' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => navigate(-1)}
            className="mr-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Learning Dashboard</h1>
            <p className="text-gray-300">Track your progress with AI tutors</p>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Book, label: 'Courses Enrolled', value: '3', color: 'text-blue-400' },
            { icon: Clock, label: 'Hours Learned', value: '24', color: 'text-green-400' },
            { icon: Trophy, label: 'Achievements', value: '8', color: 'text-yellow-400' },
            { icon: Target, label: 'Goals Completed', value: '5', color: 'text-purple-400' }
          ].map((stat, index) => (
            <div key={index} className="ai-card text-center">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Current Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold gradient-text mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "React Development",
                tutor: "Code Master 🧑‍💻",
                progress: 65,
                nextLesson: "State Management",
                timeLeft: "2 hours"
              },
              {
                title: "Physics Mastery",
                tutor: "Professor Pine 👨‍🔬",
                progress: 40,
                nextLesson: "Quantum Mechanics",
                timeLeft: "1.5 hours"
              },
              {
                title: "Culinary Arts",
                tutor: "Chef Charlie 👨‍🍳",
                progress: 80,
                nextLesson: "Advanced Sauces",
                timeLeft: "45 minutes"
              }
            ].map((course, index) => (
              <div key={index} className="ai-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">{course.title}</h3>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded text-xs">
                    AI Tutor
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{course.tutor}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="gradient-text font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Next Lesson:</p>
                  <p className="text-white font-medium">{course.nextLesson}</p>
                  <p className="text-xs text-gray-500">{course.timeLeft} remaining</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                  Continue Learning
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutors Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold gradient-text mb-6">Meet Your AI Tutors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Code Master', avatar: '🧑‍💻', specialty: 'Programming', status: 'Available' },
              { name: 'Professor Pine', avatar: '👨‍🔬', specialty: 'Sciences', status: 'In Session' },
              { name: 'Chef Charlie', avatar: '👨‍🍳', specialty: 'Culinary', status: 'Available' },
              { name: 'Sensei Sam', avatar: '🥋', specialty: 'Fitness', status: 'Available' },
              { name: 'Language Luna', avatar: '🗣️', specialty: 'Languages', status: 'Available' }
            ].map((tutor, index) => (
              <div key={index} className="ai-card text-center">
                <div className="text-4xl mb-3">{tutor.avatar}</div>
                <h3 className="font-bold text-white mb-1">{tutor.name}</h3>
                <p className="text-blue-400 text-sm mb-2">{tutor.specialty}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  tutor.status === 'Available' 
                    ? 'bg-green-900 text-green-400' 
                    : 'bg-orange-900 text-orange-400'
                }`}>
                  {tutor.status}
                </span>
                <Button 
                  className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                  size="sm"
                  disabled={tutor.status !== 'Available'}
                >
                  {tutor.status === 'Available' ? 'Start Session' : 'Busy'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/courses">
            <Button className="w-full h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg">
              Browse New Courses
            </Button>
          </Link>
          <Button className="w-full h-20 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 text-lg">
            View Achievements
          </Button>
          <Button className="w-full h-20 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 text-lg">
            Study Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learn;
