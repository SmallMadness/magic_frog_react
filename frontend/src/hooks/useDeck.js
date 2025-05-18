import { useState, useCallback } from 'react';

/**
 * Custom Hook für die Deck-Verwaltung
 * @param {Object} initialDeck - Das initiale Deck (oder null für ein neues Deck)
 * @returns {Object} Deck-Funktionen und -Zustände
 */
const useDeck = (initialDeck = null) => {
  // Initialisiere State mit Deck-Daten oder Standardwerten für ein neues Deck
  const [deckName, setDeckName] = useState(initialDeck ? initialDeck.name : '');
  const [deckFormat, setDeckFormat] = useState(initialDeck ? initialDeck.format : 'Standard');
  const [deckDescription, setDeckDescription] = useState(initialDeck ? initialDeck.description : '');
  const [mainDeck, setMainDeck] = useState(initialDeck ? initialDeck.mainDeck || [] : []);
  const [sideboard, setSideboard] = useState(initialDeck ? initialDeck.sideboard || [] : []);
  const [activeTab, setActiveTab] = useState('main'); // 'main' oder 'side' für Hauptdeck oder Sideboard

  // Karte zum Deck hinzufügen
  const addCardToDeck = useCallback((card, destination = 'main') => {
    const updateDeckList = destination === 'main' ? setMainDeck : setSideboard;
    const deckList = destination === 'main' ? mainDeck : sideboard;
    
    // Prüfen, ob die Karte bereits im Deck ist
    const existingCardIndex = deckList.findIndex(item => item.card.id === card.id);
    
    if (existingCardIndex >= 0) {
      // Karte ist bereits im Deck, erhöhe die Anzahl
      const updatedList = [...deckList];
      updatedList[existingCardIndex] = {
        ...updatedList[existingCardIndex],
        quantity: updatedList[existingCardIndex].quantity + 1
      };
      updateDeckList(updatedList);
    } else {
      // Karte ist noch nicht im Deck, füge sie hinzu
      updateDeckList([...deckList, { card, quantity: 1 }]);
    }
  }, [mainDeck, sideboard]);

  // Karte aus dem Deck entfernen
  const removeCardFromDeck = useCallback((cardId, destination = 'main', removeAll = false) => {
    const updateDeckList = destination === 'main' ? setMainDeck : setSideboard;
    const deckList = destination === 'main' ? mainDeck : sideboard;
    
    const existingCardIndex = deckList.findIndex(item => item.card.id === cardId);
    
    if (existingCardIndex >= 0) {
      const updatedList = [...deckList];
      
      if (removeAll || updatedList[existingCardIndex].quantity === 1) {
        // Entferne die Karte vollständig
        updatedList.splice(existingCardIndex, 1);
      } else {
        // Reduziere die Anzahl um 1
        updatedList[existingCardIndex] = {
          ...updatedList[existingCardIndex],
          quantity: updatedList[existingCardIndex].quantity - 1
        };
      }
      
      updateDeckList(updatedList);
    }
  }, [mainDeck, sideboard]);

  // Karte zwischen Hauptdeck und Sideboard verschieben
  const moveCardBetweenLists = useCallback((cardId, source, destination) => {
    const sourceList = source === 'main' ? mainDeck : sideboard;
    const cardToMove = sourceList.find(item => item.card.id === cardId);
    
    if (cardToMove) {
      // Entferne die Karte aus der Quellliste
      removeCardFromDeck(cardId, source, true);
      
      // Füge die Karte zur Zielliste hinzu
      const updateDeckList = destination === 'main' ? setMainDeck : setSideboard;
      const destList = destination === 'main' ? mainDeck : sideboard;
      
      const existingCardIndex = destList.findIndex(item => item.card.id === cardId);
      
      if (existingCardIndex >= 0) {
        // Karte ist bereits in der Zielliste, erhöhe die Anzahl
        const updatedList = [...destList];
        updatedList[existingCardIndex] = {
          ...updatedList[existingCardIndex],
          quantity: updatedList[existingCardIndex].quantity + cardToMove.quantity
        };
        updateDeckList(updatedList);
      } else {
        // Füge die Karte zur Zielliste hinzu
        updateDeckList([...destList, cardToMove]);
      }
    }
  }, [mainDeck, sideboard, removeCardFromDeck]);

  // Deck-Daten zusammenstellen
  const compileDeckData = useCallback(() => {
    return {
      name: deckName,
      format: deckFormat,
      description: deckDescription,
      mainDeck,
      sideboard
    };
  }, [deckName, deckFormat, deckDescription, mainDeck, sideboard]);

  return {
    deckName,
    setDeckName,
    deckFormat,
    setDeckFormat,
    deckDescription,
    setDeckDescription,
    mainDeck,
    sideboard,
    activeTab,
    setActiveTab,
    addCardToDeck,
    removeCardFromDeck,
    moveCardBetweenLists,
    compileDeckData
  };
};

export default useDeck;
