import React from 'react';
import '../../styles/SearchBar.css';

/**
 * Suchleisten-Komponente für die Kartensuche
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.searchTerm - Der aktuelle Suchbegriff
 * @param {function} props.onSearchChange - Callback-Funktion für Änderungen am Suchbegriff
 * @param {string} props.placeholder - Placeholder-Text für die Suchleiste
 * @returns {JSX.Element} Die gerenderte Suchleiste
 */
function SearchBar({ searchTerm, onSearchChange, placeholder = "Karte suchen..." }) {
  const handleClear = () => {
    onSearchChange('');
  };
  
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-button" onClick={handleClear} aria-label="Suche zurücksetzen">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
