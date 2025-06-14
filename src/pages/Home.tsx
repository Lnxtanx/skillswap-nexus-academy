
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredCourses = [
    {
      title: "Complete React Development with AI Tutor",
      instructor: "Code Master 🧑‍💻",
      price: "$99",
      level: "Intermediate" as const,
      rating: 4.8,
      students: 2341,
      duration: "8 weeks"
    },
    {
      title: "Physics & Chemistry Mastery",
      instructor: "Professor Pine 👨‍🔬",
      price: "$129",
      level: "Beginner" as const,
      rating: 4.9,
      students: 1203,
      duration: "10 weeks"
    },
    {
      title: "Advanced Culinary Arts",
      instructor: "Chef Charlie 👨‍🍳",
      price: "$149",
      level: "Advanced" as const,
      rating: 4.7,
      students: 892,
      duration: "8 weeks"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
              Learn with AI Tutors,<br />
              <span className="text-3xl md:text-5xl">Master Any Skill</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Experience the future of education with personalized AI tutors that adapt to your learning style and provide real-time guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-12 py-4 text-lg font-medium">
                  Start Learning with AI
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-12 py-4 text-lg font-medium">
                  View My Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'AI Tutors', value: '5', icon: '🤖' },
              { label: 'Active Learners', value: '50K+', icon: '👥' },
              { label: 'AI-Powered Courses', value: '10+', icon: '📚' },
              { label: 'Success Rate', value: '97%', icon: '🏆' }
            ].map((stat, index) => (
              <div key={index} className="text-center ai-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Personas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Meet Your AI Tutors
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Each AI tutor is specialized in their field with unique personalities and teaching styles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Code Master', avatar: '🧑‍💻', specialty: 'Programming & Tech', desc: 'Expert in modern development' },
              { name: 'Professor Pine', avatar: '👨‍🔬', specialty: 'Sciences', desc: 'Research and scientific methods' },
              { name: 'Chef Charlie', avatar: '👨‍🍳', specialty: 'Culinary Arts', desc: 'French cuisine mastery' },
              { name: 'Sensei Sam', avatar: '🥋', specialty: 'Physical Training', desc: 'Martial arts & fitness' },
              { name: 'Language Luna', avatar: '🗣️', specialty: 'Languages', desc: 'Multilingual communication' }
            ].map((tutor, index) => (
              <div key={index} className="ai-card text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl mb-4">{tutor.avatar}</div>
                <h3 className="text-xl font-bold text-white mb-2">{tutor.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{tutor.specialty}</p>
                <p className="text-gray-400 text-sm">{tutor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Popular AI-Powered Courses
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Start learning with our most popular AI-guided courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredCourses.map((course, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="ai-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{course.instructor.split(' ').pop()}</span>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      AI Tutor
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                  
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
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-3">
                    Start with AI Tutor
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-3">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto ai-card">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of learners already experiencing the future of education with AI tutors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4">
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-4">
                  View Learning Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
