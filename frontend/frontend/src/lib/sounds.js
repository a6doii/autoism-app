import correctSfx from '../Assets/mixkit-achievement-bell-600.wav';
import successSfx from '../Assets/mixkit-fantasy-game-success-notification-270.wav';
import loseSfx    from '../Assets/mixkit-losing-drums-2023.wav';
import winSfx     from '../Assets/mixkit-male-voice-cheer-victory-2011.wav';
import levelSfx   from '../Assets/mixkit-unlock-game-notification-253.wav';

const play = (src, volume = 0.5) => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (_) {}
};

export const sounds = {
  correct: () => play(correctSfx),       // bell  — each correct answer
  wrong:   () => play(loseSfx, 0.4),     // drums — each wrong answer
  win:     () => play(winSfx),           // cheer — game over, score ≥ 0.8
  pass:    () => play(successSfx),       // fanfare — game over, score 0.5–0.8
  lose:    () => play(loseSfx, 0.6),     // drums — game over, score < 0.5
  start:   () => play(levelSfx, 0.5),   // unlock — game starts
};
