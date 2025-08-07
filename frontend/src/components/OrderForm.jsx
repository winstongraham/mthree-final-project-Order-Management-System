import React, { useState } from 'react';
import api from '../api';

export default function OrderForm({ onOrderCreated, user_id }) {
  const [instrument, setInstrument] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState('buy');
  const [status, setStatus] = useState('open');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!instrument || !quantity || !price) {
      setError('Please fill in all fields');
      return;
    }

    if (!user_id) {
      setError('User ID missing, cannot submit order.');
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT: Use key 'user_id' to match backend expectation
      const response = await api.post('/orders', {
        instrument,
        quantity: Number(quantity),
        price: Number(price),
        side,
        status,
        user_id,
      });
      setLoading(false);
      onOrderCreated(response.data);
      setSuccess('Order created successfully!');
      setInstrument('');
      setQuantity('');
      setPrice('');
      setSide('buy');
      setStatus('open');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Order submission error:', err.response || err.message || err);
      setLoading(false);
      setError('Failed to create order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Create New Order</h3>

      <div>
        <label>Instrument: </label>
        <input
          type="text"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value.toUpperCase())}
          placeholder="e.g. AAPL"
        />
      </div>

      <div>
        <label>Quantity: </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 10"
        />
      </div>

      <div>
        <label>Price: </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 150.00"
        />
      </div>

      <div>
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">open</option>
          <option value="filled">filled</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>

      <div>
        <label>Side: </label>
        <select value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Order'}
      </button>
    </form>
  );
}
