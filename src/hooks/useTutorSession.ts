
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TutorSessionData } from '@/types/tutor';

export const useTutorSession = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState(false);

  const createSession = async (sessionData: {
    replicaId: string;
    userId?: string;
    courseId?: number;
    lessonId?: string;
    personaId: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .insert({
          user_id: sessionData.userId || null,
          course_id: sessionData.courseId || null,
          lesson_id: sessionData.lessonId || null,
          persona_id: sessionData.personaId,
          replica_id: sessionData.replicaId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSessionId(data.id);
        setIsSessionActive(true);
        return data;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const endSession = async (sessionId: string, conversationHistory: any[]) => {
    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      if (conversationHistory.length > 0) {
        await saveConversation(sessionId, conversationHistory);
      }

      setIsSessionActive(false);
      setSessionId('');
      return data;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

  const saveConversation = async (sessionId: string, conversationHistory: any[]) => {
    try {
      const conversationData = conversationHistory.map(message => ({
        session_id: sessionId,
        message_type: message.type,
        content: message.content,
        timestamp: message.timestamp,
        metadata: message.persona ? { persona: message.persona } : null
      }));

      const { error } = await supabase
        .from('conversation_history')
        .insert(conversationData);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  };

  return {
    createSession,
    endSession,
    saveConversation,
    isSessionActive,
    sessionId
  };
};
