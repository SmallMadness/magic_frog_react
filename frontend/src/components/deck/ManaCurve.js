import React from 'react';
import { ManaSymbol } from '../symbols/ManaSymbols';
import '../../styles/ManaCurve.css';

/**
 * Komponente zur Darstellung der Mana-Kurve eines Decks
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Die Karten im Deck
 * @returns {JSX.Element} Die Mana-Kurve als JSX-Element
 */
const ManaCurve = ({ cards }) => {
  // Berechne die Mana-Kurve
  const calculateManaCurve = () => {
    const curve = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7+': 0
    };
    
    cards.forEach(card => {
      // Ignoriere Länder
      if (card.type_line && card.type_line.toLowerCase().includes('land')) {
        return;
      }
      
      // Bestimme die Manakosten
      const cmc = card.cmc || 0;
      
      if (cmc >= 7) {
        curve['7+']++;
      } else {
        curve[Math.floor(cmc).toString()]++;
      }
    });
    
    return curve;
  };
  
  const manaCurve = calculateManaCurve();
  const maxCount = Math.max(...Object.values(manaCurve));
  
  return (
    <div className="mana-curve-container">
      <h3 className="mana-curve-title">Mana-Kurve</h3>
      <div className="mana-curve">
        {Object.entries(manaCurve).map(([cmc, count]) => (
          <div key={cmc} className="mana-curve-bar-container">
            <div 
              className="mana-curve-bar" 
              style={{ height: `${(count / maxCount) * 100}%` }}
            >
              <span className="mana-curve-count">{count}</span>
            </div>
            <div className="mana-curve-label">
              {cmc === '7+' ? (
                <div className="mana-symbol-container">
                  <ManaSymbol symbol="{7}" size="1x" />
                  <span>+</span>
                </div>
              ) : (
                <ManaSymbol symbol={`{${cmc}}`} size="1x" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManaCurve;
