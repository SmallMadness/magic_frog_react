import React, { useState } from 'react';
import './App.css';

// Importiere Komponenten
import CardGrid from './components/cards/CardGrid';
import SearchBar from './components/search/SearchBar';

// Importiere Daten
import exampleCards from './data/cardData';

function App() {
  // State für die Suche
  const [searchTerm, setSearchTerm] = useState('');
  
  // Einfache Filterfunktion (wird später erweitert)
  const filteredCards = exampleCards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler für Änderungen in der Suchleiste
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Magic: The Gathering Deck Builder</h1>
        <p>Erstelle und verwalte deine Magic-Decks</p>
      </header>
      <main className="App-main">
        {/* Suchleiste */}
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
        
        <section className="card-display">
          <h2>Kartensammlung ({filteredCards.length} Karten)</h2>
          <CardGrid cards={filteredCards} />
        </section>
      </main>
      <footer className="App-footer">
        <p>Entwickelt mit React - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
