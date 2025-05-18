import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

/**
 * Geschützte Route-Komponente, die prüft, ob der Benutzer angemeldet ist
 * und optional, ob er Admin-Rechte hat
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Prüfe, ob der Benutzer angemeldet ist
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        // Wenn Admin-Rechte erforderlich sind, prüfe auch diese
        if (requireAdmin && isAuth) {
          // Direkte Überprüfung des Admin-Status
          const adminStatus = authService.isAdmin();
          setIsAdmin(adminStatus);
        } else if (!requireAdmin) {
          // Wenn keine Admin-Rechte erforderlich sind, setze isAdmin auf true
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Fehler bei der Authentifizierungsprüfung:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Prüfe den Auth-Status nur bei Routenwechsel und gelegentlich
    const interval = setInterval(checkAuth, 5000); // Prüfe alle 5 Sekunden
    
    return () => clearInterval(interval);
  }, [requireAdmin, location.pathname]);

  if (isLoading) {
    return <div className="loading">Lade...</div>;
  }

  if (!isAuthenticated) {
    // Wenn nicht angemeldet, zur Login-Seite weiterleiten
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Wenn Admin-Rechte erforderlich sind, aber der Benutzer kein Admin ist
    alert('Sie haben keine Berechtigung, auf diese Seite zuzugreifen.');
    return <Navigate to="/" replace />;
  }

  // Wenn alle Prüfungen bestanden wurden, zeige die geschützte Komponente an
  return children;
};

export default ProtectedRoute;
