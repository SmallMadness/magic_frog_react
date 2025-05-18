import React from 'react';
import '../../styles/FilterPanel.css';
import { ManaSymbol } from '../symbols/ManaSymbols';

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

  // Prüfen, ob Filter aktiv sind
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Kartentyp-Icons
  const typeIcons = {
    Artifact: '⚙️',
    Creature: '🐾',
    Enchantment: '✨',
    Instant: '⚡',
    Land: '🏞️',
    Planeswalker: '👤',
    Sorcery: '🔮'
  };

  return (
    <div className="filter-panel">
      <div className="filter-groups">
        {/* Kartentyp Filter */}
        <div className="filter-group">
          <label htmlFor="typeFilter">Typ:</label>
          <div className="select-wrapper">
            <select 
              id="typeFilter" 
              value={filters.type || ''} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              <option value="">Alle</option>
              {Object.entries(typeIcons).map(([type, icon]) => (
                <option key={type} value={type}>{icon} {type}</option>
              ))}
            </select>
            <span className="select-arrow">&#9662;</span>
          </div>
        </div>

        {/* Seltenheit Filter */}
        <div className="filter-group">
          <label htmlFor="rarityFilter">Seltenheit:</label>
          <div className="select-wrapper">
            <select 
              id="rarityFilter" 
              value={filters.rarity || ''} 
              onChange={(e) => handleFilterChange('rarity', e.target.value)}
              className="filter-select"
            >
              <option value="">Alle</option>
              <option value="Common">● Common</option>
              <option value="Uncommon">◆ Uncommon</option>
              <option value="Rare">★ Rare</option>
              <option value="Mythic">✧ Mythic</option>
            </select>
            <span className="select-arrow">&#9662;</span>
          </div>
        </div>

        {/* Set Filter */}
        <div className="filter-group">
          <label htmlFor="setFilter">Set:</label>
          <div className="select-wrapper">
            <select 
              id="setFilter" 
              value={filters.set || ''} 
              onChange={(e) => handleFilterChange('set', e.target.value)}
              className="filter-select"
            >
              <option value="">Alle</option>
              <option value="m21">Core Set 2021</option>
              <option value="znr">Zendikar Rising</option>
              <option value="khm">Kaldheim</option>
              <option value="stx">Strixhaven</option>
              <option value="afr">Adventures in the Forgotten Realms</option>
            </select>
            <span className="select-arrow">&#9662;</span>
          </div>
        </div>

        {/* Manakosten Filter */}
        <div className="filter-group">
          <label htmlFor="manaCostFilter">Mana:</label>
          <div className="select-wrapper">
            <select 
              id="manaCostFilter" 
              value={filters.manaCost || ''} 
              onChange={(e) => handleFilterChange('manaCost', e.target.value)}
              className="filter-select"
            >
              <option value="">Alle</option>
              {[0, 1, 2, 3, 4, 5].map(cost => (
                <option key={cost} value={cost.toString()}>
                  <span className="mana-option">{cost}</span>
                </option>
              ))}
              <option value="6+">6+</option>
            </select>
            <span className="select-arrow">&#9662;</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button 
        className={`reset-filters-button ${hasActiveFilters ? 'active' : 'inactive'}`}
        onClick={() => onFilterChange('reset')}
        disabled={!hasActiveFilters}
        title="Filter zurücksetzen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        <span>Zurücksetzen</span>
      </button>
    </div>
  );
}

export default FilterPanel;
