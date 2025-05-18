import React from 'react';
import SearchBar from '../search/SearchBar';

/**
 * Hero-Sektion für die Homepage
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.searchTerm - Der aktuelle Suchbegriff
 * @param {Function} props.onSearchChange - Callback für Änderungen am Suchbegriff
 * @returns {JSX.Element} Die gerenderte Hero-Sektion
 */
function HeroSection({ searchTerm, onSearchChange }) {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Magic Kartensammlung</h1>
          <p className="subtitle">Durchsuche und verwalte deine Magic: The Gathering Karten</p>
        </div>
        <div className="main-search-container">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
            placeholder="Kartenname, Text oder Typ suchen..."
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
