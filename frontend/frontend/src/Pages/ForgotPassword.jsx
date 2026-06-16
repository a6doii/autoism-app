import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { auth, authActionSettings } from '../lib/firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');

  const [errorCode, setErrorCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCode('');
    setIsSuccess(false);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, authActionSettings);
      setIsSuccess(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setErrorCode('not-found');
      } else {
        setErrorCode(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (isSuccess) setIsSuccess(false);
    if (errorCode) setErrorCode('');
  };

  return (
    <section className="auth-modern" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.8rem', color: 'var(--primary)' }} />
          </div>
          <h2>{language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}</h2>
          <p className="auth-sub" style={{ marginTop: '0.5rem' }}>
            {language === 'ar'
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.'
              : 'Enter your email address and we will send you a link to reset your password.'}
          </p>
        </div>

        {errorCode && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {errorCode === 'not-found'
              ? (language === 'ar' ? 'لم يتم العثور على حساب بهذا البريد الإلكتروني.' : 'No account found with this email.')
              : errorCode}
          </div>
        )}

        {isSuccess && (
          <div style={{ padding: '1rem', background: '#dcfce7', color: '#16a34a', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {language === 'ar'
              ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
              : 'Password reset link sent to your email.'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label>{t.email || 'Email'}</label>
            <input
              type="email"
              className="form-control"
              placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary full-width" disabled={loading || isSuccess}>
            {loading
              ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...')
              : (language === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
