import React from 'react';

/**
 * Komponente zur Anzeige einer einzelnen Magic-Karte
 * @param {Object} props - Die Props der Komponente
 * @param {Object} props.card - Die Kartendaten
 * @returns {JSX.Element} Die gerenderte Kartenkomponente
 */
function MagicCard({ card }) {
  return (
    <div className="magic-card">
      <h3>{card.name}</h3>
      <div className="card-image-container">
        <img src={card.imageUrl} alt={card.name} className="card-image" />
      </div>
      <div className="card-details">
        <p><strong>Mana Cost:</strong> {card.manaCost}</p>
        <p><strong>Type:</strong> {card.type}</p>
        <p><strong>Rarity:</strong> {card.rarity}</p>
        <p><strong>Text:</strong> {card.text}</p>
        <p><strong>Set:</strong> {card.set}</p>
      </div>
    </div>
  );
}

export default MagicCard;
