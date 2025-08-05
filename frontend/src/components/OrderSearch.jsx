import React, { useState } from 'react';
import api from '../api';

export default function OrderSearch({ setOrders }) {
  const [searchId, setSearchId] = useState('');

  const fetchAllOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      alert('Failed to fetch all orders');
    }
  };

  const fetchOrderById = async () => {
    if (!searchId) return;
    try {
      const res = await api.get(`/orders/${searchId}`);
      setOrders([res.data]);
    } catch {
      alert('Order not found');
    }
  };

  return (
    <div>
      <button onClick={fetchAllOrders}>View All Orders</button>
      <input
        type="number"
        placeholder="Enter Order ID"
        value={searchId}
        onChange={e => setSearchId(e.target.value)}
      />
      <button onClick={fetchOrderById}>Search by ID</button>
    </div>
  );
}
