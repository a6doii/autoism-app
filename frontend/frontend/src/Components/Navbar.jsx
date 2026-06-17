import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  async function handleLogout() {
    try { await api('/logout', { method: 'POST' }); } catch (_) {}
    logout();
    setIsMenuOpen(false);
    navigate('/');
  }

  const isAdmin = user?.is_admin === true;
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Wrapper for toggling language & closing menu on mobile
  const handleMobileLanguageToggle = () => {
    toggleLanguage();
    // Optional: closeMenu(); if you want the menu to close immediately after changing language
  };

  return (
    <header className="navbar">
      <div className="container">
        
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">AI</div>
          <span>Auto-Ism</span>
        </Link>

        {/* 1. MAIN NAVIGATION LINKS (Includes Mobile-Only Controls) */}
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" className="nav-item" onClick={closeMenu}>{t.home}</NavLink>
          <NavLink to="/cases" className="nav-item" onClick={closeMenu}>{t.cases}</NavLink>
          <NavLink to="/autism" className="nav-item" onClick={closeMenu}>{t.whatIsAutism}</NavLink>
          
          {/* NEW: Game Link Added Here */}
          <NavLink to="/play" className="nav-item" onClick={closeMenu}>{t.playAndLearn || 'Play & Learn'}</NavLink>
          
          <NavLink to="/about" className="nav-item" onClick={closeMenu}>{t.aboutUs}</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className="nav-item" onClick={closeMenu}>{t.dashboard}</NavLink>
          )}

          {/* =========================================
              MOBILE ONLY VIEW (Inside Dropdown)
          ========================================= */}
          <div className="mobile-only">
            <button 
              onClick={handleMobileLanguageToggle}
              className="btn-language"
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            {!user ? (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }} onClick={closeMenu}>{t.login}</Link>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={closeMenu}>{t.register}</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }} onClick={closeMenu}>
                  <FontAwesomeIcon icon={faUserCircle} /> {t.profile || 'Profile'}
                </Link>
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleLogout}>{t.logout}</button>
              </>
            )}
          </div>
        </nav>

        {/* 2. RIGHT SIDE CONTROLS (Desktop View + Hamburger) */}
        <div className="nav-controls">
          
          {/* =========================================
              DESKTOP ONLY VIEW (Hidden on Mobile)
          ========================================= */}
          <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button 
              onClick={toggleLanguage}
              className="btn-language"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            <div className="nav-auth">
              {!user ? (
                <>
                  <Link to="/login" className="nav-item" onClick={closeMenu}>{t.login}</Link>
                  <Link to="/register" className="btn btn-primary" onClick={closeMenu}>{t.register}</Link>
                </>
              ) : (
                <div className="profile-section">
                  <span className="greeting">{t.greeting}, {user.firstname}</span>
                  <Link to="/profile" className="profile-link" onClick={closeMenu}>
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={`${user.firstname}'s profile`}
                        className="profile-image"
                      />
                    ) : (
                      <FontAwesomeIcon 
                        icon={faUserCircle} 
                        className="profile-icon"
                      />
                    )}
                  </Link>
                  <button className="btn btn-secondary" onClick={handleLogout}>{t.logout}</button>
                </div>
              )}
            </div>
          </div>

          {/* HAMBURGER MENU ICON (Always visible on mobile) */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
