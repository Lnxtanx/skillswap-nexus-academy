
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import CourseCard from '@/components/CourseCard';
import UserProfile from '@/components/UserProfile';

const Home = () => {
  const featuredCourses = [
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
    }
  ];

  const topInstructors = [
    {
      name: "Sarah Johnson",
      title: "Full-Stack Developer & Instructor",
      coursesCompleted: 15,
      coursesTeaching: 8,
      rating: 4.9
    },
    {
      name: "Dr. Michael Chen",
      title: "Data Science Expert",
      coursesCompleted: 22,
      coursesTeaching: 12,
      rating: 4.8
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
              Learn Anything, Teach Everything,<br />
              <span className="text-3xl md:text-5xl">Earn NFT Certificates</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the future of education where knowledge has no boundaries and achievements are permanently verified on the blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 text-lg font-medium animate-glow">
                  Start Learning Today
                </Button>
              </Link>
              <Link to="/teach">
                <Button size="lg" variant="outline" className="glass border-white/30 px-8 py-4 text-lg font-medium hover:bg-white/10">
                  Become an Instructor
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="animate-slide-up">
              <SearchBar onSearch={(query) => console.log('Searching for:', query)} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Active Learners', value: '50K+', icon: '👥' },
              { label: 'Expert Instructors', value: '1.2K+', icon: '🎓' },
              { label: 'Courses Available', value: '15K+', icon: '📚' },
              { label: 'NFT Certificates', value: '25K+', icon: '🏆' }
            ].map((stat, index) => (
              <div key={index} className="text-center glass-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
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
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most popular courses taught by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredCourses.map((course, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" variant="outline" className="glass border-white/30 hover:bg-white/10">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Meet Our Top Instructors
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Learn from industry leaders and passionate educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {topInstructors.map((instructor, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <UserProfile {...instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto glass-card">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Ready to Transform Your Future?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of learners earning verified certificates and building meaningful careers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/teach">
                <Button size="lg" variant="outline" className="glass border-white/30 px-8 py-4 hover:bg-white/10">
                  Start Teaching
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
