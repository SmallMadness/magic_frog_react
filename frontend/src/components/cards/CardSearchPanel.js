import React from 'react';
import SearchBar from '../search/SearchBar';
import MagicCardKanban from './MagicCardKanban';

/**
 * Komponente für die Kartensuche und -anzeige
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Verfügbare Karten
 * @param {string} props.searchTerm - Suchbegriff
 * @param {Function} props.onSearchChange - Callback für Änderungen am Suchbegriff
 * @param {string} props.selectedCardType - Ausgewählter Kartentyp
 * @param {Function} props.setSelectedCardType - Setter für den ausgewählten Kartentyp
 * @param {string} props.selectedColor - Ausgewählte Farbe
 * @param {Function} props.setSelectedColor - Setter für die ausgewählte Farbe
 * @param {string} props.selectedRarity - Ausgewählte Seltenheit
 * @param {Function} props.setSelectedRarity - Setter für die ausgewählte Seltenheit
 * @param {Array} props.cardTypes - Verfügbare Kartentypen
 * @param {Array} props.cardColors - Verfügbare Kartenfarben
 * @param {Array} props.cardRarities - Verfügbare Seltenheiten
 * @param {Function} props.onAddCardToDeck - Callback zum Hinzufügen einer Karte zum Deck
 * @returns {JSX.Element} Die gerenderte Komponente
 */
function CardSearchPanel({
  cards,
  searchTerm,
  onSearchChange,
  selectedCardType,
  setSelectedCardType,
  selectedColor,
  setSelectedColor,
  selectedRarity,
  setSelectedRarity,
  cardTypes,
  cardColors,
  cardRarities,
  onAddCardToDeck
}) {
  // Filtere Karten basierend auf den ausgewählten Filtern
  const filteredCards = cards.filter(card => {
    // Suche nach Suchbegriff
    const matchesSearch = !searchTerm || 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      card.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Filtern nach Kartentyp
    if (selectedCardType && !card.type.toLowerCase().includes(selectedCardType.toLowerCase())) {
      return false;
    }
    
    // Filtern nach Farbe
    if (selectedColor && card.colors) {
      if (!card.colors.includes(selectedColor)) {
        return false;
      }
    }
    
    // Filtern nach Seltenheit
    if (selectedRarity && card.rarity.toLowerCase() !== selectedRarity.toLowerCase()) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="card-search-panel">
      <div className="search-filters">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
          placeholder="Kartenname, Text oder Typ suchen..."
        />
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="cardTypeFilter">Kartentyp:</label>
            <select
              id="cardTypeFilter"
              value={selectedCardType}
              onChange={(e) => setSelectedCardType(e.target.value)}
            >
              <option value="">Alle Typen</option>
              {cardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="colorFilter">Farbe:</label>
            <select
              id="colorFilter"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Alle Farben</option>
              {cardColors.map(color => (
                <option key={color.code} value={color.code}>{color.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="rarityFilter">Seltenheit:</label>
            <select
              id="rarityFilter"
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
            >
              <option value="">Alle Seltenheiten</option>
              {cardRarities.map(rarity => (
                <option key={rarity.code} value={rarity.code}>{rarity.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="search-results">
        <h3>Gefundene Karten: {filteredCards.length}</h3>
        
        <div className="card-grid">
          {filteredCards.length > 0 ? (
            filteredCards.map(card => (
              <MagicCardKanban
                key={card.id}
                card={card}
                onAddToDeck={() => onAddCardToDeck(card)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>Keine Karten gefunden. Versuche andere Suchkriterien.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardSearchPanel;
