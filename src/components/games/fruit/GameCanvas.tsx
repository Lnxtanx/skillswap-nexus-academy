
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Particle, MouseTrail } from './types';

interface GameCanvasProps {
  particles: Particle[];
  mouseTrails: MouseTrail[];
  targetColor: string;
  targetDirection: string;
  isFullscreen: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  checkDirectionMatch: (particle: Particle) => boolean;
}

export interface GameCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
  getContext: () => CanvasRenderingContext2D | null;
}

const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(({
  particles,
  mouseTrails,
  targetColor,
  targetDirection,
  isFullscreen,
  onMouseMove,
  checkDirectionMatch
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getContext: () => canvasRef.current?.getContext('2d') || null
  }));

  const renderGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw mouse trails with enhanced effects
    mouseTrails.forEach((trail, index) => {
      ctx.globalAlpha = trail.life;
      
      for (let i = 0; i < 4; i++) {
        const offset = i * 4;
        const size = (10 - i * 2) * trail.life;
        const hue = (Date.now() * 0.1 + offset) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, ${70 + i * 5}%)`;
        ctx.beginPath();
        ctx.arc(
          trail.x + Math.sin(Date.now() * 0.01 + offset) * 3, 
          trail.y + Math.cos(Date.now() * 0.01 + offset) * 3, 
          size, 0, 2 * Math.PI
        );
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1.0;

    // Draw particles
    particles.forEach(particle => {
      const isTarget = particle.color === targetColor;
      const isDirectionMatch = checkDirectionMatch(particle);
      const isValidTarget = isTarget && isDirectionMatch;
      
      if (isValidTarget && !particle.cut) {
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 30;
        
        const pulseSize = Math.sin(Date.now() * 0.01) * 5 + 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + pulseSize, 0, 2 * Math.PI);
        ctx.fillStyle = particle.color + '30';
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      ctx.fillStyle = particle.cut ? '#444' : particle.color;
      ctx.fill();
      
      if (isValidTarget && !particle.cut) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
    });
  };

  React.useEffect(() => {
    const animationFrame = requestAnimationFrame(renderGame);
    return () => cancelAnimationFrame(animationFrame);
  });

  const canvasProps = isFullscreen 
    ? { width: window.innerWidth, height: window.innerHeight - 80 }
    : { width: 800, height: 400 };

  return (
    <canvas
      ref={canvasRef}
      {...canvasProps}
      className={`w-full ${isFullscreen 
        ? 'h-full bg-gradient-to-b from-blue-900/30 to-green-900/30 cursor-crosshair' 
        : 'bg-gradient-to-b from-blue-900/30 to-green-900/30 rounded-lg cursor-crosshair border-2 border-gray-700'
      }`}
      onMouseMove={onMouseMove}
      style={isFullscreen ? {} : { maxWidth: '100%', height: 'auto' }}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
