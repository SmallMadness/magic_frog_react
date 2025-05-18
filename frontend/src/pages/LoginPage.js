import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import authService from '../services/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  if (loading) {
    return <div className="loading">Lade...</div>;
  }

  // Wenn der Benutzer bereits angemeldet ist, zur Startseite weiterleiten
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
