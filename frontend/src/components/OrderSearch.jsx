import React, { useState } from 'react';

export default function OrderSearch({ setOrders, allOrders, setAllOrders }) {
  const [searchId, setSearchId] = useState('');

  const fetchAllOrders = async () => {
    try {
      const res = await api.get('/orders');
      setAllOrders(res.data);
      setOrders(res.data); // display all orders
    } catch {
      alert('Failed to fetch all orders');
    }
  };

  const filterOrderById = () => {
    if (!searchId) return;

    const filtered = allOrders.filter(order => order.id.toString() === searchId);
    if (filtered.length > 0) {
      setOrders(filtered);
    } else {
      alert('Order not found');
    }
  };

  return (
    <div className="flex gap-2 items-center mb-4">
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
