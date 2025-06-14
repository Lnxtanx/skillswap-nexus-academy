
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Complete React Development",
      persona: "Code Master",
      avatar: "🧑‍💻",
      description: "Master React from basics to advanced concepts with real-world projects",
      price: "$99",
      originalPrice: "$149",
      rating: 4.8,
      students: 2341,
      duration: "8 weeks",
      level: "Intermediate",
      topics: ["React Hooks", "State Management", "Testing", "Deployment"]
    },
    {
      id: 2,
      title: "Physics & Chemistry Mastery",
      persona: "Professor Pine",
      avatar: "👨‍🔬",
      description: "Comprehensive science education with lab experiments and real applications",
      price: "$129",
      originalPrice: "$199",
      rating: 4.9,
      students: 1203,
      duration: "10 weeks",
      level: "Beginner",
      topics: ["Quantum Physics", "Organic Chemistry", "Lab Techniques", "Research Methods"]
    },
    {
      id: 3,
      title: "Advanced Culinary Arts",
      persona: "Chef Charlie",
      avatar: "👨‍🍳",
      description: "Learn professional cooking techniques and French cuisine mastery",
      price: "$149",
      originalPrice: "$229",
      rating: 4.7,
      students: 892,
      duration: "8 weeks",
      level: "Advanced",
      topics: ["French Techniques", "Sauce Making", "Pastry Arts", "Menu Planning"]
    },
    {
      id: 4,
      title: "Martial Arts & Fitness",
      persona: "Sensei Sam",
      avatar: "🥋",
      description: "Complete physical training program with martial arts fundamentals",
      price: "$89",
      originalPrice: "$139",
      rating: 4.6,
      students: 1456,
      duration: "12 weeks",
      level: "Beginner",
      topics: ["Karate Basics", "Strength Training", "Flexibility", "Mental Discipline"]
    },
    {
      id: 5,
      title: "Multilingual Communication",
      persona: "Language Luna",
      avatar: "🗣️",
      description: "Master multiple languages with AI-powered conversation practice",
      price: "$119",
      originalPrice: "$179",
      rating: 4.8,
      students: 2156,
      duration: "16 weeks",
      level: "Intermediate",
      topics: ["Spanish", "French", "German", "Conversation Skills"]
    }
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
            <h1 className="text-4xl font-bold gradient-text mb-2">AI-Powered Courses</h1>
            <p className="text-gray-300">Learn with personalized AI tutors</p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="ai-card">
              {/* Course Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{course.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-blue-400">{course.persona}</h3>
                    <span className="text-xs text-gray-500">AI Tutor</span>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm">
                  AI Powered
                </span>
              </div>

              {/* Course Content */}
              <h2 className="text-xl font-bold text-white mb-3">{course.title}</h2>
              <p className="text-gray-400 mb-4 text-sm">{course.description}</p>

              {/* Course Topics */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {course.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Level Badge */}
              <div className="mb-4">
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {course.level}
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-2xl font-bold gradient-text">{course.price}</span>
                  <span className="text-gray-500 line-through ml-2">{course.originalPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link to={`/tutor/${course.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    Start with AI Tutor
                  </Button>
                </Link>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600">
                  Course Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
