
import React from 'react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  title: string;
  instructor: string;
  price: string;
  image?: string;
  rating?: number;
  students?: number;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  instructor,
  price,
  image,
  rating = 4.5,
  students = 1234,
  duration = "4 weeks",
  level = "Beginner"
}) => {
  return (
    <div className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-xl mb-4 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-20">📚</div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium glass ${
            level === 'Beginner' ? 'text-secondary-600' :
            level === 'Intermediate' ? 'text-accent-600' : 'text-primary-600'
          }`}>
            {level}
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          by {instructor}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span>{rating}</span>
            </span>
            <span>{students.toLocaleString()} students</span>
          </div>
          <span>{duration}</span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold gradient-text">{price}</span>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white border-0"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
