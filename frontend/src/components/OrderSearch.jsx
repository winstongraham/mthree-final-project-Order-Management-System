import React, { useState } from 'react';

export default function OrderSearch({ setOrders, allOrders }) {
  const [searchId, setSearchId] = useState('');

  const fetchAllOrders = () => {
    setOrders(allOrders);
  };

  const filterOrderById = () => {
    if (!searchId) {
      alert('Please enter an order ID to search.');
      return;
    }

    const filtered = allOrders.filter(order => order.id.toString() === searchId.trim());
    if (filtered.length > 0) {
      setOrders(filtered);
    } else {
      alert('Order not found');
    }
  };

  return (
    <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
      <button onClick={fetchAllOrders}>View All Orders</button>
      <input
        type="number"
        placeholder="Enter Order ID"
        value={searchId}
        onChange={e => setSearchId(e.target.value)}
      />
      <button onClick={filterOrderById}>Search by ID</button>
    </div>
  );
}
