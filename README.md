# 文字打飞机 · Text Shooter

> **中文**：一个纯文字/ASCII 渲染的纵版打飞机小游戏，共 10 关。React 18 + TypeScript + Vite 重构版。
>
> **English**：A vertical scrolling shooter rendered with text/ASCII characters. 10 levels. Refactored with React 18 + TypeScript + Vite.

```
┌──────────────────────────────────┐
│  关卡 3 / 10   第 2 / 5 波       │
│  [P] 5.2s  ████████              │
│                    ❤❤❤ ❤       │
│             \o/                  │
│               o                  │
│     ︿︿︿                        │
│                                  │
│              W                   │
└──────────────────────────────────┘
```

---

## 快速开始 · Quick Start

```bash
# 安装依赖 Install dependencies
npm install

# 开发模式 Development (HMR hot reload)
npm run dev

# 生产构建 Production build
npm run build

# 预览构建结果 Preview build
npm run preview
```

---

## 玩法 · Gameplay

| 中文 | English |
|------|---------|
| **鼠标移动** 控制战机位置 | **Mouse movement** controls your ship |
| **自动开火** — 无需按键 | **Auto-fire** — no button mashing |
| 攻击波 `︿︿︿` 自动发射 | Attack waves `︿︿︿` fire continuously |
| **10 个关卡**，每关 5~6 波 | **10 levels**, 5~6 waves each |
| 最后一波可能是 BOSS | Final wave may be a BOSS |
| 击败 BOSS 即可过关 | Defeat the BOSS to clear the level |

---

## 敌人系统 · Enemies

| 敌人 Enemy | 外观 Visual | 行为 Behavior | 攻击 Attack |
|-----------|-------------|--------------|------------|
| 小型 Small | `o` | 垂直下落 Straight down | 少量弹幕 Few bullets |
| 中型 Medium | `\o/` | 蛇形摆动 Sine-wave wobble | 中量弹幕 Moderate bullets |
| 快速 Fast | `->` | **2.7x** 高速直落 Speed rush | **不射击 None** |
| 精英 Elite | `[E]` | Z 字折线 Zigzag pattern | 较多弹幕 Many bullets |
| BOSS | `[BOSS]` | 水平巡逻 Horizontal patrol | **大量扇形 Heavy fan** |

---

## 掉落物 & 超级形态 · Power-ups & Super Forms

| 状态 State | 效果 Effect |
|-----------|------------|
| **[P] 威力 Power** | 攻击波 **加粗 28px** / Projectile becomes **bold 28px** |
| **[M] 多重 Multi** | 攻击波 `︿︿︿︿︿` 扇形 / Fans out as `︿︿︿︿︿` |
| **[P] + [M] 叠加 Both** | 攻击波 `︽` **34px · 5 发散弹** / Ultimate `︽` **5-pellet spread** |
| **[P] + [M] 护盾 Shield** | **无敌状态** / **Invincible** — 蓝色护盾 `【>>>>W<<<<】` |

---

## 成长系统 · Progression

| 中文 | English |
|------|---------|
| 每过一关战机 **变大**（40px → 58px） | Ship **grows bigger** per cleared level (40px → 58px) |
| 每关 **50% 概率** 增加一条生命 | **50% chance** for +1 life per level |
| 生命 **无上限** | **No upper limit** on lives |
| 超级形态 **W** / 终极形态 **>>>>W<<<<** | Super Form **W** / Ultimate Form **>>>>W<<<<** |

---

## 排行榜 · Leaderboard

| 中文 | English |
|------|---------|
| 通关后输入名字记录分数 | Enter your name on victory to record your score |
| 数据存入浏览器 `localStorage` | Scores saved in browser `localStorage` |
| 通关画面显示 **TOP 10** 排名 | **TOP 10** ranking shown on victory screen |

---

## 音效 · Sound

| 中文 | English |
|------|---------|
| **过关音效**：C5→E5→G5→C6 琶音 | **Level clear**: ascending C5→E5→G5→C6 arpeggio |
| **通关音效**：九音阶上行 + 大三和弦 | **Game clear**: 9-note ascending scale + major chord |
| **通关礼花**：彩色粒子特效庆祝 | **Fireworks**: colorful particle celebration |

---

## 项目结构 · Project Structure

```
src/
├── types/          # 类型定义 Type definitions
├── engine/         # 游戏引擎 Game engine (独立于 React)
│   ├── GameEngine.ts   # 主引擎 Main engine (Canvas + game loop)
│   ├── config.ts       # 关卡/敌人配置 Level & enemy config
│   ├── physics.ts      # AABB碰撞检测 Collision detection
│   ├── ai.ts           # 敌人AI Enemy AI behaviors
│   ├── audio.ts        # 音效 Web Audio API sound
│   ├── entities.ts     # 实体生成 Entity spawning
│   └── particles.ts    # 粒子系统 Particle system
├── hooks/          # React Hooks
│   ├── useGameEngine.ts    # 引擎生命周期 Engine lifecycle
│   └── useLeaderboard.ts   # 排行榜 Leaderboard
├── components/     # React UI 组件 UI components
│   ├── GameCanvas.tsx
│   ├── HUD.tsx
│   ├── StartScreen.tsx
│   ├── LevelComplete.tsx
│   ├── GameOver.tsx
│   └── Victory.tsx
├── App.tsx         # 根组件 Root component
└── main.tsx        # 入口 Entry point
```

---

## 技术栈 · Tech Stack

| 技术 Technology | 用途 Purpose |
|---------------|-------------|
| **React 18** | UI 层 UI layer |
| **TypeScript** | 类型安全 Type safety |
| **Vite** | 构建工具 Build tool |
| **HTML5 Canvas** | 游戏渲染 Game rendering |
| **Web Audio API** | 音效合成 Sound synthesis |
| **localStorage** | 排行榜持久化 Leaderboard persistence |
| **AABB** | 碰撞检测 Collision detection |

---

## 版本历史 · Changelog

| 版本 Version | 日期 Date | 说明 Notes |
|-------------|----------|-----------|
| v2.0.0 | 2026-07-21 | React 18 + TypeScript + Vite 架构升级 Architecture upgrade |
| v1.0.0 | 2026-07-21 | 完整十关原型发布 Initial full 10-level prototype |

```bash
git tag -a v2.0.0 -m "版本说明 Release notes"
git push origin v2.0.0
git tag -l
```

---

MIT License
