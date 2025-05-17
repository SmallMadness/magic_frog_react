import React, { useState, useEffect } from 'react';
import { Loading, ErrorMessage } from '../common/Loading';
import MagicCard from '../cards/MagicCard';

/**
 * Komponente zum Bearbeiten eines Decks
 * @param {Object} props - Die Props der Komponente
 * @param {Object} props.deck - Das zu bearbeitende Deck (null für ein neues Deck)
 * @param {Array} props.availableCards - Liste der verfügbaren Karten
 * @param {Function} props.onSave - Callback-Funktion zum Speichern des Decks
 * @param {Function} props.onCancel - Callback-Funktion zum Abbrechen der Bearbeitung
 * @returns {JSX.Element} Die gerenderte Deck-Editor-Komponente
 */
function DeckEditor({ deck, availableCards, onSave, onCancel }) {
  // Initialisiere State mit Deck-Daten oder Standardwerten für ein neues Deck
  const [deckName, setDeckName] = useState(deck ? deck.name : '');
  const [deckFormat, setDeckFormat] = useState(deck ? deck.format : 'Standard');
  const [deckDescription, setDeckDescription] = useState(deck ? deck.description : '');
  const [mainDeck, setMainDeck] = useState(deck ? deck.mainDeck || [] : []);
  const [sideboard, setSideboard] = useState(deck ? deck.sideboard || [] : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('main'); // 'main' oder 'side' für Hauptdeck oder Sideboard
  const [cardTypes, setCardTypes] = useState([]);
  const [cardColors, setCardColors] = useState([
    { code: 'W', name: 'Weiß' },
    { code: 'U', name: 'Blau' },
    { code: 'B', name: 'Schwarz' },
    { code: 'R', name: 'Rot' },
    { code: 'G', name: 'Grün' },
    { code: 'C', name: 'Farblos' }
  ]);
  const [cardRarities, setCardRarities] = useState([
    { code: 'common', name: 'Gewöhnlich' },
    { code: 'uncommon', name: 'Ungewöhnlich' },
    { code: 'rare', name: 'Selten' },
    { code: 'mythic', name: 'Mythisch' }
  ]);

  // Extrahiere einzigartige Kartentypen aus den verfügbaren Karten
  useEffect(() => {
    if (availableCards && availableCards.length > 0) {
      const types = new Set();
      availableCards.forEach(card => {
        if (card.type) {
          // Extrahiere Haupttypen (Kreatur, Spontanzauber, etc.)
          const mainTypes = card.type.split('\u2014')[0].trim(); // Teile am Gedankenstrich
          mainTypes.split(' ').forEach(type => types.add(type));
        }
      });
      setCardTypes(Array.from(types).sort());
    }
  }, [availableCards]);

  // Verfügbare Karten filtern
  const filteredCards = availableCards.filter(card => {
    // Namensfilter
    const nameMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Typenfilter
    const typeMatch = selectedCardType ? 
      card.type && card.type.toLowerCase().includes(selectedCardType.toLowerCase()) : true;
    
    // Farbenfilter
    let colorMatch = true;
    if (selectedColor) {
      if (selectedColor === 'C') { // Farblos
        colorMatch = !card.colors || card.colors.length === 0;
      } else {
        colorMatch = card.colors && card.colors.includes(selectedColor);
      }
    }
    
    // Seltenheitsfilter
    const rarityMatch = selectedRarity ? 
      card.rarity && card.rarity.toLowerCase() === selectedRarity.toLowerCase() : true;
    
    return nameMatch && typeMatch && colorMatch && rarityMatch;
  });

  // Karte zum Deck hinzufügen
  const addCardToDeck = (card, isSideboard = false) => {
    const targetDeck = isSideboard ? [...sideboard] : [...mainDeck];
    const existingCard = targetDeck.find(item => item.card.id === card.id);
    
    if (existingCard) {
      // Anzahl erhöhen, wenn die Karte bereits im Deck ist
      existingCard.quantity += 1;
    } else {
      // Neue Karte zum Deck hinzufügen
      targetDeck.push({
        card,
        quantity: 1
      });
    }
    
    if (isSideboard) {
      setSideboard(targetDeck);
    } else {
      setMainDeck(targetDeck);
    }
  };

  // Karte aus dem Deck entfernen
  const removeCardFromDeck = (cardId, isSideboard = false) => {
    const targetDeck = isSideboard ? [...sideboard] : [...mainDeck];
    const cardIndex = targetDeck.findIndex(item => item.card.id === cardId);
    
    if (cardIndex !== -1) {
      if (targetDeck[cardIndex].quantity > 1) {
        // Anzahl verringern, wenn mehr als eine Karte vorhanden ist
        targetDeck[cardIndex].quantity -= 1;
      } else {
        // Karte entfernen, wenn nur eine vorhanden ist
        targetDeck.splice(cardIndex, 1);
      }
      
      if (isSideboard) {
        setSideboard(targetDeck);
      } else {
        setMainDeck(targetDeck);
      }
    }
  };

  // Deck speichern
  const handleSave = () => {
    if (!deckName.trim()) {
      alert('Bitte gib einen Namen für das Deck ein.');
      return;
    }
    
    const deckData = {
      id: deck ? deck.id : null,
      name: deckName,
      format: deckFormat,
      description: deckDescription,
      mainDeck,
      sideboard
    };
    
    onSave(deckData);
  };

  // Berechne Deck-Statistiken
  const mainDeckCount = mainDeck.reduce((total, item) => total + item.quantity, 0);
  const sideboardCount = sideboard.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="deck-editor">
      {loading && <Loading message="Lade Deck-Daten..." />}
      {error && <ErrorMessage message={error} />}
      
      <div className="deck-editor-header">
        <h3>{deck ? `Deck bearbeiten: ${deck.name}` : 'Neues Deck erstellen'}</h3>
        <div className="deck-editor-actions">
          <button className="btn btn-primary" onClick={handleSave}>Speichern</button>
          <button className="btn btn-secondary" onClick={onCancel}>Abbrechen</button>
        </div>
      </div>
      
      <div className="deck-editor-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deckName">Deck-Name:</label>
            <input
              type="text"
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Gib deinem Deck einen Namen"
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deckFormat">Format:</label>
            <select
              id="deckFormat"
              value={deckFormat}
              onChange={(e) => setDeckFormat(e.target.value)}
              className="form-control"
            >
              <option value="Standard">Standard</option>
              <option value="Modern">Modern</option>
              <option value="Commander">Commander</option>
              <option value="Legacy">Legacy</option>
              <option value="Vintage">Vintage</option>
              <option value="Pauper">Pauper</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="deckDescription">Beschreibung:</label>
          <textarea
            id="deckDescription"
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            placeholder="Beschreibe dein Deck (optional)"
            className="form-control"
            rows="2"
          />
        </div>
      </div>
      
      <div className="deck-editor-content">
        <div className="deck-cards-panel">
          <div className="deck-tabs">
            <button 
              className={`tab-button ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => setActiveTab('main')}
            >
              Hauptdeck ({mainDeckCount})
            </button>
            <button 
              className={`tab-button ${activeTab === 'side' ? 'active' : ''}`}
              onClick={() => setActiveTab('side')}
            >
              Sideboard ({sideboardCount})
            </button>
          </div>
          
          <div className="deck-cards-container">
            {activeTab === 'main' ? (
              <div className="deck-main">
                {mainDeck.length === 0 ? (
                  <div className="empty-deck-message">
                    <p>Dein Hauptdeck ist leer. Füge Karten aus der Kartenliste hinzu.</p>
                  </div>
                ) : (
                  <ul className="deck-card-list">
                    {mainDeck.map(item => (
                      <li key={item.card.id} className="deck-card-item">
                        <span className="card-quantity">{item.quantity}x</span>
                        <span className="card-name">{item.card.name}</span>
                        <div className="card-item-actions">
                          <button 
                            className="btn-add" 
                            onClick={() => addCardToDeck(item.card)}
                            title="Karte hinzufügen"
                          >
                            +
                          </button>
                          <button 
                            className="btn-remove" 
                            onClick={() => removeCardFromDeck(item.card.id)}
                            title="Karte entfernen"
                          >
                            -
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="deck-sideboard">
                {sideboard.length === 0 ? (
                  <div className="empty-deck-message">
                    <p>Dein Sideboard ist leer. Füge Karten aus der Kartenliste hinzu.</p>
                  </div>
                ) : (
                  <ul className="deck-card-list">
                    {sideboard.map(item => (
                      <li key={item.card.id} className="deck-card-item">
                        <span className="card-quantity">{item.quantity}x</span>
                        <span className="card-name">{item.card.name}</span>
                        <div className="card-item-actions">
                          <button 
                            className="btn-add" 
                            onClick={() => addCardToDeck(item.card, true)}
                            title="Karte hinzufügen"
                          >
                            +
                          </button>
                          <button 
                            className="btn-remove" 
                            onClick={() => removeCardFromDeck(item.card.id, true)}
                            title="Karte entfernen"
                          >
                            -
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="card-browser">
          <h4>Karten durchsuchen</h4>
          
          <div className="card-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Kartenname suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label>Typ:</label>
                <select
                  value={selectedCardType}
                  onChange={(e) => setSelectedCardType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Alle Typen</option>
                  {cardTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Farbe:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Alle Farben</option>
                  {cardColors.map(color => (
                    <option key={color.code} value={color.code}>{color.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Seltenheit:</label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Alle Seltenheiten</option>
                  {cardRarities.map(rarity => (
                    <option key={rarity.code} value={rarity.code}>{rarity.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="available-cards">
            {filteredCards.length === 0 ? (
              <div className="no-cards-message">
                <p>Keine Karten gefunden. Versuche andere Filterkriterien.</p>
              </div>
            ) : (
              <div className="card-grid">
                {filteredCards.slice(0, 20).map(card => (
                  <MagicCard 
                    key={card.id} 
                    card={card} 
                    onAddToDeck={(card) => {
                      if (activeTab === 'main') {
                        addCardToDeck(card, false);
                      } else {
                        addCardToDeck(card, true);
                      }
                    }}
                  />
                ))}
              </div>
            )}
            {filteredCards.length > 20 && (
              <div className="more-cards-message">
                <p>Zeige 20 von {filteredCards.length} Karten. Verfeinere deine Suche für bessere Ergebnisse.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckEditor;
