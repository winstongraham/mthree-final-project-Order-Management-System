import React, { useState } from 'react';
import api from '../api';

export default function UserForm({ onUserCreated }) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('trader');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !fullName || !email || !role) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users', { username, full_name: fullName, email, role });
      setSuccess('User created successfully!');
      setUsername('');
      setFullName('');
      setEmail('');
      setRole('trader');
      onUserCreated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create user');
      console.error(err.response || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Create New User</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div>
        <label>
          Username:{' '}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Full Name:{' '}
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Email:{' '}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Role:{' '}
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="trader">Trader</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Submitting...' : 'Create User'}
      </button>
    </form>
  );
}
