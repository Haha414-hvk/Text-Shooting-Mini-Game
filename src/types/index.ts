export type Screen = 'menu' | 'playing' | 'paused' | 'levelComplete' | 'gameOver' | 'victory';

export type EnemyType = 'small' | 'medium' | 'fast' | 'elite' | 'boss';
export type AIBehavior = 'straight' | 'wobble' | 'fast' | 'zigzag' | 'patrol';
export type DropType = 'power' | 'multi';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EnemyConfig {
  text: string;
  w: number;
  h: number;
  hp: number;
  ai: AIBehavior;
  color: string;
  pts: number;
  fireMin: number;
  fireMax: number;
  fireCount: number;
}

export interface LevelConfig {
  id: number;
  waves: number;
  perWave: number[];
  types: EnemyType[];
  speed: number;
  bossWave: number;
  bossHP: number;
  fireRate: number;
}

export interface PowerUpState {
  active: boolean;
  timer: number;
  duration: number;
}

export interface PowerUps {
  power: PowerUpState;
  multi: PowerUpState;
}

export interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Enemy extends Entity {
  hp: number;
  maxHp: number;
  text: string;
  color: string;
  ai: AIBehavior;
  speed: number;
  pts: number;
  age: number;
  entityType: EnemyType;
  fireTimer: number;
  fireInterval: number;
  fireCount: number;
  aiState: { direction: number; targetY?: number; entered?: boolean };
}

export interface Projectile extends Entity {
  vx: number;
  vy: number;
  text: string;
  isBold: boolean;
  fontSize: number;
}

export interface EnemyProjectile extends Entity {
  vx: number;
  vy: number;
  text: string;
  color: string;
}

export interface Drop extends Entity {
  type: DropType;
  text: string;
  color: string;
  vy: number;
  age: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  screen: Screen;
  level: number;
  wave: number;
  waveDelay: number;
  score: number;
  lives: number;
  mouseX: number;
  mouseY: number;
  fireTimer: number;
  enemies: Enemy[];
  projectiles: Projectile[];
  enemyProjectiles: EnemyProjectile[];
  particles: Particle[];
  drops: Drop[];
  powerups: PowerUps;
  flashing: number;
  invulnTimer: number;
  combo: number;
  maxCombo: number;
  levelCompleteTimer: number;
  levelCompleteSoundPlayed: boolean;
  lifeBonusThisLevel: boolean;
  fireworksActive: boolean;
  fireworkTimer: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export interface UIState {
  screen: Screen;
  level: number;
  wave: number;
  totalWaves: number;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  powerups: PowerUps;
  isBoss: boolean;
  lifeBonusThisLevel: boolean;
  leaderboard: LeaderboardEntry[];
  leaderboardEntry: LeaderboardEntry | null;
}

export interface DropConfig {
  text: string;
  color: string;
  w: number;
  h: number;
  label: string;
}
