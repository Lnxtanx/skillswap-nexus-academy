
import { Particle, LevelConfig } from './types';
import { COLORS } from './constants';

export const createParticle = (canvas: HTMLCanvasElement, levelConfig: LevelConfig): Particle => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const side = Math.floor(Math.random() * 4);
  let x, y, vx, vy;

  // Enhanced spawn system - spawn from all edges with better center targeting
  switch (side) {
    case 0: // top
      x = Math.random() * canvas.width;
      y = -80;
      vx = (centerX - x) * 0.001 + (Math.random() - 0.5) * 0.3;
      vy = Math.random() * 0.6 + 1.0;
      break;
    case 1: // right
      x = canvas.width + 80;
      y = Math.random() * canvas.height;
      vx = -(Math.random() * 0.6 + 1.0);
      vy = (centerY - y) * 0.001 + (Math.random() - 0.5) * 0.3;
      break;
    case 2: // bottom
      x = Math.random() * canvas.width;
      y = canvas.height + 80;
      vx = (centerX - x) * 0.001 + (Math.random() - 0.5) * 0.3;
      vy = -(Math.random() * 0.6 + 1.0);
      break;
    default: // left
      x = -80;
      y = Math.random() * canvas.height;
      vx = Math.random() * 0.6 + 1.0;
      vy = (centerY - y) * 0.001 + (Math.random() - 0.5) * 0.3;
  }

  const colorIndex = Math.floor(Math.random() * COLORS.length);

  return {
    id: Math.random().toString(36).substr(2, 9),
    x,
    y,
    vx: vx * levelConfig.speed,
    vy: vy * levelConfig.speed,
    color: COLORS[colorIndex],
    size: Math.random() * 12 + 18,
    type: 'fruit',
    cut: false
  };
};

export const checkDirectionMatch = (particle: Particle, targetDirection: string, canvas: HTMLCanvasElement): boolean => {
  if (!targetDirection) return true;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  switch (targetDirection) {
    case 'left':
      return particle.x < centerX;
    case 'right':
      return particle.x > centerX;
    case 'top':
      return particle.y < centerY;
    case 'bottom':
      return particle.y > centerY;
    default:
      return true;
  }
};
