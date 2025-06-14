
import React, { useState } from 'react';
import CourseCard from '@/components/CourseCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = [
    'all', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Photography'
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const courses = [
    {
      title: "Complete React Development Course",
      instructor: "Sarah Johnson",
      price: "$99",
      level: "Intermediate" as const,
      rating: 4.8,
      students: 2341,
      duration: "8 weeks"
    },
    {
      title: "Python for Data Science",
      instructor: "Dr. Michael Chen",
      price: "$79",
      level: "Beginner" as const,
      rating: 4.9,
      students: 1876,
      duration: "6 weeks"
    },
    {
      title: "Advanced UI/UX Design",
      instructor: "Emma Rodriguez",
      price: "$129",
      level: "Advanced" as const,
      rating: 4.7,
      students: 945,
      duration: "10 weeks"
    },
    {
      title: "Digital Marketing Mastery",
      instructor: "James Wilson",
      price: "$89",
      level: "Beginner" as const,
      rating: 4.6,
      students: 1534,
      duration: "5 weeks"
    },
    {
      title: "Full-Stack JavaScript",
      instructor: "Alex Kim",
      price: "$149",
      level: "Advanced" as const,
      rating: 4.9,
      students: 892,
      duration: "12 weeks"
    },
    {
      title: "Photography Fundamentals",
      instructor: "Maria Santos",
      price: "$69",
      level: "Beginner" as const,
      rating: 4.5,
      students: 1203,
      duration: "4 weeks"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            All Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover thousands of courses from expert instructors and start your learning journey today
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
                {courses.length} Courses Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Showing courses for all categories and levels
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
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="glass border-white/30 hover:bg-white/10 px-8">
              Load More Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
