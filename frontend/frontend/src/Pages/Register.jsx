import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, setAuthToken } from '../lib/api';
import { auth, authActionSettings } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import mascotExcited from '../Assets/mascot_excited.png';
import MascotSparkle from '../Components/MascotSparkle';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showPasswords] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [tempLocalUser, setTempLocalUser] = useState(null);

  const [checks, setChecks] = useState({
    length: false, upper: false, lower: false, number: false, special: false 
  });

  useEffect(() => {
    const p = formData.password;
    setChecks({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(p) 
    });
  }, [formData.password]);

  // Polling to catch when the user clicks the verification link in their email
  useEffect(() => {
    let interval;
    if (verificationSent && auth.currentUser) {
      interval = setInterval(async () => {
        try {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            // Log the user into your global context and route to homepage
            setUser(tempLocalUser);
            navigate('/');
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(interval);
  }, [verificationSent, tempLocalUser, setUser, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!Object.values(checks).every(Boolean)) {
      return setError(language === 'ar' ? 'يرجى استيفاء جميع شروط كلمة المرور' : 'Please meet all password requirements');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError(t.passwordsDoNotMatch);
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user, authActionSettings);

      const data = await api('/register', { method: 'POST', body: JSON.stringify(formData) });
      setAuthToken(data.token);

      let registeredUser = data.user;
      if (profileImageFile && registeredUser) {
        try {
          const picFormData = new FormData();
          picFormData.append('image', profileImageFile);
          const picData = await api('/profile/picture', { method: 'POST', body: picFormData, isFormData: true });
          registeredUser = picData.user;
        } catch {
          // Account creation already succeeded; picture upload failure shouldn't block registration.
        }
      }

      setTempLocalUser(registeredUser);
      // Note: We DO NOT sign them out here anymore so we can poll their status
      setVerificationSent(true);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError(language === 'ar' ? 'هذا البريد الإلكتروني مستخدم بالفعل' : 'This email is already in use.');
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError(language === 'ar'
          ? 'تسجيل الدخول بالبريد الإلكتروني وكلمة المرور غير مفعّل في إعدادات Firebase لهذا المشروع.'
          : 'Email/Password sign-in is not enabled for this Firebase project yet.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!auth.currentUser || resendCooldown > 0) return;
    setResendStatus('');
    try {
      await sendEmailVerification(auth.currentUser, authActionSettings);
      setResendStatus(language === 'ar' ? 'تم إعادة إرسال رابط التفعيل.' : 'Verification email resent.');
      setResendCooldown(30);
    } catch (err) {
      setResendStatus(err.message);
    }
  };

  const ConditionItem = ({ met, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: met ? '#10b981' : '#ef4444', marginBottom: '4px', transition: 'color 0.3s ease' }}>
      <i className={`fas fa-${met ? 'check-circle' : 'times-circle'}`}></i>
      <span>{label}</span>
    </div>
  );

  return (
    <section className="auth-modern" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {!verificationSent ? (
        <div className="auth-box">
          <h1>{t.createAccount}</h1>
          <p className="auth-sub">{t.joinNow}</p>
          
          {error && <div style={{ padding: '0.8rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <label htmlFor="profile-upload" style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px dashed #cbd5e1', transition: 'border-color 0.3s' }}>
                  {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FontAwesomeIcon icon={faUser} style={{ color: '#94a3b8', fontSize: '3rem' }} />}
                </div>
                <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'var(--primary)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.8rem' }} />
                </div>
              </label>
              <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>

            <div className="form-group-row">
              <div className="form-group"><label>{t.firstName}</label><input type="text" name="firstname" className="form-control" value={formData.firstname} onChange={handleChange} required /></div>
              <div className="form-group"><label>{t.lastName}</label><input type="text" name="lastname" className="form-control" value={formData.lastname} onChange={handleChange} required /></div>
            </div>
            <div className="form-group" style={{ textAlign: 'left' }}><label>{t.email}</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required /></div>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'left' }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>{language === 'ar' ? 'متطلبات كلمة المرور:' : 'Password Requirements:'}</p>
              <ConditionItem met={checks.length} label={t.passwordTooShort} />
              <ConditionItem met={checks.upper} label={t.passwordUppercase} />
              <ConditionItem met={checks.lower} label={language === 'ar' ? 'حرف صغير واحد على الأقل' : 'At least one lowercase letter'} />
              <ConditionItem met={checks.number} label={t.passwordNumber} />
              <ConditionItem met={checks.special} label={language === 'ar' ? 'رمز خاص واحد على الأقل (#$@!)' : 'At least one special character (#$@!)'} />
            </div>

            <div className="form-group-row">
              <div className="form-group"><label>{t.password}</label><input type={showPasswords ? "text" : "password"} name="password" className="form-control" value={formData.password} onChange={handleChange} required /></div>
              <div className="form-group"><label>{t.confirmPassword}</label><input type={showPasswords ? "text" : "password"} name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required /></div>
            </div>

            <button type="submit" className="btn btn-primary full-width" disabled={loading}>{loading ? '...' : t.register}</button>
          </form>
        </div>
      ) : (
        <div className="auth-box">
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <MascotSparkle src={mascotExcited} alt="mascot" width="175px" wrapperStyle={{ margin: '0 auto 1rem auto' }} />
            <h2>{language === 'ar' ? 'في انتظار التفعيل...' : 'Waiting for Verification...'}</h2>
            <p style={{ color: '#64748B', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {language === 'ar'
                ? `لقد أرسلنا رابط تفعيل إلى ${formData.email}. يرجى النقر على الرابط، وسيقوم هذا الموقع بتسجيل دخولك تلقائياً.`
                : `We've sent a verification link to ${formData.email}. Please click the link, and this page will automatically log you in.`}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {language === 'ar' ? 'لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam).' : "Didn't get the email? Check your spam folder."}
            </p>
            {resendStatus && (
              <p style={{ color: resendStatus.includes('resent') || resendStatus.includes('إعادة') ? '#16a34a' : '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {resendStatus}
              </p>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `${language === 'ar' ? 'إعادة الإرسال بعد' : 'Resend in'} ${resendCooldown}s`
                : (language === 'ar' ? 'إعادة إرسال رابط التفعيل' : 'Resend verification email')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;