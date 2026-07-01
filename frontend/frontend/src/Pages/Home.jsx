import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faClipboardCheck, faFileAlt, faWandMagicSparkles, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../context/LanguageContext';
import mascot from "../Assets/mascot.png";

const BACKEND = process.env.REACT_APP_API_URL || 'https://autoism-backend-production.up.railway.app';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Home = () => {
  const { t, language } = useLanguage();
  const [displayCount, setDisplayCount] = useState(0);
  const [totalTests, setTotalTests] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/public-stats`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setTotalTests(data.total_tests ?? 0))
      .catch(() => setTotalTests(0));
  }, []);

  // Count-up animation
  useEffect(() => {
    if (totalTests === null || totalTests === 0) return;
    const duration = 1800;
    const steps = 80;
    const increment = totalTests / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalTests) {
        setDisplayCount(totalTests);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalTests]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section id="hero" className="hero-section">
        <div className="hero-text">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSubtitle}</p>
          <div className="hero-buttons">
            <Link to="/cases" className="btn-magic">
              <FontAwesomeIcon icon={faWandMagicSparkles} /> {t.startAssessment}
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="mascot-wrapper">
            <div className="mascot-glow" />
            {[
              { top: '4%',  left: '10%', char: '✦', size: '1.2rem', color: '#38bdf8', delay: '0s',   dur: '2.2s' },
              { top: '2%',  left: '58%', char: '✧', size: '1rem',   color: '#a78bfa', delay: '0.5s', dur: '2.7s' },
              { top: '6%',  left: '86%', char: '✦', size: '1.3rem', color: '#fbbf24', delay: '1s',   dur: '2s'   },
              { top: '44%', left: '-3%', char: '★', size: '1rem',   color: '#34d399', delay: '1.3s', dur: '2.5s' },
              { top: '42%', left: '96%', char: '✦', size: '1.1rem', color: '#f472b6', delay: '0.3s', dur: '2.8s' },
              { top: '74%', left: '6%',  char: '✧', size: '0.9rem', color: '#38bdf8', delay: '1.6s', dur: '2.1s' },
              { top: '76%', left: '88%', char: '✦', size: '1.2rem', color: '#a78bfa', delay: '0.7s', dur: '2.4s' },
              { top: '20%', left: '94%', char: '★', size: '0.8rem', color: '#fbbf24', delay: '2s',   dur: '2.3s' },
              { top: '88%', left: '46%', char: '✧', size: '0.9rem', color: '#34d399', delay: '1.1s', dur: '2.6s' },
            ].map((s, i) => (
              <span key={i} className="spark" style={{ top: s.top, left: s.left, fontSize: s.size, color: s.color, animationDelay: s.delay, animationDuration: s.dur }}>{s.char}</span>
            ))}
            <img src={mascot} alt="Auto-Ism Mascot" className="mascot-img" />
          </div>
        </div>

        <button className="scroll-arrow-btn" onClick={() => scrollTo('stats')} aria-label="Scroll down">
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </section>

      {/* ── Stats counter ─────────────────────────────────────────────── */}
      <section id="stats" className="stats-banner" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="stats-ring">
          <div className="stats-number-wrap">
            <span className="stats-count">{displayCount.toLocaleString()}</span>
            <span className="stats-plus">+</span>
          </div>
        </div>
        <p className="stats-label">{t.screeningsCompleted}</p>
        <p className="stats-sub">{t.screeningsTrust}</p>

        <button className="scroll-arrow-btn" onClick={() => scrollTo('how-it-works')} aria-label="Scroll down">
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-title">
          <h2>{t.howItWorks}</h2>
          <p>{t.howItWorksSubtitle}</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="icon-circle"><FontAwesomeIcon icon={faUpload} /></div>
            <h3>{t.step1Title}</h3>
            <p>{t.step1Description}</p>
          </div>
          <div className="step-card">
            <div className="icon-circle"><FontAwesomeIcon icon={faClipboardCheck} /></div>
            <h3>{t.step2Title}</h3>
            <p>{t.step2Description}</p>
          </div>
          <div className="step-card">
            <div className="icon-circle"><FontAwesomeIcon icon={faFileAlt} /></div>
            <h3>{t.step3Title}</h3>
            <p>{t.step3Description}</p>
          </div>
        </div>

        <div className="scroll-up-wrap">
          <button className="scroll-arrow-btn scroll-arrow-up" onClick={() => scrollTo('hero')} aria-label="Scroll to top">
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;