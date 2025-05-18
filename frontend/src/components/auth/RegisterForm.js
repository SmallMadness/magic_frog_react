import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import '../../styles/Auth.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Überprüfen, ob die Passwörter übereinstimmen
    if (formData.password !== formData.password_confirm) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    
    setLoading(true);

    try {
      await authService.register(formData);
      setLoading(false);
      
      // Nach erfolgreicher Registrierung zur Login-Seite weiterleiten
      navigate('/login', { state: { message: 'Registrierung erfolgreich! Du kannst dich jetzt anmelden.' } });
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Registrierung fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-form-container">
      <h2>Registrieren</h2>
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Benutzername</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            disabled={loading}
          />
          <small>Mindestens 8 Zeichen</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="password_confirm">Passwort bestätigen</label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Registrierung läuft...' : 'Registrieren'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          Bereits registriert? 
          <button 
            className="text-button" 
            onClick={navigateToLogin}
            disabled={loading}
          >
            Anmelden
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
