import { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from '../engine/GameEngine';
import type { UIState } from '../types';

export function useGameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [uiState, setUIState] = useState<UIState>({
    screen: 'menu',
    level: 0,
    wave: 0,
    totalWaves: 0,
    score: 0,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    powerups: {
      power: { active: false, timer: 0, duration: 8 },
      multi: { active: false, timer: 0, duration: 8 },
    },
    isBoss: false,
    lifeBonusThisLevel: false,
    leaderboard: [],
    leaderboardEntry: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new GameEngine();
    engine.onStateChange = (s) => setUIState(s);
    engine.init(canvasRef.current);
    engineRef.current = engine;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      engine.setMouse(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const start = useCallback(() => engineRef.current?.start(), []);
  const pause = useCallback(() => engineRef.current?.pause(), []);
  const restart = useCallback(() => engineRef.current?.restart(), []);
  const advanceLevel = useCallback(() => engineRef.current?.advanceLevel(), []);

  return { canvasRef, uiState, start, pause, restart, advanceLevel };
}
