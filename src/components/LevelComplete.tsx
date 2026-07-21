interface Props {
  level: number;
  score: number;
  lifeBonus: boolean;
  onNext: () => void;
}

export function LevelComplete({ level, score, lifeBonus, onNext }: Props) {
  return (
    <div className="overlay">
      <h2 className="complete-title">关卡 {level + 1} 通过!</h2>
      <div className="complete-score">得分: {score}</div>
      {lifeBonus ? (
        <div className="life-bonus">❤ 额外获得一条生命!</div>
      ) : (
        <div className="life-bonus miss">未获得生命奖励</div>
      )}
      <button className="btn-primary" onClick={onNext}>
        下一关
      </button>
    </div>
  );
}
