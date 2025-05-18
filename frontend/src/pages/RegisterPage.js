import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import authService from '../services/auth';

const RegisterPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Lade...</div>;
  }

  // Wenn der Benutzer bereits angemeldet ist, zur Startseite weiterleiten
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="register-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
