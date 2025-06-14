
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Book, Clock, Trophy, Target, ArrowLeft, Star, Users, Flame, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserEnrollments } from '@/hooks/useEnrollments';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LearningStats from '@/components/learning/LearningStats';
import ActiveCourses from '@/components/learning/ActiveCourses';
import AITutorsGrid from '@/components/learning/AITutorsGrid';

const Learn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: enrollments, isLoading: enrollmentsLoading } = useUserEnrollments();
  const { data: allCourses } = useCourses();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
      toast({
        title: "Authentication Required",
        description: "Please sign in to access your learning dashboard.",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  if (!user) return null;
  if (enrollmentsLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => navigate(-1)}
            className="mr-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Learning Dashboard</h1>
            <p className="text-gray-300">Track your progress with AI tutors</p>
          </div>
        </div>

        {/* Learning Stats */}
        <LearningStats enrollments={enrollments || []} />

        {/* Active Courses */}
        <ActiveCourses enrollments={enrollments || []} />

        {/* AI Tutors Section */}
        <AITutorsGrid />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/courses">
            <Button className="w-full h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg">
              <Book className="h-6 w-6 mr-2" />
              Browse New Courses
            </Button>
          </Link>
          <Button className="w-full h-20 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white border-0 text-lg">
            <Trophy className="h-6 w-6 mr-2" />
            View Achievements
          </Button>
          <Button className="w-full h-20 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 text-lg">
            <Target className="h-6 w-6 mr-2" />
            Study Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learn;
