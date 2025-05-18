import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ManaCost } from '../symbols/ManaSymbols';
import '../../styles/MagicCardList.css';

/**
 * Komponente zur Anzeige von Magic-Karten in einer Listenansicht
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Die Liste der anzuzeigenden Karten
 * @param {Function} props.onAddToDeck - Callback, wenn Karte zum Deck hinzugefügt wird
 * @returns {JSX.Element} Die gerenderte Listenansicht
 */
function MagicCardList({ cards, onAddToDeck }) {
  // Normalisiere Kartenfelder, um mit verschiedenen API-Formaten umzugehen
  const normalizeCard = (card) => {
    return {
      id: card.id || card.scryfall_id || '',
      name: card.name || '',
      mana_cost: card.mana_cost || card.manaCost || '',
      type: card.type || card.type_line || '',
      rarity: card.rarity || '',
      set: card.set || '',
      set_name: card.set_name || card.setName || '',
      colors: card.colors || []
    };
  };
  
  // State für die Sortierung
  const [sortConfig, setSortConfig] = useState({
    key: 'name', // Standardmäßig nach Namen sortieren
    direction: 'ascending'
  });
  
  // Funktion zum Extrahieren der Manakosten als numerischen Wert
  const extractManaCost = (manaCost) => {
    if (!manaCost) return 0;
    
    // Zähle generische Manakosten (z.B. {2} = 2)
    let genericCost = 0;
    const genericMatch = manaCost.match(/{([0-9]+)}/g);
    if (genericMatch) {
      genericCost = genericMatch.reduce((sum, cost) => {
        return sum + parseInt(cost.replace(/{|}/g, ''), 10);
      }, 0);
    }
    
    // Zähle farbige Mana-Symbole (jedes Symbol = 1)
    const coloredMatch = manaCost.match(/{[^0-9{}]+}/g);
    const coloredCost = coloredMatch ? coloredMatch.length : 0;
    
    return genericCost + coloredCost;
  };
  
  // Funktion zum Bestimmen des Seltenheitsrangs
  const getRarityRank = (rarity) => {
    const rarityLower = (rarity || '').toLowerCase();
    switch (rarityLower) {
      case 'common': return 1;
      case 'uncommon': return 2;
      case 'rare': return 3;
      case 'mythic': case 'mythic rare': return 4;
      case 'special': case 'bonus': return 5;
      default: return 0; // Unbekannte Seltenheit
    }
  };
  
  // Funktion zum Sortieren der Karten
  const sortedCards = React.useMemo(() => {
    let sortableCards = [...cards];
    if (sortConfig.key) {
      sortableCards.sort((a, b) => {
        // Normalisiere die Karten für den Vergleich
        const normalizedA = normalizeCard(a);
        const normalizedB = normalizeCard(b);
        
        // Spezielle Behandlung für Seltenheiten
        if (sortConfig.key === 'rarity') {
          const aRank = getRarityRank(normalizedA.rarity);
          const bRank = getRarityRank(normalizedB.rarity);
          
          if (aRank !== bRank) {
            return sortConfig.direction === 'ascending' 
              ? aRank - bRank 
              : bRank - aRank;
          }
          // Bei gleicher Seltenheit, alphabetisch nach Namen sortieren
          const aName = normalizedA.name.toLowerCase();
          const bName = normalizedB.name.toLowerCase();
          return sortConfig.direction === 'ascending'
            ? aName.localeCompare(bName)
            : bName.localeCompare(aName);
        }
        
        // Spezielle Behandlung für Manakosten
        if (sortConfig.key === 'mana_cost') {
          const aCost = extractManaCost(normalizedA.mana_cost);
          const bCost = extractManaCost(normalizedB.mana_cost);
          
          if (aCost !== bCost) {
            return sortConfig.direction === 'ascending' 
              ? aCost - bCost 
              : bCost - aCost;
          }
          // Bei gleichen Kosten, alphabetisch nach Namen sortieren
          const aName = normalizedA.name.toLowerCase();
          const bName = normalizedB.name.toLowerCase();
          return sortConfig.direction === 'ascending'
            ? aName.localeCompare(bName)
            : bName.localeCompare(aName);
        } 
        
        // Normale alphabetische Sortierung für Strings
        const aValue = normalizedA[sortConfig.key] || '';
        const bValue = normalizedB[sortConfig.key] || '';
        
        // Strings mit localeCompare vergleichen (korrekte alphabetische Sortierung)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
            : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
        }
        
        // Fallback für andere Datentypen
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCards;
  }, [cards, sortConfig]);
  
  // Handler für Klick auf Spaltenüberschrift
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Funktion zum Bestimmen der Sortierklasse für die Spaltenüberschrift
  const getSortDirectionClass = (name) => {
    if (!sortConfig) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };
  
  // Bestimme die Kartenfarbe basierend auf dem Typ
  const getCardColor = (type) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('creature')) return 'red';
    if (typeLower.includes('land')) return 'green';
    if (typeLower.includes('instant') || typeLower.includes('sorcery')) return 'blue';
    if (typeLower.includes('artifact')) return 'gray';
    if (typeLower.includes('enchantment')) return 'purple';
    if (typeLower.includes('planeswalker')) return 'orange';
    return 'darkgray';
  };
  
  // Karte zum Deck hinzufügen
  const handleAddToDeck = (e, card) => {
    e.stopPropagation();
    e.preventDefault();
    if (onAddToDeck) {
      onAddToDeck(card);
    }
  };

  return (
    <div className="magic-card-list">
      <table>
        <thead>
          <tr>
            <th 
              className={`name-column sortable ${getSortDirectionClass('name')}`}
              onClick={() => requestSort('name')}
            >
              Name
              <span className="sort-indicator"></span>
            </th>
            <th 
              className={`type-column sortable ${getSortDirectionClass('type')}`}
              onClick={() => requestSort('type')}
            >
              Typ
              <span className="sort-indicator"></span>
            </th>
            <th 
              className={`mana-column sortable ${getSortDirectionClass('mana_cost')}`}
              onClick={() => requestSort('mana_cost')}
            >
              Mana
              <span className="sort-indicator"></span>
            </th>
            <th 
              className={`set-column sortable ${getSortDirectionClass('set_name')}`}
              onClick={() => requestSort('set_name')}
            >
              Set
              <span className="sort-indicator"></span>
            </th>
            <th 
              className={`rarity-column sortable ${getSortDirectionClass('rarity')}`}
              onClick={() => requestSort('rarity')}
            >
              Seltenheit
              <span className="sort-indicator"></span>
            </th>
            <th className="actions-column">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {sortedCards.map(card => {
            const normalizedCard = normalizeCard(card);
            return (
              <tr 
                key={normalizedCard.id} 
                className="card-list-row"
                style={{ borderLeft: `4px solid ${getCardColor(normalizedCard.type)}` }}
              >
                <td className="name-column">
                  <div className="card-name-container">
                    <span className="card-name">{normalizedCard.name}</span>
                  </div>
                </td>
                <td className="type-column">{normalizedCard.type}</td>
                <td className="mana-column">
                  {normalizedCard.mana_cost && <ManaCost cost={normalizedCard.mana_cost} size="1x" />}
                </td>
                <td className="set-column">{normalizedCard.set_name}</td>
                <td className="rarity-column">{normalizedCard.rarity}</td>
                <td className="actions-column">
                  <div className="action-buttons">
                    <button 
                      className="btn-add-list" 
                      onClick={(e) => handleAddToDeck(e, card)} 
                      title="Zum Deck hinzufügen"
                    >
                      +
                    </button>
                    <Link 
                      to={`/card/${normalizedCard.id}`} 
                      className="btn-details" 
                      title="Details anzeigen"
                    >
                      Info
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

MagicCardList.propTypes = {
  cards: PropTypes.array.isRequired,
  onAddToDeck: PropTypes.func
};

export default MagicCardList;
