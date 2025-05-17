import React from 'react';
import SyncButton from '../components/admin/SyncButton';

/**
 * Admin-Seite für die Verwaltung der Anwendung
 * @returns {JSX.Element} Die gerenderte Admin-Seite
 */
function AdminPage() {
  return (
    <div className="admin-container">
      <h2>Administration</h2>
      
      <div className="admin-section">
        <SyncButton />
      </div>
      
      <div className="admin-section">
        <h3>Datenbank-Statistiken</h3>
        <p>Hier könnten in Zukunft Statistiken über die Datenbank angezeigt werden.</p>
      </div>
    </div>
  );
}

export default AdminPage;
