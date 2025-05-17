import React from 'react';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/filters/FilterPanel';
import CardGrid from '../components/cards/CardGrid';
import { Loading, ErrorMessage } from '../components/common/Loading';

/**
 * Homepage-Komponente, die die Kartensammlung anzeigt
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.searchTerm - Der aktuelle Suchbegriff
 * @param {Function} props.onSearchChange - Callback-Funktion für Änderungen am Suchbegriff
 * @param {Object} props.filters - Die aktuellen Filter
 * @param {Function} props.onFilterChange - Callback-Funktion für Änderungen an den Filtern
 * @param {Array} props.filteredCards - Die gefilterten Karten
 * @param {boolean} props.loading - Gibt an, ob Daten geladen werden
 * @param {string} props.error - Fehlermeldung, falls vorhanden
 * @returns {JSX.Element} Die gerenderte Homepage
 */
function HomePage({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  filteredCards,
  loading,
  error
}) {
  return (
    <div className="home-page-container">
      <div className="search-filter-container">
        <div className="search-section">
          <h2>Magic Kartensammlung</h2>
          {/* Suchleiste */}
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
            placeholder="Kartenname, Text oder Typ suchen..."
          />
        </div>
        
        {/* Filterpanel */}
        <FilterPanel 
          filters={filters} 
          onFilterChange={onFilterChange} 
        />
      </div>
      
      <section className="card-display">
        {loading ? (
          <Loading message="Lade Karten..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <div className="card-display-header">
              <h3>Gefundene Karten: {filteredCards.length}</h3>
              {filteredCards.length > 0 && (
                <div className="card-sort-options">
                  <label htmlFor="sortOrder">Sortieren nach:</label>
                  <select id="sortOrder" className="sort-select">
                    <option value="name">Name</option>
                    <option value="cmc">Manawert</option>
                    <option value="rarity">Seltenheit</option>
                    <option value="type">Kartentyp</option>
                  </select>
                </div>
              )}
            </div>
            
            {filteredCards.length === 0 ? (
              <div className="no-cards-message">
                <p>Keine Karten gefunden. Versuche andere Suchkriterien oder Filter.</p>
              </div>
            ) : (
              <CardGrid cards={filteredCards} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;
