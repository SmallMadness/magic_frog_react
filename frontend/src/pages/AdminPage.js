import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import SyncButton from '../components/admin/SyncButton';
import UserManagement from '../components/admin/UserManagement';
import authService from '../services/auth';
import '../styles/Admin.css';

/**
 * Admin-Seite für die Verwaltung der Anwendung
 * @returns {JSX.Element} Die gerenderte Admin-Seite
 */
function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sync');

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdminUser = await authService.isAdmin();
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Fehler beim Überprüfen des Admin-Status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div className="loading">Lade Admin-Bereich...</div>;
  }

  // Wenn der Benutzer kein Administrator ist, zur Login-Seite weiterleiten
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-container">
      <h2>Administration</h2>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => setActiveTab('sync')}
        >
          Datensynchronisation
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Benutzerverwaltung
        </button>
        <button 
          className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistiken
        </button>
      </div>
      
      {activeTab === 'sync' && (
        <div className="admin-section">
          <h3>Datensynchronisation</h3>
          <SyncButton />
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="admin-section">
          <h3>Benutzerverwaltung</h3>
          <UserManagement />
        </div>
      )}
      
      {activeTab === 'stats' && (
        <div className="admin-section">
          <h3>Datenbank-Statistiken</h3>
          <p>Hier könnten in Zukunft Statistiken über die Datenbank angezeigt werden.</p>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
