import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";


const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (formData.email === 'admin1') {
        const data = await api('/login', { method: 'POST', body: JSON.stringify(formData) });
        setUser(data.user);
        return navigate('/admin');
      }

      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const fbUser = userCredential.user;

      if (!fbUser.emailVerified) {
        await signOut(auth);
        throw new Error(language === 'ar' ? 'يرجى تفعيل حسابك من الرابط المرسل إلى بريدك الإلكتروني أولاً.' : 'Please verify your account using the link sent to your email first.');
      }

      const data = await api('/login', { method: 'POST', body: JSON.stringify(formData) });
      
      if (trustDevice) {
        localStorage.setItem(`trustedDevice_${formData.email}`, 'true');
      }

      setUser(data.user);
      navigate(data.user?.is_admin ? '/admin' : '/cases');
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getEmailPlaceholder = () => {
    if (language === 'ar') return 'example@email.com أو admin1';
    return 'your.email@example.com or admin1';
  };

  return (
    <section className="auth-modern" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="auth-box">
        <h1>{t.loginTitle || 'Welcome Back'}</h1>
        <p className="auth-sub">{t.loginSubtitle || 'Please sign in to your account'}</p>
        
        {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>{t.email || 'Email'}</label>
            <input 
              type="text" 
              name="email" 
              className="form-control" 
              placeholder={getEmailPlaceholder()}
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label>{t.password || 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className="form-control" 
                placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', position: 'absolute', right: language === 'ar' ? 'auto' : '12px', left: language === 'ar' ? '12px' : 'auto', top: '50%', transform: 'translateY(-50%)' }}>
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </span>
            </div>
            
            {/* ROUTING TO NEW FORGOT PASSWORD PAGE */}
            <div style={{ display: 'flex', justifyContent: language === 'ar' ? 'flex-start' : 'flex-end', marginTop: '0.5rem' }}>
              <span 
                onClick={() => navigate('/forgot-password')} 
                style={{ color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
              >
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </span>
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <input 
              type="checkbox" 
              id="trustDevice" 
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="trustDevice" style={{ margin: 0, fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)' }}>
              {language === 'ar' ? 'الوثوق بهذا المتصفح (تخطي التحقق مستقبلاً)' : 'Trust this device (skip verification next time)'}
            </label>
          </div>

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...') : (t.login || 'Login')}
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: '#64748B' }}>
          {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/register')}>
            {language === 'ar' ? 'إنشاء حساب' : 'Register'}
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
