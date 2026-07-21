import type { EnemyConfig, LevelConfig, DropConfig } from '../types';

export const ENEMY_TYPES: Record<string, EnemyConfig> = {
  small:  { text: 'o',     w: 36, h: 36, hp: 1,  ai: 'straight', color: '#ff4455', pts: 100, fireMin:3.0, fireMax:4.5, fireCount:1 },
  medium: { text: '\\o/',  w: 78, h: 42, hp: 2,  ai: 'wobble',   color: '#ff8822', pts: 200, fireMin:2.0, fireMax:3.0, fireCount:1 },
  fast:   { text: '->',    w: 54, h: 36, hp: 1,  ai: 'fast',     color: '#ff44ff', pts: 150, fireMin:0,   fireMax:0,   fireCount:0 },
  elite:  { text: '[E]',   w: 78, h: 42, hp: 3,  ai: 'zigzag',   color: '#ff2222', pts: 300, fireMin:1.0, fireMax:1.8, fireCount:2 },
  boss:   { text: '[BOSS]',w: 144, h: 60, hp: 12, ai: 'patrol',  color: '#ff0044', pts: 1000,fireMin:0.5, fireMax:0.9, fireCount:5 },
};

export const DROP_TYPES: Record<string, DropConfig> = {
  power: { text: '[P]', color: '#ff8800', w: 44, h: 32, label: '威力' },
  multi: { text: '[M]', color: '#44aaff', w: 44, h: 32, label: '多重' },
};

export const LEVELS: LevelConfig[] = [
  { id:1, waves:5, perWave:[4,4,5,5,6],        types:['small'],              speed:35, bossWave:0, bossHP:0, fireRate:320 },
  { id:2, waves:5, perWave:[4,5,5,6,6],        types:['small'],              speed:45, bossWave:0, bossHP:0, fireRate:300 },
  { id:3, waves:5, perWave:[4,5,5,6,1],        types:['small','medium'],     speed:40, bossWave:5, bossHP:5, fireRate:290 },
  { id:4, waves:5, perWave:[5,5,6,7,1],        types:['medium'],             speed:48, bossWave:5, bossHP:6, fireRate:280 },
  { id:5, waves:6, perWave:[4,5,6,6,7,1],      types:['small','medium','fast'], speed:45, bossWave:6, bossHP:7, fireRate:265 },
  { id:6, waves:6, perWave:[5,5,6,7,7,1],      types:['fast','medium'],      speed:55, bossWave:6, bossHP:7, fireRate:250 },
  { id:7, waves:6, perWave:[5,6,6,7,8,1],      types:['fast','medium','small'], speed:60, bossWave:6, bossHP:8, fireRate:240 },
  { id:8, waves:6, perWave:[5,6,7,7,8,1],      types:['elite','fast','medium'], speed:58, bossWave:6, bossHP:9, fireRate:225 },
  { id:9, waves:6, perWave:[6,6,7,8,8,1],      types:['elite','fast','medium','small'], speed:65, bossWave:6, bossHP:10, fireRate:210 },
  { id:10,waves:6, perWave:[6,7,7,8,9,1],      types:['elite','fast','medium','small'], speed:72, bossWave:6, bossHP:14, fireRate:195 },
];

export const CANVAS_W = 800;
export const CANVAS_H = 600;
export const PLAYER_BASE_SIZE = 40;
export const PLAYER_GROWTH_PER_LEVEL = 2;
