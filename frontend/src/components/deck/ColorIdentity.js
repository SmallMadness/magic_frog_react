import React from 'react';
import { ManaSymbol } from '../symbols/ManaSymbols';
import '../../styles/ColorIdentity.css';

/**
 * Komponente zur Darstellung der Farbidentität eines Decks
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Die Karten im Deck
 * @returns {JSX.Element} Die Farbidentität als JSX-Element
 */
const ColorIdentity = ({ cards }) => {
  // Berechne die Farbidentität des Decks
  const calculateColorIdentity = () => {
    const colors = {
      W: 0, // Weiß
      U: 0, // Blau
      B: 0, // Schwarz
      R: 0, // Rot
      G: 0, // Grün
      C: 0  // Farblos
    };
    
    cards.forEach(card => {
      if (card.colors && card.colors.length > 0) {
        card.colors.forEach(color => {
          if (colors[color] !== undefined) {
            colors[color]++;
          }
        });
      } else if (card.color_identity && card.color_identity.length > 0) {
        card.color_identity.forEach(color => {
          if (colors[color] !== undefined) {
            colors[color]++;
          }
        });
      } else {
        colors.C++;
      }
    });
    
    return colors;
  };
  
  const colorIdentity = calculateColorIdentity();
  const totalCards = Object.values(colorIdentity).reduce((sum, count) => sum + count, 0);
  
  // Sortiere die Farben nach WUBRG-Reihenfolge
  const sortedColors = ['W', 'U', 'B', 'R', 'G', 'C'];
  
  return (
    <div className="color-identity-container">
      <h3 className="color-identity-title">Farbidentität</h3>
      <div className="color-identity-symbols">
        {sortedColors.map(color => (
          colorIdentity[color] > 0 && (
            <div key={color} className="color-identity-item">
              <ManaSymbol symbol={`{${color}}`} size="2x" />
              <div className="color-identity-count">
                {colorIdentity[color]}
                <span className="color-identity-percentage">
                  ({Math.round((colorIdentity[color] / totalCards) * 100)}%)
                </span>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="color-identity-bars">
        {sortedColors.map(color => (
          colorIdentity[color] > 0 && (
            <div 
              key={`bar-${color}`} 
              className={`color-identity-bar color-${color.toLowerCase()}`}
              style={{ width: `${(colorIdentity[color] / totalCards) * 100}%` }}
            ></div>
          )
        ))}
      </div>
    </div>
  );
};

export default ColorIdentity;
