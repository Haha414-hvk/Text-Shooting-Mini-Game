interface Props {
  score: number;
  level: number;
  lives: number;
  onRestart: () => void;
}

export function GameOver({ score, level, lives, onRestart }: Props) {
  return (
    <div className="overlay">
      <h2 className="gameover-title">游戏结束</h2>
      <div className="gameover-stat">最终得分: {score}</div>
      <div className="gameover-stat">到达关卡: {level + 1} / 10</div>
      <div className="gameover-stat">❤ 剩余 x{lives}</div>
      <button className="btn-primary" onClick={onRestart}>
        重新开始
      </button>
    </div>
  );
}
