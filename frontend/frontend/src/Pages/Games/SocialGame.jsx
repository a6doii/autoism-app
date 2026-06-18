import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/sounds';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const TOTAL = 8;

const SCENARIOS = [
  {
    emoji: '🧸',
    en: 'Your friend wants to play with your toy. What should you do?',
    ar: 'يريد صديقك اللعب بلعبتك. ماذا يجب أن تفعل؟',
    opts: [
      { en: 'Share and take turns', ar: 'تشارك وتتناوب', correct: true },
      { en: 'Hide the toy quickly', ar: 'تخفي اللعبة بسرعة', correct: false },
      { en: 'Scream "NO!"', ar: 'تصرخ "لا!"', correct: false },
    ],
  },
  {
    emoji: '🤕',
    en: 'Someone fell down and is crying. What should you do?',
    ar: 'سقط شخص ما ويبكي. ماذا يجب أن تفعل؟',
    opts: [
      { en: 'Walk away and ignore', ar: 'تمشي وتتجاهل', correct: false },
      { en: 'Laugh at them', ar: 'تضحك عليه', correct: false },
      { en: 'Ask if they are okay', ar: 'تسأله إذا كان بخير', correct: true },
    ],
  },
  {
    emoji: '🛝',
    en: 'You want to go on the swing, but someone is already on it. What do you do?',
    ar: 'تريد الذهاب على الأرجوحة ولكن هناك شخصاً عليها. ماذا تفعل؟',
    opts: [
      { en: 'Wait patiently for your turn', ar: 'تنتظر بصبر دورك', correct: true },
      { en: 'Push them off the swing', ar: 'تدفعه من الأرجوحة', correct: false },
      { en: 'Start crying loudly', ar: 'تبدأ بالبكاء بصوت عالٍ', correct: false },
    ],
  },
  {
    emoji: '📚',
    en: 'Your classmate is struggling with their homework. What should you do?',
    ar: 'زميلك يجد صعوبة في واجبه. ماذا يجب أن تفعل؟',
    opts: [
      { en: 'Make fun of them', ar: 'تسخر منه', correct: false },
      { en: 'Offer to help kindly', ar: 'تعرض مساعدته بلطف', correct: true },
      { en: 'Tell the teacher loudly', ar: 'تخبر المعلم بصوت عالٍ', correct: false },
    ],
  },
  {
    emoji: '🍪',
    en: 'There is only one cookie left and you and your sibling both want it. What do you do?',
    ar: 'تبقيت كعكة واحدة وأنت وأخوك كلاكما تريدانها. ماذا تفعل؟',
    opts: [
      { en: 'Grab it and eat it fast', ar: 'تخطفها وتأكلها بسرعة', correct: false },
      { en: 'Split it in half and share', ar: 'تقسمها وتتشارك', correct: true },
      { en: 'Throw it away so no one gets it', ar: 'ترميها حتى لا يحصل عليها أحد', correct: false },
    ],
  },
  {
    emoji: '🎂',
    en: "It is your friend's birthday. What is the nicest thing to do?",
    ar: 'اليوم عيد ميلاد صديقك. ما هو أجمل شيء تفعله؟',
    opts: [
      { en: 'Wish them a happy birthday', ar: 'تتمنى له عيد ميلاد سعيد', correct: true },
      { en: 'Ignore the special day', ar: 'تتجاهل اليوم الخاص', correct: false },
      { en: 'Ask them to share their cake', ar: 'تطلب منه أن يشاركك كعكته', correct: false },
    ],
  },
  {
    emoji: '🗣️',
    en: 'Two people are talking. You want to say something. What should you do?',
    ar: 'شخصان يتحدثان. تريد أن تقول شيئاً. ماذا يجب أن تفعل؟',
    opts: [
      { en: 'Shout over them', ar: 'تصرخ فوق كلامهم', correct: false },
      { en: 'Wait and say "excuse me"', ar: 'تنتظر وتقول "لو سمحت"', correct: true },
      { en: 'Walk away upset', ar: 'تمشي وأنت زعلان', correct: false },
    ],
  },
  {
    emoji: '😭',
    en: 'Your friend is very sad today. What can you do to help?',
    ar: 'صديقك حزين جداً اليوم. ماذا يمكنك أن تفعل لمساعدته؟',
    opts: [
      { en: 'Tell them a joke or be kind', ar: 'تحكي له نكتة أو تكون لطيفاً', correct: true },
      { en: 'Tell everyone at school', ar: 'تخبر الجميع في المدرسة', correct: false },
      { en: 'Leave them completely alone', ar: 'تتركه وحده تماماً', correct: false },
    ],
  },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const SocialGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();
  const ar = language === 'ar';

  const [state, setState] = useState('intro');
  const [rounds, setRounds] = useState([]);
  const [ri, setRi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [status, setStatus] = useState('');

  const start = () => {
    setRounds(shuffle([...SCENARIOS]).slice(0, TOTAL).map(s => ({ ...s, opts: shuffle(s.opts) })));
    setRi(0); setScore(0); setStreak(0);
    setAnswered(false); setSelectedIdx(null); setStatus('');
    setState('playing');
  };

  const pick = (idx) => {
    if (answered) return;
    setAnswered(true); setSelectedIdx(idx);
    const correct = rounds[ri].opts[idx].correct;
    if (correct) {
      setScore(s => s + 1); setStreak(s => s + 1); setStatus('correct');
      sounds.correct();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } else { setStreak(0); setStatus('wrong'); sounds.wrong(); }
  };

  const next = () => {
    if (ri + 1 >= TOTAL) {
      setState('gameover');
      const pctSoc = score / TOTAL;
      if (pctSoc >= 0.8) { sounds.win(); confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
      else if (pctSoc >= 0.5) { sounds.pass(); confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 1000 }); }
      else { sounds.lose(); }
      onFinish && onFinish({ score, maxScore: TOTAL, level: 'standard' });
    } else {
      setRi(i => i + 1); setAnswered(false); setSelectedIdx(null); setStatus('');
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤝</div>
          <h1>{ar ? 'المواقف الاجتماعية' : 'Social Situations'}</h1>
          <p>{ar ? 'اقرأ الموقف واختر التصرف الصحيح.' : 'Read the situation and choose the right action.'}</p>
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

          <div className={`img-card ${status}`} style={{ fontSize: '3.5rem', padding: '1.5rem' }}>
            <div>{round.emoji}</div>
            <p style={{ fontSize: '1rem', marginTop: '0.75rem', color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
              {ar ? round.ar : round.en}
            </p>
          </div>

          <div className={`feedback ${status || 'empty'}`}>
            {status === 'correct' && (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1)}
            {status === 'wrong' && (ar ? '❌ حاول مرة أخرى — فكر في الخيار الأكثر لطفاً!' : '❌ Try again — think of the kindest choice!')}
          </div>

          <div className="options" style={{ flexDirection: 'column', gap: '0.6rem' }}>
            {round.opts.map((opt, idx) => {
              let cls = 'opt-btn';
              if (answered) {
                if (opt.correct) cls += ' correct';
                else if (idx === selectedIdx) cls += ' wrong';
              }
              return (
                <button key={idx} className={cls} style={{ textAlign: ar ? 'right' : 'left', padding: '14px 18px' }}
                  disabled={answered} onClick={() => pick(idx)}>
                  {ar ? opt.ar : opt.en}
                </button>
              );
            })}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '1rem' }} disabled={!answered} onClick={next}>
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

export default SocialGame;
