import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import '../../styles/Auth.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(username, password);
      setLoading(false);
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      
      // Weiterleitung zur Startseite nach erfolgreicher Anmeldung
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.');
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-form-container">
      <h2>Anmelden</h2>
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Benutzername</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Anmeldung läuft...' : 'Anmelden'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          Noch kein Konto? 
          <button 
            className="text-button" 
            onClick={navigateToRegister}
            disabled={loading}
          >
            Registrieren
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
