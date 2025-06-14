
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
  name: string;
  title: string;
  avatar?: string;
  bio?: string;
  coursesCompleted?: number;
  coursesTeaching?: number;
  rating?: number;
  badges?: string[];
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  title,
  avatar,
  bio = "Passionate learner and educator committed to sharing knowledge and building skills.",
  coursesCompleted = 12,
  coursesTeaching = 3,
  rating = 4.8,
  badges = ['Early Adopter', 'Course Creator', 'Top Rated']
}) => {
  return (
    <div className="glass-card max-w-md mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-24 h-24 mb-4">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full rounded-full object-cover border-4 border-white/50"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-4 border-white/50">
              <span className="text-2xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          {name}
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
          <div className="text-2xl font-bold gradient-text">{coursesTeaching}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Courses Teaching</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-medium rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
          View Full Profile
        </Button>
        <Button variant="outline" className="w-full glass border-white/30">
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
