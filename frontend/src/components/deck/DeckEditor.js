import React, { useState, useEffect } from 'react';
import { Loading, ErrorMessage } from '../common/Loading';
import DeckForm from './DeckForm';
import DeckCardList from './DeckCardList';
import DeckStats from './DeckStats';
import CardSearchPanel from '../cards/CardSearchPanel';
import useDeck from '../../hooks/useDeck';
import '../../styles/DeckEditor.css';

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
  // Verwende den useDeck-Hook für die Deck-Verwaltung
  const {
    deckName, setDeckName,
    deckFormat, setDeckFormat,
    deckDescription, setDeckDescription,
    mainDeck, sideboard,
    activeTab, setActiveTab,
    addCardToDeck,
    removeCardFromDeck,
    moveCardBetweenLists,
    compileDeckData
  } = useDeck(deck);
  
  // State für die Kartensuche und -filterung
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [loading] = useState(false);
  const [error] = useState(null);
  
  // Kartentypen, -farben und -seltenheiten für Filter
  const [cardTypes, setCardTypes] = useState([]);
  const cardColors = [
    { code: 'W', name: 'Weiß' },
    { code: 'U', name: 'Blau' },
    { code: 'B', name: 'Schwarz' },
    { code: 'R', name: 'Rot' },
    { code: 'G', name: 'Grün' },
    { code: 'C', name: 'Farblos' }
  ];
  const cardRarities = [
    { code: 'common', name: 'Gewöhnlich' },
    { code: 'uncommon', name: 'Ungewöhnlich' },
    { code: 'rare', name: 'Selten' },
    { code: 'mythic', name: 'Mythisch' }
  ];

  useEffect(() => {
    if (availableCards && availableCards.length > 0) {
      const types = new Set();
      availableCards.forEach(card => {
        if (card.type) {
          // Extrahiere den Haupttyp (z.B. "Creature" aus "Legendary Creature - Human Wizard")
          const mainType = card.type.split(' ')[0];
          types.add(mainType);
        }
      });
      setCardTypes(Array.from(types).sort());
    }
  }, [availableCards]);

  // Filtere Karten basierend auf Suchbegriff und Filtern
  // Diese gefilterten Karten werden an die CardSearchPanel-Komponente übergeben
  const availableFilteredCards = availableCards.filter(card => {
    // Suche im Namen, Text und Typ
    const nameMatch = !searchTerm || (
      (card.name && card.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.text && card.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.type && card.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Typfilter
    const typeMatch = !selectedCardType || 
      (card.type && card.type.toLowerCase().includes(selectedCardType.toLowerCase()));
    
    // Farbfilter
    const colorMatch = !selectedColor || 
      (card.colors && card.colors.includes(selectedColor));
    
    // Seltenheitsfilter
    const rarityMatch = selectedRarity ? 
      (card.rarity && card.rarity.toLowerCase() === selectedRarity.toLowerCase()) : true;
    
    return nameMatch && typeMatch && colorMatch && rarityMatch;
  });

  // Handler für das Hinzufügen einer Karte zum Deck
  const handleAddCard = (card) => {
    addCardToDeck(card, activeTab === 'side');
  };

  // Handler für das Entfernen einer Karte aus dem Deck
  const handleRemoveCard = (cardId, removeAll = false) => {
    removeCardFromDeck(cardId, activeTab === 'side', removeAll);
  };

  // Deck speichern
  const handleSave = () => {
    if (!deckName.trim()) {
      alert('Bitte gib einen Namen für das Deck ein.');
      return;
    }
    
    onSave(compileDeckData());
  };

  // Zähle die Karten im Deck
  const mainDeckCount = mainDeck.reduce((total, item) => total + item.quantity, 0);
  const sideboardCount = sideboard.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="deck-editor">
      {loading ? (
        <Loading message="Lade Daten..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <div className="deck-editor-header">
            <h2>{deck ? `Deck bearbeiten: ${deck.name}` : 'Neues Deck erstellen'}</h2>
            <div className="deck-editor-actions">
              <button className="btn btn-secondary" onClick={onCancel}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleSave}>Deck speichern</button>
            </div>
          </div>
          
          {/* Deck-Formular */}
          <DeckForm
            deckName={deckName}
            setDeckName={setDeckName}
            deckFormat={deckFormat}
            setDeckFormat={setDeckFormat}
            deckDescription={deckDescription}
            setDeckDescription={setDeckDescription}
          />
          
          <div className="deck-editor-content">
            <div className="deck-management-panel">
              {/* Tabs für Hauptdeck und Sideboard */}
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
              
              {/* Anzeige der Karten im aktiven Deck */}
              <DeckCardList
                cards={activeTab === 'main' ? mainDeck : sideboard}
                onRemoveCard={handleRemoveCard}
                onMoveCard={moveCardBetweenLists}
                source={activeTab === 'main' ? 'main' : 'side'}
                destination={activeTab === 'main' ? 'side' : 'main'}
              />
              
              {/* Deck-Statistiken */}
              {mainDeck.length > 0 && (
                <DeckStats mainDeck={mainDeck} />
              )}
            </div>
            
            {/* Kartensuche und -filterung */}
            <CardSearchPanel
              cards={availableFilteredCards}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCardType={selectedCardType}
              setSelectedCardType={setSelectedCardType}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
              cardTypes={cardTypes}
              cardColors={cardColors}
              cardRarities={cardRarities}
              onAddCardToDeck={handleAddCard}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default DeckEditor;
