import type { Enemy, EnemyType, Drop, DropType, LevelConfig } from '../types';
import { ENEMY_TYPES, CANVAS_W } from './config';
import { rand, randInt } from './physics';

export function makeEnemy(
  type: EnemyType,
  baseSpeed: number,
  xPos: number,
  yOffset?: number
): Enemy {
  const et = ENEMY_TYPES[type];
  const fireInterval = et.fireMin > 0 ? rand(et.fireMin, et.fireMax) : 0;
  return {
    x: xPos + rand(-18, 18),
    y: -et.h - (yOffset ?? rand(0, 60)),
    w: et.w, h: et.h,
    hp: et.hp, maxHp: et.hp,
    text: et.text, color: et.color, ai: et.ai,
    speed: type === 'fast' ? baseSpeed * 2.7 : baseSpeed + rand(-5, 10),
    pts: et.pts, age: 0, entityType: type,
    fireTimer: rand(1.0, fireInterval || 999),
    fireInterval,
    fireCount: et.fireCount,
    aiState: { direction: Math.random() > 0.5 ? 1 : -1 },
  };
}

export function spawnWave(
  _level: number,
  levelConfig: LevelConfig,
  waveIndex: number
): Enemy[] {
  const wi = levelConfig.perWave[waveIndex];
  const isBoss = levelConfig.bossWave === waveIndex + 1;
  const types = levelConfig.types;
  const enemies: Enemy[] = [];

  if (isBoss) {
    const bt = ENEMY_TYPES.boss;
    enemies.push({
      x: CANVAS_W / 2 - bt.w / 2,
      y: -bt.h,
      w: bt.w, h: bt.h,
      hp: levelConfig.bossHP, maxHp: levelConfig.bossHP,
      text: bt.text, color: bt.color, ai: bt.ai,
      speed: levelConfig.speed * 0.7, pts: bt.pts, age: 0,
      entityType: 'boss',
      fireTimer: rand(0.5, bt.fireMin),
      fireInterval: rand(bt.fireMin, bt.fireMax),
      fireCount: bt.fireCount,
      aiState: { direction: 1, targetY: rand(80, 150), entered: false },
    });
    const escortCount = Math.min(wi || 3, 4);
    for (let i = 0; i < escortCount; i++) {
      const t = types[randInt(0, types.length - 1)];
      enemies.push(makeEnemy(t, levelConfig.speed, 40 + i * 45));
    }
  } else {
    const count = wi;
    const spacing = (CANVAS_W - 80) / count;
    for (let i = 0; i < count; i++) {
      const t = types[randInt(0, types.length - 1)];
      enemies.push(makeEnemy(t, levelConfig.speed, 40 + i * spacing, i * 35));
    }
  }

  return enemies;
}

export function createDrop(x: number, y: number, type: DropType): Drop {
  const dtMap: Record<DropType, { text: string; color: string; w: number; h: number }> = {
    power: { text: '[P]', color: '#ff8800', w: 44, h: 32 },
    multi: { text: '[M]', color: '#44aaff', w: 44, h: 32 },
  };
  const dt = dtMap[type];
  return {
    x: x - dt.w / 2,
    y: y - dt.h / 2,
    w: dt.w, h: dt.h,
    type,
    text: dt.text,
    color: dt.color,
    vy: 55,
    age: 0,
  };
}

export function tryCreateDrop(x: number, y: number, entityType: EnemyType): Drop[] {
  const drops: Drop[] = [];
  if (entityType === 'boss') {
    drops.push(createDrop(x, y - 15, 'power'));
    drops.push(createDrop(x, y + 15, 'multi'));
    return drops;
  }
  const chance = entityType === 'elite' ? 0.3 : 0.12;
  if (Math.random() < chance) {
    drops.push(createDrop(x, y, Math.random() < 0.5 ? 'power' : 'multi'));
  }
  return drops;
}
