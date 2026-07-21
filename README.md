# 文字打飞机 · Text Shooter

一个使用纯文字/ASCII 渲染的纵版打飞机小游戏，共 10 关，全部使用 HTML + CSS + JavaScript 实现，无需任何外部依赖。

A vertical scrolling shooter game rendered entirely with text/ASCII characters. 10 levels, built with pure HTML + CSS + JavaScript — zero external dependencies.

---

## 游戏截图 Preview

```
┌──────────────────────────────────┐
│  关卡 3 / 10   第 2 / 5 波       │
│  [P] 5.2s  ████████              │
│                         ❤❤❤   │
│             \o/                  │
│               o                  │
│     ︿︿︿                        │
│                                  │
│              W                   │
└──────────────────────────────────┘
```

---

## 中文介绍

### 玩法
- **鼠标移动** 控制战机位置
- **自动开火** — 无需按键，持续发射攻击波 `︿︿︿`
- **10 个关卡**，每关 5~6 波敌人，最后一波可能是 BOSS

### 敌人系统
| 敌人 | 外观 | 行为 | 攻击 |
|------|------|------|------|
| 小型 | `o` | 垂直下落 | 少量弹幕 |
| 中型 | `\o/` | 蛇形摆动 | 中量弹幕 |
| 快速 | `->` | 2.7x 高速直落 | 不射击 |
| 精英 | `[E]` | Z 字折线 | 较多弹幕 |
| BOSS | `[BOSS]` | 水平巡逻 | 大量扇形弹幕 |

### 掉落物 & 超级形态
- **[P] 威力** — 攻击波变粗变大（**加粗 28px**）
- **[M] 多重** — 攻击波变为扇形 `︿︿︿︿︿`
- **[P] + [M] 同时持有** — 攻击波变为 `︽`（34px 加粗 **5 发散弹**），玩家进入**无敌状态**（蓝色护盾 `【>>>>W<<<<】`）

### 成长系统
- 每过一关战机 **变大**（40px → 58px）
- 每关 **50% 概率** 增加一条生命，**无上限**
- 拾取掉落物进入 **超级形态**（`W` / `>>>>W<<<<`）

### 排行榜
- 通关后输入名字，分数存入浏览器 `localStorage`
- 显示 TOP 10 排名

### 音效
- 过关：C5→E5→G5→C6 琶音
- 通关：九音阶上行 + 大三和弦 + **彩色礼花粒子效果**

---

## English Introduction

### Gameplay
- **Mouse movement** controls your ship
- **Auto-fire** — continuously shoots attack waves `︿︿︿`
- **10 levels**, each with 5~6 waves of enemies, final wave may be a BOSS

### Enemy System
| Enemy | Visual | Behavior | Attack |
|-------|--------|----------|--------|
| Small | `o` | Straight down | Few bullets |
| Medium | `\o/` | Sine-wave wobble | Moderate bullets |
| Fast | `->` | 2.7x speed rush | None |
| Elite | `[E]` | Zigzag pattern | Many bullets |
| BOSS | `[BOSS]` | Horizontal patrol | Heavy fan-shaped barrage |

### Power-ups & Super Forms
- **[P] Power** — projectile becomes **bold 28px**
- **[M] Multi** — projectile fans out as `︿︿︿︿︿`
- **[P] + [M] together** — ultimate form `︽` (34px bold, **5-pellet spread**), player becomes **invincible** (blue shield `【>>>>W<<<<】`)

### Progression
- Ship **grows bigger** per cleared level (40px → 58px)
- **50% chance** for +1 life per level, **no upper limit**
- Pick up drops to enter **Super Form** (`W` / `>>>>W<<<<`)

### Leaderboard
- Enter your name on victory, scores saved to browser `localStorage`
- TOP 10 ranking displayed on victory screen

### Sound
- Level clear: ascending C5→E5→G5→C6 arpeggio
- Game clear: 9-note scale + major chord + **colorful firework particles**

---

## 如何运行 How to Run

直接双击打开 `game.html` 即可游玩，无需安装任何东西。

Just double-click `game.html` to play. No installation required.

---

## 技术栈 Tech Stack

- **HTML5 Canvas** — 游戏渲染
- **Vanilla JavaScript** — 游戏逻辑 (requestAnimationFrame 游戏循环)
- **Web Audio API** — 音效合成
- **localStorage** — 排行榜持久化
- **AABB** — 碰撞检测

---

## 关卡难度曲线 Level Difficulty

| 关卡 | 波数 | 敌人种类 | 速度(px/s) | BOSS血量 |
|------|------|---------|-----------|---------|
| 1-2  | 5    | 小型     | 35~45    | 无      |
| 3-4  | 5    | +中型    | 40~48    | 5~6     |
| 5-6  | 6    | +快速    | 45~55    | 7      |
| 7-8  | 6    | +精英    | 58~60    | 8~9     |
| 9    | 6    | 全类型   | 65       | 10      |
| 10   | 6    | 全类型   | 72       | 14      |

---

MIT License
