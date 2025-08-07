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
    } catch (error) {
    // setError('Failed to create user');
    // console.error(err.response || err.message || err);
        if (error.response && error.response.status === 409) {
            setError(error.response.data.error);
            setTimeout(() => setError(''), 3000);
        } else {
            console.error('Unexpected error:', error);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', textAlign: "center" }}>
      <h3>Create New User</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div className="form-field">
        <label>
          Username:{' '}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
      </div>

      <div className="form-field">
        <label>
          Full Name:
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="form-input"
          />
      </div>

      <div className="form-field">
        <label>
          Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
      </div>

      <div className="form-field">
        <label>
          Role:
        </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required className="form-input">
            <option value="trader">Trader</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? 'Submitting...' : 'Create User'}
      </button>
    </form>
  );
}
