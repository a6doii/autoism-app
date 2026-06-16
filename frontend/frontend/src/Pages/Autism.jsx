import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../context/LanguageContext';
import qchatImage from '../Assets/QCHAT-10.jpg';

const Autism = () => {
  const [openItems, setOpenItems] = useState({});
  const [isImageZoomed, setIsImageZoomed] = useState(false); 
  const { t } = useLanguage();

  const toggleAccordion = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    { question: t.faq1Question, answer: t.faq1Answer },
    { question: t.faq2Question, answer: t.faq2Answer },
    { question: t.faq3Question, answer: t.faq3Answer },
    { question: t.faq4Question, answer: t.faq4Answer }
  ];

  return (
    <>
      {/* Ensures that when the image zooms out past the screen bounds, 
          it doesn't cause the whole browser window to scroll left/right */}
      <style>{`
        body { overflow-x: hidden; }
      `}</style>

      <div className="container" style={{ 
        maxWidth: 'min(800px, 90%)', 
        padding: '0 clamp(0.5rem, 3vw, 1.5rem)',
        margin: '0 auto',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          margin: 'clamp(2rem, 5vw, 2.5rem) 0 clamp(1rem, 2.5vw, 1.25rem) 0',
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          lineHeight: 1.2
        }}>
          {t.understandingAutism}
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
          marginBottom: 'clamp(2rem, 5vw, 2.5rem)',
          color: '#475569'
        }}>
          {t.essentialInfo}
        </p>

        <section style={{ 
          marginBottom: 'clamp(3rem, 8vw, 4rem)',
          background: '#f8fafc',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          borderRadius: 'clamp(1rem, 2.5vw, 1.5rem)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.6rem, 4vw, 2rem)',
              marginBottom: 'clamp(2rem, 4vw, 2.5rem)',
              color: '#1e293b',
              textAlign: 'center'
            }}>
              {t.screeningMechanism}
            </h2>
            
            <div style={{ marginBottom: 'clamp(2rem, 5vw, 2.5rem)' }}>
              <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', color: '#2c3e50' }}>
                {t.facialAnalysis}
              </h3>
              <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', lineHeight: '1.7', color: '#475569', marginBottom: 'clamp(1.5rem, 3vw, 2rem)', wordBreak: 'break-word' }}>
                {t.facialAnalysisText}
              </p>

              <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', color: '#2c3e50' }}>
                {t.qchatTitle}
              </h3>
              <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', lineHeight: '1.7', color: '#475569', marginBottom: 'clamp(1.5rem, 3vw, 2rem)', wordBreak: 'break-word' }}>
                {t.qchatText}
              </p>

              {/* INCREASED ZOOM AND MARGIN */}
              <div style={{ 
                margin: 'clamp(2rem, 5vw, 3rem) auto',
                // Increased the extra bottom margin from 35% to 50% to accommodate the larger zoom
                marginBottom: isImageZoomed ? 'calc(clamp(2rem, 5vw, 3rem) + 50%)' : 'clamp(2rem, 5vw, 3rem)',
                transition: 'margin 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                width: '100%',
                position: 'relative',
                zIndex: 10
              }}>
                <div 
                  style={{ 
                    width: '100%',
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: 'clamp(1rem, 2vw, 1.5rem)',
                    boxShadow: isImageZoomed ? '0 25px 50px rgba(0,0,0,0.25)' : '0 0.5rem 1.5rem rgba(0,0,0,0.1)',
                    cursor: 'zoom-in',
                    // Increased scale from 1.25 to 1.5
                    transform: isImageZoomed ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: 'top center',
                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                  onMouseEnter={() => setIsImageZoomed(true)}
                  onMouseLeave={() => setIsImageZoomed(false)}
                >
                  <img 
                    src={qchatImage} 
                    alt="Q-CHAT-10 Questionnaire" 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      borderRadius: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2vw, 1.5rem) 0 0',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                  <p style={{ 
                    padding: 'clamp(1rem, 2vw, 1.5rem)',
                    margin: 0,
                    fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                    color: '#64748b',
                    fontStyle: 'italic',
                    background: 'white',
                    borderBottomLeftRadius: 'clamp(1rem, 2vw, 1.5rem)',
                    borderBottomRightRadius: 'clamp(1rem, 2vw, 1.5rem)'
                  }}>
                    {t.qchatImageCaption}
                  </p>
                </div>
              </div>

              <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', color: '#2c3e50' }}>
                {t.scoreFusion}
              </h3>
              <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', lineHeight: '1.7', color: '#475569', wordBreak: 'break-word' }}>
                {t.scoreFusionText}
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 'clamp(3rem, 8vw, 4rem)' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#1e293b' }}>
            {t.faq}
          </h2>
          
          <div>
            {faqs.map((faq, index) => {
              const isOpen = openItems[index] || false;
              
              return (
                <div 
                  key={index}
                  style={{ 
                    background: 'linear-gradient(90deg, #222222 0%, #888888 100%)',
                    borderRadius: 'clamp(1.25rem, 3vw, 1.875rem)',
                    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    onClick={() => toggleAccordion(index)}
                    style={{ 
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '600',
                      color: 'white',
                      borderBottom: isOpen ? '0.0625rem solid rgba(255,255,255,0.2)' : 'none',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                    }}
                  >
                    <span style={{ wordBreak: 'break-word', paddingRight: '0.5rem' }}>{faq.question}</span>
                    <FontAwesomeIcon 
                      icon={isOpen ? faChevronUp : faChevronDown}
                      style={{ color: 'white', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', flexShrink: 0 }}
                    />
                  </div>

                  {isOpen && (
                    <div style={{ 
                      padding: 'clamp(1rem, 2.5vw, 1.25rem)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      lineHeight: '1.6',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      borderTop: '0.0625rem solid rgba(255,255,255,0.2)',
                      wordBreak: 'break-word'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div style={{ 
            marginTop: 'clamp(2rem, 5vw, 2.5rem)', 
            textAlign: 'center', 
            padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1rem, 3vw, 1.5rem)',
            borderRadius: 'clamp(0.75rem, 2vw, 1rem)'
          }}>
            <h3 style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', color: '#1e293b' }}>
              {t.concerned}
            </h3>
            <Link 
              to="/cases" 
              style={{ 
                display: 'inline-block',
                padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1.5rem, 4vw, 2rem)',
                background: 'linear-gradient(90deg, #40E0D0 0%, #8A2BE2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 'clamp(1.875rem, 5vw, 2.5rem)',
                fontWeight: '500',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                textAlign: 'center'
              }}
            >
              {t.takeAssessment}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Autism;