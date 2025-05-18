import React from 'react';
import { calculateManaCurve, calculateColorDistribution } from '../../utils/cardHelpers';

/**
 * Komponente zur Anzeige von Deck-Statistiken
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.mainDeck - Karten im Hauptdeck
 * @returns {JSX.Element} Die gerenderte Komponente
 */
function DeckStats({ mainDeck }) {
  // Berechne die Mana-Kurve
  const manaCurve = calculateManaCurve(mainDeck);
  
  // Berechne die Farbverteilung
  const colorDistribution = calculateColorDistribution(mainDeck);
  
  // Berechne die Gesamtzahl der Karten
  const totalCards = mainDeck.reduce((total, card) => total + card.quantity, 0);
  
  // Finde den höchsten Wert in der Mana-Kurve für die Skalierung
  const maxCurveValue = Math.max(...Object.values(manaCurve));
  
  // Finde den höchsten Wert in der Farbverteilung für die Skalierung
  const maxColorValue = Math.max(...Object.values(colorDistribution));
  
  // Farbnamen für die Legende
  const colorNames = {
    'W': 'Weiß',
    'U': 'Blau',
    'B': 'Schwarz',
    'R': 'Rot',
    'G': 'Grün',
    'C': 'Farblos'
  };
  
  // Farbcodes für die Balken
  const colorCodes = {
    'W': '#f8f6d8',
    'U': '#c1d7e9',
    'B': '#a69f9d',
    'R': '#e49977',
    'G': '#a3c095',
    'C': '#d5d5d5'
  };

  return (
    <div className="deck-stats">
      <h3>Deck-Statistiken</h3>
      
      <div className="stat-section">
        <h4>Mana-Kurve</h4>
        <div className="mana-curve">
          {Object.entries(manaCurve).map(([cmc, count]) => (
            <div key={cmc} className="curve-bar-container">
              <div className="curve-label">{cmc}</div>
              <div className="curve-bar-wrapper">
                <div 
                  className="curve-bar" 
                  style={{ 
                    height: maxCurveValue > 0 ? `${(count / maxCurveValue) * 100}%` : '0%',
                    backgroundColor: '#4285f4'
                  }}
                />
              </div>
              <div className="curve-count">{count}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="stat-section">
        <h4>Farbverteilung</h4>
        <div className="color-distribution">
          {Object.entries(colorDistribution)
            .filter(([_, count]) => count > 0)
            .map(([color, count]) => (
              <div key={color} className="color-bar-container">
                <div className="color-label" title={colorNames[color]}>{color}</div>
                <div className="color-bar-wrapper">
                  <div 
                    className="color-bar" 
                    style={{ 
                      width: maxColorValue > 0 ? `${(count / maxColorValue) * 100}%` : '0%',
                      backgroundColor: colorCodes[color]
                    }}
                  />
                </div>
                <div className="color-count">{count}</div>
              </div>
            ))}
        </div>
      </div>
      
      <div className="stat-section">
        <h4>Zusammenfassung</h4>
        <div className="stat-summary">
          <div className="stat-item">
            <span className="stat-label">Gesamtkarten:</span>
            <span className="stat-value">{totalCards}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Durchschnittlicher CMC:</span>
            <span className="stat-value">
              {totalCards > 0 
                ? (Object.entries(manaCurve).reduce((sum, [cmc, count]) => {
                    const cmcValue = cmc === '6+' ? 6 : parseInt(cmc);
                    return sum + (cmcValue * count);
                  }, 0) / totalCards).toFixed(2)
                : '0.00'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckStats;
