import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const TOTAL = 10;

// Each pattern: sequence of emojis with one '?' that the child must fill
const PATTERNS = [
  { seq: ['🔴','🔵','🔴','🔵','❓'], answer: '🔴', opts: ['🔴','🟡','🟢','⚫'] },
  { seq: ['⭐','⭐','🌙','⭐','⭐','❓'], answer: '🌙', opts: ['⭐','🌙','☀️','🌟'] },
  { seq: ['🐱','🐶','🐱','🐶','❓'], answer: '🐱', opts: ['🐱','🐸','🐭','🐰'] },
  { seq: ['🔺','🔷','🔺','🔷','🔺','❓'], answer: '🔷', opts: ['🔺','🔷','🟣','🟠'] },
  { seq: ['🍎','🍌','🍎','🍌','❓'], answer: '🍎', opts: ['🍌','🍎','🍇','🍊'] },
  { seq: ['1️⃣','2️⃣','3️⃣','1️⃣','2️⃣','❓'], answer: '3️⃣', opts: ['1️⃣','2️⃣','3️⃣','4️⃣'] },
  { seq: ['🟩','🟩','🟥','🟩','🟩','❓'], answer: '🟥', opts: ['🟩','🟥','🟦','🟨'] },
  { seq: ['🌸','🌺','🌸','🌺','🌸','❓'], answer: '🌺', opts: ['🌸','🌺','🌻','🌼'] },
  { seq: ['🐘','🐘','🐭','🐘','🐘','❓'], answer: '🐭', opts: ['🐘','🐭','🐻','🦁'] },
  { seq: ['🔔','🎵','🔔','🎵','❓'], answer: '🔔', opts: ['🎵','🔔','🥁','🎸'] },
  { seq: ['🟦','🟧','🟦','🟧','🟦','❓'], answer: '🟧', opts: ['🟦','🟧','🟩','🟪'] },
  { seq: ['🌝','🌚','🌝','🌚','❓'], answer: '🌝', opts: ['🌝','🌚','🌛','🌞'] },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const PatternGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();
  const ar = language === 'ar';

  const [state, setState] = useState('intro');
  const [rounds, setRounds] = useState([]);
  const [ri, setRi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');

  const start = () => {
    setRounds(shuffle([...PATTERNS]).slice(0, TOTAL).map(p => ({ ...p, opts: shuffle(p.opts) })));
    setRi(0); setScore(0); setStreak(0);
    setAnswered(false); setSelected(null); setStatus('');
    setState('playing');
  };

  const pick = (opt) => {
    if (answered) return;
    setAnswered(true); setSelected(opt);
    if (opt === rounds[ri].answer) {
      setScore(s => s + 1); setStreak(s => s + 1); setStatus('correct');
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } else { setStreak(0); setStatus('wrong'); }
  };

  const next = () => {
    if (ri + 1 >= TOTAL) {
      setState('gameover');
      if (score / TOTAL >= 0.5) confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 });
      onFinish && onFinish({ score, maxScore: TOTAL, level: 'standard' });
    } else {
      setRi(i => i + 1); setAnswered(false); setSelected(null); setStatus('');
    }
  };

  const round = rounds[ri];
  const pct = score / TOTAL;

  return (
    <div className="game-shell" dir={ar ? 'rtl' : 'ltr'}>
      <button className="game-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t.backToGames}
      </button>

      {state === 'intro' && (
        <div className="game-intro">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔢</div>
          <h1>{ar ? 'إكمال النمط' : 'Pattern Completion'}</h1>
          <p>{ar ? 'انظر إلى التسلسل وأكمل الجزء الناقص.' : 'Look at the sequence and complete the missing piece.'}</p>
          <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.2rem', borderRadius: '999px', marginTop: '1rem' }} onClick={start}>
            {t.startGame}
          </button>
        </div>
      )}

      {state === 'playing' && round && (
        <div>
          <div className="stats-row">
            <div className="stat-box"><div className="stat-label">{t.score}</div><div className="stat-val teal">{score}</div></div>
            <div className="stat-box"><div className="stat-label">{t.question}</div><div className="stat-val" style={{ direction: 'ltr' }}>{ri + 1} / {TOTAL}</div></div>
            <div className="stat-box"><div className="stat-label">{t.streak}</div><div className="stat-val">{streak}</div></div>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{ width: `${((ri + 1) / TOTAL) * 100}%` }}></div></div>

          <p style={{ textAlign: 'center', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem' }}>
            {ar ? 'ما الذي يكمل النمط؟' : 'What completes the pattern?'}
          </p>

          {/* Pattern sequence display */}
          <div className={`img-card ${status}`} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '2.2rem' }}>
              {round.seq.map((item, i) => (
                <span key={i} style={{
                  background: item === '❓' ? '#e2e8f0' : 'transparent',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  minWidth: '44px',
                  textAlign: 'center',
                  border: item === '❓' ? '2px dashed #94a3b8' : 'none',
                }}>
                  {item === '❓' ? (answered ? round.answer : '❓') : item}
                </span>
              ))}
            </div>
          </div>

          <div className={`feedback ${status || 'empty'}`}>
            {status === 'correct' && (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1)}
            {status === 'wrong' && `${t.wrongFeedback} ${round.answer}`}
          </div>

          <div className="options">
            {round.opts.map((opt) => {
              let cls = 'opt-btn';
              if (answered) {
                if (opt === round.answer) cls += ' correct';
                else if (opt === selected) cls += ' wrong';
              }
              return (
                <button key={opt} className={cls} style={{ fontSize: '2rem', padding: '12px 20px' }}
                  disabled={answered} onClick={() => pick(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '16px' }} disabled={!answered} onClick={next}>
            {t.nextBtn} {ar ? '←' : '→'}
          </button>
        </div>
      )}

      {state === 'gameover' && (
        <div className="game-over">
          <MascotSparkle src={mascotExcited} alt="mascot" width="188px" wrapperStyle={{ marginBottom: '0.5rem' }} />
          <h2>{pct >= 0.8 ? t.gameOverTitleExcellent : pct >= 0.5 ? t.gameOverTitleGood : t.gameOverTitleKeep}</h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '30px' }}>
            {ar ? `لقد سجلت ${score} من أصل ${TOTAL}` : `You scored ${score} out of ${TOTAL}`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '999px' }} onClick={start}>{t.playAgain}</button>
            <button className="btn btn-secondary" style={{ padding: '14px 40px', borderRadius: '999px' }} onClick={onBack}>{t.backToGames}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternGame;
