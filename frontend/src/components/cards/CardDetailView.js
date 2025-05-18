import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { ManaCost, SetSymbol } from '../symbols/ManaSymbols';
import CardTextFormatter from '../symbols/CardTextFormatter';
import '../../styles/CardDetailView.css';

/**
 * Detailansicht für eine einzelne Magic-Karte mit allen verfügbaren Informationen
 * @returns {JSX.Element} Die gerenderte Kartendetailansicht
 */
function CardDetailView() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.scryfall.com/cards/${cardId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCard(data);
        setLoading(false);
      } catch (err) {
        setError(`Fehler beim Laden der Kartendetails: ${err.message}`);
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardDetails();
    }
  }, [cardId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Bestimme die Kartenfarbe basierend auf dem Typ
  const getCardColor = (type) => {
    if (!type) return 'darkgray';
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('creature')) return 'red';
    if (typeLower.includes('land')) return 'green';
    if (typeLower.includes('instant') || typeLower.includes('sorcery')) return 'blue';
    if (typeLower.includes('artifact')) return 'gray';
    if (typeLower.includes('enchantment')) return 'purple';
    if (typeLower.includes('planeswalker')) return 'orange';
    return 'darkgray';
  };

  if (loading) {
    return (
      <div className="card-detail-loading">
        <div className="loading-spinner"></div>
        <p>Lade Kartendetails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-detail-error">
        <h2>Fehler</h2>
        <p>{error}</p>
        <button className="btn-back" onClick={handleGoBack}>Zurück</button>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="card-detail-error">
        <h2>Karte nicht gefunden</h2>
        <p>Die angeforderte Karte konnte nicht gefunden werden.</p>
        <button className="btn-back" onClick={handleGoBack}>Zurück</button>
      </div>
    );
  }

  return (
    <div className="card-detail-view">
      <div className="card-detail-header">
        <button className="btn-back" onClick={handleGoBack}>
          ← Zurück
        </button>
        <h1>{card.name}</h1>
        {card.mana_cost && (
          <div className="card-detail-mana">
            <ManaCost cost={card.mana_cost} size="2x" />
          </div>
        )}
      </div>

      <div className="card-detail-content">
        <div className="card-detail-image-container">
          <img 
            src={card.image_uris?.normal || card.image_uris?.large || card.image_uris?.small} 
            alt={card.name}
            className="card-detail-image"
          />
        </div>

        <div className="card-detail-info">
          <div className="detail-section">
            <h2>Allgemeine Informationen</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{card.name}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Typ:</span>
                <span className="detail-value">{card.type_line}</span>
              </div>
              
              {card.mana_cost && (
                <div className="detail-item">
                  <span className="detail-label">Manakosten:</span>
                  <span className="detail-value"><ManaCost cost={card.mana_cost} size="1x" /></span>
                </div>
              )}
              
              {card.oracle_text && (
                <div className="detail-item full-width">
                  <span className="detail-label">Text:</span>
                  <span className="detail-value card-text">
                    <CardTextFormatter text={card.oracle_text} />
                  </span>
                </div>
              )}
              
              {(card.power || card.toughness) && (
                <div className="detail-item">
                  <span className="detail-label">Stärke/Widerstandskraft:</span>
                  <span className="detail-value">{card.power}/{card.toughness}</span>
                </div>
              )}
              
              {card.loyalty && (
                <div className="detail-item">
                  <span className="detail-label">Loyalität:</span>
                  <span className="detail-value">{card.loyalty}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h2>Set-Informationen</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Set:</span>
                <span className="detail-value">
                  <SetSymbol set={card.set} rarity={card.rarity} size="2x" /> {card.set_name}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Seltenheit:</span>
                <span className="detail-value">{card.rarity}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Künstler:</span>
                <span className="detail-value">{card.artist}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Sammler-Nr.:</span>
                <span className="detail-value">{card.collector_number}</span>
              </div>
            </div>
          </div>

          {card.prices && (
            <div className="detail-section">
              <h2>Preise</h2>
              <div className="detail-grid">
                {card.prices.usd && (
                  <div className="detail-item">
                    <span className="detail-label">USD:</span>
                    <span className="detail-value">${card.prices.usd}</span>
                  </div>
                )}
                
                {card.prices.usd_foil && (
                  <div className="detail-item">
                    <span className="detail-label">USD (Foil):</span>
                    <span className="detail-value">${card.prices.usd_foil}</span>
                  </div>
                )}
                
                {card.prices.eur && (
                  <div className="detail-item">
                    <span className="detail-label">EUR:</span>
                    <span className="detail-value">€{card.prices.eur}</span>
                  </div>
                )}
                
                {card.prices.eur_foil && (
                  <div className="detail-item">
                    <span className="detail-label">EUR (Foil):</span>
                    <span className="detail-value">€{card.prices.eur_foil}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h2>Spielinformationen</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Farbidentität:</span>
                <span className="detail-value">
                  {card.color_identity && card.color_identity.length > 0 
                    ? card.color_identity.map(color => 
                        <ManaCost key={color} cost={`{${color}}`} size="1x" />
                      )
                    : 'Farblos'}
                </span>
              </div>
              
              {card.keywords && card.keywords.length > 0 && (
                <div className="detail-item full-width">
                  <span className="detail-label">Schlüsselwörter:</span>
                  <span className="detail-value">{card.keywords.join(', ')}</span>
                </div>
              )}
              
              {card.legalities && (
                <div className="detail-item full-width">
                  <span className="detail-label">Legalität:</span>
                  <div className="legalities-grid">
                    {Object.entries(card.legalities).map(([format, legality]) => (
                      <div key={format} className={`legality-item ${legality}`}>
                        <span className="format-name">{format}</span>
                        <span className="legality-status">{legality}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {card.related_uris && (
            <div className="detail-section">
              <h2>Links</h2>
              <div className="detail-grid">
                {card.related_uris.gatherer && (
                  <div className="detail-item">
                    <a href={card.related_uris.gatherer} target="_blank" rel="noopener noreferrer" className="card-link">
                      Gatherer
                    </a>
                  </div>
                )}
                
                {card.related_uris.edhrec && (
                  <div className="detail-item">
                    <a href={card.related_uris.edhrec} target="_blank" rel="noopener noreferrer" className="card-link">
                      EDHREC
                    </a>
                  </div>
                )}
                
                {card.scryfall_uri && (
                  <div className="detail-item">
                    <a href={card.scryfall_uri} target="_blank" rel="noopener noreferrer" className="card-link">
                      Scryfall
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CardDetailView.propTypes = {};

export default CardDetailView;
