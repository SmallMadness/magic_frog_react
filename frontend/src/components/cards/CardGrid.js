import React from 'react';
import MagicCard from './MagicCard';

/**
 * Komponente zur Anzeige eines Rasters von Magic-Karten
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Die Liste der anzuzeigenden Karten
 * @returns {JSX.Element} Das gerenderte Kartenraster
 */
function CardGrid({ cards }) {
  return (
    <div className="card-grid">
      {cards.map(card => (
        <MagicCard key={card.id} card={card} />
      ))}
    </div>
  );
}

export default CardGrid;
