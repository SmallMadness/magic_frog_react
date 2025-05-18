import React from 'react';
import { groupCardsByType } from '../../utils/cardHelpers';

/**
 * Komponente zur Anzeige und Verwaltung der Karten im Deck
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Karten im Deck
 * @param {Function} props.onRemoveCard - Callback zum Entfernen einer Karte
 * @param {Function} props.onMoveCard - Callback zum Verschieben einer Karte
 * @param {string} props.source - Quelle der Karten ('main' oder 'side')
 * @param {string} props.destination - Ziel für das Verschieben ('main' oder 'side')
 * @returns {JSX.Element} Die gerenderte Komponente
 */
function DeckCardList({ cards, onRemoveCard, onMoveCard, source, destination }) {
  // Gruppiere Karten nach Typ
  const groupedCards = groupCardsByType(cards);
  
  // Berechne die Gesamtzahl der Karten
  const totalCards = cards.reduce((total, card) => total + card.quantity, 0);
  
  // Filtere leere Gruppen heraus
  const nonEmptyGroups = Object.entries(groupedCards)
    .filter(([_, cards]) => cards.length > 0);

  return (
    <div className="deck-card-list">
      <div className="deck-header">
        <h3>{source === 'main' ? 'Hauptdeck' : 'Sideboard'}</h3>
        <span className="card-count">{totalCards} Karten</span>
      </div>
      
      {totalCards === 0 ? (
        <div className="empty-deck-message">
          <p>{source === 'main' ? 'Dein Hauptdeck ist leer. Füge Karten hinzu!' : 'Dein Sideboard ist leer.'}</p>
        </div>
      ) : (
        <div className="deck-cards">
          {nonEmptyGroups.map(([type, cards]) => (
            <div key={type} className="card-type-group">
              <h4 className="type-header">{type} ({cards.reduce((total, card) => total + card.quantity, 0)})</h4>
              <ul className="card-list">
                {cards.map(({ card, quantity }) => (
                  <li key={card.id} className="deck-card-item">
                    <div className="card-info">
                      <span className="card-quantity">{quantity}x</span>
                      <span className="card-name" title={card.name}>{card.name}</span>
                      {card.mana_cost && (
                        <span className="card-mana" dangerouslySetInnerHTML={{ __html: formatManaCost(card.mana_cost) }} />
                      )}
                    </div>
                    <div className="card-actions">
                      <button 
                        className="card-action-btn move-btn" 
                        onClick={() => onMoveCard(card.id, source, destination)}
                        title={`Zu ${source === 'main' ? 'Sideboard' : 'Hauptdeck'} verschieben`}
                      >
                        {source === 'main' ? '→' : '←'}
                      </button>
                      <button 
                        className="card-action-btn remove-btn" 
                        onClick={() => onRemoveCard(card.id, source)}
                        title="Karte entfernen"
                      >
                        −
                      </button>
                      <button 
                        className="card-action-btn add-btn" 
                        onClick={() => onRemoveCard(card.id, source, true)}
                        title="Alle entfernen"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Formatiert einen Mana-String in HTML
 * @param {string} manaCost - Der Mana-String (z.B. "{2}{U}{R}")
 * @returns {string} Formatierter HTML-String
 */
function formatManaCost(manaCost) {
  if (!manaCost) return '';
  
  // Ersetze Mana-Symbole durch Bilder oder CSS-Klassen
  // Dies ist ein einfaches Beispiel, in einer echten Anwendung würde man Bilder oder Icons verwenden
  return manaCost
    .replace(/{W}/g, '<span class="mana-symbol mana-w">W</span>')
    .replace(/{U}/g, '<span class="mana-symbol mana-u">U</span>')
    .replace(/{B}/g, '<span class="mana-symbol mana-b">B</span>')
    .replace(/{R}/g, '<span class="mana-symbol mana-r">R</span>')
    .replace(/{G}/g, '<span class="mana-symbol mana-g">G</span>')
    .replace(/{(\d+)}/g, '<span class="mana-symbol mana-generic">$1</span>');
}

export default DeckCardList;
