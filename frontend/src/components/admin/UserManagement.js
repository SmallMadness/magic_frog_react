import React, { useState, useEffect } from 'react';
import authService from '../../services/auth';
import '../../styles/Admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    is_active: true
  });

  // Benutzer laden
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (error) {
      setError('Fehler beim Laden der Benutzer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Benutzer zum Bearbeiten auswählen
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    });
  };

  // Bearbeitung abbrechen
  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      role: '',
      is_active: true
    });
  };

  // Formularänderungen verarbeiten
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Benutzer aktualisieren
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await authService.updateUser(editingUser.id, formData);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      setError('Fehler beim Aktualisieren des Benutzers: ' + error.message);
    }
  };

  // Benutzer löschen
  const handleDelete = async (userId) => {
    if (!window.confirm('Möchtest du diesen Benutzer wirklich löschen?')) {
      return;
    }
    
    setError('');
    
    try {
      await authService.deleteUser(userId);
      loadUsers();
    } catch (error) {
      setError('Fehler beim Löschen des Benutzers: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Benutzer werden geladen...</div>;
  }

  return (
    <div className="user-management">
      <h2>Benutzerverwaltung</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {editingUser ? (
        <div className="edit-user-form">
          <h3>Benutzer bearbeiten</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="username">Benutzername</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-Mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Rolle</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">Benutzer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Aktiv
              </label>
            </div>
            
            <div className="button-group">
              <button type="submit" className="primary-button">Speichern</button>
              <button type="button" className="secondary-button" onClick={handleCancelEdit}>Abbrechen</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="users-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Benutzername</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Erstellt am</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-users">Keine Benutzer gefunden</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role === 'admin' ? 'Administrator' : 'Benutzer'}</td>
                    <td>{user.is_active ? 'Aktiv' : 'Inaktiv'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="edit-button" 
                        onClick={() => handleEdit(user)}
                      >
                        Bearbeiten
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(user.id)}
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button className="refresh-button" onClick={loadUsers}>
            Aktualisieren
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
