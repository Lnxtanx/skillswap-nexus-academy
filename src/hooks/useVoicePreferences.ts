
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface VoicePreferences {
  selectedPersona: string;
  selectedLanguage: string;
  speechSpeed: number;
  volume: number;
  noiseCancellation: boolean;
  accessibilityMode: boolean;
  autoPlay: boolean;
  handsFreeModeEnabled: boolean;
  preferredVoiceId: string;
}

const defaultPreferences: VoicePreferences = {
  selectedPersona: 'code-master',
  selectedLanguage: 'en',
  speechSpeed: 1.0,
  volume: 0.7,
  noiseCancellation: true,
  accessibilityMode: false,
  autoPlay: false,
  handsFreeModeEnabled: false,
  preferredVoiceId: 'N2lVS1w4EtoT3dr4eOWO'
};

export const useVoicePreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<VoicePreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from database or localStorage
  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // Try to load from database
        const { data, error } = await supabase
          .from('user_voice_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setPreferences({
            selectedPersona: data.selected_persona,
            selectedLanguage: data.selected_language,
            speechSpeed: data.speech_speed,
            volume: data.volume,
            noiseCancellation: data.noise_cancellation,
            accessibilityMode: data.accessibility_mode,
            autoPlay: data.auto_play,
            handsFreeModeEnabled: data.hands_free_mode,
            preferredVoiceId: data.preferred_voice_id
          });
        } else {
          // Create default preferences in database
          await savePreferences(defaultPreferences);
        }
      } else {
        // Load from localStorage for anonymous users
        const saved = localStorage.getItem('skillswap-voice-preferences');
        if (saved) {
          setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
        }
      }
    } catch (err) {
      console.error('Error loading voice preferences:', err);
      setError('Failed to load voice preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Partial<VoicePreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      if (user) {
        // Save to database
        const { error } = await supabase
          .from('user_voice_preferences')
          .upsert({
            user_id: user.id,
            selected_persona: updatedPreferences.selectedPersona,
            selected_language: updatedPreferences.selectedLanguage,
            speech_speed: updatedPreferences.speechSpeed,
            volume: updatedPreferences.volume,
            noise_cancellation: updatedPreferences.noiseCancellation,
            accessibility_mode: updatedPreferences.accessibilityMode,
            auto_play: updatedPreferences.autoPlay,
            hands_free_mode: updatedPreferences.handsFreeModeEnabled,
            preferred_voice_id: updatedPreferences.preferredVoiceId,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } else {
        // Save to localStorage for anonymous users
        localStorage.setItem('skillswap-voice-preferences', JSON.stringify(updatedPreferences));
      }
    } catch (err) {
      console.error('Error saving voice preferences:', err);
      setError('Failed to save voice preferences');
    }
  };

  const resetPreferences = async () => {
    await savePreferences(defaultPreferences);
  };

  const updatePersona = async (persona: string) => {
    await savePreferences({ selectedPersona: persona });
  };

  const updateLanguage = async (language: string) => {
    await savePreferences({ selectedLanguage: language });
  };

  const updateSpeechSpeed = async (speed: number) => {
    await savePreferences({ speechSpeed: speed });
  };

  const updateVolume = async (volume: number) => {
    await savePreferences({ volume });
  };

  const toggleNoiseCancellation = async () => {
    await savePreferences({ noiseCancellation: !preferences.noiseCancellation });
  };

  const toggleAccessibilityMode = async () => {
    await savePreferences({ accessibilityMode: !preferences.accessibilityMode });
  };

  const toggleHandsFreeMode = async () => {
    await savePreferences({ handsFreeModeEnabled: !preferences.handsFreeModeEnabled });
  };

  return {
    preferences,
    isLoading,
    error,
    savePreferences,
    resetPreferences,
    updatePersona,
    updateLanguage,
    updateSpeechSpeed,
    updateVolume,
    toggleNoiseCancellation,
    toggleAccessibilityMode,
    toggleHandsFreeMode
  };
};
