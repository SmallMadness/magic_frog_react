import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import authService from '../services/auth';

/**
 * Profilseite für Benutzer, um ihre Einstellungen und Informationen zu verwalten
 * @returns {JSX.Element} Die gerenderte Profilseite
 */
function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Formularstatus für Profilbearbeitung
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Benachrichtigungsstatus
  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        
        if (!userData) {
          // Benutzer ist nicht eingeloggt, zur Login-Seite umleiten
          navigate('/login');
          return;
        }
        
        setUser(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        setNotification({
          type: 'error',
          message: 'Fehler beim Laden der Benutzerdaten. Bitte versuche es später erneut.'
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Profilinformationen aktualisieren
      const result = await authService.updateProfile({
        username: formData.username,
        email: formData.email
      });
      
      setUser(result);
      setNotification({
        type: 'success',
        message: 'Profil erfolgreich aktualisiert!'
      });
      
      // Benachrichtigung nach 3 Sekunden ausblenden
      setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
      setNotification({
        type: 'error',
        message: 'Fehler beim Aktualisieren des Profils. Bitte versuche es später erneut.'
      });
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Überprüfen, ob die Passwörter übereinstimmen
    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({
        type: 'error',
        message: 'Die neuen Passwörter stimmen nicht überein.'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Passwort ändern
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Formular zurücksetzen
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setNotification({
        type: 'success',
        message: 'Passwort erfolgreich geändert!'
      });
      
      // Benachrichtigung nach 3 Sekunden ausblenden
      setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      setNotification({
        type: 'error',
        message: 'Fehler beim Ändern des Passworts. Bitte überprüfe dein aktuelles Passwort.'
      });
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      try {
        setLoading(true);
        
        // Konto löschen
        await authService.deleteAccount();
        
        // Zur Startseite umleiten
        navigate('/');
      } catch (error) {
        console.error('Fehler beim Löschen des Kontos:', error);
        setNotification({
          type: 'error',
          message: 'Fehler beim Löschen des Kontos. Bitte versuche es später erneut.'
        });
        setLoading(false);
      }
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="loading-spinner"></div>
        <p>Lade Benutzerdaten...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Mein Profil</h1>
        
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            Profil
          </button>
          <button 
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleTabChange('security')}
          >
            Sicherheit
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => handleTabChange('preferences')}
          >
            Einstellungen
          </button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profilinformationen</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="username">Benutzername</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Wird aktualisiert...' : 'Profil aktualisieren'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="tab-content">
              <h2>Passwort ändern</h2>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Aktuelles Passwort</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Neues Passwort</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                  />
                  <small>Das Passwort muss mindestens 8 Zeichen lang sein.</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Passwort bestätigen</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Wird geändert...' : 'Passwort ändern'}
                  </button>
                </div>
              </form>
              
              <div className="danger-zone">
                <h3>Gefahrenzone</h3>
                <p>Wenn du dein Konto löschst, werden alle deine Daten unwiderruflich gelöscht.</p>
                <button 
                  className="btn-danger" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  Konto löschen
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <h2>Einstellungen</h2>
              <p>Hier können in Zukunft weitere Einstellungen hinzugefügt werden.</p>
              
              {/* Platzhalter für zukünftige Einstellungen */}
              <div className="placeholder-settings">
                <div className="setting-group">
                  <h3>Anzeigeeinstellungen</h3>
                  <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select id="theme" name="theme" disabled>
                      <option value="light">Hell</option>
                      <option value="dark">Dunkel</option>
                      <option value="system">Systemeinstellung</option>
                    </select>
                    <small>Diese Funktion wird bald verfügbar sein.</small>
                  </div>
                </div>
                
                <div className="setting-group">
                  <h3>Benachrichtigungen</h3>
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="emailNotifications" disabled />
                    <label htmlFor="emailNotifications">E-Mail-Benachrichtigungen</label>
                    <small>Diese Funktion wird bald verfügbar sein.</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
