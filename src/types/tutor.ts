
export interface AIPersona {
  id: string;
  name: string;
  description: string;
  avatar: string;
  specialties: string[];
  personality: string;
  greeting: string;
  tavusReplicaId: string;
}

export interface ConversationMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  persona?: string;
}

export interface TutorSessionData {
  id: string;
  user_id: string;
  course_id?: number;
  lesson_id?: string;
  persona_id: string;
  replica_id: string;
  status: 'active' | 'completed' | 'paused';
  started_at: string;
  ended_at?: string;
  conversation_summary?: string;
  created_at: string;
}

export interface ConversationHistory {
  id: string;
  session_id: string;
  message_type: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: any;
  created_at: string;
}
