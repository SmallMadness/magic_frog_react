import React from 'react';
import { ManaSymbol } from './ManaSymbols';

/**
 * Formatiert den Kartentext und ersetzt Mana-Symbole und andere spezielle Symbole
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.text - Der zu formatierende Text
 * @returns {JSX.Element} Der formatierte Text als JSX-Element
 */
const CardTextFormatter = ({ text }) => {
  if (!text) return null;
  
  // Teile den Text in Segmente auf, wobei die Symbole als separate Segmente behandelt werden
  const segments = [];
  let currentText = '';
  let i = 0;
  
  while (i < text.length) {
    // Suche nach Symbolen im Format {X}
    if (text[i] === '{') {
      const endIndex = text.indexOf('}', i);
      
      if (endIndex !== -1) {
        // Füge den Text vor dem Symbol hinzu
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        // Extrahiere das Symbol
        const symbol = text.substring(i, endIndex + 1);
        segments.push({ type: 'symbol', content: symbol });
        
        // Setze den Index hinter das Symbol
        i = endIndex + 1;
        continue;
      }
    }
    
    // Füge das aktuelle Zeichen zum Text hinzu
    currentText += text[i];
    i++;
  }
  
  // Füge den verbleibenden Text hinzu
  if (currentText) {
    segments.push({ type: 'text', content: currentText });
  }
  
  // Rendere die Segmente
  return (
    <span className="card-text-formatted">
      {segments.map((segment, index) => {
        if (segment.type === 'symbol') {
          return <ManaSymbol key={index} symbol={segment.content} size="1x" />;
        } else {
          return <span key={index}>{segment.content}</span>;
        }
      })}
    </span>
  );
};

export default CardTextFormatter;
