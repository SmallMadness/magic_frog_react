import { API_BASE_URL } from './api';

// Auth-Service für die Benutzerauthentifizierung
const authService = {
  // Benutzer registrieren
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registrierung fehlgeschlagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Registrierungsfehler:', error);
      throw error;
    }
  },

  // Benutzer anmelden
  login: async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/users/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Anmeldung fehlgeschlagen');
      }

      const data = await response.json();
      
      // Token und Admin-Status im localStorage speichern
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isAdmin', data.is_admin || false);
      
      // Benutzerinformationen abrufen
      const userInfo = await authService.getCurrentUser();
      
      return userInfo;
    } catch (error) {
      console.error('Anmeldefehler:', error);
      throw error;
    }
  },

  // Aktuellen Benutzer abrufen
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token ist ungültig oder abgelaufen
          localStorage.removeItem('token');
          return null;
        }
        throw new Error('Fehler beim Abrufen des Benutzerprofils');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzerprofils:', error);
      return null;
    }
  },

  // Benutzer abmelden
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  },

  // Prüfen, ob der Benutzer angemeldet ist
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Prüfen, ob der Benutzer ein Administrator ist
  isAdmin: () => {
    // Prüfe zuerst den im localStorage gespeicherten Admin-Status
    const isAdminFromStorage = localStorage.getItem('isAdmin');
    if (isAdminFromStorage === 'true') {
      return true;
    }
    
    // Wenn kein Admin-Status im localStorage gefunden wurde, prüfe das Token
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    try {
      // Dekodiere das JWT-Token (ohne Signaturprüfung, da dies nur clientseitig ist)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Prüfe alle möglichen Varianten der Admin-Rolle im Token
      return (
        payload.is_admin === true || 
        payload.role === 'ADMIN' || 
        payload.role === 'admin'
      );
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      return false;
    }
  },

  // Benutzer abrufen (nur für Administratoren)
  getUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Nicht autorisiert');
      }

      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Benutzer');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
      throw error;
    }
  },

  // Benutzer aktualisieren (nur für Administratoren)
  updateUser: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Nicht autorisiert');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Aktualisierung fehlgeschlagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Benutzers:', error);
      throw error;
    }
  },

  // Benutzer löschen (nur für Administratoren)
  deleteUser: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Nicht autorisiert');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Löschen fehlgeschlagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers:', error);
      throw error;
    }
  },
};

export default authService;
