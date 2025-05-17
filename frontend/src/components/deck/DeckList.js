import React from 'react';
import { Loading } from '../common/Loading';

/**
 * Komponente zur Anzeige einer Liste von Decks
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.decks - Die Liste der anzuzeigenden Decks
 * @param {Function} props.onSelectDeck - Callback-Funktion für die Auswahl eines Decks
 * @param {Function} props.onDeleteDeck - Callback-Funktion für das Löschen eines Decks
 * @param {Boolean} props.loading - Gibt an, ob die Daten noch geladen werden
 * @returns {JSX.Element} Die gerenderte Deck-Liste
 */
function DeckList({ decks, onSelectDeck, onDeleteDeck, loading }) {
  // Berechne Statistiken für jedes Deck
  const calculateDeckStats = (deck) => {
    let mainDeckCount = 0;
    let sideboardCount = 0;
    let colorIdentity = new Set();
    
    // Wenn deck_cards vorhanden ist (API-Format)
    if (deck.deck_cards && Array.isArray(deck.deck_cards)) {
      deck.deck_cards.forEach(item => {
        if (item.is_sideboard) {
          sideboardCount += item.quantity;
        } else {
          mainDeckCount += item.quantity;
        }
        
        // Farben zur Color Identity hinzufügen
        if (item.card && item.card.colors) {
          item.card.colors.forEach(color => colorIdentity.add(color));
        }
      });
    } 
    // Wenn mainDeck und sideboard vorhanden sind (Frontend-Format)
    else if (deck.mainDeck || deck.sideboard) {
      if (deck.mainDeck) {
        mainDeckCount = deck.mainDeck.reduce((total, item) => total + item.quantity, 0);
        deck.mainDeck.forEach(item => {
          if (item.card && item.card.colors) {
            item.card.colors.forEach(color => colorIdentity.add(color));
          }
        });
      }
      
      if (deck.sideboard) {
        sideboardCount = deck.sideboard.reduce((total, item) => total + item.quantity, 0);
      }
    }
    
    return {
      mainDeckCount,
      sideboardCount,
      totalCount: mainDeckCount + sideboardCount,
      colorIdentity: Array.from(colorIdentity)
    };
  };
  
  // Funktion zum Rendern der Farbidentität
  const renderColorIdentity = (colors) => {
    if (!colors || colors.length === 0) return <span className="color-identity color-colorless">C</span>;
    
    const colorMap = {
      'W': 'white',
      'U': 'blue',
      'B': 'black',
      'R': 'red',
      'G': 'green'
    };
    
    return colors.map(color => (
      <span key={color} className={`color-identity color-${colorMap[color] || 'colorless'}`}>
        {color}
      </span>
    ));
  };
  
  if (loading) {
    return <Loading message="Lade Decks..." />;
  }
  
  if (!decks || decks.length === 0) {
    return (
      <div className="deck-list-empty">
        <p>Keine Decks vorhanden. Erstelle dein erstes Deck!</p>
      </div>
    );
  }

  return (
    <div className="deck-list">
      <ul className="deck-items">
        {decks.map(deck => {
          const stats = calculateDeckStats(deck);
          const createdDate = deck.createdAt || deck.created_at;
          
          return (
            <li key={deck.id} className="deck-item">
              <div className="deck-item-header">
                <div className="deck-color-identity">
                  {renderColorIdentity(stats.colorIdentity)}
                </div>
                <div className="deck-format-badge">{deck.format}</div>
              </div>
              
              <div className="deck-item-content">
                <h4 className="deck-name">{deck.name}</h4>
                <p className="deck-description">{deck.description}</p>
                
                <div className="deck-stats">
                  <div className="stat-item">
                    <span className="stat-label">Hauptdeck:</span>
                    <span className="stat-value">{stats.mainDeckCount} Karten</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Sideboard:</span>
                    <span className="stat-value">{stats.sideboardCount} Karten</span>
                  </div>
                  
                  {createdDate && (
                    <div className="stat-item">
                      <span className="stat-label">Erstellt:</span>
                      <span className="stat-value">
                        {new Date(createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="deck-item-actions">
                <button 
                  className="btn btn-primary deck-edit-btn" 
                  onClick={() => onSelectDeck(deck)}
                  title="Deck bearbeiten"
                >
                  <i className="fas fa-edit"></i> Bearbeiten
                </button>
                <button 
                  className="btn btn-danger deck-delete-btn" 
                  onClick={() => onDeleteDeck(deck.id)}
                  title="Deck löschen"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DeckList;
