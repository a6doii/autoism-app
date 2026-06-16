import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faShapes, faFaceLaughBeam, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import RecognitionGame from './Games/RecognitionGame';
import ShapeMatchGame from './Games/ShapeMatchGame';
import EmotionGame from './Games/EmotionGame';
import '../CSS/Game.css';

const GAMES = [
  { key: 'recognition', icon: faPuzzlePiece, color: '#3b82f6', titleKey: 'gameIntroTitle', descKey: 'gameIntroDesc' },
  { key: 'shapes', icon: faShapes, color: '#a855f7', titleKey: 'shapeGameTitle', descKey: 'shapeGameDesc' },
  { key: 'emotions', icon: faFaceLaughBeam, color: '#f59e0b', titleKey: 'emotionGameTitle', descKey: 'emotionGameDesc' },
];

const Game = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [saveError, setSaveError] = useState('');

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
      <div className="game-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
    const commonProps = { onFinish: saveScore, onBack: () => setActiveGame(null) };
    return (
      <>
        {saveError && <p style={{ textAlign: 'center', color: 'var(--danger)' }}>{saveError}</p>}
        {activeGame === 'recognition' && <RecognitionGame {...commonProps} />}
        {activeGame === 'shapes' && <ShapeMatchGame {...commonProps} />}
        {activeGame === 'emotions' && <EmotionGame {...commonProps} />}
      </>
    );
  }

  return (
    <div className="game-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
          <button key={g.key} className="game-card" style={{ '--game-color': g.color }} onClick={() => setActiveGame(g.key)}>
            <div className="game-card-icon"><FontAwesomeIcon icon={g.icon} /></div>
            <h3>{t[g.titleKey]}</h3>
            <p>{t[g.descKey]}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;
