import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/sounds';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const ROUNDS = 3;
const BUBBLES_PER_ROUND = 12;
const BUBBLE_SHOW_MS = 1200;

const ROUND_CONFIGS = [
  { target: '🍎', pool: ['🍎','🍌','🍇','🍊','🍎','🍌','🍎','🍇','🍊','🍎','🍌','🍇'], en_t: 'apple', ar_t: 'تفاحة' },
  { target: '⭐', pool: ['⭐','🌙','☀️','⭐','🌟','⭐','🌙','⭐','☀️','⭐','🌟','🌙'], en_t: 'star', ar_t: 'نجمة' },
  { target: '🐶', pool: ['🐶','🐱','🐭','🐶','🐹','🐶','🐱','🐶','🐭','🐶','🐹','🐱'], en_t: 'dog', ar_t: 'كلب' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const BubblesGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();
  const ar = language === 'ar';

  const [state, setState] = useState('intro');
  const [round, setRound] = useState(0);
  const [bubbles, setBubbles] = useState([]);      // { id, emoji, x, y, visible, clicked }
  const [currentIdx, setCurrentIdx] = useState(0); // which bubble is currently showing
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const timerRef = useRef(null);

  const config = ROUND_CONFIGS[round] || ROUND_CONFIGS[0];

  const launchRound = useCallback((roundIdx) => {
    const cfg = ROUND_CONFIGS[roundIdx];
    const pool = shuffle(cfg.pool).map((emoji, i) => ({
      id: i, emoji,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      visible: false, clicked: false,
    }));
    setBubbles(pool);
    setCurrentIdx(0);
    setHits(0); setMisses(0);
  }, []);

  useEffect(() => {
    if (state !== 'playing') return;
    if (currentIdx >= BUBBLES_PER_ROUND) return;

    // Show current bubble
    setBubbles(prev => prev.map(b => b.id === currentIdx ? { ...b, visible: true } : b));

    timerRef.current = setTimeout(() => {
      // Hide it and auto-miss if not clicked
      setBubbles(prev => {
        const updated = prev.map(b => b.id === currentIdx
          ? { ...b, visible: false }
          : b
        );
        // Count as miss if it was a target and not clicked
        const bubble = prev.find(b => b.id === currentIdx);
        if (bubble && bubble.emoji === config.target && !bubble.clicked) {
          setMisses(m => m + 1);
        }
        return updated;
      });
      setCurrentIdx(i => i + 1);
    }, BUBBLE_SHOW_MS);

    return () => clearTimeout(timerRef.current);
  }, [state, currentIdx, config]);

  useEffect(() => {
    if (state !== 'playing') return;
    if (currentIdx < BUBBLES_PER_ROUND) return;

    // Round over
    const roundHits = hits;
    const roundScore = Math.max(0, roundHits);
    setTotalScore(s => s + roundScore);

    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setState('gameover');
        const finalScore = totalScore + roundScore;
        const maxScore = ROUND_CONFIGS.reduce((acc, c) => acc + c.pool.filter(e => e === c.target).length, 0);
        const pctB = finalScore / maxScore;
        if (pctB >= 0.8) { sounds.win(); confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
        else if (pctB >= 0.5) { sounds.pass(); confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
        else { sounds.lose(); }
        onFinish && onFinish({ score: finalScore, maxScore, level: 'standard' });
      } else {
        setRound(r => {
          const next = r + 1;
          launchRound(next);
          return next;
        });
      }
    }, 800);
  }, [currentIdx, state]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setRound(0); setTotalScore(0);
    launchRound(0);
    setState('playing');
  };

  const popBubble = (id) => {
    const bubble = bubbles.find(b => b.id === id);
    if (!bubble || !bubble.visible || bubble.clicked) return;

    setBubbles(prev => prev.map(b => b.id === id ? { ...b, clicked: true, visible: false } : b));
    clearTimeout(timerRef.current);

    if (bubble.emoji === config.target) {
      setHits(h => h + 1);
      sounds.correct();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 }, colors: ['#a855f7','#3b82f6','#10b981'] });
    } else {
      setMisses(m => m + 1);
      sounds.wrong();
    }
    setCurrentIdx(i => i + 1);
  };

  const targets = config.pool.filter(e => e === config.target).length;
  const maxScore = ROUND_CONFIGS.reduce((acc, c) => acc + c.pool.filter(e => e === c.target).length, 0);
  const pct = totalScore / maxScore;

  return (
    <div className="game-shell" dir={ar ? 'rtl' : 'ltr'}>
      <button className="game-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t.backToGames}
      </button>

      {state === 'intro' && (
        <div className="game-intro">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
          <h1>{ar ? 'فقاعات التركيز' : 'Focus Bubbles'}</h1>
          <p>{ar ? 'انقر فقط على الفقاعات التي تحتوي على الهدف المطلوب.' : 'Click only the bubbles that match the target item.'}</p>
          <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.2rem', borderRadius: '999px', marginTop: '1rem' }} onClick={start}>
            {t.startGame}
          </button>
        </div>
      )}

      {state === 'playing' && (
        <div>
          <div className="stats-row">
            <div className="stat-box"><div className="stat-label">{ar ? 'إصابات' : 'Hits'}</div><div className="stat-val teal">{hits}</div></div>
            <div className="stat-box"><div className="stat-label">{ar ? 'الجولة' : 'Round'}</div><div className="stat-val" style={{ direction: 'ltr' }}>{round + 1} / {ROUNDS}</div></div>
            <div className="stat-box"><div className="stat-label">{ar ? 'أخطاء' : 'Misses'}</div><div className="stat-val" style={{ color: '#ef4444' }}>{misses}</div></div>
          </div>

          <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#64748B' }}>
              {ar ? `انقر على جميع: ` : `Tap all the: `}
            </span>
            <span style={{ fontSize: '2rem' }}>{config.target}</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#6c63ff', marginLeft: 6 }}>
              ({ar ? config.ar_t : config.en_t})
            </span>
          </div>

          <div style={{
            position: 'relative', width: '100%', height: '340px',
            background: 'linear-gradient(135deg,#f0f4ff,#fdf0ff)',
            borderRadius: '16px', overflow: 'hidden', border: '2px solid #e2e8f0',
          }}>
            {bubbles.map(b => b.visible && (
              <button
                key={b.id}
                onClick={() => popBubble(b.id)}
                style={{
                  position: 'absolute',
                  left: `${b.x}%`, top: `${b.y}%`,
                  transform: 'translate(-50%,-50%)',
                  fontSize: '2.5rem', lineHeight: 1,
                  background: 'white', border: '2px solid #e2e8f0',
                  borderRadius: '50%', width: 64, height: 64,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  animation: 'bubble-pop 0.15s ease',
                  transition: 'transform 0.1s',
                }}
              >
                {b.emoji}
              </button>
            ))}
            {currentIdx >= BUBBLES_PER_ROUND && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 800, color: '#6c63ff' }}>
                {ar ? `انتهت الجولة! أصبت ${hits} من ${targets}` : `Round done! ${hits} / ${targets} found`}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            {ar ? `الفقاعة ${Math.min(currentIdx + 1, BUBBLES_PER_ROUND)} من ${BUBBLES_PER_ROUND}` : `Bubble ${Math.min(currentIdx + 1, BUBBLES_PER_ROUND)} of ${BUBBLES_PER_ROUND}`}
          </div>
        </div>
      )}

      {state === 'gameover' && (
        <div className="game-over">
          <MascotSparkle src={mascotExcited} alt="mascot" width="188px" wrapperStyle={{ marginBottom: '0.5rem' }} />
          <h2>{pct >= 0.8 ? t.gameOverTitleExcellent : pct >= 0.5 ? t.gameOverTitleGood : t.gameOverTitleKeep}</h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '30px' }}>
            {ar ? `لقد أصبت ${totalScore} من أصل ${maxScore}` : `You hit ${totalScore} out of ${maxScore} targets`}
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

export default BubblesGame;
