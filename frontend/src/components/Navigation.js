import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigationskomponente für die App
 * @returns {JSX.Element} Die gerenderte Navigationsleiste
 */
function Navigation() {
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
      </ul>
    </nav>
  );
}

export default Navigation;
