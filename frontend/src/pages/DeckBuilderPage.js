import React from 'react';

/**
 * Deck Builder Seite
 * @returns {JSX.Element} Die gerenderte Deck Builder Seite
 */
function DeckBuilderPage() {
  return (
    <div className="deck-builder-container">
      <h2>Deck Builder</h2>
      <p className="coming-soon">Diese Funktion wird bald verfügbar sein!</p>
      
      <div className="deck-builder-placeholder">
        <div className="placeholder-content">
          <h3>Hier entsteht dein Deck Builder</h3>
          <p>In zukünftigen Updates kannst du hier:</p>
          <ul>
            <li>Karten zu deinem Deck hinzufügen</li>
            <li>Deine Decks speichern und verwalten</li>
            <li>Deck-Statistiken einsehen</li>
            <li>Mana-Kurven analysieren</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DeckBuilderPage;
