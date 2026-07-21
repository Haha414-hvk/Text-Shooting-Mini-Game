let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type?: OscillatorType, volume?: number) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playPickup() {
  playTone(880, 0.1, 'sine', 0.06);
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.06), 70);
}

export function playLevelComplete() {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.25, 'square', 0.07), i * 100)
  );
}

export function playVictory() {
  const notes = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568];
  notes.forEach((f, i) =>
    setTimeout(() => playTone(f, 0.35, 'sine', 0.08), i * 130)
  );
  setTimeout(() => {
    [523, 659, 784, 1047].forEach((f) => playTone(f, 0.9, 'sine', 0.1));
  }, notes.length * 130 + 200);
}
