
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();

  // AI-powered courses matching our 5 personas
  const courses = [
    {
      id: 1,
      title: "Complete React Development with AI Tutor",
      instructor: "Code Master 🧑‍💻",
      price: "$99",
      level: "Intermediate" as const,
      rating: 4.9,
      students: 2341,
      duration: "8 weeks",
      category: "programming",
      description: "Master React with personalized AI guidance from Code Master. Learn modern development practices with hands-on projects.",
      hasAITutor: true
    },
    {
      id: 2,
      title: "Python Programming Fundamentals",
      instructor: "Code Master 🧑‍💻",
      price: "$79",
      level: "Beginner" as const,
      rating: 4.8,
      students: 1876,
      duration: "6 weeks",
      category: "programming",
      description: "Build solid Python foundations with AI-powered learning and real-world applications.",
      hasAITutor: true
    },
    {
      id: 3,
      title: "Physics & Chemistry Mastery",
      instructor: "Professor Pine 👨‍🔬",
      price: "$129",
      level: "Intermediate" as const,
      rating: 4.9,
      students: 1203,
      duration: "10 weeks",
      category: "science",
      description: "Explore the wonders of science with Professor Pine's expert AI guidance and interactive experiments.",
      hasAITutor: true
    },
    {
      id: 4,
      title: "Advanced Physics Research",
      instructor: "Professor Pine 👨‍🔬",
      price: "$159",
      level: "Advanced" as const,
      rating: 4.8,
      students: 567,
      duration: "12 weeks",
      category: "science",
      description: "Dive deep into advanced physics concepts with AI-assisted research and analysis.",
      hasAITutor: true
    },
    {
      id: 5,
      title: "Culinary Arts & French Cuisine",
      instructor: "Chef Charlie 👨‍🍳",
      price: "$149",
      level: "Beginner" as const,
      rating: 4.8,
      students: 892,
      duration: "8 weeks",
      category: "cooking",
      description: "Learn professional cooking techniques and French cuisine mastery with Chef Charlie's AI guidance.",
      hasAITutor: true
    },
    {
      id: 6,
      title: "Advanced Baking & Pastry",
      instructor: "Chef Charlie 👨‍🍳",
      price: "$169",
      level: "Advanced" as const,
      rating: 4.9,
      students: 623,
      duration: "10 weeks",
      category: "cooking",
      description: "Master the art of baking and pastry with AI-powered technique refinement.",
      hasAITutor: true
    },
    {
      id: 7,
      title: "Martial Arts & Fitness Training",
      instructor: "Sensei Sam 🥋",
      price: "$119",
      level: "Beginner" as const,
      rating: 4.7,
      students: 1534,
      duration: "12 weeks",
      category: "physical",
      description: "Master martial arts and physical fitness with Sensei Sam's disciplined AI training approach.",
      hasAITutor: true
    },
    {
      id: 8,
      title: "Advanced Combat Techniques",
      instructor: "Sensei Sam 🥋",
      price: "$179",
      level: "Advanced" as const,
      rating: 4.8,
      students: 789,
      duration: "16 weeks",
      category: "physical",
      description: "Advanced martial arts training with AI-powered form correction and technique analysis.",
      hasAITutor: true
    },
    {
      id: 9,
      title: "Multilingual Communication Skills",
      instructor: "Language Luna 🗣️",
      price: "$89",
      level: "Beginner" as const,
      rating: 4.8,
      students: 1456,
      duration: "6 weeks",
      category: "language",
      description: "Learn multiple languages with Luna's cultural expertise and AI-powered pronunciation coaching.",
      hasAITutor: true
    },
    {
      id: 10,
      title: "Advanced Language Immersion",
      instructor: "Language Luna 🗣️",
      price: "$139",
      level: "Advanced" as const,
      rating: 4.9,
      students: 834,
      duration: "8 weeks",
      category: "language",
      description: "Deep cultural and linguistic immersion with AI-powered conversation practice.",
      hasAITutor: true
    }
  ];

  const handleStartAITutor = (courseId: number) => {
    navigate(`/tutor/${courseId}`);
  };

  return (
    <div className="min-h-screen pt-20 bg-black text-white">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            AI-Powered Learning Experience
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Learn with personalized AI tutors that adapt to your learning style and provide real-time guidance
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {courses.length} AI-Powered Courses
              </h2>
              <p className="text-gray-400">
                Each course includes a dedicated AI tutor for personalized learning
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course.id} className="animate-slide-up ai-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{course.instructor.split(' ').pop()}</span>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    AI Tutor
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {course.title}
                </h3>
                
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold gradient-text">{course.price}</span>
                  <span className="text-sm text-gray-400">{course.duration}</span>
                </div>
                
                <div className="flex items-center mb-6 text-sm text-gray-400">
                  <span className="text-yellow-400">⭐ {course.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{course.students} students</span>
                  <span className="mx-2">•</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-xs">{course.level}</span>
                </div>
                
                <Button 
                  className="w-full ai-button py-3"
                  onClick={() => handleStartAITutor(course.id)}
                >
                  Start with AI Tutor
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
