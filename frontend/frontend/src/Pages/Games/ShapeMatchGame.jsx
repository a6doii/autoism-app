import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';
import { sounds } from '../../lib/sounds';

const TOTAL = 8;

const COLOR_HEX = {
  red: '#ef4444', blue: '#3b82f6', green: '#10b981', yellow: '#f59e0b',
  purple: '#a855f7', orange: '#f97316', pink: '#ec4899', teal: '#14b8a6',
};

const SHAPE_CLIP = {
  circle: { borderRadius: '50%' },
  square: { borderRadius: '10px' },
  triangle: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: 0 },
  star: { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', borderRadius: 0 },
  diamond: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: 0 },
  hexagon: { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', borderRadius: 0 },
};

const LEVELS = {
  easy: { shapes: ['circle', 'square', 'triangle'], colors: ['red', 'blue', 'green'], optionCount: 3, points: 1 },
  medium: { shapes: ['circle', 'square', 'triangle', 'star'], colors: ['red', 'blue', 'green', 'yellow'], optionCount: 4, points: 2 },
  hard: { shapes: ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'], colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'], optionCount: 5, points: 3 },
};

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
const sameCombo = (a, b) => a.shape === b.shape && a.color === b.color;

const ShapeIcon = ({ shape, color, size = 80 }) => (
  <div style={{ width: size, height: size, background: COLOR_HEX[color], display: 'inline-block', ...SHAPE_CLIP[shape] }} />
);

const buildRound = (level) => {
  const { shapes, colors, optionCount } = LEVELS[level];
  const target = { shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] };
  const options = [target];
  while (options.length < optionCount) {
    const candidate = { shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] };
    if (!options.some((o) => sameCombo(o, candidate))) options.push(candidate);
  }
  return { target, options: shuffle(options) };
};

const ShapeMatchGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();

  const [gameState, setGameState] = useState('intro');
  const [level, setLevel] = useState('easy');
  const [rounds, setRounds] = useState([]);
  const [ri, setRi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');

  const startGame = () => {
    setRounds(Array.from({ length: TOTAL }, () => buildRound(level)));
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
    setSelected(option);

    const round = rounds[ri];
    const pts = LEVELS[level].points;

    if (sameCombo(option, round.target)) {
      setScore((s) => s + pts);
      setStreak((s) => s + 1);
      setStatus('correct');
      sounds.correct();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'] });
    } else {
      setStreak(0);
      setStatus('wrong');
      sounds.wrong();
    }
  };

  const maxPts = TOTAL * LEVELS[level].points;

  const nextRound = () => {
    if (ri + 1 >= TOTAL) {
      setGameState('gameover');
      const pctS = score / maxPts;
      if (pctS >= 0.8) { sounds.win(); confetti({ particleCount: 250, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
      else if (pctS >= 0.5) { sounds.pass(); confetti({ particleCount: 250, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
      else { sounds.lose(); }
      onFinish && onFinish({ score, maxScore: maxPts, level });
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔷</div>
          <h1>{t.shapeGameTitle}</h1>
          <p>{t.shapeGameDesc}</p>

          <div style={{ marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748B', fontWeight: 'bold' }}>{t.difficulty}</label>
            <div className="diff-strip">
              <button className={`diff-btn ${level === 'easy' ? 'active' : ''}`} onClick={() => setLevel('easy')}>{t.easy}</button>
              <button className={`diff-btn ${level === 'medium' ? 'active' : ''}`} onClick={() => setLevel('medium')}>{t.medium}</button>
              <button className={`diff-btn ${level === 'hard' ? 'active' : ''}`} onClick={() => setLevel('hard')}>{t.hard}</button>
            </div>
          </div>

          <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.2rem', borderRadius: '999px' }} onClick={startGame}>
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

          <p style={{ textAlign: 'center', fontWeight: 700, marginBottom: '0.75rem', color: '#64748B' }}>{t.findThisShape}</p>

          <div className={`img-card ${status}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className={status === 'correct' ? 'animate-success' : ''}>
              <ShapeIcon shape={round.target.shape} color={round.target.color} size={90} />
            </span>
          </div>

          <div className={`feedback ${status === '' ? 'empty' : status}`}>
            {status === 'correct' ? (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1) : ''}
            {status === 'wrong' ? t.wrongFeedback : ''}
          </div>

          <div className="shape-options">
            {round.options.map((opt, idx) => {
              let btnClass = 'shape-opt-btn';
              if (answered) {
                if (sameCombo(opt, round.target)) btnClass += ' correct';
                else if (opt === selected) btnClass += ' wrong';
              }
              return (
                <button key={idx} className={btnClass} disabled={answered} onClick={() => handlePick(opt)}>
                  <ShapeIcon shape={opt.shape} color={opt.color} size={56} />
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
          <MascotSparkle src={mascotExcited} alt="mascot" width="188px" wrapperStyle={{ marginBottom: '0.5rem' }} />
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

export default ShapeMatchGame;
