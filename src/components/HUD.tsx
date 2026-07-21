import type { UIState } from '../types';

interface Props {
  state: UIState;
}

export function HUD({ state }: Props) {
  const isSuper = state.powerups.power.active || state.powerups.multi.active;
  const isDouble = state.powerups.power.active && state.powerups.multi.active;

  return (
    <div className="hud">
      <div className="hud-left-col">
        <div className="hud-row">
          <span className="hud-level">关卡 {state.level + 1} / 10</span>
          <span className="hud-wave">第 {state.wave + 1} / {state.totalWaves} 波</span>
          {state.isBoss && <span className="hud-boss">⚠ BOSS 波</span>}
        </div>
        <div className="hud-row">
          {isDouble ? (
            <span className="hud-invincible">✦ 无敌 ✦</span>
          ) : isSuper ? (
            <span className="hud-super">⚡ 超级形态</span>
          ) : null}
        </div>
        <div className="hud-row powerups-row">
          {(['power', 'multi'] as const).map((key) => {
            const pu = state.powerups[key];
            if (!pu.active) return null;
            const cfg = key === 'power'
              ? { text: '[P]', color: '#ff8800', label: '威力' }
              : { text: '[M]', color: '#44aaff', label: '多重' };
            const pct = Math.max(0, pu.timer / pu.duration);
            return (
              <div key={key} className="powerup-item">
                <span className="powerup-label" style={{ color: cfg.color }}>
                  {cfg.text} {pu.timer.toFixed(1)}s
                </span>
                <div className="powerup-bar-bg">
                  <div className="powerup-bar-fill" style={{ width: `${pct * 100}%`, background: cfg.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="hud-right">
        <span className="hud-hearts">{'❤'.repeat(Math.max(0, state.lives))}</span>
        <span>得分 {state.score}</span>
        <span className="hud-combo">连击 x{state.combo}</span>
      </div>
    </div>
  );
}
