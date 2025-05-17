import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/DeckBuilder.css';
import './styles/Cards.css';
import './styles/HomePage.css';

import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import { cardsApi } from './services/api';

function App() {
  // State für die Suche und Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    set: '',
    manaCost: ''
  });
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Karten aus der API laden
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);

      try {
        const cardsData = await cardsApi.getCards();
        setAllCards(cardsData);
        setFilteredCards(cardsData);
      } catch (error) {
        console.error('Fehler beim Laden der Karten:', error);
        setError('Fehler beim Laden der Karten. Bitte versuche es später erneut.');
        setAllCards([]);
        setFilteredCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Effekt zum Filtern der Karten bei Änderungen an Suche oder Filtern
  useEffect(() => {
    if (!allCards.length) return;

    let result = [...allCards];

    // Filtern nach Suchbegriff
    if (searchTerm) {
      result = result.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtern nach Kartentyp
    if (filters.type) {
      result = result.filter(card =>
        card.type.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    // Filtern nach Seltenheit
    if (filters.rarity) {
      result = result.filter(card =>
        card.rarity.toLowerCase() === filters.rarity.toLowerCase()
      );
    }

    // Filtern nach Set
    if (filters.set) {
      result = result.filter(card =>
        card.set_code.toLowerCase() === filters.set.toLowerCase()
      );
    }

    // Filtern nach Manakosten
    if (filters.manaCost) {
      result = result.filter(card =>
        card.mana_cost && card.mana_cost.includes(filters.manaCost)
      );
    }
    
    setFilteredCards(result);
  }, [searchTerm, filters, allCards]);
  
  // Handler für Änderungen in der Suchleiste
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  
  // Handler für Änderungen an den Filtern
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'reset') {
      // Alle Filter zurücksetzen
      setFilters({
        type: '',
        rarity: '',
        set: '',
        manaCost: ''
      });
    } else {
      // Einzelnen Filter aktualisieren
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: value
      }));
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Magic Frog</h1>
          <p>Dein Magic: The Gathering Deck Builder</p>
          <Navigation />
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={
              <HomePage 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                filteredCards={filteredCards}
                loading={loading}
                error={error}
              />
            } />
            <Route path="/deck-builder" element={<DeckBuilderPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>Entwickelt mit React - {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
