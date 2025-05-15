import React from 'react';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/filters/FilterPanel';
import CardGrid from '../components/cards/CardGrid';

/**
 * Homepage-Komponente, die die Kartensammlung anzeigt
 * @param {Object} props - Die Props der Komponente
 * @returns {JSX.Element} Die gerenderte Homepage
 */
function HomePage({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  filteredCards 
}) {
  return (
    <>
      <div className="search-filter-container">
        {/* Suchleiste */}
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
        
        {/* Filterpanel */}
        <FilterPanel 
          filters={filters} 
          onFilterChange={onFilterChange} 
        />
      </div>
      
      <section className="card-display">
        <h2>Kartensammlung ({filteredCards.length} Karten)</h2>
        <CardGrid cards={filteredCards} />
      </section>
    </>
  );
}

export default HomePage;
