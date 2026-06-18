import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/sounds';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const TOTAL = 5;

const ROUTINES = [
  {
    en: 'Morning Routine', ar: 'الروتين الصباحي',
    steps: [
      { emoji: '⏰', en: 'Wake up', ar: 'الاستيقاظ' },
      { emoji: '🪥', en: 'Brush teeth', ar: 'تنظيف الأسنان' },
      { emoji: '👕', en: 'Get dressed', ar: 'ارتداء الملابس' },
      { emoji: '🥣', en: 'Eat breakfast', ar: 'تناول الإفطار' },
    ],
  },
  {
    en: 'Bedtime Routine', ar: 'روتين وقت النوم',
    steps: [
      { emoji: '🛁', en: 'Take a bath', ar: 'الاستحمام' },
      { emoji: '👚', en: 'Put on pajamas', ar: 'ارتداء البيجامة' },
      { emoji: '🦷', en: 'Brush teeth', ar: 'تنظيف الأسنان' },
      { emoji: '😴', en: 'Go to sleep', ar: 'الذهاب للنوم' },
    ],
  },
  {
    en: 'Washing Hands', ar: 'غسل اليدين',
    steps: [
      { emoji: '🚿', en: 'Turn on the water', ar: 'تشغيل الماء' },
      { emoji: '🧼', en: 'Use soap', ar: 'استخدام الصابون' },
      { emoji: '👐', en: 'Rub hands together', ar: 'فرك اليدين معاً' },
      { emoji: '💧', en: 'Rinse with water', ar: 'الشطف بالماء' },
    ],
  },
  {
    en: 'Getting Ready for School', ar: 'الاستعداد للمدرسة',
    steps: [
      { emoji: '⏰', en: 'Wake up early', ar: 'الاستيقاظ مبكراً' },
      { emoji: '🍳', en: 'Eat breakfast', ar: 'تناول الإفطار' },
      { emoji: '🎒', en: 'Pack your backpack', ar: 'تجهيز الحقيبة' },
      { emoji: '🚌', en: 'Go to school', ar: 'الذهاب للمدرسة' },
    ],
  },
  {
    en: 'Cleaning Your Room', ar: 'ترتيب الغرفة',
    steps: [
      { emoji: '🧸', en: 'Pick up toys', ar: 'جمع الألعاب' },
      { emoji: '🛏️', en: 'Make the bed', ar: 'ترتيب السرير' },
      { emoji: '🧹', en: 'Sweep the floor', ar: 'كنس الأرضية' },
      { emoji: '🗑️', en: 'Empty the bin', ar: 'إفراغ سلة المهملات' },
    ],
  },
  {
    en: 'Making a Snack', ar: 'تحضير وجبة خفيفة',
    steps: [
      { emoji: '🙌', en: 'Wash your hands', ar: 'اغسل يديك' },
      { emoji: '🍞', en: 'Get the bread', ar: 'أخذ الخبز' },
      { emoji: '🧈', en: 'Spread the butter', ar: 'وضع الزبدة' },
      { emoji: '😋', en: 'Enjoy your snack', ar: 'تناول وجبتك' },
    ],
  },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const RoutineGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();
  const ar = language === 'ar';

  const [state, setState] = useState('intro');
  const [rounds, setRounds] = useState([]);
  const [ri, setRi] = useState(0);
  const [score, setScore] = useState(0);
  const [order, setOrder] = useState([]);   // current shuffled display
  const [clicks, setClicks] = useState([]); // indices clicked so far
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState('');

  const start = () => {
    const pool = shuffle([...ROUTINES]).slice(0, TOTAL);
    setRounds(pool);
    setRi(0); setScore(0); setDone(false); setStatus(''); setClicks([]);
    setOrder(shuffle([0, 1, 2, 3]));
    setState('playing');
  };

  const initRound = (idx, pool) => {
    setOrder(shuffle([0, 1, 2, 3]));
    setClicks([]); setDone(false); setStatus('');
  };

  const clickStep = (displayIdx) => {
    if (done) return;
    const stepIdx = order[displayIdx]; // actual step index
    const expectedStep = clicks.length; // the next correct step
    const newClicks = [...clicks, displayIdx];
    setClicks(newClicks);

    if (stepIdx === expectedStep) {
      // Correct step
      if (newClicks.length === 4) {
        // All steps in correct order!
        setDone(true);
        setStatus('correct');
        setScore(s => s + 1);
        sounds.correct();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      // Wrong order
      setDone(true);
      setStatus('wrong');
      sounds.wrong();
    }
  };

  const next = () => {
    if (ri + 1 >= TOTAL) {
      setState('gameover');
      const pctR = score / TOTAL;
      if (pctR >= 0.8) { sounds.win(); confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
      else if (pctR >= 0.5) { sounds.pass(); confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
      else { sounds.lose(); }
      onFinish && onFinish({ score, maxScore: TOTAL, level: 'standard' });
    } else {
      const nextRi = ri + 1;
      setRi(nextRi);
      initRound(nextRi, rounds);
    }
  };

  const round = rounds[ri];
  const pct = score / TOTAL;

  const getStepStatus = (displayIdx) => {
    const clickPos = clicks.indexOf(displayIdx);
    if (clickPos === -1) return 'idle';
    if (!done) return 'selected';
    // Game ended
    const stepIdx = order[displayIdx];
    if (stepIdx === clickPos && status === 'correct') return 'correct-step';
    if (stepIdx === clickPos) return 'correct-step';
    if (clicks[clicks.length - 1] === displayIdx && status === 'wrong') return 'wrong-step';
    return 'selected';
  };

  return (
    <div className="game-shell" dir={ar ? 'rtl' : 'ltr'}>
      <button className="game-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t.backToGames}
      </button>

      {state === 'intro' && (
        <div className="game-intro">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h1>{ar ? 'ترتيب الروتين' : 'Daily Routine'}</h1>
          <p>{ar ? 'انقر على الخطوات بالترتيب الصحيح من الأول إلى الأخير.' : 'Tap the steps in the correct order, from first to last.'}</p>
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
            <div className="stat-box">
              <div className="stat-label">{ar ? 'خطوات' : 'Steps'}</div>
              <div className="stat-val">{clicks.length} / 4</div>
            </div>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{ width: `${((ri + 1) / TOTAL) * 100}%` }}></div></div>

          <p style={{ textAlign: 'center', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>
            {ar ? 'رتّب الخطوات بالترتيب الصحيح:' : 'Put the steps in the correct order:'}
          </p>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#6c63ff', marginBottom: '1rem' }}>
            {ar ? round.ar : round.en}
          </p>

          <div className={`img-card ${status}`} style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {order.map((stepIdx, displayIdx) => {
                const step = round.steps[stepIdx];
                const clickPos = clicks.indexOf(displayIdx);
                const isClicked = clickPos !== -1;
                const stepSt = getStepStatus(displayIdx);
                return (
                  <button
                    key={displayIdx}
                    onClick={() => clickStep(displayIdx)}
                    disabled={done || isClicked}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '16px 10px', borderRadius: '12px', fontSize: '2rem',
                      border: `2px solid ${stepSt === 'correct-step' ? '#10b981' : stepSt === 'wrong-step' ? '#ef4444' : isClicked ? '#6c63ff' : '#e2e8f0'}`,
                      background: stepSt === 'correct-step' ? '#ecfdf5' : stepSt === 'wrong-step' ? '#fef2f2' : isClicked ? '#ede9fe' : '#f8fafc',
                      cursor: done || isClicked ? 'default' : 'pointer',
                      position: 'relative',
                    }}
                  >
                    {isClicked && (
                      <span style={{
                        position: 'absolute', top: 6, right: 8,
                        background: stepSt === 'correct-step' ? '#10b981' : stepSt === 'wrong-step' ? '#ef4444' : '#6c63ff',
                        color: 'white', borderRadius: '50%', width: 22, height: 22,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 800,
                      }}>
                        {stepSt === 'correct-step' ? <FontAwesomeIcon icon={faCheck} /> : clickPos + 1}
                      </span>
                    )}
                    <span>{step.emoji}</span>
                    <span style={{ fontSize: '0.8rem', marginTop: 6, fontWeight: 600, color: '#334155', textAlign: 'center' }}>
                      {ar ? step.ar : step.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {done && (
            <div className={`feedback ${status || 'empty'}`}>
              {status === 'correct' ? t.correctFeedback1 : (ar ? '❌ الترتيب الصحيح هو:' : '❌ The correct order is:')}
              {status === 'wrong' && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center', fontSize: '1.4rem' }}>
                  {round.steps.map((s, i) => <span key={i}>{s.emoji}</span>)}
                </div>
              )}
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '0.75rem' }} disabled={!done} onClick={next}>
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

export default RoutineGame;
