import React from 'react';

/**
 * Komponente für das Deck-Formular
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.deckName - Name des Decks
 * @param {Function} props.setDeckName - Setter für den Deck-Namen
 * @param {string} props.deckFormat - Format des Decks
 * @param {Function} props.setDeckFormat - Setter für das Deck-Format
 * @param {string} props.deckDescription - Beschreibung des Decks
 * @param {Function} props.setDeckDescription - Setter für die Deck-Beschreibung
 * @returns {JSX.Element} Die gerenderte Formular-Komponente
 */
function DeckForm({ 
  deckName, 
  setDeckName, 
  deckFormat, 
  setDeckFormat, 
  deckDescription, 
  setDeckDescription 
}) {
  // Verfügbare Formate
  const formats = [
    'Standard',
    'Modern',
    'Legacy',
    'Commander',
    'Pioneer',
    'Historic',
    'Pauper',
    'Vintage',
    'Brawl',
    'Draft'
  ];

  return (
    <div className="deck-form">
      <div className="form-group">
        <label htmlFor="deckName">Deck Name:</label>
        <input
          type="text"
          id="deckName"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="Gib deinem Deck einen Namen..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="deckFormat">Format:</label>
        <select
          id="deckFormat"
          value={deckFormat}
          onChange={(e) => setDeckFormat(e.target.value)}
        >
          {formats.map(format => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="deckDescription">Beschreibung:</label>
        <textarea
          id="deckDescription"
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
          placeholder="Beschreibe dein Deck und seine Strategie..."
          rows="4"
        />
      </div>
    </div>
  );
}

export default DeckForm;
