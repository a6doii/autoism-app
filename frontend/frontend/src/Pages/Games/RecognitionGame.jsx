import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import mascotExcited from '../../Assets/mascot_excited.png';

const TOTAL = 10;

const dict = {
  'Cat': 'قطة', 'Car': 'سيارة', 'Apple': 'تفاحة', 'House': 'منزل',
  'Dog': 'كلب', 'Fish': 'سمكة', 'Ball': 'كرة', 'Tree': 'شجرة',
  'Bus': 'حافلة', 'Star': 'نجمة', 'Moon': 'قمر', 'Frog': 'ضفدع',
  'Hat': 'قبعة', 'Egg': 'بيضة', 'Flower': 'زهرة', 'Sock': 'جورب',
  'Key': 'مفتاح', 'Cup': 'كوب', 'Bed': 'سرير', 'Plane': 'طائرة',
  'Rock': 'صخرة', 'Fork': 'شوكة', 'Bag': 'حقيبة', 'Log': 'جذع',
  'Balloon': 'بالون', 'Brick': 'طوبة', 'Pen': 'قلم', 'Shoe': 'حذاء',
  'Banana': 'موزة', 'Cloud': 'سحابة', 'Door': 'باب', 'Pipe': 'أنبوب',
  'Lamp': 'مصباح',
  'Fox': 'ثعلب', 'Wolf': 'ذئب', 'Bear': 'دب', 'Mouse': 'فأر',
  'Rat': 'جرذ', 'Rabbit': 'أرنب', 'Hamster': 'هامستر', 'Toad': 'علجوم',
  'Lizard': 'سحلية', 'Turtle': 'سلحفاة', 'Lion': 'أسد', 'Tiger': 'نمر',
  'Leopard': 'فهد', 'Cheetah': 'فهد صياد', 'Elephant': 'فيل', 'Hippo': 'فرس النهر',
  'Rhino': 'وحيد القرن', 'Buffalo': 'جاموس', 'Butterfly': 'فراشة', 'Moth': 'عثة',
  'Bee': 'نحلة', 'Fly': 'ذبابة', 'Clownfish': 'سمكة المهرج', 'Goldfish': 'سمكة ذهبية',
  'Catfish': 'سمكة السلور', 'Swordfish': 'سمكة أبو سيف', 'Penguin': 'بطريق', 'Duck': 'بطة',
  'Goose': 'إوزة', 'Swan': 'بجعة', 'Eagle': 'نسر', 'Hawk': 'صقر',
  'Falcon': 'صقر', 'Osprey': 'عقاب', 'Crocodile': 'تمساح', 'Alligator': 'تمساح',
  'Gecko': 'أبو بريص', 'Monitor': 'ورل', 'Squid': 'حبار', 'Octopus': 'أخطبوط',
  'Cuttlefish': 'حبار', 'Nautilus': 'نوتيلوس', 'Chipmunk': 'سنجاب مخطط', 'Squirrel': 'سنجاب',
  'Gopher': 'غوفر', 'Marmot': 'مرموط', 'Kangaroo': 'كنغر', 'Wallaby': 'والابي',
  'Wombat': 'ومبت', 'Quokka': 'كوكا', 'Wasp': 'دبور', 'Hornet': 'دبور',
  'Bumblebee': 'نحلة طنانة', 'Flamingo': 'نحام', 'Heron': 'مالك الحزين', 'Crane': 'كركي',
  'Stork': 'لقلق', 'Dragon': 'تنين', 'Dinosaur': 'ديناصور', 'Basilisk': 'باسيليسك',
  'Hedgehog': 'قنفذ', 'Porcupine': 'شيهم', 'Mole': 'خلد', 'Shrew': 'زباب'
};

const BASE_SETS = {
  easy: [
    {e:'🐱', label:'Cat',     opts:['Cat','Car','Apple','House']},
    {e:'🐶', label:'Dog',     opts:['Dog','Fish','Ball','Tree']},
    {e:'🍎', label:'Apple',   opts:['Apple','Bus','Star','Moon']},
    {e:'🚗', label:'Car',     opts:['Car','Frog','Hat','Egg']},
    {e:'🌸', label:'Flower',  opts:['Flower','Sock','Key','Cup']},
    {e:'🐟', label:'Fish',    opts:['Fish','Bed','Plane','Rock']},
    {e:'🌙', label:'Moon',    opts:['Moon','Fork','Bag','Log']},
    {e:'🎈', label:'Balloon', opts:['Balloon','Brick','Pen','Shoe']},
    {e:'🍌', label:'Banana',  opts:['Banana','Cloud','Door','Pipe']},
    {e:'🏠', label:'House',   opts:['House','Lamp','Star','Tree']},
  ],
  medium: [
    {e:'🐱', label:'Cat',      opts:['Cat','Dog','Fox','Wolf']},
    {e:'🐶', label:'Dog',      opts:['Dog','Cat','Wolf','Bear']},
    {e:'🦊', label:'Fox',      opts:['Fox','Cat','Dog','Wolf']},
    {e:'🐭', label:'Mouse',    opts:['Mouse','Rat','Rabbit','Hamster']},
    {e:'🐸', label:'Frog',     opts:['Frog','Toad','Lizard','Turtle']},
    {e:'🦁', label:'Lion',     opts:['Lion','Tiger','Leopard','Cheetah']},
    {e:'🐘', label:'Elephant', opts:['Elephant','Hippo','Rhino','Buffalo']},
    {e:'🦋', label:'Butterfly',opts:['Butterfly','Moth','Bee','Fly']},
    {e:'🐠', label:'Clownfish',opts:['Clownfish','Goldfish','Catfish','Swordfish']},
    {e:'🐧', label:'Penguin',  opts:['Penguin','Duck','Goose','Swan']},
  ],
  hard: [
    {e:'🐺', label:'Wolf',      opts:['Wolf','Fox','Dog','Bear']},
    {e:'🦅', label:'Eagle',     opts:['Eagle','Hawk','Falcon','Osprey']},
    {e:'🐊', label:'Crocodile', opts:['Crocodile','Alligator','Gecko','Monitor']},
    {e:'🦑', label:'Squid',     opts:['Squid','Octopus','Cuttlefish','Nautilus']},
    {e:'🐿️', label:'Chipmunk',  opts:['Chipmunk','Squirrel','Gopher','Marmot']},
    {e:'🦘', label:'Kangaroo',  opts:['Kangaroo','Wallaby','Wombat','Quokka']},
    {e:'🐝', label:'Bee',       opts:['Bee','Wasp','Hornet','Bumblebee']},
    {e:'🦩', label:'Flamingo',  opts:['Flamingo','Heron','Crane','Stork']},
    {e:'🐉', label:'Dragon',    opts:['Dragon','Lizard','Dinosaur','Basilisk']},
    {e:'🦔', label:'Hedgehog',  opts:['Hedgehog','Porcupine','Mole','Shrew']},
  ]
};

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const RecognitionGame = ({ onFinish, onBack }) => {
  const { t, language } = useLanguage();

  const [gameState, setGameState] = useState('intro');
  const [diff, setDiff] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [status, setStatus] = useState('');

  const trWord = (word) => language === 'ar' ? (dict[word] || word) : word;

  const startGame = () => {
    const rawSet = BASE_SETS[diff];
    const randomizedSet = rawSet.map(q => ({
      e: q.e,
      label: q.label,
      opts: shuffle([...q.opts])
    }));

    setQuestions(shuffle(randomizedSet).slice(0, TOTAL));
    setQi(0);
    setScore(0);
    setStreak(0);
    setAnswered(false);
    setSelectedOpt(null);
    setStatus('');
    setGameState('playing');
  };

  const handlePick = (opt) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(opt);

    const q = questions[qi];
    const pts = diff === 'hard' ? 3 : diff === 'medium' ? 2 : 1;

    if (opt === q.label) {
      setScore(s => s + pts);
      setStreak(s => s + 1);
      setStatus('correct');

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444']
      });

    } else {
      setStreak(0);
      setStatus('wrong');
    }
  };

  const nextQ = () => {
    if (qi + 1 >= TOTAL) {
      setGameState('gameover');

      const maxPts = TOTAL * (diff === 'hard' ? 3 : diff === 'medium' ? 2 : 1);
      if ((score / maxPts) >= 0.5) {
        confetti({
          particleCount: 250,
          spread: 120,
          origin: { y: 0.4 },
          zIndex: 1000
        });
      }
      onFinish && onFinish({ score, maxScore: maxPts, level: diff });
    } else {
      setQi(i => i + 1);
      setAnswered(false);
      setSelectedOpt(null);
      setStatus('');
    }
  };

  const currentQ = questions[qi];
  const maxPts = TOTAL * (diff === 'hard' ? 3 : diff === 'medium' ? 2 : 1);
  const pct = score / maxPts;

  return (
    <div className="game-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <button className="game-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t.backToGames}
      </button>

      {gameState === 'intro' && (
        <div className="game-intro">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
          <h1>{t.gameIntroTitle}</h1>
          <p>{t.gameIntroDesc}</p>

          <div style={{ marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748B', fontWeight: 'bold' }}>{t.difficulty}</label>
            <div className="diff-strip">
              <button className={`diff-btn ${diff === 'easy' ? 'active' : ''}`} onClick={() => setDiff('easy')}>{t.easy}</button>
              <button className={`diff-btn ${diff === 'medium' ? 'active' : ''}`} onClick={() => setDiff('medium')}>{t.medium}</button>
              <button className={`diff-btn ${diff === 'hard' ? 'active' : ''}`} onClick={() => setDiff('hard')}>{t.hard}</button>
            </div>
          </div>

          <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.2rem', borderRadius: '999px' }} onClick={startGame}>
            {t.startGame}
          </button>
        </div>
      )}

      {gameState === 'playing' && currentQ && (
        <div>
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">{t.score}</div>
              <div className="stat-val teal">{score}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{t.question}</div>
              <div className="stat-val" style={{direction: 'ltr'}}>{qi + 1} / {TOTAL}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{t.streak}</div>
              <div className="stat-val">{streak}</div>
            </div>
          </div>

          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${Math.round(((qi + 1) / TOTAL) * 100)}%` }}></div>
          </div>

          <div className={`img-card ${status}`}>
            <span style={{ lineHeight: 1, display: 'inline-block' }} className={status === 'correct' ? 'animate-success' : ''}>
              {currentQ.e}
            </span>
          </div>

          <div className={`feedback ${status === '' ? 'empty' : status}`}>
            {status === 'correct' ? (streak >= 3 ? t.correctFeedback2 : t.correctFeedback1) : ''}
            {status === 'wrong' ? `${t.wrongFeedback} ${trWord(currentQ.label)}` : ''}
          </div>

          <div className="options">
            {currentQ.opts.map(opt => {
              let btnClass = 'opt-btn';
              if (answered) {
                if (opt === currentQ.label) btnClass += ' correct';
                else if (opt === selectedOpt) btnClass += ' wrong';
              }
              return (
                <button key={opt} className={btnClass} disabled={answered} onClick={() => handlePick(opt)}>
                  {trWord(opt)}
                </button>
              );
            })}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} disabled={!answered} onClick={nextQ}>
            {t.nextBtn} {language === 'ar' ? '←' : '→'}
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="game-over">
          <img src={mascotExcited} alt="mascot" style={{ width: '150px', objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(56,189,248,0.35))', animation: 'mascotFloat 4s ease-in-out infinite', marginBottom: '0.5rem' }} />
          <h2>
            {pct >= 0.8 ? t.gameOverTitleExcellent : pct >= 0.5 ? t.gameOverTitleGood : t.gameOverTitleKeep}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '30px', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {language === 'ar'
              ? `لقد سجلت ${score} من أصل ${maxPts}`
              : `You scored ${score} out of ${maxPts}`
            }
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

export default RecognitionGame;
