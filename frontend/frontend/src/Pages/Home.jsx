import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faClipboardCheck, faFileAlt, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../context/LanguageContext';
import familyImage from "../Assets/Fam.jpg";

const Home = () => {
  const { t } = useLanguage();

  return (
    <>

      <section className="hero-section">
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
          <img src={familyImage} alt={t.familyImageAlt} />
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>{t.howItWorks}</h2>
          <p>{t.howItWorksSubtitle}</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="icon-circle">
              <FontAwesomeIcon icon={faUpload} />
            </div>
            <h3>{t.step1Title}</h3>
            <p>{t.step1Description}</p>
          </div>

          <div className="step-card">
            <div className="icon-circle">
              <FontAwesomeIcon icon={faClipboardCheck} />
            </div>
            <h3>{t.step2Title}</h3>
            <p>{t.step2Description}</p>
          </div>

          <div className="step-card">
            <div className="icon-circle">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <h3>{t.step3Title}</h3>
            <p>{t.step3Description}</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;