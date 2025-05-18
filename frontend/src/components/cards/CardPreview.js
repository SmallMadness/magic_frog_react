import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/CardPreview.css';

/**
 * Komponente zur Anzeige einer Kartenvorschau mit Details
 * @param {Object} props - Die Props der Komponente
 * @param {Object} props.card - Die anzuzeigende Karte
 * @returns {JSX.Element} Die gerenderte Kartenvorschau
 */
function CardPreview({ card }) {
  if (!card) return null;

  // Hilfsfunktion, um sicherzustellen, dass Werte als Strings gerendert werden
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') {
      // Wenn es ein Objekt ist, versuche einen sinnvollen String zu extrahieren
      return value.name || value.title || JSON.stringify(value);
    }
    return String(value);
  };

  // Mana-Symbole formatieren
  const formatManaSymbols = (manaCost) => {
    if (!manaCost) return null;
    
    // Hier könnte später eine Logik zur Umwandlung von {R} in entsprechende Icons erfolgen
    return <span className="mana-symbols">{safeRender(manaCost)}</span>;
  };

  return (
    <div className="card-preview">
      <div className="card-preview-header">
        <h3>{safeRender(card.name)}</h3>
        {card.manaCost && formatManaSymbols(card.manaCost)}
      </div>
      
      <div className="card-preview-content">
        {card.imageUrl ? (
          <div className="card-image-container">
            <img 
              src={safeRender(card.imageUrl)} 
              alt={safeRender(card.name)} 
              className="card-image" 
              loading="lazy"
            />
          </div>
        ) : (
          <div className="card-details">
            <div className="card-detail-row">
              <span className="detail-label">Typ:</span>
              <span className="detail-value">{safeRender(card.type)}</span>
            </div>
            
            {card.rarity && (
              <div className="card-detail-row">
                <span className="detail-label">Seltenheit:</span>
                <span className="detail-value">{safeRender(card.rarity)}</span>
              </div>
            )}
            
            {card.text && (
              <div className="card-detail-row">
                <span className="detail-label">Text:</span>
                <span className="detail-value">{safeRender(card.text)}</span>
              </div>
            )}
            
            {card.set && (
              <div className="card-detail-row">
                <span className="detail-label">Set:</span>
                <span className="detail-value">{safeRender(card.set)}</span>
              </div>
            )}
            
            {card.flavorText && (
              <div className="card-flavor-text">
                <em>{safeRender(card.flavorText)}</em>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="card-preview-footer">
        {card.imageUrl ? (
          <button className="btn btn-secondary btn-sm">Details</button>
        ) : (
          <button className="btn btn-secondary btn-sm">Bild anzeigen</button>
        )}
      </div>
    </div>
  );
}

CardPreview.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    manaCost: PropTypes.string,
    text: PropTypes.string,
    imageUrl: PropTypes.string,
    rarity: PropTypes.string,
    set: PropTypes.string,
    flavorText: PropTypes.string
  })
};

export default CardPreview;
