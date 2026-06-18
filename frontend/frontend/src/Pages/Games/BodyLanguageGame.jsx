import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';
import MascotSparkle from '../../Components/MascotSparkle';

const TOTAL = 8;

const CUES = [
  {
    emoji: '👋', en_q: 'Someone is waving their hand at you.', ar_q: 'شخص ما يلوّح بيده نحوك.',
    answer: 'hello', opts: ['hello','angry','scared','sleeping'],
    labels: { hello: {en:'Saying hello/goodbye', ar:'يقول مرحباً/وداعاً'}, angry: {en:'They are angry', ar:'هو غاضب'}, scared: {en:'They are scared', ar:'هو خائف'}, sleeping: {en:'They are sleeping', ar:'هو نائم'} },
  },
  {
    emoji: '👍', en_q: 'A person shows you their thumb up.', ar_q: 'شخص يرفع إبهامه نحوك.',
    answer: 'great', opts: ['great','stop','sad','confused'],
    labels: { great: {en:'Great job / I agree', ar:'عمل رائع / أوافق'}, stop: {en:'Stop!', ar:'توقف!'}, sad: {en:'They are sad', ar:'هو حزين'}, confused: {en:'They are confused', ar:'هو مشوش'} },
  },
  {
    emoji: '🤐', en_q: 'A person has their arms crossed and looks away.', ar_q: 'شخص يضم ذراعيه ويبتعد بنظره.',
    answer: 'upset', opts: ['happy','upset','excited','tired'],
    labels: { happy: {en:'They are happy', ar:'هو سعيد'}, upset: {en:'They might be upset', ar:'ربما هو منزعج'}, excited: {en:'They are excited', ar:'هو متحمس'}, tired: {en:'They are very tired', ar:'هو متعب جداً'} },
  },
  {
    emoji: '👉', en_q: 'Someone is pointing their finger at something.', ar_q: 'شخص يشير بإصبعه نحو شيء ما.',
    answer: 'look', opts: ['look','angry','laugh','bye'],
    labels: { look: {en:'Look over there!', ar:'انظر هناك!'}, angry: {en:'They are angry', ar:'هو غاضب'}, laugh: {en:'They are laughing', ar:'هو يضحك'}, bye: {en:'Saying goodbye', ar:'يقول وداعاً'} },
  },
  {
    emoji: '😤', en_q: 'A person is stomping their feet and frowning.', ar_q: 'شخص يدقّ قدميه ويعبس.',
    answer: 'mad', opts: ['happy','mad','bored','shy'],
    labels: { happy: {en:'They are happy', ar:'هو سعيد'}, mad: {en:'They are angry', ar:'هو غاضب'}, bored: {en:'They are bored', ar:'هو يشعر بالملل'}, shy: {en:'They are shy', ar:'هو خجول'} },
  },
  {
    emoji: '🫣', en_q: 'A child is hiding behind their hands and peeking.', ar_q: 'طفل يختبئ خلف يديه ويتلصص.',
    answer: 'shy', opts: ['angry','shy','happy','bored'],
    labels: { angry: {en:'They are angry', ar:'هو غاضب'}, shy: {en:'They are shy or nervous', ar:'هو خجول أو متوتر'}, happy: {en:'They are happy', ar:'هو سعيد'}, bored: {en:'They are bored', ar:'هو يشعر بالملل'} },
  },
  {
    emoji: '👏', en_q: 'Someone is clapping their hands.', ar_q: 'شخص يصفق بيديه.',
    answer: 'bravo', opts: ['bravo','scared','bored','mad'],
    labels: { bravo: {en:'Bravo! / Well done!', ar:'أحسنت! / رائع!'}, scared: {en:'They are scared', ar:'هو خائف'}, bored: {en:'They are bored', ar:'هو يشعر بالملل'}, mad: {en:'They are angry', ar:'هو غاضب'} },
  },
  {
    emoji: '🤷', en_q: "A person shrugs their shoulders and looks confused.", ar_q: 'شخص يرفع كتفيه ويبدو مرتبكاً.',
    answer: "dunno", opts: ["dunno","happy","angry","excited"],
    labels: { dunno: {en:"I don't know / I'm not sure", ar:'لا أعلم / لست متأكداً'}, happy: {en:'They are happy', ar:'هو سعيد'}, angry: {en:'They are angry', ar:'هو غاضب'}, excited: {en:'They are excited', ar:'هو متحمس'} },
  },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const BodyLanguageGame = ({ onFinish, onBack }) => {
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
    setRounds(shuffle([...CUES]).slice(0, TOTAL).map(c => ({
      ...c, opts: shuffle(c.opts),
    })));
    setRi(0); setScore(0); setStreak(0);
    setAnswered(false); setSelected(null); setStatus('');
    setState('playing');
  };

  const pick = (key) => {
    if (answered) return;
    setAnswered(true); setSelected(key);
    if (key === rounds[ri].answer) {
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚶</div>
          <h1>{ar ? 'لغة الجسد' : 'Body Language'}</h1>
          <p>{ar ? 'انظر إلى الحركة واختر ماذا تعني.' : 'Look at the body language and choose what it means.'}</p>
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
            <p style={{ fontSize: '1rem', marginTop: '0.75rem', color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
              {ar ? round.ar_q : round.en_q}
            </p>
          </div>

          <p style={{ textAlign: 'center', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem' }}>
            {ar ? 'ماذا يعني هذا؟' : 'What does this mean?'}
          </p>

          <div className={`feedback ${status || 'empty'}`}>
            {status === 'correct' && (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1)}
            {status === 'wrong' && `${t.wrongFeedback} ${ar ? round.labels[round.answer].ar : round.labels[round.answer].en}`}
          </div>

          <div className="options" style={{ flexDirection: 'column', gap: '0.5rem' }}>
            {round.opts.map((key) => {
              let cls = 'opt-btn';
              if (answered) {
                if (key === round.answer) cls += ' correct';
                else if (key === selected) cls += ' wrong';
              }
              return (
                <button key={key} className={cls}
                  style={{ textAlign: ar ? 'right' : 'left', padding: '14px 18px' }}
                  disabled={answered} onClick={() => pick(key)}>
                  {ar ? round.labels[key].ar : round.labels[key].en}
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

export default BodyLanguageGame;
