
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';
import type { TutorSessionData, ConversationMessage } from '@/types/tutor';

export const useTutorSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const createSession = async (sessionData: {
    replicaId: string;
    userId?: string;
    courseId?: number;
    lessonId?: string;
    personaId: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .insert([{
          user_id: user.id,
          course_id: sessionData.courseId,
          lesson_id: sessionData.lessonId,
          persona_id: sessionData.personaId,
          replica_id: sessionData.replicaId,
          status: 'active',
          started_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setIsSessionActive(true);
      return data;
    } catch (error) {
      console.error('Error creating tutor session:', error);
      throw error;
    }
  };

  const endSession = async (sessionId: string, conversationHistory: ConversationMessage[]) => {
    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          conversation_summary: JSON.stringify(conversationHistory.slice(-10)) // Last 10 messages
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setIsSessionActive(false);
      setSessionId(null);
      return data;
    } catch (error) {
      console.error('Error ending tutor session:', error);
      throw error;
    }
  };

  const saveConversation = async (sessionId: string, messages: ConversationMessage[]) => {
    try {
      const conversationRecords = messages.map(message => ({
        session_id: sessionId,
        message_type: message.type,
        content: message.content,
        timestamp: message.timestamp,
        metadata: message.persona ? { persona: message.persona } : null
      }));

      const { error } = await supabase
        .from('conversation_history')
        .insert(conversationRecords);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['conversation-history', sessionId] });
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  };

  const getSessionHistory = (userId: string) => {
    return useQuery({
      queryKey: ['tutor-sessions', userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tutor_sessions')
          .select(`
            *,
            conversation_history(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      enabled: !!userId,
    });
  };

  return {
    createSession,
    endSession,
    saveConversation,
    getSessionHistory,
    sessionId,
    isSessionActive
  };
};
