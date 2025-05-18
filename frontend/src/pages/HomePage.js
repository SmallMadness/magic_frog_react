import React, { useState } from 'react';
import FilterPanel from '../components/filters/FilterPanel';
import CardKanbanBoard from '../components/cards/CardKanbanBoard';
import { Loading, ErrorMessage } from '../components/common/Loading';
import HeroSection from '../components/ui/HeroSection';
import '../styles/HomePage.css';

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
  const [sortOrder, setSortOrder] = useState('name');

  // Handler für Änderungen an der Sortierung
  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    // Hier könnte die Sortierlogik implementiert werden
  };

  return (
    <div className="home-page-container">
      {/* Hero-Sektion mit Titel und Suchleiste */}
      <HeroSection 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
      />

      <div className="content-area">
        <aside className="filter-sidebar">
          <h2>Filter</h2>
          <FilterPanel 
            filters={filters} 
            onFilterChange={onFilterChange} 
          />
        </aside>
        
        <main className="card-display-area">
          {loading ? (
            <Loading message="Lade Karten..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <>
              {filteredCards.length > 0 ? (
                <CardKanbanBoard 
                  cards={filteredCards} 
                  onAddCardToDeck={(card) => console.log('Karte zum Deck hinzufügen:', card)}
                />
              ) : (
                <div className="no-results">
                  <p>Keine Karten gefunden. Versuche andere Suchkriterien.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
