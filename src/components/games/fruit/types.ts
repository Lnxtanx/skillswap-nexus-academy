
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  type: 'fruit';
  cut: boolean;
}

export interface MouseTrail {
  x: number;
  y: number;
  color: string;
  life: number;
}

export interface GameState {
  currentLevel: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  score: number;
  particles: Particle[];
  mouseTrails: MouseTrail[];
  targetColor: string;
  targetColorName: string;
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
