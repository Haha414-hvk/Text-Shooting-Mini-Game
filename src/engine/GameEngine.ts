import type {
  GameState, UIState, Enemy,
} from '../types';
import {
  LEVELS, CANVAS_W, CANVAS_H,
  PLAYER_BASE_SIZE, PLAYER_GROWTH_PER_LEVEL,
} from './config';
import { collides, rand, clamp } from './physics';
import { updateEnemyAI } from './ai';
import { spawnWave, tryCreateDrop } from './entities';
import { spawnParticles, spawnFirework } from './particles';
import { playPickup, playLevelComplete, playVictory } from './audio';

export type StateChangeCallback = (uiState: UIState) => void;

export class GameEngine {
  private ctx!: CanvasRenderingContext2D;
  private gs!: GameState;
  private lastTime = 0;
  private animFrameId = 0;
  private running = false;

  onStateChange: StateChangeCallback | null = null;

  init(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.resetState();
    this.emitState();
  }

  // ──── State management ────

  private resetState() {
    this.gs = {
      screen: 'menu', level: 0, wave: 0, waveDelay: 0,
      score: 0, lives: 3,
      mouseX: CANVAS_W / 2, mouseY: CANVAS_H - 80,
      fireTimer: 0,
      enemies: [], projectiles: [], enemyProjectiles: [],
      particles: [], drops: [],
      powerups: {
        power: { active: false, timer: 0, duration: 8 },
        multi: { active: false, timer: 0, duration: 8 },
      },
      flashing: 0, invulnTimer: 0,
      combo: 0, maxCombo: 0,
      levelCompleteTimer: 0, levelCompleteSoundPlayed: false,
      lifeBonusThisLevel: false,
      fireworksActive: false, fireworkTimer: 0,
    };
  }

  private playerSize(): number {
    return PLAYER_BASE_SIZE + Math.min(this.gs.level, 9) * PLAYER_GROWTH_PER_LEVEL;
  }

  private isSuperForm(): boolean {
    return this.gs.powerups.power.active || this.gs.powerups.multi.active;
  }

  private isDoubleSuper(): boolean {
    return this.gs.powerups.power.active && this.gs.powerups.multi.active;
  }

  private levelConfig() {
    return LEVELS[this.gs.level];
  }

  private emitState() {
    if (!this.onStateChange) return;
    const lv = this.levelConfig();
    const waveInfo = lv ? { count: lv.perWave[this.gs.wave], isBoss: lv.bossWave === this.gs.wave + 1 } : { count: 0, isBoss: false };
    const ui: UIState = {
      screen: this.gs.screen,
      level: this.gs.level,
      wave: this.gs.wave,
      totalWaves: lv?.waves || 0,
      score: this.gs.score,
      lives: this.gs.lives,
      combo: this.gs.combo,
      maxCombo: this.gs.maxCombo,
      powerups: { ...this.gs.powerups },
      isBoss: waveInfo.isBoss,
      lifeBonusThisLevel: this.gs.lifeBonusThisLevel,
      leaderboard: [],
      leaderboardEntry: null,
    };
    this.onStateChange(ui);
  }

  // ──── Game loop ────

  start() {
    if (this.running) return;
    this.running = true;
    this.gs.screen = 'playing';
    this.gs.wave = 0;
    this.gs.waveDelay = 0.5;
    this.lastTime = performance.now();
    setTimeout(() => {
      if (this.gs.screen === 'playing') {
        this.gs.enemies.push(...spawnWave(this.gs.level, this.levelConfig(), 0));
      }
    }, 500);
    this.loop(performance.now());
    this.emitState();
  }

  pause() {
    this.gs.screen = this.gs.screen === 'playing' ? 'paused' : 'playing';
    if (this.gs.screen === 'playing') this.lastTime = performance.now();
    this.emitState();
  }

  restart() {
    this.stop();
    this.resetState();
    this.start();
  }

  stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
  }

  destroy() {
    this.stop();
    this.onStateChange = null;
  }

  setMouse(x: number, y: number) {
    this.gs.mouseX = clamp(x, 10, CANVAS_W - 10);
    this.gs.mouseY = clamp(y, 10, CANVAS_H - 10);
  }

  private loop = (timestamp: number) => {
    if (!this.running) return;
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    if (dt > 0.05) dt = 0.05;

    this.update(dt);
    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  // ──── Update ────

  private update(dt: number) {
    const { gs } = this;
    gs.levelCompleteTimer += dt;

    if (gs.screen === 'playing') {
      this.updatePlaying(dt);
    }

    if (gs.screen === 'levelComplete') {
      if (!gs.levelCompleteSoundPlayed) {
        gs.levelCompleteSoundPlayed = true;
        if (gs.level < 9) playLevelComplete();
      }
      if (gs.levelCompleteTimer > 2.5) {
        gs.levelCompleteTimer = 0;
        this.nextLevel();
      }
    }

    if (gs.fireworksActive) {
      gs.fireworkTimer += dt;
      if (gs.fireworkTimer > 0.25) {
        gs.fireworkTimer = 0;
        gs.particles.push(...spawnFirework());
      }
    }

    this.emitState();
  }

  private updatePlaying(dt: number) {
    const { gs } = this;

    if (gs.flashing > 0) gs.flashing -= dt;
    if (gs.invulnTimer > 0) gs.invulnTimer -= dt;

    const lv = this.levelConfig();

    // Auto-fire
    gs.fireTimer -= dt * 1000;
    if (gs.fireTimer <= 0) {
      gs.fireTimer = lv.fireRate;
      this.spawnProjectile();
    }

    // Move player projectiles
    for (let i = gs.projectiles.length - 1; i >= 0; i--) {
      const p = gs.projectiles[i];
      p.x += (p.vx || 0) * dt;
      p.y += p.vy * dt;
      if (p.y + p.h < 0 || p.x > CANVAS_W + 20 || p.x < -20) {
        gs.projectiles.splice(i, 1);
      }
    }

    // Update enemies & enemy firing
    const pBox = this.getPlayerBox();
    for (let i = gs.enemies.length - 1; i >= 0; i--) {
      const e = gs.enemies[i];
      updateEnemyAI(e, dt);

      // Enemy fires
      if (e.fireInterval > 0) {
        e.fireTimer -= dt;
        if (e.fireTimer <= 0) {
          e.fireTimer = e.fireInterval + rand(-0.3, 0.3);
          this.enemyFire(e);
        }
      }

      // Enemy escapes bottom
      if (e.y > CANVAS_H + 30) {
        if (e.ai === 'patrol') { gs.lives = 0; gs.screen = 'gameOver'; }
        else gs.lives--;
        if (gs.lives <= 0) { gs.lives = 0; gs.screen = 'gameOver'; }
        gs.enemies.splice(i, 1);
        gs.flashing = 0.5;
        continue;
      }

      // Enemy collides with player
      if (!this.isDoubleSuper() && gs.invulnTimer <= 0 && collides(pBox, e)) {
        gs.lives--; gs.invulnTimer = 1.2; gs.flashing = 0.5;
        gs.particles.push(...spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff0000', 15, 1.2));
        gs.drops.push(...tryCreateDrop(e.x + e.w / 2, e.y + e.h / 2, e.entityType));
        gs.enemies.splice(i, 1);
        if (gs.lives <= 0) { gs.lives = 0; gs.screen = 'gameOver'; }
        continue;
      }
    }

    // Move enemy projectiles & player collision
    for (let i = gs.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = gs.enemyProjectiles[i];
      ep.x += (ep.vx || 0) * dt;
      ep.y += ep.vy * dt;
      if (ep.y > CANVAS_H + 20 || ep.x < -30 || ep.x > CANVAS_W + 30) {
        gs.enemyProjectiles.splice(i, 1);
        continue;
      }
      if (!this.isDoubleSuper() && gs.invulnTimer <= 0 && collides(this.getPlayerBox(), ep)) {
        gs.lives--; gs.invulnTimer = 1.2; gs.flashing = 0.5;
        gs.particles.push(...spawnParticles(ep.x + ep.w / 2, ep.y + ep.h / 2, '#ff4444', 10));
        gs.enemyProjectiles.splice(i, 1);
        if (gs.lives <= 0) { gs.lives = 0; gs.screen = 'gameOver'; }
      }
    }

    // Player projectiles hit enemies
    for (let i = gs.projectiles.length - 1; i >= 0; i--) {
      const p = gs.projectiles[i];
      let used = false;
      for (let j = gs.enemies.length - 1; j >= 0; j--) {
        const e = gs.enemies[j];
        if (collides(p, e)) {
          e.hp--;
          gs.particles.push(...spawnParticles(p.x + p.w / 2, p.y + p.h / 2, '#ffff44', 5));
          if (e.hp <= 0) {
            gs.score += e.pts * (1 + Math.floor(gs.combo / 5) * 0.5);
            gs.combo++;
            if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo;
            gs.particles.push(...spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color, 15, 1.5));
            gs.drops.push(...tryCreateDrop(e.x + e.w / 2, e.y + e.h / 2, e.entityType));
            gs.enemies.splice(j, 1);
          }
          used = true;
          break;
        }
      }
      if (used) gs.projectiles.splice(i, 1);
    }

    // Drops
    for (let i = gs.drops.length - 1; i >= 0; i--) {
      const d = gs.drops[i];
      d.y += d.vy * dt;
      d.age += dt;
      if (d.y > CANVAS_H + 20) { gs.drops.splice(i, 1); continue; }
      if (collides(this.getPlayerBox(), d)) {
        const pu = gs.powerups[d.type];
        if (!pu.active) playPickup();
        pu.active = true;
        pu.timer = pu.duration;
        gs.particles.push(...spawnParticles(d.x + d.w / 2, d.y + d.h / 2, d.color, 20, 1.5));
        gs.drops.splice(i, 1);
      }
    }

    // Power-up timers
    (['power', 'multi'] as const).forEach((key) => {
      const pu = gs.powerups[key];
      if (pu.active) {
        pu.timer -= dt;
        if (pu.timer <= 0) { pu.active = false; pu.timer = 0; }
      }
    });

    // Particles
    for (let i = gs.particles.length - 1; i >= 0; i--) {
      const p = gs.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) gs.particles.splice(i, 1);
    }

    // Wave progression
    if (gs.enemies.length === 0) {
      gs.waveDelay += dt;
      if (gs.waveDelay > 1.2) {
        gs.waveDelay = 0;
        gs.wave++;
        if (gs.wave >= lv.waves) {
          gs.screen = 'levelComplete';
          gs.levelCompleteTimer = 0;
          gs.levelCompleteSoundPlayed = false;
          gs.lifeBonusThisLevel = Math.random() < 0.5;
        } else {
          gs.enemies.push(...spawnWave(gs.level, lv, gs.wave));
        }
      }
    }

    if (gs.lives <= 0) { gs.lives = 0; gs.screen = 'gameOver'; }
  }

  advanceLevel() {
    this.gs.levelCompleteTimer = 999;
  }

  private nextLevel() {
    const { gs } = this;
    if (gs.lifeBonusThisLevel) gs.lives++;
    gs.level++;
    if (gs.level >= 10) {
      gs.screen = 'victory';
      gs.fireworksActive = true;
      playVictory();
      return;
    }
    gs.wave = 0; gs.waveDelay = 0;
    gs.enemies = []; gs.projectiles = []; gs.enemyProjectiles = []; gs.drops = [];
    gs.combo = 0; gs.fireworksActive = false;
    gs.screen = 'playing';
    setTimeout(() => {
      if (gs.screen === 'playing') {
        gs.enemies.push(...spawnWave(gs.level, this.levelConfig(), 0));
      }
    }, 400);
  }

  // ──── Spawning helpers ────

  private spawnProjectile() {
    const { gs } = this;
    const speed = 450;
    const hasPower = gs.powerups.power.active;
    const hasMulti = gs.powerups.multi.active;
    const isBoth = hasPower && hasMulti;
    const pSize = this.playerSize();
    const baseY = gs.mouseY - pSize * 0.4;

    let text: string, pw: number, ph: number, isBold: boolean, fontSize: number, isSpread: boolean;

    if (isBoth) {
      text = '︽'; pw = 44; ph = 22; isBold = true; fontSize = 34; isSpread = true;
    } else if (hasPower) {
      text = '︿︿︿'; pw = 36; ph = 16; isBold = true; fontSize = 28; isSpread = false;
    } else if (hasMulti) {
      text = '︿︿︿︿︿'; pw = 48; ph = 16; isBold = false; fontSize = 24; isSpread = false;
    } else {
      text = '︿︿︿'; pw = 36; ph = 16; isBold = false; fontSize = 24; isSpread = false;
    }

    if (isSpread) {
      [-24, -12, 0, 12, 24].forEach((ox) => {
        gs.projectiles.push({
          x: gs.mouseX + ox - pw / 2, y: baseY, w: pw, h: ph,
          vx: ox * 3, vy: -speed, text, isBold, fontSize,
        });
      });
    } else {
      gs.projectiles.push({
        x: gs.mouseX - pw / 2, y: baseY, w: pw, h: ph,
        vx: 0, vy: -speed, text, isBold, fontSize,
      });
    }
  }

  private enemyFire(e: Enemy) {
    const { gs } = this;
    if (e.fireCount <= 1) {
      gs.enemyProjectiles.push({
        x: e.x + e.w / 2 - 10, y: e.y + e.h - 5,
        w: 20, h: 24, vx: 0, vy: 160 + rand(0, 40),
        text: '▼', color: '#ff6644',
      });
    } else {
      for (let j = 0; j < e.fireCount; j++) {
        const angle = e.fireCount > 1 ? (j / (e.fireCount - 1) - 0.5) * 0.7 : 0;
        gs.enemyProjectiles.push({
          x: e.x + e.w / 2 - 10, y: e.y + e.h - 5,
          w: 20, h: 24,
          vx: Math.sin(angle) * 100, vy: 150 + rand(0, 30),
          text: '▼', color: '#ff6644',
        });
      }
    }
  }

  private getPlayerBox() {
    const s = this.playerSize();
    const { gs } = this;
    if (this.isDoubleSuper()) {
      const w = s * 3.2;
      return { x: gs.mouseX - w / 2, y: gs.mouseY - s * 0.6, w, h: s * 1.1 };
    }
    if (this.isSuperForm()) {
      return { x: gs.mouseX - s * 0.5, y: gs.mouseY - s * 0.45, w: s * 0.9, h: s * 0.9 };
    }
    return { x: gs.mouseX - s * 0.4, y: gs.mouseY - s * 0.4, w: s * 0.8, h: s * 0.8 };
  }

  // ──── Render (game field only — UI is handled by React) ────

  private render() {
    const ctx = this.ctx;

    ctx.fillStyle = '#0a0a2e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#111122';
    for (let i = 0; i < 35; i++) {
      ctx.fillRect((i * 137 + 50) % CANVAS_W, (i * 251 + 30) % CANVAS_H, 1, 1);
    }

    if (this.gs.screen !== 'menu') {
      this.drawEntities();
    }
  }

  private drawEntities() {
    const { ctx, gs } = this;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Enemies
    for (const e of gs.enemies) {
      ctx.font = (e.ai === 'patrol' ? 'bold 42px ' : 'bold 34px ') + '"Courier New", monospace';
      ctx.fillStyle = e.color;
      ctx.fillText(e.text, e.x + e.w / 2, e.y + e.h / 2);
      this.drawHealthBar(e);
    }

    // Enemy projectiles
    for (const ep of gs.enemyProjectiles) {
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.fillStyle = ep.color;
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur = 10;
      ctx.fillText(ep.text, ep.x + ep.w / 2, ep.y + ep.h / 2 + 4);
      ctx.shadowBlur = 0;
    }

    // Drops
    for (const d of gs.drops) {
      const pulse = 1 + Math.sin(d.age * 6) * 0.08;
      ctx.font = `bold ${Math.floor(24 * pulse)}px "Courier New", monospace`;
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 14;
      ctx.fillText(d.text, d.x + d.w / 2, d.y + d.h / 2);
      ctx.shadowBlur = 0;
    }

    // Player projectiles
    for (const p of gs.projectiles) {
      ctx.font = (p.isBold ? 'bold ' : '') + `${p.fontSize}px "Courier New", monospace`;
      ctx.fillStyle = '#00ff88';
      ctx.fillText(p.text, p.x + p.w / 2, p.y + p.h / 2);
    }

    // Player
    const pSize = this.playerSize();
    let playerText: string, playerFont: string, playerColor: string;

    if (this.isDoubleSuper()) {
      playerText = '>>>>W<<<<';
      playerFont = `bold ${Math.floor(pSize * 1.2)}px "Courier New", monospace`;
      playerColor = '#ffdd00';
    } else if (this.isSuperForm()) {
      playerText = 'W';
      playerFont = `bold ${Math.floor(pSize * 1.1)}px "Courier New", monospace`;
      playerColor = '#ffcc00';
    } else {
      playerText = '▲';
      playerFont = `bold ${pSize}px "Courier New", monospace`;
      playerColor = '#00ff88';
    }

    if (gs.invulnTimer > 0 && Math.floor(gs.invulnTimer * 8) % 2 === 0) playerColor = '#ff4444';
    else if (gs.flashing > 0 && Math.floor(gs.flashing * 10) % 2 === 0) playerColor = '#ff0000';

    ctx.font = playerFont;
    if (this.isSuperForm()) { ctx.shadowColor = playerColor; ctx.shadowBlur = 18; }
    ctx.fillStyle = playerColor;
    ctx.fillText(playerText, gs.mouseX, gs.mouseY);
    ctx.shadowBlur = 0;

    if (this.isDoubleSuper()) {
      const shieldW = Math.floor(pSize * 1.5);
      ctx.font = `bold ${shieldW}px "Courier New", monospace`;
      const pulse = 0.4 + Math.sin(Date.now() * 0.006) * 0.2;
      ctx.fillStyle = `rgba(68, 170, 255, ${pulse})`;
      ctx.shadowColor = '#44aaff';
      ctx.shadowBlur = 30;
      ctx.fillText(`【${playerText}】`, gs.mouseX, gs.mouseY);
      ctx.shadowBlur = 0;
    }

    // Particles
    for (const p of gs.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.font = `${Math.floor(8 + p.size)}px "Courier New", monospace`;
      ctx.fillText('✦', p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }

  private drawHealthBar(e: Enemy) {
    if (e.hp >= e.maxHp) return;
    const by = e.y - 8;
    const ctx = this.ctx;
    ctx.fillStyle = '#333';
    ctx.fillRect(e.x, by, e.w, 5);
    ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#0f8' : e.hp / e.maxHp > 0.25 ? '#fa0' : '#f44';
    ctx.fillRect(e.x, by, e.w * (e.hp / e.maxHp), 5);
  }


}
