import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-section">
          <div
            className="logo"
            style={{ color: "white", marginBottom: "1rem" }}
          >
            <div className="logo-icon">AI</div>
            <span style={{ marginLeft: "1%" }}>Auto-Ism</span>
          </div>
          <p>{t.footerDescription}</p>
        </div>

        <div className="footer-section">
          <h3>{t.contact}</h3>
          <p>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "1%" }} />
            support@auto-ism.com
          </p>
          <p>{t.footerAddress}</p>
        </div>

        <div className="footer-section">
          <h3>{t.followUs}</h3>
          <div className="social-links">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>{t.footerCopyright}</p>
      </div>
    </footer>
  );
};

export default Footer;