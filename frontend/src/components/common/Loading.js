import React from 'react';
import '../../styles/Loading.css';

/**
 * Komponente zum Anzeigen eines Ladezustands
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.message - Die anzuzeigende Nachricht
 * @returns {JSX.Element} Die gerenderte Ladekomponente
 */
export function Loading({ message = 'Lade Daten...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

/**
 * Komponente zum Anzeigen einer Fehlermeldung
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.message - Die anzuzeigende Fehlermeldung
 * @returns {JSX.Element} Die gerenderte Fehlerkomponente
 */
export function ErrorMessage({ message }) {
  return message ? (
    <div className="error-container">
      <p>{message}</p>
    </div>
  ) : null;
}

/**
 * Komponente zum Anzeigen einer Erfolgsmeldung
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.message - Die anzuzeigende Erfolgsmeldung
 * @returns {JSX.Element} Die gerenderte Erfolgskomponente
 */
export function SuccessMessage({ message }) {
  return message ? (
    <div className="success-message">
      <p>{message}</p>
    </div>
  ) : null;
}

/**
 * Komponente zum Anzeigen einer Infomeldung
 * @param {Object} props - Die Props der Komponente
 * @param {string} props.message - Die anzuzeigende Infomeldung
 * @returns {JSX.Element} Die gerenderte Infokomponente
 */
export function InfoMessage({ message }) {
  return message ? (
    <div className="info-message">
      <p>{message}</p>
    </div>
  ) : null;
}
