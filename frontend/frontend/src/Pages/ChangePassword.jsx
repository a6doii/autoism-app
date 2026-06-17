import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { auth } from '../lib/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import '../CSS/ChangePassword.css';

const ChangePassword = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const toggleShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleVerifyOldPassword = async () => {
    if (!passwordData.oldPassword) {
      setMessage({ type: 'error', text: t.pleaseEnterPassword });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // For regular (Firebase) users, re-authenticate so updatePassword works later
      if (auth.currentUser) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordData.oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      const response = await api('/user/verify-password', {
        method: 'POST',
        body: JSON.stringify({ password: passwordData.oldPassword })
      });

      if (response.verified) {
        setStep(2);
        setMessage({ type: 'success', text: t.passwordVerified });
      }
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setMessage({ type: 'error', text: t.incorrectPassword });
      } else {
        setMessage({ type: 'error', text: err.message || t.incorrectPassword });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateNewPassword = () => {
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: t.passwordTooShort });
      return false;
    }
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      setMessage({ type: 'error', text: t.passwordUppercase });
      return false;
    }
    if (!/[0-9]/.test(passwordData.newPassword)) {
      setMessage({ type: 'error', text: t.passwordNumber });
      return false;
    }
    return true;
  };

  const handleSetNewPassword = () => {
    if (!validateNewPassword()) {
      return;
    }
    setStep(3);
    setMessage({ type: '', text: '' });
  };

  const handleConfirmPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t.passwordsDoNotMatch });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Update Firebase password for regular (non-admin) users
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, passwordData.newPassword);
      }

      // Update Flask backend password (always — covers admin too)
      const response = await api('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.success) {
        setMessage({ type: 'success', text: t.passwordChanged });
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || t.errorUpdating });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setMessage({ type: '', text: '' });
    } else {
      navigate('/profile');
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <div className="cp-step-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <h3>{t.verifyIdentity}</h3>
            <p className="cp-step-description">{t.enterCurrentPasswordDesc}</p>

            <div className="cp-input-group">
              <input
                type={showPassword.old ? 'text' : 'password'}
                name="oldPassword"
                placeholder={t.currentPasswordPlaceholder}
                value={passwordData.oldPassword}
                onChange={handleChange}
                className="form-control"
                autoFocus
              />
              <button
                type="button"
                className="cp-password-toggle"
                onClick={() => toggleShowPassword('old')}
              >
                <FontAwesomeIcon icon={showPassword.old ? faEyeSlash : faEye} />
              </button>
            </div>

            <button
              className="cp-btn"
              onClick={handleVerifyOldPassword}
              disabled={loading}
            >
              {loading ? t.verifyingLoading : t.verifyPasswordBtn}
            </button>
          </>
        );

      case 2:
        return (
          <>
            <div className="cp-step-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <h3>{t.createNewPassword}</h3>
            <p className="cp-step-description">{t.chooseStrongPasswordDesc}</p>

            <div className="cp-requirements">
              <p className={passwordData.newPassword.length >= 6 ? 'cp-valid' : ''}>
                ✓ {t.atLeast6Chars}
              </p>
              <p className={/[A-Z]/.test(passwordData.newPassword) ? 'cp-valid' : ''}>
                ✓ {t.atLeastOneUpper}
              </p>
              <p className={/[0-9]/.test(passwordData.newPassword) ? 'cp-valid' : ''}>
                ✓ {t.atLeastOneNum}
              </p>
            </div>

            <div className="cp-input-group">
              <input
                type={showPassword.new ? 'text' : 'password'}
                name="newPassword"
                placeholder={t.newPasswordPlaceholder}
                value={passwordData.newPassword}
                onChange={handleChange}
                className="form-control"
                autoFocus
              />
              <button
                type="button"
                className="cp-password-toggle"
                onClick={() => toggleShowPassword('new')}
              >
                <FontAwesomeIcon icon={showPassword.new ? faEyeSlash : faEye} />
              </button>
            </div>

            <button
              className="cp-btn"
              onClick={handleSetNewPassword}
            >
              {t.continueBtn}
            </button>
          </>
        );

      case 3:
        return (
          <>
            <div className="cp-step-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <h3>{t.confirmNewPasswordTitle}</h3>
            <p className="cp-step-description">{t.reenterPasswordDesc}</p>

            <div className="cp-input-group">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder={t.confirmPasswordPlaceholder}
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                autoFocus
              />
              <button
                type="button"
                className="cp-password-toggle"
                onClick={() => toggleShowPassword('confirm')}
              >
                <FontAwesomeIcon icon={showPassword.confirm ? faEyeSlash : faEye} />
              </button>
            </div>

            {passwordData.confirmPassword && (
              <div className="cp-match-indicator">
                {passwordData.newPassword === passwordData.confirmPassword ? (
                  <span className="cp-match">✓ {t.passwordsMatch}</span>
                ) : (
                  <span className="cp-no-match">✗ {t.passwordsDoNotMatch}</span>
                )}
              </div>
            )}

            <button
              className="cp-btn"
              onClick={handleConfirmPassword}
              disabled={loading || passwordData.newPassword !== passwordData.confirmPassword}
            >
              {loading ? t.changingPasswordLoading : t.changePassword}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cp-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="cp-card">
        <button className="cp-back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> {t.backBtn}
        </button>

        {message.text && (
          <div className={`cp-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="cp-step-indicator">
          <div className={`cp-step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`cp-step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`cp-step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`cp-step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`cp-step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default ChangePassword;
