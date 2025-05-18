import React from 'react';

/**
 * Komponente zur Anzeige von Mana-Symbolen
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.symbol - Das anzuzeigende Symbol (z.B. "W", "U", "B", "R", "G", "1", etc.)
 * @param {string} props.size - Die Größe des Symbols (default: "1x")
 * @returns {JSX.Element} Das Mana-Symbol als JSX-Element
 */
export const ManaSymbol = ({ symbol, size = "1x" }) => {
  // Konvertiere das Symbol in das richtige Format für die Mana-Font
  const getSymbolClass = (symbol) => {
    // Entferne geschweifte Klammern, falls vorhanden
    const cleanSymbol = symbol.replace(/[{}]/g, '');
    // Füge die Klasse ms-cost hinzu, um die Symbole farbig zu machen
    return `ms ms-${cleanSymbol.toLowerCase()} ms-${size} ms-cost`;
  };

  return <i className={getSymbolClass(symbol)} aria-hidden="true" />;
};

/**
 * Komponente zur Anzeige eines Set-Symbols
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.set - Der Set-Code (z.B. "M21", "ZNR", etc.)
 * @param {string} props.rarity - Die Seltenheit (common, uncommon, rare, mythic)
 * @param {string} props.size - Die Größe des Symbols (default: "1x")
 * @returns {JSX.Element} Das Set-Symbol als JSX-Element
 */
export const SetSymbol = ({ set, rarity = "common", size = "1x" }) => {
  // Konvertiere die Seltenheit in die richtige CSS-Klasse
  const getRarityClass = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'ke-common';
      case 'uncommon': return 'ke-uncommon';
      case 'rare': return 'ke-rare';
      case 'mythic': return 'ke-mythic';
      default: return 'ke-common';
    }
  };

  // Überprüfe, ob set ein gültiger String ist
  if (!set || typeof set !== 'string') {
    return null; // Wenn kein gültiges Set vorhanden ist, zeige nichts an
  }

  return (
    <i 
      className={`ke ke-${set.toLowerCase()} ke-${size} ${getRarityClass(rarity)}`} 
      aria-hidden="true" 
    />
  );
};

/**
 * Komponente zur Anzeige von Mana-Kosten (z.B. "{1}{W}{U}")
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.cost - Die Mana-Kosten als String (z.B. "{1}{W}{U}")
 * @param {string} props.size - Die Größe der Symbole (default: "1x")
 * @returns {JSX.Element} Die Mana-Kosten als JSX-Element mit Symbolen
 */
export const ManaCost = ({ cost, size = "1x" }) => {
  if (!cost) return null;
  
  // Extrahiere die einzelnen Symbole aus dem Mana-Kosten-String
  const symbols = cost.match(/\{([^}]+)\}/g) || [];
  
  return (
    <span className="mana-cost">
      {symbols.map((symbol, index) => (
        <ManaSymbol key={index} symbol={symbol} size={size} />
      ))}
    </span>
  );
};

export default { ManaSymbol, SetSymbol, ManaCost };
