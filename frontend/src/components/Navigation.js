import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';
import '../styles/Navigation.css';

/**
 * Navigationskomponente für die App
 * @returns {JSX.Element} Die gerenderte Navigationsleiste
 */
function Navigation() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

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
    setDropdownOpen(false);
    // Zur Startseite navigieren und Seite neu laden, um alle Zustände zurückzusetzen
    navigate('/', { replace: true });
    window.location.reload();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Schließe das Dropdown, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generiere Avatar-Initialen aus dem Benutzernamen
  const getInitials = (username) => {
    if (!username) return '';
    return username.charAt(0).toUpperCase();
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Magic Frog
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          </li>
          <li>
            <Link to="/deck-builder" className={location.pathname === '/deck-builder' ? 'nav-link active' : 'nav-link'}>Deck Builder</Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>Über</Link>
          </li>
          
          {isAdmin && (
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}>Admin</Link>
            </li>
          )}
          
          {!loading && (
            <>
              {user ? (
                <li className="profile-dropdown" ref={dropdownRef}>
                  <button className="profile-button" onClick={toggleDropdown}>
                    <div className="profile-avatar">
                      {getInitials(user.username)}
                    </div>
                  </button>
                  
                  <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{user.username}</p>
                      {user.email && <p className="dropdown-user-email">{user.email}</p>}
                    </div>
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Profil bearbeiten
                    </Link>
                    
                    <Link to="/deck-builder" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Meine Decks
                    </Link>
                    
                    <button onClick={handleLogout} className="dropdown-item danger">
                      Abmelden
                    </button>
                  </div>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="auth-button login-button">Anmelden</Link>
                  </li>
                  <li>
                    <Link to="/register" className="auth-button register-button">Registrieren</Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
