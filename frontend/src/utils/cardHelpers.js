/**
 * Hilfsfunktionen für die Verarbeitung von Magic-Karten
 */

/**
 * Normalisiert Kartendaten aus verschiedenen Quellen
 * @param {Object} card - Die zu normalisierende Karte
 * @returns {Object} Die normalisierte Karte
 */
export const normalizeCard = (card) => {
  return {
    id: card.id || card.scryfall_id || '',
    name: card.name || '',
    mana_cost: card.mana_cost || card.manaCost || '',
    cmc: card.cmc || calculateCmc(card.mana_cost || card.manaCost || ''),
    type: card.type || card.type_line || '',
    rarity: card.rarity || '',
    text: card.text || card.oracle_text || '',
    set: card.set || '',
    set_name: card.set_name || card.setName || '',
    image_url: card.image_url || card.image_uris?.normal || card.image_uris?.small || 
              card.imageUrl || 'https://c2.scryfall.com/file/scryfall-cards/normal/front/0/0/00000000-0000-0000-0000-000000000000.jpg',
    image_url_small: card.image_url_small || card.image_uris?.small || card.imageUrl || 
                    card.image_uris?.normal || 'https://c2.scryfall.com/file/scryfall-cards/small/front/0/0/00000000-0000-0000-0000-000000000000.jpg',
    colors: card.colors || extractColors(card.mana_cost || card.manaCost || ''),
    power: card.power || '',
    toughness: card.toughness || ''
  };
};

/**
 * Berechnet den Converted Mana Cost (CMC) aus einem Mana-String
 * @param {string} manaCost - Der Mana-String (z.B. "{2}{U}{R}")
 * @returns {number} Der berechnete CMC
 */
export const calculateCmc = (manaCost) => {
  if (!manaCost) return 0;
  
  // Extrahiere alle Zahlen und Symbole aus dem Mana-String
  const matches = manaCost.match(/{([^}]+)}/g) || [];
  
  return matches.reduce((total, match) => {
    const value = match.replace(/{|}/g, '');
    
    // Wenn es eine Zahl ist, addiere sie
    if (!isNaN(value)) {
      return total + parseInt(value);
    }
    
    // Für Farbsymbole (W, U, B, R, G) oder X, addiere 1
    if (['W', 'U', 'B', 'R', 'G', 'X'].includes(value)) {
      return total + 1;
    }
    
    // Für Hybrid-Mana (z.B. W/U) addiere 1
    if (value.includes('/')) {
      return total + 1;
    }
    
    return total;
  }, 0);
};

/**
 * Extrahiert Farben aus einem Mana-String
 * @param {string} manaCost - Der Mana-String (z.B. "{2}{U}{R}")
 * @returns {Array} Array mit Farbcodes
 */
export const extractColors = (manaCost) => {
  if (!manaCost) return [];
  
  const colors = [];
  const colorMap = {
    'W': 'W', // Weiß
    'U': 'U', // Blau
    'B': 'B', // Schwarz
    'R': 'R', // Rot
    'G': 'G'  // Grün
  };
  
  // Suche nach Farbsymbolen im Mana-String
  Object.keys(colorMap).forEach(color => {
    if (manaCost.includes(`{${color}}`) || manaCost.includes(`/${color}}`)) {
      colors.push(colorMap[color]);
    }
  });
  
  return colors;
};

/**
 * Gruppiert Karten nach Typ
 * @param {Array} cards - Array von Kartenobjekten
 * @returns {Object} Objekt mit Karten gruppiert nach Typ
 */
export const groupCardsByType = (cards) => {
  const groups = {
    'Creature': [],
    'Instant': [],
    'Sorcery': [],
    'Artifact': [],
    'Enchantment': [],
    'Planeswalker': [],
    'Land': [],
    'Other': []
  };
  
  cards.forEach(card => {
    let placed = false;
    
    // Überprüfe, zu welcher Gruppe die Karte gehört
    for (const type in groups) {
      if (type !== 'Other' && card.card.type?.includes(type)) {
        groups[type].push(card);
        placed = true;
        break;
      }
    }
    
    // Wenn die Karte keiner Gruppe zugeordnet wurde, füge sie zu "Other" hinzu
    if (!placed) {
      groups['Other'].push(card);
    }
  });
  
  return groups;
};

/**
 * Berechnet die Mana-Kurve eines Decks
 * @param {Array} cards - Array von Kartenobjekten
 * @returns {Object} Objekt mit der Anzahl der Karten pro CMC
 */
export const calculateManaCurve = (cards) => {
  const curve = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6+': 0
  };
  
  cards.forEach(card => {
    const cmc = card.card.cmc || 0;
    
    if (cmc >= 6) {
      curve['6+'] += card.quantity;
    } else {
      curve[cmc.toString()] += card.quantity;
    }
  });
  
  return curve;
};

/**
 * Berechnet die Farbverteilung eines Decks
 * @param {Array} cards - Array von Kartenobjekten
 * @returns {Object} Objekt mit der Anzahl der Karten pro Farbe
 */
export const calculateColorDistribution = (cards) => {
  const distribution = {
    'W': 0, // Weiß
    'U': 0, // Blau
    'B': 0, // Schwarz
    'R': 0, // Rot
    'G': 0, // Grün
    'C': 0  // Farblos
  };
  
  cards.forEach(card => {
    const colors = card.card.colors || [];
    
    if (colors.length === 0) {
      distribution['C'] += card.quantity;
    } else {
      colors.forEach(color => {
        if (distribution[color] !== undefined) {
          distribution[color] += card.quantity;
        }
      });
    }
  });
  
  return distribution;
};
