import React from 'react';

/**
 * Komponente für erweiterte Filteroptionen
 * @param {Object} props - Die Props der Komponente
 * @param {Object} props.filters - Aktueller Filterzustand
 * @param {Function} props.onFilterChange - Callback für Filteränderungen
 * @returns {JSX.Element} Das gerenderte Filterpanel
 */
function FilterPanel({ filters, onFilterChange }) {
  // Handler für Änderungen an Dropdown-Filtern
  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  return (
    <div className="filter-panel">
      <h3>Filter</h3>
      <div className="filter-options">
        {/* Kartentyp Filter */}
        <div className="filter-group">
          <label htmlFor="typeFilter">Kartentyp:</label>
          <select 
            id="typeFilter" 
            value={filters.type || ''} 
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Alle Typen</option>
            <option value="Artifact">Artifact</option>
            <option value="Creature">Creature</option>
            <option value="Enchantment">Enchantment</option>
            <option value="Instant">Instant</option>
            <option value="Land">Land</option>
            <option value="Planeswalker">Planeswalker</option>
            <option value="Sorcery">Sorcery</option>
          </select>
        </div>

        {/* Seltenheit Filter */}
        <div className="filter-group">
          <label htmlFor="rarityFilter">Seltenheit:</label>
          <select 
            id="rarityFilter" 
            value={filters.rarity || ''} 
            onChange={(e) => handleFilterChange('rarity', e.target.value)}
          >
            <option value="">Alle Seltenheiten</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Mythic">Mythic Rare</option>
          </select>
        </div>

        {/* Set Filter */}
        <div className="filter-group">
          <label htmlFor="setFilter">Set:</label>
          <select 
            id="setFilter" 
            value={filters.set || ''} 
            onChange={(e) => handleFilterChange('set', e.target.value)}
          >
            <option value="">Alle Sets</option>
            <option value="Alpha">Alpha</option>
            <option value="Masters 25">Masters 25</option>
            <option value="Mystery Booster">Mystery Booster</option>
            <option value="Iconic Masters">Iconic Masters</option>
          </select>
        </div>

        {/* Manakosten Filter (vereinfacht) */}
        <div className="filter-group">
          <label htmlFor="manaFilter">Manakosten:</label>
          <select 
            id="manaFilter" 
            value={filters.manaCost || ''} 
            onChange={(e) => handleFilterChange('manaCost', e.target.value)}
          >
            <option value="">Alle Kosten</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      {/* Reset-Button für Filter */}
      <button 
        className="reset-filters-btn"
        onClick={() => onFilterChange('reset')}
      >
        Filter zurücksetzen
      </button>
    </div>
  );
}

export default FilterPanel;
