interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  return (
    <div className="overlay">
      <h1 className="title">文字打飞机</h1>
      <div className="menu-hint">鼠标移动操控 · 自动发射攻击波</div>
      <div className="menu-hint">拾取 [P]威力  [M]多重  进入超级形态</div>
      <div className="menu-hint">共 10 关 · 每过一关 50% 概率增加生命</div>
      <button className="btn-primary" onClick={onStart}>
        开始游戏
      </button>
    </div>
  );
}
