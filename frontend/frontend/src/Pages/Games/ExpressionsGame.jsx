import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const TOTAL = 8;

const DATA = [
  { emoji: '🎁', en: 'You just received a gift!',               ar: 'لقد تلقيت هدية للتو!',                   answer: 'happy',   en_a: 'Happy',     ar_a: 'سعيد',     opts: ['happy','sad','angry','scared'] },
  { emoji: '😢', en: 'Your friend took your toy away.',          ar: 'أخذ صديقك لعبتك.',                       answer: 'sad',     en_a: 'Sad',       ar_a: 'حزين',     opts: ['happy','sad','angry','surprised'] },
  { emoji: '🕷️', en: 'You saw a big spider!',                    ar: 'رأيت عنكبوتاً كبيراً!',                   answer: 'scared',  en_a: 'Scared',    ar_a: 'خائف',     opts: ['happy','surprised','scared','calm'] },
  { emoji: '🎉', en: 'Your birthday party is today!',            ar: 'حفلة عيد ميلادك اليوم!',                  answer: 'excited', en_a: 'Excited',   ar_a: 'متحمس',    opts: ['excited','sad','angry','scared'] },
  { emoji: '😤', en: 'Someone cut in front of you in line.',     ar: 'تجاوز شخص ما عليك في الطابور.',           answer: 'angry',   en_a: 'Angry',     ar_a: 'غاضب',     opts: ['happy','sad','angry','surprised'] },
  { emoji: '🎈', en: 'You heard a loud bang behind you!',        ar: 'سمعت صوتاً مفاجئاً خلفك!',               answer: 'surprised', en_a: 'Surprised', ar_a: 'متفاجئ',  opts: ['happy','surprised','scared','excited'] },
  { emoji: '🌙', en: 'It is night and very quiet.',              ar: 'حل الليل وكل شيء هادئ.',                  answer: 'calm',    en_a: 'Calm',      ar_a: 'هادئ',     opts: ['happy','calm','sad','sleepy'] },
  { emoji: '😴', en: 'It is very late and past your bedtime.',   ar: 'الوقت متأخر جداً وحان وقت نومك.',         answer: 'sleepy',  en_a: 'Sleepy',    ar_a: 'نعسان',    opts: ['happy','calm','sad','sleepy'] },
  { emoji: '🏆', en: 'You won first place!',                     ar: 'حصلت على المركز الأول!',                  answer: 'excited', en_a: 'Excited',   ar_a: 'متحمس',    opts: ['excited','sad','angry','calm'] },
  { emoji: '🤝', en: 'You and your friend made up after a fight.',ar: 'أنت وصديقك تصالحتما بعد شجار.',          answer: 'happy',   en_a: 'Happy',     ar_a: 'سعيد',     opts: ['happy','surprised','angry','scared'] },
];

const ALL_OPTS = [
  { key: 'happy',     en: 'Happy',     ar: 'سعيد' },
  { key: 'sad',       en: 'Sad',       ar: 'حزين' },
  { key: 'angry',     en: 'Angry',     ar: 'غاضب' },
  { key: 'scared',    en: 'Scared',    ar: 'خائف' },
  { key: 'excited',   en: 'Excited',   ar: 'متحمس' },
  { key: 'surprised', en: 'Surprised', ar: 'متفاجئ' },
  { key: 'calm',      en: 'Calm',      ar: 'هادئ' },
  { key: 'sleepy',    en: 'Sleepy',    ar: 'نعسان' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const ExpressionsGame = ({ onFinish, onBack }) => {
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
    const pool = shuffle([...DATA]).slice(0, TOTAL).map(d => ({
      ...d,
      opts: shuffle(d.opts.map(k => ALL_OPTS.find(o => o.key === k))),
    }));
    setRounds(pool);
    setRi(0); setScore(0); setStreak(0);
    setAnswered(false); setSelected(null); setStatus('');
    setState('playing');
  };

  const pick = (key) => {
    if (answered) return;
    setAnswered(true); setSelected(key);
    const round = rounds[ri];
    if (key === round.answer) {
      setScore(s => s + 1); setStreak(s => s + 1); setStatus('correct');
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } else { setStreak(0); setStatus('wrong'); }
  };

  const next = () => {
    if (ri + 1 >= TOTAL) {
      setState('gameover');
      if (score + (status === 'correct' ? 0 : 0) / TOTAL >= 0.5)
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 });
      onFinish && onFinish({ score: score + (status === 'correct' ? 1 : 0), maxScore: TOTAL, level: 'standard' });
    } else {
      setRi(i => i + 1); setAnswered(false); setSelected(null); setStatus('');
    }
  };

  const round = rounds[ri];
  const finalScore = score;
  const pct = finalScore / TOTAL;

  return (
    <div className="game-shell" dir={ar ? 'rtl' : 'ltr'}>
      <button className="game-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t.backToGames}
      </button>

      {state === 'intro' && (
        <div className="game-intro">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
          <h1>{ar ? 'مطابقة التعبيرات' : 'Face Expressions Match'}</h1>
          <p>{ar ? 'اقرأ الموقف واختر المشاعر المناسبة.' : 'Read the situation and pick the correct feeling.'}</p>
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

          <div className={`img-card ${status}`} style={{ fontSize: '4rem', padding: '1.5rem' }}>
            <div>{round.emoji}</div>
            <p style={{ fontSize: '1rem', marginTop: '0.75rem', color: '#334155', fontWeight: 600 }}>
              {ar ? round.ar : round.en}
            </p>
          </div>

          <p style={{ textAlign: 'center', fontWeight: 700, color: '#64748B', marginBottom: '0.75rem' }}>
            {ar ? 'كيف يشعر هذا الشخص؟' : 'How does this person feel?'}
          </p>

          <div className={`feedback ${status || 'empty'}`}>
            {status === 'correct' && (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1)}
            {status === 'wrong' && `${t.wrongFeedback} ${ar ? round.ar_a : round.en_a}`}
          </div>

          <div className="options">
            {round.opts.map(opt => {
              let cls = 'opt-btn';
              if (answered) {
                if (opt.key === round.answer) cls += ' correct';
                else if (opt.key === selected) cls += ' wrong';
              }
              return (
                <button key={opt.key} className={cls} disabled={answered} onClick={() => pick(opt.key)}>
                  {ar ? opt.ar : opt.en}
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
            {ar ? `لقد سجلت ${finalScore} من أصل ${TOTAL}` : `You scored ${finalScore} out of ${TOTAL}`}
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

export default ExpressionsGame;
