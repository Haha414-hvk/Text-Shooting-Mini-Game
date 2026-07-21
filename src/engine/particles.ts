import type { Particle } from '../types';
import { rand, randInt } from './physics';

const FIREWORK_COLORS = ['#ff0','#f44','#4f4','#44f','#f4f','#0ff','#ff8800','#ff4488','#88ff44'];

export function spawnParticles(
  x: number,
  y: number,
  color: string,
  count: number,
  speedMul?: number
): Particle[] {
  const sm = speedMul || 1;
  const arr: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const spd = rand(40, 160) * sm;
    arr.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: rand(0.3, 0.8),
      maxLife: rand(0.3, 0.8),
      color,
      size: rand(3, 8) * sm,
    });
  }
  return arr;
}

export function spawnFirework(x?: number, y?: number): Particle[] {
  const fx = x ?? rand(100, 700);
  const fy = y ?? rand(80, 350);
  const color = FIREWORK_COLORS[randInt(0, FIREWORK_COLORS.length - 1)];
  const arr: Particle[] = [];
  for (let i = 0; i < 35; i++) {
    const angle = rand(0, Math.PI * 2);
    const spd = rand(60, 220);
    arr.push({
      x: fx, y: fy,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: rand(0.8, 2.2),
      maxLife: rand(0.8, 2.2),
      color,
      size: rand(4, 12),
    });
  }
  return arr;
}
