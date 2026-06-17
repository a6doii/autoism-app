import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../context/LanguageContext';

import s7sImage from '../Assets/S7S.jpeg';
import mostafaImage from '../Assets/Mostafa.jpeg';
import ziadImage from '../Assets/Ziad.jpeg';
import naderImage from '../Assets/Nader.jpeg';
import mohamedImage from '../Assets/Mohamed.jpeg';
import remonImage from '../Assets/Remon.jpeg';

const About = () => {
  const { t } = useLanguage();

  const teamMembers = [
    {
      id: 1,
      name: 'AlHussein Abdo',
      role: t.teamRole1,
      image: s7sImage,
      alt: 'AlHussein'
    },
    {
      id: 2,
      name: 'Mostafa Allam',
      role: t.teamRole2,
      image: mostafaImage,
      alt: 'Mostafa'
    },
    {
      id: 3,
      name: 'Ziad Ali',
      role: t.teamRole3,
      image: ziadImage,
      alt: 'Ziad'
    },
    {
      id: 4,
      name: 'Ahmed Nader',
      role: t.teamRole4,
      image: naderImage,
      alt: 'Ahmed'
    },
    {
      id: 5,
      name: 'Mohamed Ahmed',
      role: t.teamRole5,
      image: mohamedImage,
      alt: 'Mohamed'
    },
    {
      id: 6,
      name: 'Remon Maged',
      role: t.teamRole6,
      image: remonImage,
      alt: 'Remon'
    }
  ];

  return (
    <>
      <section className="about-hero">
        <div className="container">
          <h1>Auto-Ism</h1>
          <p className="subtitle" style={{ maxWidth: 'min(600px, 90%)', margin: '0 auto', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)' }}>
            {t.aboutDescription}
          </p>
        </div>
      </section>

      <section className="container">
        <div className="story-grid">
          <div className="story-text">
            <h2>{t.ourStory}</h2>
            <p style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)', color: '#475569', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              {t.storyText1}
            </p>
            <p style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)', color: '#475569', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              {t.storyText2} <strong>Auto-Ism</strong>: {t.storyText3}
            </p>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#f8fafc', padding: 'clamp(2rem, 8vw, 4rem) 0' }}>
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="icon-circle">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <h3>{t.ourMission}</h3>
              <p style={{ color: '#64748B', marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                {t.missionText}
              </p>
              <p style={{ color: '#3b82f6', marginTop: 'clamp(0.4rem, 1vw, 0.6rem)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: 600 }}>
                {t.missionTagline}
              </p>
            </div>
            <div className="mission-card">
              <div className="icon-circle">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <h3>{t.ourVision}</h3>
              <p style={{ color: '#64748B', marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                {t.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: 'clamp(2rem, 8vw, 4rem) 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{t.meetTheTeam}</h2>
        <div className="team-container">
          {teamMembers.map((member) => (
            <div key={member.id} className="card">
              <img 
                src={member.image} 
                alt={member.alt}
                style={{ 
                  width: 'clamp(6rem, 15vw, 9.375rem)', 
                  height: 'clamp(6rem, 15vw, 9.375rem)', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 'clamp(0.5rem, 2vw, 1rem)'
                }}
                onError={(e) => {
                  console.log(`Error loading image for ${member.name}`);
                  e.target.style.display = 'none';
                }}
              />
              <h4 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>{member.name}</h4>
              <p style={{ color: '#64748B', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;