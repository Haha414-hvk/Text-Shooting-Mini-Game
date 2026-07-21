import type { UIState } from '../types';

interface Props {
  state: UIState;
}

export function HUD({ state }: Props) {
  return (
    <div className="hud">
      <div className="hud-left">
        <span>关卡 {state.level + 1} / 10</span>
        <span className="hud-wave">第 {state.wave + 1} / {state.totalWaves} 波</span>
        {state.isBoss && <span className="hud-boss">⚠ BOSS 波</span>}
      </div>
      <div className="hud-right">
        <span className="hud-hearts">{'❤'.repeat(Math.max(0, state.lives))}</span>
        <span>得分 {state.score}</span>
        <span>连击 x{state.combo}</span>
      </div>
    </div>
  );
}
