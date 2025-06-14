
import { supabase } from '@/integrations/supabase/client';

export const speakInstruction = async (text: string): Promise<void> => {
  try {
    console.log('Speaking:', text);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.includes('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      return;
    }

    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text,
        voice: 'alloy'
      }
    });

    if (error) {
      console.error('TTS API error:', error);
      return;
    }

    if (data?.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.volume = 0.7;
      await audio.play();
    }
  } catch (error) {
    console.error('Voice instruction failed:', error);
  }
};
