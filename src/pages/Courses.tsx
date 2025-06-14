
import React, { useState } from 'react';
import CourseCard from '@/components/CourseCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = [
    'all', 'Programming', 'Science', 'Cooking', 'Physical', 'Language'
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

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
      description: "Learn React with personalized AI guidance from Code Master",
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
      description: "Master Python basics with AI-powered learning",
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
      description: "Explore sciences with Professor Pine's expert guidance",
      hasAITutor: true
    },
    {
      id: 4,
      title: "Culinary Arts & French Cuisine",
      instructor: "Chef Charlie 👨‍🍳",
      price: "$149",
      level: "Beginner" as const,
      rating: 4.8,
      students: 892,
      duration: "8 weeks",
      category: "cooking",
      description: "Learn professional cooking techniques with Chef Charlie",
      hasAITutor: true
    },
    {
      id: 5,
      title: "Martial Arts & Fitness Training",
      instructor: "Sensei Sam 🥋",
      price: "$119",
      level: "Beginner" as const,
      rating: 4.7,
      students: 1534,
      duration: "12 weeks",
      category: "physical",
      description: "Master martial arts and physical fitness with Sensei Sam",
      hasAITutor: true
    },
    {
      id: 6,
      title: "Multilingual Communication Skills",
      instructor: "Language Luna 🗣️",
      price: "$89",
      level: "Beginner" as const,
      rating: 4.8,
      students: 1456,
      duration: "6 weeks",
      category: "language",
      description: "Learn multiple languages with Luna's cultural expertise",
      hasAITutor: true
    }
  ];

  const handleStartAITutor = (courseId: number) => {
    navigate(`/tutor/${courseId}`);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            AI-Powered Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Learn with personalized AI tutors that adapt to your learning style and pace
          </p>
          <SearchBar onSearch={(query) => console.log('Searching:', query)} />
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 glass border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                      : "glass border-white/30 hover:bg-white/10"
                    }
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Difficulty Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className={selectedLevel === level 
                      ? "bg-gradient-to-r from-accent-500 to-primary-500 text-white"
                      : "glass border-white/30 hover:bg-white/10"
                    }
                  >
                    {level === 'all' ? 'All Levels' : level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {courses.length} AI-Powered Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Each course includes a dedicated AI tutor for personalized learning
              </p>
            </div>
            
            <select className="glass rounded-lg px-4 py-2 border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white">
              <option>Sort by Popularity</option>
              <option>Sort by Rating</option>
              <option>Sort by Price: Low to High</option>
              <option>Sort by Price: High to Low</option>
              <option>Sort by Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course.id} className="animate-slide-up relative" style={{ animationDelay: `${index * 0.1}s` }}>
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
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {course.description}
                  </p>
                  
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
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500"
                      onClick={() => handleStartAITutor(course.id)}
                    >
                      Start with AI Tutor
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
