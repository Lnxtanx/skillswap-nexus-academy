
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Teach = () => {
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    category: '',
    level: '',
    duration: '',
    price: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Course proposal submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Become an Instructor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Share your expertise with thousands of learners worldwide and earn while you teach
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold gradient-text text-center mb-12">
            Why Teach with SkillSwap Academy?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '💰',
                title: 'Earn Revenue',
                description: 'Keep up to 70% of course revenue with our instructor-friendly revenue sharing model.'
              },
              {
                icon: '🌍',
                title: 'Global Reach',
                description: 'Reach learners from around the world and build your personal brand as an expert.'
              },
              {
                icon: '🎓',
                title: 'NFT Certificates',
                description: 'Issue blockchain-verified certificates that add real value to your students.'
              },
              {
                icon: '📊',
                title: 'Analytics Dashboard',
                description: 'Track your performance with detailed analytics and student feedback.'
              },
              {
                icon: '🎯',
                title: 'Marketing Support',
                description: 'Get featured in our course promotions and benefit from our marketing efforts.'
              },
              {
                icon: '🤝',
                title: 'Community',
                description: 'Join a community of passionate educators and learn from each other.'
              }
            ].map((benefit, index) => (
              <div key={index} className="glass-card text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Creation Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card">
              <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
                Propose Your Course
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Description
                  </label>
                  <textarea
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn in your course..."
                    rows={4}
                    className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="data-science">Data Science</option>
                      <option value="photography">Photography</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 8 weeks"
                      className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Suggested Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., $99"
                      className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-4 text-lg"
                >
                  Submit Course Proposal
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold gradient-text text-center mb-12">
            Instructor Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                title: "Full-Stack Developer",
                earnings: "$15,000",
                students: "2,341",
                quote: "Teaching on SkillSwap Academy has been incredibly rewarding. I've been able to reach students globally and earn substantial income while doing what I love."
              },
              {
                name: "Dr. Michael Chen",
                title: "Data Science Expert",
                earnings: "$22,000",
                students: "3,456",
                quote: "The platform's support for instructors is outstanding. The NFT certificates add real value for my students, and the analytics help me improve my courses continuously."
              }
            ].map((story, index) => (
              <div key={index} className="glass-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold mr-4">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {story.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {story.title}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{story.quote}"
                </p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600 font-medium">
                    Earned: {story.earnings}
                  </span>
                  <span className="text-primary-600 font-medium">
                    Students: {story.students}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto glass-card">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Ready to Start Teaching?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join our community of expert instructors and start earning while sharing your knowledge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8">
                Get Started Today
              </Button>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="glass border-white/30 hover:bg-white/10 px-8">
                  View Sample Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Teach;
