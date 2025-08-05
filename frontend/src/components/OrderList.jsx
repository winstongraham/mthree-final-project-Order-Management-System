import React, { useEffect, useState } from 'react';
import api from '../api';

export default function OrderList({ refreshFlag }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        api.get('/orders')
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch orders');
                setLoading(false);
            });
    }, [refreshFlag]);

    const handleDelete = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);
            // Refresh orders
            const response = await api.get('/orders');
            setOrders(response.data);
            // Set success message
            setSuccessMessage('Order deleted successfully!');
            // Clear message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    };

    if (loading) return  <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <ul>
        {orders
          .slice(-5)
          .map(order => (
            <li key={order.id}>
              {order.instrument} - {order.quantity} @ ${order.price} [{order.side}]
              <button
                style={{ marginLeft: '10px', color: 'red' }}
                onClick={() => handleDelete(order.id)}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}