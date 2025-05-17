import React, { useState } from 'react';
import '../../styles/Cards.css';

/**
 * Komponente zur Anzeige einer einzelnen Magic-Karte
 * @param {Object} props - Die Props der Komponente
 * @param {Object} props.card - Die Kartendaten
 * @param {Function} props.onAddToDeck - Callback, wenn Karte zum Deck hinzugefügt wird
 * @returns {JSX.Element} Die gerenderte Kartenkomponente
 */
function MagicCard({ card, onAddToDeck }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Normalisiere Kartenfelder, um mit verschiedenen API-Formaten umzugehen
  const normalizedCard = {
    id: card.id || card.scryfall_id || '',
    name: card.name || '',
    mana_cost: card.mana_cost || card.manaCost || '',
    type: card.type || card.type_line || '',
    rarity: card.rarity || '',
    text: card.text || card.oracle_text || '',
    set_name: card.set_name || card.setName || '',
    image_url: card.image_url || card.image_uris?.normal || card.image_uris?.small || 
               card.imageUrl || 'https://c2.scryfall.com/file/scryfall-cards/normal/front/0/0/00000000-0000-0000-0000-000000000000.jpg',
    image_url_small: card.image_url_small || card.image_uris?.small || card.imageUrl || 
                    card.image_uris?.normal || 'https://c2.scryfall.com/file/scryfall-cards/small/front/0/0/00000000-0000-0000-0000-000000000000.jpg',
    colors: card.colors || [],
    power: card.power || '',
    toughness: card.toughness || ''
  };
  
  // Bestimme die Rarityfarbe für den Kartenrand
  const getRarityClass = () => {
    switch (normalizedCard.rarity?.toLowerCase()) {
      case 'common':
        return 'rarity-common';
      case 'uncommon':
        return 'rarity-uncommon';
      case 'rare':
        return 'rarity-rare';
      case 'mythic':
      case 'mythic rare':
        return 'rarity-mythic';
      default:
        return '';
    }
  };
  
  // Karte umdrehen, um Details anzuzeigen oder zu verstecken
  const toggleCardDetails = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Karte zum Deck hinzufügen, wenn die Funktion vorhanden ist
  const handleAddToDeck = () => {
    if (onAddToDeck) {
      onAddToDeck(card);
    }
  };
  
  // Fallback-Bild für fehlende Bilder
  const fallbackImage = 'https://c2.scryfall.com/file/scryfall-card-backs/large/59/597b79b3-7d77-4261-871a-60dd17403388.jpg?1561757111';
  
  // Bestimme, ob die Karte ein Bild hat
  const hasImage = normalizedCard.image_url && normalizedCard.image_url !== 'https://c2.scryfall.com/file/scryfall-cards/normal/front/0/0/00000000-0000-0000-0000-000000000000.jpg';

  return (
    <div className={`magic-card ${getRarityClass()}`} onClick={toggleCardDetails}>
      <h3 title={normalizedCard.name}>{normalizedCard.name || "Unbekannte Karte"}</h3>
      
      {!isFlipped ? (
        <div className="card-image-container">
          {hasImage ? (
            <img 
              src={normalizedCard.image_url_small || normalizedCard.image_url} 
              alt={normalizedCard.name} 
              className="card-image" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
          ) : (
            <div className="card-placeholder">
              <div className="card-placeholder-header">
                <span className="card-name-placeholder">{normalizedCard.name}</span>
                <span className="card-mana-placeholder">{normalizedCard.mana_cost}</span>
              </div>
              <div className="card-placeholder-type">{normalizedCard.type}</div>
              <div className="card-placeholder-text">{normalizedCard.text}</div>
              {(normalizedCard.power || normalizedCard.toughness) && (
                <div className="card-placeholder-pt">{normalizedCard.power}/{normalizedCard.toughness}</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="card-details">
          {normalizedCard.mana_cost && <p><strong>Mana:</strong> {normalizedCard.mana_cost}</p>}
          {normalizedCard.type && <p><strong>Typ:</strong> {normalizedCard.type}</p>}
          {normalizedCard.rarity && <p><strong>Seltenheit:</strong> {normalizedCard.rarity}</p>}
          {normalizedCard.text && (
            <div>
              <strong>Text:</strong>
              <div className="card-text">{normalizedCard.text}</div>
            </div>
          )}
          {normalizedCard.set_name && <p><strong>Set:</strong> {normalizedCard.set_name}</p>}
          {(normalizedCard.power || normalizedCard.toughness) && (
            <p><strong>Stärke/Widerstandskraft:</strong> {normalizedCard.power}/{normalizedCard.toughness}</p>
          )}
        </div>
      )}
      
      {onAddToDeck && (
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleAddToDeck}>Zum Deck hinzufügen</button>
        </div>
      )}
    </div>
  );
}

export default MagicCard;
