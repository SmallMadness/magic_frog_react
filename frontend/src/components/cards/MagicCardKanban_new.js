import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/MagicCardKanban.css';
import { ManaCost, SetSymbol } from '../symbols/ManaSymbols';
import CardTextFormatter from '../symbols/CardTextFormatter';

/**
 * Neue Kanban-Style Komponente für Magic-Karten mit Flip-Effekt
 * @param {Object} props - Die Props der Komponente
 * @param {Object} props.card - Die Kartendaten
 * @param {Function} props.onAddToDeck - Callback, wenn Karte zum Deck hinzugefügt wird
 * @returns {JSX.Element} Die gerenderte Karten-Komponente
 */
function MagicCardKanban({ card, onAddToDeck }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Normalisiere Kartenfelder, um mit verschiedenen API-Formaten umzugehen
  const normalizedCard = {
    id: card.id || card.scryfall_id || '',
    name: card.name || '',
    mana_cost: card.mana_cost || card.manaCost || '',
    type: card.type || card.type_line || '',
    rarity: card.rarity || '',
    text: card.text || card.oracle_text || '',
    set: card.set || '',
    set_name: card.set_name || card.setName || '',
    image_url: card.image_url || card.image_uris?.normal || card.image_uris?.small || 
               card.imageUrl || 'https://c2.scryfall.com/file/scryfall-cards/normal/front/0/0/00000000-0000-0000-0000-000000000000.jpg',
    colors: card.colors || [],
    power: card.power || '',
    toughness: card.toughness || ''
  };
  
  // Bestimme die Kartenfarbe basierend auf dem Typ
  const getCardColor = () => {
    const type = normalizedCard.type.toLowerCase();
    if (type.includes('creature')) return 'red';
    if (type.includes('land')) return 'green';
    if (type.includes('instant') || type.includes('sorcery')) return 'blue';
    if (type.includes('artifact')) return 'gray';
    if (type.includes('enchantment')) return 'purple';
    if (type.includes('planeswalker')) return 'orange';
    return 'darkgray';
  };
  
  // Umdrehen der Karte
  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  // Karte zum Deck hinzufügen
  const handleAddToDeck = (e) => {
    e.stopPropagation();
    if (onAddToDeck) {
      onAddToDeck(card);
    }
  };
  
  return (
    <div 
      className={`magic-card-kanban ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="card-inner">
        {/* Vorderseite mit Bild */}
        <div className="card-front">
          <div className="card-color-bar" style={{ backgroundColor: getCardColor() }}></div>
          <div className="card-header">
            <div className="card-title-container">
              <h3 className="card-title" title={normalizedCard.name}>{normalizedCard.name}</h3>
            </div>
            {normalizedCard.mana_cost && (
              <div className="card-mana-cost">
                <ManaCost cost={normalizedCard.mana_cost} size="1x" />
              </div>
            )}
          </div>
          <div className="card-body">
            <div className="card-image-container">
              <img 
                src={normalizedCard.image_url} 
                alt={normalizedCard.name}
                className="card-image"
                loading="lazy"
              />
            </div>
          </div>
          <div className="card-footer">
            <span className="card-type">{normalizedCard.type}</span>
            <button className="btn-add" onClick={handleAddToDeck} title="Zum Deck hinzufügen">+</button>
          </div>
        </div>
        
        {/* Rückseite mit Details */}
        <div className="card-back">
          <div className="card-color-bar" style={{ backgroundColor: getCardColor() }}></div>
          <div className="card-header">
            <div className="card-title-container">
              <h3 className="card-title" title={normalizedCard.name}>{normalizedCard.name}</h3>
            </div>
            {normalizedCard.mana_cost && (
              <div className="card-mana-cost">
                <ManaCost cost={normalizedCard.mana_cost} size="1x" />
              </div>
            )}
          </div>
          <div className="card-body card-details">
            <div className="detail-row">
              <span className="detail-label">Typ:</span>
              <span className="detail-value">{normalizedCard.type}</span>
            </div>
            
            {normalizedCard.set_name && normalizedCard.set && (
              <div className="detail-row">
                <span className="detail-label">Set:</span>
                <span className="detail-value">
                  <SetSymbol set={normalizedCard.set} rarity={normalizedCard.rarity} size="2x" /> {normalizedCard.set_name}
                </span>
              </div>
            )}
            
            {normalizedCard.rarity && (
              <div className="detail-row">
                <span className="detail-label">Seltenheit:</span>
                <span className="detail-value">{normalizedCard.rarity}</span>
              </div>
            )}
            
            {normalizedCard.text && (
              <div className="detail-row">
                <span className="detail-label">Text:</span>
                <span className="detail-value card-text">
                  <CardTextFormatter text={normalizedCard.text} />
                </span>
              </div>
            )}
            
            {(normalizedCard.power || normalizedCard.toughness) && (
              <div className="detail-row">
                <span className="detail-label">Stärke/Widerstandskraft:</span>
                <span className="detail-value">{normalizedCard.power}/{normalizedCard.toughness}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

MagicCardKanban.propTypes = {
  card: PropTypes.object.isRequired,
  onAddToDeck: PropTypes.func
};

MagicCardKanban.defaultProps = {
  onAddToDeck: () => {}
};

export default MagicCardKanban;
