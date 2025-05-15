import React from 'react';

/**
 * Suchleisten-Komponente für die Kartensuche
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.searchTerm - Der aktuelle Suchbegriff
 * @param {function} props.onSearchChange - Callback-Funktion für Änderungen am Suchbegriff
 * @returns {JSX.Element} Die gerenderte Suchleiste
 */
function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <section className="search-section">
      <input
        type="text"
        placeholder="Karte suchen..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </section>
  );
}

export default SearchBar;
