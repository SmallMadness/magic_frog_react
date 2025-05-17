/**
 * API-Service für die Kommunikation mit dem Backend
 */

// API-Basis-URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Hilfsfunktion für API-Aufrufe
 * @param {string} endpoint - Der API-Endpunkt
 * @param {Object} options - Optionen für den Fetch-Aufruf
 * @returns {Promise<any>} Die API-Antwort
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Standard-Header setzen
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  try {
    console.log(`API-Anfrage an: ${endpoint}`);
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Fehler werfen, wenn die Anfrage nicht erfolgreich war
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API-Fehler: ${response.status}`);
    }
    
    // Leere Antwort bei 204 No Content
    if (response.status === 204) {
      return null;
    }
    
    // JSON-Antwort parsen
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

/**
 * Karten-API
 */
export const cardsApi = {
  /**
   * Alle Karten abrufen
   * @param {Object} params - Abfrageparameter (Suche, Filter, Paginierung)
   * @returns {Promise<Object>} Karten und Metadaten
   */
  getCards: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Parameter hinzufügen
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi(`/cards/${query}`);
  },
  
  /**
   * Eine einzelne Karte abrufen
   * @param {string} cardId - Die ID der Karte
   * @returns {Promise<Object>} Die Karte
   */
  getCard: (cardId) => {
    return fetchApi(`/cards/${cardId}`);
  }
};

/**
 * Decks-API
 */
export const decksApi = {
  /**
   * Alle Decks abrufen
   * @param {Object} params - Abfrageparameter (Paginierung)
   * @returns {Promise<Array>} Liste der Decks
   */
  getDecks: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Parameter hinzufügen
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi(`/decks/${query}`);
  },
  
  /**
   * Ein einzelnes Deck abrufen
   * @param {number} deckId - Die ID des Decks
   * @returns {Promise<Object>} Das Deck
   */
  getDeck: (deckId) => {
    return fetchApi(`/decks/${deckId}`);
  },
  
  /**
   * Ein neues Deck erstellen
   * @param {Object} deckData - Die Deck-Daten
   * @returns {Promise<Object>} Das erstellte Deck
   */
  createDeck: (deckData) => {
    return fetchApi('/decks/', {
      method: 'POST',
      body: JSON.stringify(deckData)
    });
  },
  
  /**
   * Ein bestehendes Deck aktualisieren
   * @param {number} deckId - Die ID des Decks
   * @param {Object} deckData - Die aktualisierten Deck-Daten
   * @returns {Promise<Object>} Das aktualisierte Deck
   */
  updateDeck: (deckId, deckData) => {
    return fetchApi(`/decks/${deckId}`, {
      method: 'PUT',
      body: JSON.stringify(deckData)
    });
  },
  
  /**
   * Ein Deck löschen
   * @param {number} deckId - Die ID des Decks
   * @returns {Promise<void>}
   */
  deleteDeck: (deckId) => {
    return fetchApi(`/decks/${deckId}`, {
      method: 'DELETE'
    });
  },
  
  /**
   * Eine Karte zu einem Deck hinzufügen
   * @param {number} deckId - Die ID des Decks
   * @param {string} cardId - Die ID der Karte
   * @param {number} quantity - Die Anzahl der Karten
   * @param {boolean} isSideboard - Ob die Karte im Sideboard ist
   * @returns {Promise<Object>} Das aktualisierte Deck
   */
  addCardToDeck: (deckId, cardId, quantity = 1, isSideboard = false) => {
    const queryParams = new URLSearchParams();
    queryParams.append('quantity', quantity.toString());
    queryParams.append('is_sideboard', isSideboard.toString());
    
    return fetchApi(`/decks/${deckId}/cards/${cardId}?${queryParams.toString()}`, {
      method: 'POST'
    });
  },
  
  /**
   * Eine Karte aus einem Deck entfernen
   * @param {number} deckId - Die ID des Decks
   * @param {string} cardId - Die ID der Karte
   * @param {boolean} isSideboard - Ob die Karte im Sideboard ist
   * @returns {Promise<Object>} Das aktualisierte Deck
   */
  removeCardFromDeck: (deckId, cardId, isSideboard = false) => {
    const queryParams = new URLSearchParams();
    if (isSideboard) {
      queryParams.append('is_sideboard', 'true');
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi(`/decks/${deckId}/cards/${cardId}${query}`, {
      method: 'DELETE'
    });
  }
};

// API-Service-Objekt
const apiService = {
  cards: cardsApi,
  decks: decksApi
};

export default apiService;
