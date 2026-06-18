import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPuzzlePiece, faShapes, faFaceLaughBeam, faTriangleExclamation,
  faFaceSmile, faHandshake, faListCheck, faShuffle, faBullseye,
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import RecognitionGame   from './Games/RecognitionGame';
import ShapeMatchGame    from './Games/ShapeMatchGame';
import EmotionGame       from './Games/EmotionGame';
import ExpressionsGame   from './Games/ExpressionsGame';
import SocialGame        from './Games/SocialGame';
import PatternGame       from './Games/PatternGame';
import RoutineGame       from './Games/RoutineGame';
import BubblesGame       from './Games/BubblesGame';
import '../CSS/Game.css';

const GAMES = [
  // ── existing ──────────────────────────────────────────────────────────────
  { key: 'recognition', icon: faPuzzlePiece,     color: '#3b82f6',
    en_title: 'Recognition',      ar_title: 'التعرف',
    en_desc:  'Match the right items together.', ar_desc: 'طابق العناصر الصحيحة معاً.',
    titleKey: 'gameIntroTitle', descKey: 'gameIntroDesc' },

  { key: 'shapes',      icon: faShapes,           color: '#a855f7',
    en_title: 'Shape Match',      ar_title: 'مطابقة الأشكال',
    en_desc:  'Match shapes by color and form.', ar_desc: 'طابق الأشكال حسب اللون والشكل.',
    titleKey: 'shapeGameTitle', descKey: 'shapeGameDesc' },

  { key: 'emotions',    icon: faFaceLaughBeam,    color: '#f59e0b',
    en_title: 'Emotion Match',    ar_title: 'مطابقة المشاعر',
    en_desc:  'Name the emotion shown.',         ar_desc: 'سمِّ الشعور المعروض.',
    titleKey: 'emotionGameTitle', descKey: 'emotionGameDesc' },

  // ── new ───────────────────────────────────────────────────────────────────
  { key: 'expressions', icon: faFaceSmile,        color: '#ec4899',
    en_title: 'Expressions',      ar_title: 'التعبيرات',
    en_desc:  'Read a situation and pick the right feeling.', ar_desc: 'اقرأ الموقف واختر الشعور الصحيح.' },

  { key: 'social',      icon: faHandshake,        color: '#06b6d4',
    en_title: 'Social Skills',    ar_title: 'المهارات الاجتماعية',
    en_desc:  'Choose the kindest thing to do.', ar_desc: 'اختر التصرف الأكثر لطفاً.' },

  { key: 'pattern',     icon: faListCheck,        color: '#8b5cf6',
    en_title: 'Patterns',         ar_title: 'الأنماط',
    en_desc:  'Complete the missing piece.',     ar_desc: 'أكمل الجزء الناقص.' },

  { key: 'routine',     icon: faShuffle,          color: '#f97316',
    en_title: 'Daily Routine',    ar_title: 'الروتين اليومي',
    en_desc:  'Put the daily steps in order.',   ar_desc: 'رتّب الخطوات اليومية بالترتيب الصحيح.' },

  { key: 'bubbles',     icon: faBullseye,         color: '#ef4444',
    en_title: 'Focus Bubbles',    ar_title: 'فقاعات التركيز',
    en_desc:  'Pop only the target bubbles!',    ar_desc: 'انقر فقط على الفقاعات المطلوبة!' },
];

const Game = () => {
  const { t, language } = useLanguage();
  const ar = language === 'ar';
  const [loading, setLoading]       = useState(true);
  const [cases, setCases]           = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [saveError, setSaveError]   = useState('');

  useEffect(() => {
    api('/cases')
      .then((data) => {
        const list = data.cases || [];
        setCases(list);
        if (list.length > 0) setSelectedCaseId(String(list[0].id));
      })
      .finally(() => setLoading(false));
  }, []);

  const saveScore = async ({ score, maxScore, level }) => {
    if (!activeGame) return;
    setSaveError('');
    try {
      await api(`/cases/${selectedCaseId}/game-scores`, {
        method: 'POST',
        body: JSON.stringify({ game: activeGame, score, max_score: maxScore, level }),
      });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  if (loading) {
    return <div className="game-shell"><p style={{ textAlign: 'center', color: '#64748B' }}>{t.loading || 'Loading...'}</p></div>;
  }

  if (cases.length === 0) {
    return (
      <div className="game-shell" dir={ar ? 'rtl' : 'ltr'}>
        <div className="no-cases-alert">
          <FontAwesomeIcon icon={faTriangleExclamation} className="no-cases-icon" />
          <h2>{t.noCaseForGamesTitle}</h2>
          <p>{t.noCaseForGamesMessage}</p>
          <Link to="/cases" className="btn-magic">{t.createCase}</Link>
        </div>
      </div>
    );
  }

  if (activeGame) {
    const props = { onFinish: saveScore, onBack: () => setActiveGame(null) };
    return (
      <>
        {saveError && <p style={{ textAlign: 'center', color: 'var(--danger)' }}>{saveError}</p>}
        {activeGame === 'recognition'  && <RecognitionGame  {...props} />}
        {activeGame === 'shapes'       && <ShapeMatchGame   {...props} />}
        {activeGame === 'emotions'     && <EmotionGame      {...props} />}
        {activeGame === 'expressions'  && <ExpressionsGame  {...props} />}
        {activeGame === 'social'       && <SocialGame       {...props} />}
        {activeGame === 'pattern'      && <PatternGame      {...props} />}
        {activeGame === 'routine'      && <RoutineGame      {...props} />}
        {activeGame === 'bubbles'      && <BubblesGame      {...props} />}
      </>
    );
  }

  return (
    <div className="game-shell" dir={ar ? 'rtl' : 'ltr'}>
      <div className="games-hub-header">
        <h1>{t.playAndLearn}</h1>
        <p>{t.gamesHubSubtitle}</p>
      </div>

      <div className="child-selector">
        <label>{t.selectChildToPlay}</label>
        <select className="form-control" value={selectedCaseId} onChange={(e) => setSelectedCaseId(e.target.value)}>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>{c.child_name}</option>
          ))}
        </select>
      </div>

      <div className="games-grid">
        {GAMES.map((g) => (
          <button key={g.key} className="game-card" style={{ '--game-color': g.color }}
            onClick={() => setActiveGame(g.key)}>
            <div className="game-card-icon"><FontAwesomeIcon icon={g.icon} /></div>
            <h3>{g.titleKey ? t[g.titleKey] : (ar ? g.ar_title : g.en_title)}</h3>
            <p>{g.descKey  ? t[g.descKey]  : (ar ? g.ar_desc  : g.en_desc)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;
