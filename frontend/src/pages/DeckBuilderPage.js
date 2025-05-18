import React, { useState, useEffect } from 'react';
import DeckList from '../components/deck/DeckList';
import DeckEditor from '../components/deck/DeckEditor';
import { Loading, ErrorMessage } from '../components/common/Loading';
import { decksApi, cardsApi } from '../services/api';

/**
 * Deck Builder Seite
 * @returns {JSX.Element} Die gerenderte Deck Builder Seite
 */
function DeckBuilderPage() {
  // State für Decks und ausgewähltes Deck
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [availableCards, setAvailableCards] = useState([]);
  // const [selectedCard, setSelectedCard] = useState(null); // Auskommentiert, da aktuell nicht verwendet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Daten vom Backend laden
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Decks laden
        const decksResponse = await decksApi.getDecks();
        if (decksResponse) {
          setDecks(decksResponse);
        }
        
        // Karten laden (mit Paginierung, da es viele Karten gibt)
        const cardsResponse = await cardsApi.getCards({ limit: 100 });
        if (cardsResponse) {
          setAvailableCards(cardsResponse);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        setError('Fehler beim Laden der Daten. Bitte versuche es später erneut.');
        
        // Fallback zu Mock-Daten, falls die API nicht verfügbar ist
        // Dies ist nur für die Entwicklung und sollte in Produktion entfernt werden
        const mockDecks = [
          {
            id: 1,
            name: 'Mono-Rot Aggro',
            format: 'Standard',
            description: 'Ein schnelles Aggro-Deck mit roten Kreaturen und Direktschaden-Zaubern.',
            created_at: '2025-05-01T12:00:00Z',
            deck_cards: [
              { card: { id: 'card1', name: 'Goblin Guide', type: 'Creature', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=170987&type=card' }, quantity: 4, is_sideboard: false },
              { card: { id: 'card2', name: 'Lightning Bolt', type: 'Instant', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=397722&type=card' }, quantity: 4, is_sideboard: false },
              { card: { id: 'card3', name: 'Pyroclasm', type: 'Sorcery', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=208008&type=card' }, quantity: 3, is_sideboard: true }
            ]
          },
          {
            id: 2,
            name: 'Simic Ramp',
            format: 'Commander',
            description: 'Ein Ramp-Deck mit großen Kreaturen und Mana-Beschleunigung.',
            created_at: '2025-05-10T14:30:00Z',
            deck_cards: []
          }
        ];
        
        const mockCards = [
          { id: 'card1', name: 'Goblin Guide', mana_cost: '{R}', type: 'Creature — Goblin Scout', text: 'Haste\nWhenever Goblin Guide attacks, defending player reveals the top card of their library. If it\'s a land card, that player puts it into their hand.', power: '2', toughness: '2', rarity: 'Rare', set_name: 'Zendikar', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=170987&type=card' },
          { id: 'card2', name: 'Lightning Bolt', mana_cost: '{R}', type: 'Instant', text: 'Lightning Bolt deals 3 damage to any target.', rarity: 'Common', set_name: 'Magic 2011', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=397722&type=card' },
          { id: 'card3', name: 'Pyroclasm', mana_cost: '{1}{R}', type: 'Sorcery', text: 'Pyroclasm deals 2 damage to each creature.', rarity: 'Uncommon', set_name: 'Magic 2010', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=208008&type=card' },
          { id: 'card4', name: 'Birds of Paradise', mana_cost: '{G}', type: 'Creature — Bird', text: 'Flying\n{T}: Add one mana of any color.', power: '0', toughness: '1', rarity: 'Rare', set_name: 'Magic 2012', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=221896&type=card' },
          { id: 'card5', name: 'Counterspell', mana_cost: '{U}{U}', type: 'Instant', text: 'Counter target spell.', rarity: 'Common', set_name: 'Magic 2013', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=397731&type=card' },
          { id: 'card6', name: 'Wrath of God', mana_cost: '{2}{W}{W}', type: 'Sorcery', text: 'Destroy all creatures. They can\'t be regenerated.', rarity: 'Rare', set_name: 'Magic 2014', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=413580&type=card' },
          { id: 'card7', name: 'Thoughtseize', mana_cost: '{B}', type: 'Sorcery', text: 'Target player reveals their hand. You choose a nonland card from it. That player discards that card. You lose 2 life.', rarity: 'Rare', set_name: 'Theros', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=373632&type=card' },
          { id: 'card8', name: 'Sol Ring', mana_cost: '{1}', type: 'Artifact', text: '{T}: Add {C}{C}.', rarity: 'Uncommon', set_name: 'Commander', image_url: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=389683&type=card' }
        ];
        
        setDecks(mockDecks);
        setAvailableCards(mockCards);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Deck auswählen
  const handleSelectDeck = (deck) => {
    setSelectedDeck(deck);
    setIsCreatingDeck(false);
  };
  
  // Deck löschen
  const handleDeleteDeck = async (deckId) => {
    if (window.confirm('Möchtest du dieses Deck wirklich löschen?')) {
      try {
        setLoading(true);
        await decksApi.deleteDeck(deckId);
        setDecks(decks.filter(deck => deck.id !== deckId));
        if (selectedDeck && selectedDeck.id === deckId) {
          setSelectedDeck(null);
        }
      } catch (error) {
        console.error('Fehler beim Löschen des Decks:', error);
        setError('Fehler beim Löschen des Decks. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Neues Deck erstellen
  const handleCreateDeck = () => {
    setSelectedDeck(null);
    setIsCreatingDeck(true);
  };
  
  // Deck speichern
  const handleSaveDeck = async (deckData) => {
    try {
      setLoading(true);
      
      if (deckData.id) {
        // Bestehendes Deck aktualisieren
        const updatedDeck = await decksApi.updateDeck(deckData.id, deckData);
        setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
      } else {
        // Neues Deck erstellen
        const newDeck = await decksApi.createDeck(deckData);
        setDecks([...decks, newDeck]);
      }
      
      setSelectedDeck(null);
      setIsCreatingDeck(false);
    } catch (error) {
      console.error('Fehler beim Speichern des Decks:', error);
      setError('Fehler beim Speichern des Decks. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };
  
  // Anzahl der Karten im Deck zählen (aktuell nicht verwendet)
  /*
  const countCards = (deck) => {
    const mainDeckCount = deck.mainDeck.reduce((total, item) => total + item.quantity, 0);
    const sideboardCount = deck.sideboard.reduce((total, item) => total + item.quantity, 0);
    return mainDeckCount + sideboardCount;
  };
  */
  
  // Bearbeitung abbrechen
  const handleCancelEdit = () => {
    setSelectedDeck(null);
    setIsCreatingDeck(false);
  };
  
  return (
    <div className="deck-builder-container">
      <div className="deck-builder-header">
        <h2>Magic Deck Builder</h2>
        {!selectedDeck && !isCreatingDeck && (
          <button 
            className="btn btn-primary create-deck-btn" 
            onClick={handleCreateDeck}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Neues Deck erstellen
          </button>
        )}
      </div>
      
      {loading && <Loading message="Lade Deck-Daten..." />}
      {error && <ErrorMessage message={error} />}
      
      {!loading && !error && (
        <div className="deck-builder-content">
          {!selectedDeck && !isCreatingDeck ? (
            <div className="deck-list-view">
              <div className="deck-list-header">
                <h3>Deine Decks</h3>
              </div>
              
              {decks.length === 0 ? (
                <div className="empty-decks-message">
                  <p>Du hast noch keine Decks erstellt. Klicke auf "Neues Deck erstellen", um zu beginnen.</p>
                </div>
              ) : (
                <DeckList 
                  decks={decks} 
                  onSelectDeck={handleSelectDeck} 
                  onDeleteDeck={handleDeleteDeck} 
                />
              )}
            </div>
          ) : (
            <div className="deck-editor-view">
              <DeckEditor 
                deck={selectedDeck} 
                availableCards={availableCards} 
                onSave={handleSaveDeck} 
                onCancel={handleCancelEdit} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DeckBuilderPage;
