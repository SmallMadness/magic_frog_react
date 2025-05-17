import React, { useState, useEffect } from 'react';

/**
 * Button-Komponente zum Synchronisieren der Karten-Datenbank mit der Scryfall-API
 * @returns {JSX.Element} Die gerenderte Komponente
 */
function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);
  
  // API-Basis-URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  // Status der letzten Synchronisierung abrufen
  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sync/status`);
        if (!response.ok) {
          throw new Error(`Fehler beim Abrufen des Synchronisierungsstatus: ${response.status}`);
        }
        const data = await response.json();
        setLastSync(data.last_sync);
      } catch (error) {
        console.error('Fehler beim Abrufen des Synchronisierungsstatus:', error);
        setError('Fehler beim Abrufen des Synchronisierungsstatus');
      }
    };
    
    fetchSyncStatus();
  }, [API_BASE_URL]);
  
  // Synchronisierung starten
  const handleSync = async () => {
    if (loading) return;
    
    setLoading(true);
    setMessage('');
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/sync/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Fehler beim Starten der Synchronisierung: ${response.status}`);
      }
      
      const data = await response.json();
      setMessage(data.message);
      
      // Status nach 5 Sekunden aktualisieren
      setTimeout(async () => {
        try {
          const statusResponse = await fetch(`${API_BASE_URL}/sync/status`);
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            setLastSync(statusData.last_sync);
          }
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Status:', error);
        } finally {
          setLoading(false);
        }
      }, 5000);
    } catch (error) {
      console.error('Fehler beim Synchronisieren:', error);
      setError(`Fehler beim Synchronisieren: ${error.message}`);
      setLoading(false);
    }
  };
  
  // Formatiertes Datum der letzten Synchronisierung
  const formattedLastSync = lastSync ? new Date(lastSync).toLocaleString() : 'Noch nie';
  
  return (
    <div className="sync-container">
      <h3>Karten-Datenbank synchronisieren</h3>
      <p>
        Dieser Vorgang lädt alle Karten von der Scryfall-API und speichert sie in der lokalen Datenbank.
        Dies kann einige Minuten dauern.
      </p>
      <p>
        <strong>Letzte Synchronisierung:</strong> {formattedLastSync}
      </p>
      <button 
        className="btn btn-primary sync-button" 
        onClick={handleSync}
        disabled={loading}
      >
        {loading ? 'Synchronisierung läuft...' : 'Jetzt synchronisieren'}
      </button>
      {message && <div className="sync-message">{message}</div>}
      {error && <div className="sync-error">{error}</div>}
    </div>
  );
}

export default SyncButton;
