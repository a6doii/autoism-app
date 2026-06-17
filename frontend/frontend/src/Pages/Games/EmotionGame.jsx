import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';

const TOTAL = 8;
const POINTS = 1;

const EMOTIONS = [
  { key: 'happy', emoji: '😄' },
  { key: 'sad', emoji: '😢' },
  { key: 'angry', emoji: '😠' },
  { key: 'surprised', emoji: '😲' },
  { key: 'scared', emoji: '😱' },
  { key: 'excited', emoji: '🤩' },
  { key: 'sleepy', emoji: '😴' },
  { key: 'silly', emoji: '🤪' },
  { key: 'love', emoji: '😍' },
  { key: 'calm', emoji: '😌' },
];

const BOUNCE_ANIMS = ['emoji-bounce', 'emoji-spin', 'emoji-wiggle', 'emoji-pop'];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const buildRound = () => {
  const target = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
  const options = [target];
  while (options.length < 4) {
    const candidate = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    if (!options.some((o) => o.key === candidate.key)) options.push(candidate);
  }
  return { target, options: shuffle(options), anim: BOUNCE_ANIMS[Math.floor(Math.random() * BOUNCE_ANIMS.length)] };
};

const EmotionGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();

  const [gameState, setGameState] = useState('intro');
  const [rounds, setRounds] = useState([]);
  const [ri, setRi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');

  const emotionLabel = (key) => t[`emotion_${key}`] || key;

  const startGame = () => {
    setRounds(Array.from({ length: TOTAL }, buildRound));
    setRi(0);
    setScore(0);
    setStreak(0);
    setAnswered(false);
    setSelected(null);
    setStatus('');
    setGameState('playing');
  };

  const handlePick = (option) => {
    if (answered) return;
    setAnswered(true);
    setSelected(option.key);

    const round = rounds[ri];
    if (option.key === round.target.key) {
      setScore((s) => s + POINTS);
      setStreak((s) => s + 1);
      setStatus('correct');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'] });
    } else {
      setStreak(0);
      setStatus('wrong');
    }
  };

  const maxPts = TOTAL * POINTS;

  const nextRound = () => {
    if (ri + 1 >= TOTAL) {
      setGameState('gameover');
      if (score / maxPts >= 0.5) {
        confetti({ particleCount: 250, spread: 120, origin: { y: 0.4 }, zIndex: 1000 });
      }
      onFinish && onFinish({ score, maxScore: maxPts, level: 'standard' });
    } else {
      setRi((i) => i + 1);
      setAnswered(false);
      setSelected(null);
      setStatus('');
    }
  };

  const round = rounds[ri];
  const pct = score / maxPts;

  return (
    <div className="game-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <button className="game-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t.backToGames}
      </button>

      {gameState === 'intro' && (
        <div className="game-intro">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥳</div>
          <h1>{t.emotionGameTitle}</h1>
          <p>{t.emotionGameDesc}</p>
          <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.2rem', borderRadius: '999px', marginTop: '1rem' }} onClick={startGame}>
            {t.startGame}
          </button>
        </div>
      )}

      {gameState === 'playing' && round && (
        <div>
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">{t.score}</div>
              <div className="stat-val teal">{score}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{t.question}</div>
              <div className="stat-val" style={{ direction: 'ltr' }}>{ri + 1} / {TOTAL}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{t.streak}</div>
              <div className="stat-val">{streak}</div>
            </div>
          </div>

          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${Math.round(((ri + 1) / TOTAL) * 100)}%` }}></div>
          </div>

          <p style={{ textAlign: 'center', fontWeight: 700, marginBottom: '0.75rem', color: '#64748B' }}>{t.howDoesThisFeel}</p>

          <div className={`img-card ${status}`} style={{ fontSize: '5rem' }}>
            <span className={round.anim}>{round.target.emoji}</span>
          </div>

          <div className={`feedback ${status === '' ? 'empty' : status}`}>
            {status === 'correct' ? (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1) : ''}
            {status === 'wrong' ? `${t.wrongFeedback} ${emotionLabel(round.target.key)}` : ''}
          </div>

          <div className="options">
            {round.options.map((opt) => {
              let btnClass = 'opt-btn';
              if (answered) {
                if (opt.key === round.target.key) btnClass += ' correct';
                else if (opt.key === selected) btnClass += ' wrong';
              }
              return (
                <button key={opt.key} className={btnClass} disabled={answered} onClick={() => handlePick(opt)}>
                  {emotionLabel(opt.key)}
                </button>
              );
            })}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} disabled={!answered} onClick={nextRound}>
            {t.nextBtn} {language === 'ar' ? '←' : '→'}
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="game-over">
          <img src={mascotExcited} alt="mascot" style={{ width: '150px', objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(56,189,248,0.35))', animation: 'mascotFloat 4s ease-in-out infinite', marginBottom: '0.5rem' }} />
          <h2>{pct >= 0.8 ? t.gameOverTitleExcellent : pct >= 0.5 ? t.gameOverTitleGood : t.gameOverTitleKeep}</h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '30px', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {language === 'ar' ? `لقد سجلت ${score} من أصل ${maxPts}` : `You scored ${score} out of ${maxPts}`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '999px' }} onClick={startGame}>
              {t.playAgain}
            </button>
            <button className="btn btn-secondary" style={{ padding: '14px 40px', borderRadius: '999px' }} onClick={onBack}>
              {t.backToGames}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionGame;
