
import { LevelConfig } from './types';

export const COLORS = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#ffa500'];
export const COLOR_NAMES = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
export const DIRECTIONS = ['left', 'right', 'top', 'bottom'];

export const LEVELS: LevelConfig[] = [
  { level: 1, speed: 0.3, particleCount: 120, timeLimit: 120 },
  { level: 2, speed: 0.4, particleCount: 150, timeLimit: 150 },
  { level: 3, speed: 0.5, particleCount: 180, timeLimit: 180 },
  { level: 4, speed: 0.6, particleCount: 220, timeLimit: 200 },
  { level: 5, speed: 0.7, particleCount: 280, timeLimit: 240 }
];
