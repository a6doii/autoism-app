import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { api, staticUrl } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ fullName: '', email: '', dateOfBirth: '', sex: '' });
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        email: user.email || '',
        dateOfBirth: user.dob || '',
        sex: user.sex || '',
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const data = await api('/profile/picture', { method: 'POST', body: formData, isFormData: true });
      setUser(data.user);
    } catch (err) {
      setMessage(err.message || t.errorUpdating);
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!isEditing) return setIsEditing(true);
    const [firstName, ...rest] = profileData.fullName.split(' ');
    const lastName = rest.join(' ') || '-';
    try {
      const data = await api('/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, email: profileData.email, dateOfBirth: profileData.dateOfBirth, sex: profileData.sex }),
      });
      setUser(data.user);
      setMessage(t.profileUpdated);
      setIsEditing(false);
      
      setTimeout(() => {
        setMessage('');
      }, 1000);
    } catch (error) {
      setMessage(t.errorUpdating);
      
      setTimeout(() => {
        setMessage('');
      }, 1000);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log('Navigating to change password...');
    navigate('/profile/change-password', { replace: false });
  };

  return (
    <div className="container" style={{ maxWidth: 'min(800px, 90%)', paddingTop: 'clamp(1rem, 4vw, 2rem)', paddingBottom: 'clamp(1rem, 4vw, 2rem)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
        <div 
          style={{ 
            width: 'clamp(80px, 15vw, 120px)', 
            height: 'clamp(80px, 15vw, 120px)', 
            background: 'var(--primary)', 
            borderRadius: '50%', 
            display: 'inline-flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            marginBottom: 'clamp(0.5rem, 2vw, 1rem)', 
            color: 'white',
            overflow: 'hidden',
            cursor: isEditing ? 'pointer' : 'default'
          }}
          onClick={() => isEditing && document.getElementById('profile-upload').click()}
        >
          {uploadingImage ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : user?.profile_image ? (
            <img src={staticUrl(user.profile_image)} alt={t.myProfile} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </div>
        <input 
          type="file" 
          id="profile-upload" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleImageUpload} 
        />
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{t.myProfile}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{t.manageAccount}</p>
      </div>
      
      {message && (
        <p style={{ 
          color: message.includes('Error') || message.includes('خطأ') ? 'var(--danger)' : 'var(--success)', 
          marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
      
      <div className="form-container" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
        <div className="form-group" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <label style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{t.fullName}</label>
          <input 
            type="text" 
            name="fullName" 
            className="form-control" 
            value={profileData.fullName} 
            disabled={!isEditing} 
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <label style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{t.emailAddress}</label>
          <input 
            type="email" 
            name="email" 
            className="form-control" 
            value={profileData.email} 
            disabled={!isEditing} 
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <label style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{t.dateOfBirth}</label>
          <input 
            type="date" 
            name="dateOfBirth" 
            className="form-control" 
            value={profileData.dateOfBirth} 
            disabled={!isEditing} 
            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)' }}>
          <label style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{t.sex}</label>
          <select 
            className="form-control" 
            value={profileData.sex} 
            disabled={!isEditing} 
            onChange={(e) => setProfileData({ ...profileData, sex: e.target.value })}
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          >
            <option value="" disabled>{t.selectSex || '— Select —'}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', marginTop: 'clamp(0.5rem, 2vw, 1rem)' }}>
          <button 
            className="btn btn-secondary" 
            style={{ 
              flex: 1, 
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)'
            }} 
            onClick={handleSave}
          >
            {isEditing ? t.saveProfile : t.editProfile}
          </button>
          
          {isEditing && (
            <button 
              className="btn btn-primary" 
              style={{ 
                flex: 1,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)'
              }} 
              onClick={handleChangePassword}
              type="button"
            >
              {t.changePassword}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;