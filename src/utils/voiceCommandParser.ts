
export interface VoiceCommand {
  action: string;
  parameters?: Record<string, any>;
  confidence: number;
}

export class VoiceCommandParser {
  private static commands = {
    navigation: [
      { patterns: ['next lesson', 'go to next', 'continue'], action: 'next_lesson' },
      { patterns: ['previous lesson', 'go back', 'last lesson'], action: 'previous_lesson' },
      { patterns: ['home', 'main menu', 'dashboard'], action: 'navigate_home' },
      { patterns: ['courses', 'course list', 'browse courses'], action: 'navigate_courses' }
    ],
    learning: [
      { patterns: ['quiz me', 'start quiz', 'test me'], action: 'start_quiz' },
      { patterns: ['repeat that', 'say again', 'repeat'], action: 'repeat_content' },
      { patterns: ['explain this', 'explain that', 'more details'], action: 'explain_topic' },
      { patterns: ['summary', 'summarize', 'recap'], action: 'summarize_lesson' },
      { patterns: ['take notes', 'note this', 'remember this'], action: 'take_notes' }
    ],
    playback: [
      { patterns: ['pause', 'stop'], action: 'pause_playback' },
      { patterns: ['resume', 'continue', 'play'], action: 'resume_playback' },
      { patterns: ['slower', 'slow down', 'speak slower'], action: 'decrease_speed' },
      { patterns: ['faster', 'speed up', 'speak faster'], action: 'increase_speed' },
      { patterns: ['louder', 'volume up', 'turn up'], action: 'increase_volume' },
      { patterns: ['quieter', 'volume down', 'turn down'], action: 'decrease_volume' }
    ],
    system: [
      { patterns: ['help', 'what can you do', 'commands'], action: 'show_help' },
      { patterns: ['settings', 'preferences', 'options'], action: 'open_settings' },
      { patterns: ['switch language', 'change language'], action: 'change_language' },
      { patterns: ['switch tutor', 'change tutor', 'different voice'], action: 'change_tutor' }
    ]
  };

  static parse(transcript: string): VoiceCommand | null {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Check all command categories
    for (const [category, commands] of Object.entries(this.commands)) {
      for (const command of commands) {
        for (const pattern of command.patterns) {
          const confidence = this.calculateConfidence(normalizedTranscript, pattern);
          if (confidence > 0.7) {
            return {
              action: command.action,
              parameters: { category, original: transcript },
              confidence
            };
          }
        }
      }
    }

    // Check for parametrized commands
    const parametrizedCommand = this.parseParametrizedCommands(normalizedTranscript);
    if (parametrizedCommand) {
      return parametrizedCommand;
    }

    // If no specific command found, treat as general question/conversation
    if (normalizedTranscript.length > 5) {
      return {
        action: 'general_conversation',
        parameters: { query: transcript },
        confidence: 0.5
      };
    }

    return null;
  }

  private static calculateConfidence(transcript: string, pattern: string): number {
    // Simple fuzzy matching algorithm
    const transcriptWords = transcript.split(' ');
    const patternWords = pattern.split(' ');
    
    let matches = 0;
    for (const patternWord of patternWords) {
      if (transcriptWords.some(word => 
        word.includes(patternWord) || 
        patternWord.includes(word) ||
        this.levenshteinDistance(word, patternWord) <= 2
      )) {
        matches++;
      }
    }
    
    return matches / patternWords.length;
  }

  private static parseParametrizedCommands(transcript: string): VoiceCommand | null {
    // Handle "go to lesson X" or "open lesson X"
    const lessonMatch = transcript.match(/(?:go to|open|start)\s+lesson\s+(\d+|[a-z]+)/i);
    if (lessonMatch) {
      return {
        action: 'navigate_to_lesson',
        parameters: { lesson: lessonMatch[1] },
        confidence: 0.9
      };
    }

    // Handle "set speed to X" or "speed X"
    const speedMatch = transcript.match(/(?:set\s+speed\s+to|speed)\s+(\d+(?:\.\d+)?)/i);
    if (speedMatch) {
      return {
        action: 'set_speed',
        parameters: { speed: parseFloat(speedMatch[1]) },
        confidence: 0.9
      };
    }

    // Handle "set volume to X" or "volume X"
    const volumeMatch = transcript.match(/(?:set\s+volume\s+to|volume)\s+(\d+)/i);
    if (volumeMatch) {
      return {
        action: 'set_volume',
        parameters: { volume: parseInt(volumeMatch[1]) / 100 },
        confidence: 0.9
      };
    }

    // Handle language switching
    const languageMatch = transcript.match(/(?:switch to|change to|speak)\s+(english|spanish|french|german|italian|portuguese|japanese|korean|chinese)/i);
    if (languageMatch) {
      const languageMap: Record<string, string> = {
        'english': 'en',
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
        'italian': 'it',
        'portuguese': 'pt',
        'japanese': 'ja',
        'korean': 'ko',
        'chinese': 'zh'
      };
      
      return {
        action: 'change_language',
        parameters: { language: languageMap[languageMatch[1].toLowerCase()] },
        confidence: 0.9
      };
    }

    return null;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  static getAvailableCommands(): string[] {
    const allCommands: string[] = [];
    
    for (const commands of Object.values(this.commands)) {
      for (const command of commands) {
        allCommands.push(...command.patterns);
      }
    }
    
    return allCommands.sort();
  }
}
