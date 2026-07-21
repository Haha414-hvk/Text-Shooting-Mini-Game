import { useRef, useEffect, useCallback, useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { GameCanvas } from './components/GameCanvas';
import { StartScreen } from './components/StartScreen';
import { HUD } from './components/HUD';
import { LevelComplete } from './components/LevelComplete';
import { GameOver } from './components/GameOver';
import { Victory } from './components/Victory';
import './App.css';

const screensWithHUD = new Set(['playing', 'paused', 'levelComplete']);

function App() {
  const { canvasRef, uiState, start, pause, restart } = useGameEngine();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(true);

  useEffect(() => {
    const audio = new Audio('/bgm.m4a');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (uiState.screen === 'playing') {
      if (musicOn && audio.paused) audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [uiState.screen, musicOn]);

  const toggleMusic = useCallback(() => {
    setMusicOn((v) => {
      const next = !v;
      if (audioRef.current) {
        if (next) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }
      return next;
    });
  }, []);

  const isPlaying = uiState.screen === 'playing';
  const showHUD = screensWithHUD.has(uiState.screen);

  return (
    <div className="game-wrapper">
      <div className="canvas-area">
        <GameCanvas canvasRef={canvasRef} />

        {showHUD && <HUD state={uiState} />}

        {uiState.screen === 'paused' && (
          <div className="overlay">
            <div className="pause-text">⏸ 暂停</div>
          </div>
        )}

        {uiState.screen === 'menu' && <StartScreen onStart={start} />}

        {uiState.screen === 'levelComplete' && (
          <LevelComplete
            level={uiState.level}
            score={uiState.score}
            lifeBonus={uiState.lifeBonusThisLevel}
            onNext={start}
          />
        )}

        {uiState.screen === 'gameOver' && (
          <GameOver
            score={uiState.score}
            level={uiState.level}
            lives={uiState.lives}
            onRestart={restart}
          />
        )}

        {uiState.screen === 'victory' && (
          <Victory
            score={uiState.score}
            maxCombo={uiState.maxCombo}
            lives={uiState.lives}
            onRestart={restart}
          />
        )}
      </div>

      <div className="controls">
        <button className="ctrl-btn" onClick={() => { if (uiState.screen === 'paused') pause(); else if (isPlaying) pause(); else start(); }}>
          {uiState.screen === 'paused' ? '继续' : isPlaying ? '暂停' : '开始游戏'}
        </button>
        <button className="ctrl-btn" onClick={restart}>
          重新开始
        </button>
        <button className={'ctrl-btn' + (musicOn ? '' : ' muted')} onClick={toggleMusic}>
          {musicOn ? '🔊 音乐' : '🔇 静音'}
        </button>
      </div>

      <div className="hint">鼠标移动控制战机 · 自动开火</div>
    </div>
  );
}

export default App;
