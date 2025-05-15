import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importiere Komponenten
import Navigation from './components/Navigation';

// Importiere Seiten
import HomePage from './pages/HomePage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import AboutPage from './pages/AboutPage';

// Importiere Daten
import exampleCards from './data/cardData';

function App() {
  // State für die Suche und Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    set: '',
    manaCost: ''
  });
  const [filteredCards, setFilteredCards] = useState(exampleCards);
  
  // Effekt zum Filtern der Karten bei Änderungen an Suche oder Filtern
  useEffect(() => {
    let result = exampleCards;
    
    // Filtern nach Suchbegriff
    if (searchTerm) {
      result = result.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtern nach Kartentyp
    if (filters.type) {
      result = result.filter(card => 
        card.type.includes(filters.type)
      );
    }
    
    // Filtern nach Seltenheit
    if (filters.rarity) {
      result = result.filter(card => 
        card.rarity === filters.rarity
      );
    }
    
    // Filtern nach Set
    if (filters.set) {
      result = result.filter(card => 
        card.set === filters.set
      );
    }
    
    // Filtern nach Manakosten (vereinfacht)
    if (filters.manaCost) {
      const cost = parseInt(filters.manaCost);
      if (cost === 5) {
        // 5+ Mana
        result = result.filter(card => {
          const manaCost = card.manaCost.match(/\d+/) ? parseInt(card.manaCost.match(/\d+/)[0]) : 0;
          return manaCost >= 5;
        });
      } else {
        // Exakter Manawert
        result = result.filter(card => {
          const manaCost = card.manaCost.match(/\d+/) ? parseInt(card.manaCost.match(/\d+/)[0]) : 0;
          return manaCost === cost;
        });
      }
    }
    
    setFilteredCards(result);
  }, [searchTerm, filters]); // Abhängigkeiten für den Effekt
  
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
          <h1>Magic: The Gathering Deck Builder</h1>
          <p>Erstelle und verwalte deine Magic-Decks</p>
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
              />
            } />
            <Route path="/deck-builder" element={<DeckBuilderPage />} />
            <Route path="/about" element={<AboutPage />} />
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
