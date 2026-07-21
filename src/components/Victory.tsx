import type { LeaderboardEntry } from '../types';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  score: number;
  maxCombo: number;
  lives: number;
  onRestart: () => void;
}

export function Victory({ score, maxCombo, lives, onRestart }: Props) {
  const { list, addEntry } = useLeaderboard();
  const [entry, setEntry] = useState<{ name: string; score: number; date: string } | null>(null);
  const [namePrompted, setNamePrompted] = useState(false);

  const promptName = useCallback(() => {
    if (namePrompted) return;
    setNamePrompted(true);
    setTimeout(() => {
      const name = prompt('🏆 通关！请输入名字记录排行榜：', '玩家') || '玩家';
      const result = addEntry(name, score);
      setEntry(result.entry);
    }, 600);
  }, [namePrompted, addEntry, score]);

  useEffect(() => { promptName(); }, [promptName]);

  return (
    <div className="overlay">
      <h2 className="victory-title">🎉 通关! 🎉</h2>
      <div className="victory-stat">最终得分: {score}</div>
      <div className="victory-stat">最大连击: {maxCombo} | ❤ x{lives}</div>

      {list.length > 0 && (
        <div className="leaderboard">
          <h3>🏆 排行榜 TOP 10</h3>
          <table>
            <tbody>
              {list.map((e, i) => (
                <tr key={i} className={entry && e.name === entry.name && e.score === entry.score ? 'highlight' : ''}>
                  <td className="rank">{i + 1}.</td>
                  <td className="name">{e.name}</td>
                  <td className="score">{e.score}分</td>
                  <td className="date">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn-primary" onClick={onRestart}>
        再来一次
      </button>
    </div>
  );
}
