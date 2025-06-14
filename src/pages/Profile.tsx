
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const userCourses = [
    {
      title: "Complete React Development Course",
      instructor: "Sarah Johnson",
      price: "Completed",
      level: "Intermediate" as const,
      rating: 4.8,
      students: 2341,
      duration: "8 weeks"
    },
    {
      title: "Python for Data Science",
      instructor: "Dr. Michael Chen",
      price: "In Progress",
      level: "Beginner" as const,
      rating: 4.9,
      students: 1876,
      duration: "6 weeks"
    }
  ];

  const achievements = [
    { name: 'First Course Completed', date: '2024-01-15', icon: '🎓' },
    { name: 'React Expert', date: '2024-02-20', icon: '⚛️' },
    { name: 'Python Practitioner', date: '2024-03-10', icon: '🐍' },
    { name: 'Early Adopter', date: '2024-01-01', icon: '🚀' },
    { name: '30 Day Streak', date: '2024-03-15', icon: '🔥' },
    { name: 'Course Creator', date: '2024-02-28', icon: '👨‍🏫' }
  ];

  const certificates = [
    { course: 'Complete React Development', issueDate: '2024-02-20', nftId: '#12345' },
    { course: 'JavaScript Fundamentals', issueDate: '2024-01-15', nftId: '#12344' },
    { course: 'Web Design Basics', issueDate: '2024-01-10', nftId: '#12343' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Profile Header */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-4 border-white/50">
                    <span className="text-4xl font-bold text-white">JD</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    John Doe
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Full-Stack Developer & Lifelong Learner
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">12</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">156</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">8</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Certificates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">4.9</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Navigation */}
      <section className="py-8 glass border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'courses', label: 'My Courses' },
                { id: 'certificates', label: 'Certificates' },
                { id: 'achievements', label: 'Achievements' },
                { id: 'settings', label: 'Settings' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id 
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                    : "glass border-white/30 hover:bg-white/10"
                  }
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Learning Progress */}
                <div className="glass-card">
                  <h2 className="text-2xl font-bold gradient-text mb-6">Learning Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userCourses.map((course, index) => (
                      <div key={index} className="relative">
                        <CourseCard {...course} />
                        <div className="mt-4 glass rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-sm font-medium">
                              {course.price === 'Completed' ? '100%' : '65%'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: course.price === 'Completed' ? '100%' : '65%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card">
                  <h2 className="text-2xl font-bold gradient-text mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {[
                      { action: 'Completed lesson', course: 'React Development', time: '2 hours ago' },
                      { action: 'Earned certificate', course: 'JavaScript Fundamentals', time: '1 day ago' },
                      { action: 'Started new course', course: 'Python Data Science', time: '3 days ago' },
                      { action: 'Achieved milestone', course: '30 Day Learning Streak', time: '1 week ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {activity.action}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.course}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {userCourses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">NFT Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert, index) => (
                    <div key={index} className="glass-card">
                      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-lg p-6 mb-4">
                        <div className="text-center">
                          <div className="text-4xl mb-4">🏆</div>
                          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                            Certificate of Completion
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {cert.course}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                          <span className="font-medium">{cert.issueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">NFT ID:</span>
                          <span className="font-medium text-primary-600">{cert.nftId}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-4 bg-gradient-to-r from-primary-500 to-secondary-500">
                        View on Blockchain
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="glass-card text-center">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Earned on {achievement.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">Account Settings</h2>
                <div className="glass-card">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="Full-Stack Developer & Lifelong Learner"
                        className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Notifications
                      </label>
                      <div className="space-y-3">
                        {[
                          'Course updates and announcements',
                          'New course recommendations',
                          'Achievement notifications',
                          'Weekly progress reports'
                        ].map((option, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
