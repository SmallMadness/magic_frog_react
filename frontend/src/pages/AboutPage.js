import React from 'react';

/**
 * About-Seite mit Informationen über die App
 * @returns {JSX.Element} Die gerenderte About-Seite
 */
function AboutPage() {
  return (
    <div className="about-container">
      <h2>Über Magic Frog</h2>
      
      <section className="about-section">
        <h3>Was ist Magic Frog?</h3>
        <p>
          Magic Frog ist eine React-basierte Webanwendung zum Durchsuchen, Filtern und Verwalten 
          von Magic: The Gathering Karten. Mit dieser App kannst du deine Kartensammlung durchsuchen,
          Decks erstellen und deine Spielstrategien optimieren.
        </p>
      </section>
      
      <section className="about-section">
        <h3>Features</h3>
        <ul>
          <li>Durchsuche und filtere Karten nach verschiedenen Kriterien</li>
          <li>Sieh dir detaillierte Karteninformationen an</li>
          <li>Erstelle und verwalte deine eigenen Decks (in Entwicklung)</li>
          <li>Analysiere Deck-Statistiken und Mana-Kurven (in Entwicklung)</li>
        </ul>
      </section>
      
      <section className="about-section">
        <h3>Technologie</h3>
        <p>
          Diese Anwendung wurde mit React entwickelt und nutzt moderne Web-Technologien 
          wie React Hooks, React Router und CSS Grid für ein responsives Design.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
