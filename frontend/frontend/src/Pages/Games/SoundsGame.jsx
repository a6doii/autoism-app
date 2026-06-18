import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const TOTAL = 10;

const ANIMALS = [
  { emoji: '🐕', sound: 'Woof! Woof!', en: 'Dog',    ar: 'كلب',    soundAr: 'واو واو!' },
  { emoji: '🐈', sound: 'Meow!',       en: 'Cat',    ar: 'قطة',    soundAr: 'مياو!' },
  { emoji: '🐄', sound: 'Mooo!',       en: 'Cow',    ar: 'بقرة',   soundAr: 'مووو!' },
  { emoji: '🐸', sound: 'Ribbit!',     en: 'Frog',   ar: 'ضفدع',   soundAr: 'كراك!' },
  { emoji: '🐔', sound: 'Cluck cluck!',en: 'Chicken',ar: 'دجاجة',  soundAr: 'قاق قاق!' },
  { emoji: '🦆', sound: 'Quack quack!',en: 'Duck',   ar: 'بطة',    soundAr: 'كواك!' },
  { emoji: '🐷', sound: 'Oink oink!',  en: 'Pig',    ar: 'خنزير',  soundAr: 'أوينك!' },
  { emoji: '🐑', sound: 'Baaaa!',      en: 'Sheep',  ar: 'خروف',   soundAr: 'مباع!' },
  { emoji: '🦁', sound: 'Roarrr!',     en: 'Lion',   ar: 'أسد',    soundAr: 'رووار!' },
  { emoji: '🐝', sound: 'Bzzzzz!',     en: 'Bee',    ar: 'نحلة',   soundAr: 'بزززز!' },
  { emoji: '🦉', sound: 'Hoooo!',      en: 'Owl',    ar: 'بومة',   soundAr: 'هوووو!' },
  { emoji: '🐸', sound: 'Croak!',      en: 'Frog',   ar: 'ضفدع',   soundAr: 'كراك!' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const buildRound = (pool) => {
  const target = pool[Math.floor(Math.random() * pool.length)];
  const distractors = shuffle(pool.filter(a => a.en !== target.en)).slice(0, 3);
  return { target, opts: shuffle([target, ...distractors]) };
};

const SoundsGame = ({ onFinish, onBack }) => {
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
    const pool = shuffle([...new Map(ANIMALS.map(a => [a.en, a])).values()]);
    const generated = Array.from({ length: TOTAL }, () => buildRound(pool));
    setRounds(generated);
    setRi(0); setScore(0); setStreak(0);
    setAnswered(false); setSelected(null); setStatus('');
    setState('playing');
  };

  const pick = (animal) => {
    if (answered) return;
    setAnswered(true); setSelected(animal.en);
    if (animal.en === rounds[ri].target.en) {
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔊</div>
          <h1>{ar ? 'صوت من؟' : 'Whose Sound?'}</h1>
          <p>{ar ? 'اقرأ الصوت واختر الحيوان الصحيح.' : 'Read the sound and pick the matching animal.'}</p>
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
            {ar ? 'أي حيوان يصدر هذا الصوت؟' : 'Which animal makes this sound?'}
          </p>

          <div className={`img-card ${status}`} style={{ fontSize: '2.5rem', padding: '1.5rem', letterSpacing: '1px' }}>
            🔊 {ar ? round.target.soundAr : round.target.sound}
          </div>

          <div className={`feedback ${status || 'empty'}`}>
            {status === 'correct' && (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1)}
            {status === 'wrong' && `${t.wrongFeedback} ${round.target.emoji} ${ar ? round.target.ar : round.target.en}`}
          </div>

          <div className="options">
            {round.opts.map((animal) => {
              let cls = 'opt-btn';
              if (answered) {
                if (animal.en === round.target.en) cls += ' correct';
                else if (animal.en === selected) cls += ' wrong';
              }
              return (
                <button key={animal.en} className={cls} style={{ fontSize: '2rem', flexDirection: 'column', gap: 4 }}
                  disabled={answered} onClick={() => pick(animal)}>
                  <span>{animal.emoji}</span>
                  <span style={{ fontSize: '0.85rem' }}>{ar ? animal.ar : animal.en}</span>
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

export default SoundsGame;
