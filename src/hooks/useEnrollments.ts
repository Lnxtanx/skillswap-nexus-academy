
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Enrollment = Tables<'enrollments'>;
type EnrollmentInsert = TablesInsert<'enrollments'>;

export const useUserEnrollments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useEnrollment = (courseId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['enrollment', user?.id, courseId],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!courseId,
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: number) => {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', user?.id, data.course_id] });
      toast({
        title: "Enrolled successfully",
        description: "You have been enrolled in the course.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error enrolling in course",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: number; progress: number }) => {
      if (!user) throw new Error('No user logged in');
      
      const { error } = await supabase.rpc('update_enrollment_progress', {
        p_user_id: user.id,
        p_course_id: courseId,
        p_progress: progress,
      });
      
      if (error) throw error;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', user?.id, courseId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
