import React, { useState, useEffect } from 'react';
import api from '../api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch {
      alert('Failed to fetch users');
    }
  };

  const startEdit = (user) => {
    setEditUserId(user.id);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditEmail('');
    setEditRole('');
  };

  const submitEdit = async () => {
    try {
      await api.put(`/users/${editUserId}`, {
        email: editEmail,
        role: editRole,
      });
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      cancelEdit();
      fetchUsers(); // refresh list
    } catch {
      alert('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchUsers();
    } catch {
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
              {editUserId === user.id ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                    />
                  </td>
                  <td>
                    <select value={editRole} onChange={e => setEditRole(e.target.value)}>
                      <option value="trader">Trader</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={submitEdit}>Save</button>
                    <button onClick={cancelEdit} style={{ marginLeft: '5px' }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => startEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)} style={{ color: 'red', marginLeft: '10px' }}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
