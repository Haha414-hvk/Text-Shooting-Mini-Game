import type { Enemy } from '../types';
import { CANVAS_W } from './config';

export function updateEnemyAI(e: Enemy, dt: number): void {
  e.age += dt;

  switch (e.ai) {
    case 'straight':
      e.y += e.speed * dt;
      break;
    case 'wobble':
      e.y += e.speed * dt;
      e.x += Math.sin(e.age * 3.5) * 1.8;
      break;
    case 'fast':
      e.y += e.speed * dt;
      break;
    case 'zigzag':
      e.x += e.aiState.direction * e.speed * 1.8 * dt;
      e.y += e.speed * 0.9 * dt;
      if (e.x < 10 || e.x > CANVAS_W - e.w - 10) e.aiState.direction *= -1;
      break;
    case 'patrol':
      if (!e.aiState.entered) {
        e.y += e.speed * dt;
        if (e.y >= (e.aiState.targetY || 120)) {
          e.y = e.aiState.targetY || 120;
          e.aiState.entered = true;
        }
      } else {
        e.x += e.aiState.direction * e.speed * 1.6 * dt;
        if (e.x < 15 || e.x > CANVAS_W - e.w - 15) e.aiState.direction *= -1;
      }
      break;
  }
}
