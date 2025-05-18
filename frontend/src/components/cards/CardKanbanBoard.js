import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MagicCardKanban from './MagicCardKanban';
import MagicCardList from './MagicCardList';
import authService from '../../services/auth';
import '../../styles/CardKanbanBoard.css';

/**
 * Komponente zur Anzeige eines Rasters von Magic-Karten im Kanban-Style
 * @param {Object} props - Die Props der Komponente
 * @param {Array} props.cards - Die Liste der anzuzeigenden Karten
 * @param {Function} props.onAddCardToDeck - Callback, wenn Karte zum Deck hinzugefügt wird
 * @returns {JSX.Element} Das gerenderte Kartenraster
 */
function CardKanbanBoard({ cards, onAddCardToDeck }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' oder 'list'
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // Standard-Sortierung nach Namen
  const cardsPerPage = viewMode === 'kanban' ? 15 : 20; // Mehr Karten in der Listenansicht
  
  // Überprüfe, ob der Benutzer angemeldet ist
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      setIsUserAuthenticated(isAuthenticated);
      
      // Setze die Ansicht auf Kanban zurück, wenn der Benutzer nicht angemeldet ist
      if (!isAuthenticated && viewMode !== 'kanban') {
        setViewMode('kanban');
      }
    };
    
    // Initial prüfen
    checkAuth();
    
    // Event-Listener für Login/Logout-Events
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        checkAuth();
      }
    });
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  // Funktion zum Normalisieren der Kartendaten
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
  
  // Sortiere die Karten basierend auf dem ausgewählten Sortierkriterium
  const sortedCards = React.useMemo(() => {
    let sortableCards = [...cards];
    
    if (sortBy) {
      sortableCards.sort((a, b) => {
        const normalizedA = normalizeCard(a);
        const normalizedB = normalizeCard(b);
        
        // Spezielle Behandlung für Seltenheiten
        if (sortBy === 'rarity') {
          const aRank = getRarityRank(normalizedA.rarity);
          const bRank = getRarityRank(normalizedB.rarity);
          
          if (aRank !== bRank) {
            return aRank - bRank;
          }
        }
        
        // Standardsortierung nach Namen, Typ oder Set
        const aValue = normalizedA[sortBy] || '';
        const bValue = normalizedB[sortBy] || '';
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        }
        
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      });
    }
    
    return sortableCards;
  }, [cards, sortBy]);
  
  // Handle Sortierauswahländerung
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Berechne die aktuell anzuzeigenden Karten
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = sortedCards.slice(indexOfFirstCard, indexOfLastCard);
  
  // Berechne die Gesamtzahl der Seiten
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  
  // Erstelle ein Array mit den Seitenzahlen
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Wechsle zur vorherigen Seite
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Wechsle zur nächsten Seite
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Wechsle zu einer bestimmten Seite
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="card-kanban-container">
      <div className="card-kanban-header">
        <h2>Gefundene Karten: {cards.length}</h2>
        <div className="view-controls">
          {viewMode === 'kanban' && (
            <div className="sort-options">
              <label htmlFor="sortOrder">Sortieren nach:</label>
              <select 
                id="sortOrder" 
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="name">Name</option>
                <option value="rarity">Seltenheit</option>
                <option value="type">Typ</option>
                <option value="set_name">Set</option>
              </select>
            </div>
          )}
          {isUserAuthenticated && (
            <div className="view-toggle">
              <button 
                className={`view-button ${viewMode === 'kanban' ? 'active' : ''}`}
                onClick={() => setViewMode('kanban')}
                aria-label="Kanban-Ansicht"
                title="Kartenansicht"
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="Listen-Ansicht"
                title="Listenansicht"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {viewMode === 'kanban' ? (
        <div className="card-kanban-grid">
          {currentCards.map(card => (
            <div key={card.id} className="card-kanban-item">
              <MagicCardKanban 
                card={card} 
                onAddToDeck={onAddCardToDeck}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="card-list-container">
          <MagicCardList 
            cards={currentCards} 
            onAddToDeck={onAddCardToDeck} 
          />
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button prev" 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            aria-label="Vorherige Seite"
          >
            &laquo;
          </button>
          
          <div className="page-numbers">
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                onClick={() => goToPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-button next" 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            aria-label="Nächste Seite"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

CardKanbanBoard.propTypes = {
  cards: PropTypes.array.isRequired,
  onAddCardToDeck: PropTypes.func
};

CardKanbanBoard.defaultProps = {
  onAddCardToDeck: () => {}
};

export default CardKanbanBoard;
