let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function play(freq: number, type: OscillatorType, duration: number, gain = 0.08) {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.connect(g);
    g.connect(ac.destination);
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch {
    /* ignore */
  }
}

export const sounds = {
  correct: () => {
    play(523, "sine", 0.12);
    setTimeout(() => play(659, "sine", 0.15), 80);
    setTimeout(() => play(784, "sine", 0.2), 180);
  },
  wrong: () => {
    play(220, "sawtooth", 0.25, 0.06);
    setTimeout(() => play(180, "sawtooth", 0.2, 0.05), 150);
  },
  levelup: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => play(f, "sine", 0.3), i * 100));
  },
  click: () => play(600, "sine", 0.05, 0.04),
  win: () => {
    [523, 587, 659, 698, 784].forEach((f, i) => setTimeout(() => play(f, "sine", 0.2), i * 80));
  },
  coin: () => {
    play(988, "square", 0.08, 0.05);
    setTimeout(() => play(1318, "square", 0.1, 0.05), 60);
  },
};
