
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import { useAuth } from '@/hooks/useAuth';
import { useUserEnrollments } from '@/hooks/useEnrollments';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading } = useUserEnrollments();

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Please sign in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments?.filter(e => e.progress_percentage === 100) || [];
  const inProgressCourses = enrollments?.filter(e => e.progress_percentage < 100) || [];
  const totalHours = enrollments?.reduce((acc, enrollment) => {
    return acc + (enrollment.course?.duration || 0);
  }, 0) || 0;

  const userDisplayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userInitials = userDisplayName.split(' ').map(n => n[0]).join('').toUpperCase();

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
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt={userDisplayName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/50"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-4 border-white/50">
                      <span className="text-4xl font-bold text-white">{userInitials}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    {userDisplayName}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {user.user_metadata?.title || 'Lifelong Learner'}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {enrollmentsLoading ? '...' : enrollments?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {enrollmentsLoading ? '...' : Math.round(totalHours / 60)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {enrollmentsLoading ? '...' : completedCourses.length}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
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
                  {enrollmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : enrollments && enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {enrollments.slice(0, 4).map((enrollment) => (
                        <div key={enrollment.id} className="relative">
                          <CourseCard 
                            title={enrollment.course?.title || 'Course'}
                            instructor={enrollment.course?.instructor?.full_name || enrollment.course?.instructor?.username || 'Instructor'}
                            price={enrollment.progress_percentage === 100 ? 'Completed' : 'In Progress'}
                            level={enrollment.course?.level as "Beginner" | "Intermediate" | "Advanced" || 'Beginner'}
                            rating={4.8}
                            students={1200}
                            duration={`${Math.round((enrollment.course?.duration || 0) / 60)} hours`}
                          />
                          <div className="mt-4 glass rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="text-sm font-medium">
                                {enrollment.progress_percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">No enrolled courses yet. Start learning today!</p>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="glass-card">
                  <h2 className="text-2xl font-bold gradient-text mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {enrollments && enrollments.length > 0 ? (
                      enrollments.slice(0, 4).map((enrollment, index) => (
                        <div key={enrollment.id} className="flex items-center justify-between p-4 glass rounded-lg">
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {enrollment.progress_percentage === 100 ? 'Completed course' : 'Studying course'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {enrollment.course?.title}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {enrollment.last_accessed ? new Date(enrollment.last_accessed).toLocaleDateString() : 'Recently'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">My Courses</h2>
                {enrollmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : enrollments && enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {enrollments.map((enrollment) => (
                      <CourseCard 
                        key={enrollment.id}
                        title={enrollment.course?.title || 'Course'}
                        instructor={enrollment.course?.instructor?.full_name || enrollment.course?.instructor?.username || 'Instructor'}
                        price={enrollment.progress_percentage === 100 ? 'Completed' : 'In Progress'}
                        level={enrollment.course?.level as "Beginner" | "Intermediate" | "Advanced" || 'Beginner'}
                        rating={4.8}
                        students={1200}
                        duration={`${Math.round((enrollment.course?.duration || 0) / 60)} hours`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No enrolled courses yet. Browse courses to get started!</p>
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">NFT Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((enrollment) => (
                    <div key={enrollment.id} className="glass-card">
                      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-lg p-6 mb-4">
                        <div className="text-center">
                          <div className="text-4xl mb-4">🏆</div>
                          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                            Certificate of Completion
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {enrollment.course?.title}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                          <span className="font-medium">
                            {enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-4 bg-gradient-to-r from-primary-500 to-secondary-500">
                        View Certificate
                      </Button>
                    </div>
                  ))}
                  {completedCourses.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">Complete a course to earn your first certificate!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments && enrollments.length > 0 && (
                    <div className="glass-card text-center">
                      <div className="text-4xl mb-4">🎓</div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                        First Course Started
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Started your learning journey
                      </p>
                    </div>
                  )}
                  
                  {completedCourses.length > 0 && (
                    <div className="glass-card text-center">
                      <div className="text-4xl mb-4">🏆</div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                        First Course Completed
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completed your first course
                      </p>
                    </div>
                  )}

                  {completedCourses.length >= 3 && (
                    <div className="glass-card text-center">
                      <div className="text-4xl mb-4">🚀</div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                        Learning Enthusiast
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completed 3+ courses
                      </p>
                    </div>
                  )}

                  {enrollments && enrollments.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">Start learning to unlock achievements!</p>
                    </div>
                  )}
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
                        defaultValue={userDisplayName}
                        className="w-full px-4 py-3 glass rounded-lg border border-white/30 focus:border-primary-500 focus:outline-none text-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full px-4 py-3 glass rounded-lg border border-white/30 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        defaultValue={user.user_metadata?.bio || "Passionate learner committed to building new skills."}
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
