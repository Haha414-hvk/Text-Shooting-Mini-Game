import { useGameEngine } from './hooks/useGameEngine';
import { GameCanvas } from './components/GameCanvas';
import { StartScreen } from './components/StartScreen';
import { HUD } from './components/HUD';
import { LevelComplete } from './components/LevelComplete';
import { GameOver } from './components/GameOver';
import { Victory } from './components/Victory';
import './App.css';

function App() {
  const { canvasRef, uiState, start, pause, restart } = useGameEngine();

  return (
    <div className="game-wrapper">
      <div className="canvas-area">
        <GameCanvas canvasRef={canvasRef} />

        {uiState.screen === 'menu' && <StartScreen onStart={start} />}

        {uiState.screen === 'playing' && <HUD state={uiState} />}

        {uiState.screen === 'levelComplete' && (
          <>
            <HUD state={uiState} />
            <LevelComplete
              level={uiState.level}
              score={uiState.score}
              lifeBonus={uiState.lifeBonusThisLevel}
              onNext={start}
            />
          </>
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
        <button
          className="ctrl-btn"
          onClick={uiState.screen === 'playing' ? pause : start}
          disabled={uiState.screen === 'menu' || uiState.screen === 'victory' || uiState.screen === 'gameOver'}
        >
          {uiState.screen === 'paused' ? '继续' : '暂停'}
        </button>
        <button className="ctrl-btn" onClick={restart}>
          重新开始
        </button>
      </div>

      <div className="hint">鼠标移动控制战机 · 自动开火</div>
    </div>
  );
}

export default App;
