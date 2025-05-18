import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

/**
 * Navigationskomponente für die App
 * @returns {JSX.Element} Die gerenderte Navigationsleiste
 */
function Navigation() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Überprüfe den Authentifizierungsstatus bei jedem Rendering und Routenwechsel
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Prüfe, ob ein Token vorhanden ist
        const isAuth = authService.isAuthenticated();
        
        if (isAuth) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          
          if (currentUser) {
            // Direkte Überprüfung des Admin-Status ohne async/await
            const adminStatus = authService.isAdmin();
            setIsAdmin(adminStatus);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Benutzerstatus:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Prüfe den Auth-Status nur bei Routenwechsel und alle 5 Sekunden
    // Dies reduziert die Anzahl der Überprüfungen erheblich
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, [location.pathname]); // Führe den Effekt aus, wenn sich der Pfad ändert

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
    // Zur Startseite navigieren und Seite neu laden, um alle Zustände zurückzusetzen
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <nav className="main-nav">
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/deck-builder" className="nav-link">Deck Builder</Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">Über</Link>
        </li>
        
        {isAdmin && (
          <li>
            <Link to="/admin" className="nav-link">Admin</Link>
          </li>
        )}
        
        {!loading && (
          <>
            {user ? (
              <li className="auth-nav-item">
                <span className="user-greeting">Hallo, {user.username}</span>
                <button onClick={handleLogout} className="nav-link logout-button">
                  Abmelden
                </button>
              </li>
            ) : (
              <li className="auth-nav-item">
                <Link to="/login" className="nav-link">Anmelden</Link>
                <Link to="/register" className="nav-link register-link">Registrieren</Link>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
