
export interface CodeParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  code: string;
  category: string;
  size: number;
  cut: boolean;
}

export interface MouseTrail {
  x: number;
  y: number;
  color: string;
  life: number;
}

export interface CodeGameState {
  currentLevel: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  score: number;
  particles: CodeParticle[];
  mouseTrails: MouseTrail[];
  targetCategory: string;
  targetDirection: string;
  timeLeft: number;
  particlesCut: number;
  particlesMissed: number;
  gameStartTime: number;
}

export interface LevelConfig {
  level: number;
  speed: number;
  particleCount: number;
  timeLimit: number;
}
