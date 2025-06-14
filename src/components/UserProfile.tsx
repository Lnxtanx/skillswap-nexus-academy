
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserEnrollments } from '@/hooks/useEnrollments';
import { Loader2 } from 'lucide-react';

interface UserProfileProps {
  userId?: string;
  showActions?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  showActions = true 
}) => {
  const { user } = useAuth();
  const { data: enrollments, isLoading } = useUserEnrollments();
  
  // If no userId provided, show current user's profile
  const profileUser = user;
  
  if (!profileUser) {
    return (
      <div className="glass-card max-w-md mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Please sign in to view profile</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card max-w-md mx-auto">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const displayName = profileUser.user_metadata?.full_name || 
                     profileUser.user_metadata?.username || 
                     profileUser.email?.split('@')[0] || 
                     'User';
  
  const title = profileUser.user_metadata?.title || 'Lifelong Learner';
  const bio = profileUser.user_metadata?.bio || "Passionate learner and educator committed to sharing knowledge and building skills.";
  const avatarUrl = profileUser.user_metadata?.avatar_url;
  
  const coursesCompleted = enrollments?.filter(e => e.progress_percentage === 100).length || 0;
  const coursesEnrolled = enrollments?.length || 0;
  const rating = 4.8; // This would come from actual ratings data
  
  // Generate achievements based on actual data
  const achievements = [];
  if (coursesEnrolled > 0) achievements.push('Early Adopter');
  if (coursesCompleted > 0) achievements.push('Course Completer');
  if (coursesCompleted >= 3) achievements.push('Learning Enthusiast');
  if (rating >= 4.5) achievements.push('Top Rated');

  return (
    <div className="glass-card max-w-md mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-24 h-24 mb-4">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              className="w-full h-full rounded-full object-cover border-4 border-white/50"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-4 border-white/50">
              <span className="text-2xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          {displayName}
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {title}
        </p>

        <div className="flex items-center justify-center space-x-1 mb-4">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">rating</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
        {bio}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center glass rounded-lg p-3">
          <div className="text-2xl font-bold gradient-text">{coursesCompleted}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Courses Completed</div>
        </div>
        <div className="text-center glass rounded-lg p-3">
          <div className="text-2xl font-bold gradient-text">{coursesEnrolled}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Courses Enrolled</div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-medium rounded-full"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="space-y-2">
          <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
            View Full Profile
          </Button>
          <Button variant="outline" className="w-full glass border-white/30">
            Send Message
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
