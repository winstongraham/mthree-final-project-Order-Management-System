import React, { useState } from 'react';
import api from '../api';

export default function OrderList({ orders = [], limit }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [editOrderId, setEditOrderId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  // Apply limit if provided
  const displayedOrders = limit ? orders.slice(-limit) : orders;

  const startEdit = (order) => {
    setEditOrderId(order.id);
    setEditPrice(order.price);
    setEditQuantity(order.quantity);
  };

  const cancelEdit = () => {
    setEditOrderId(null);
    setEditPrice('');
    setEditQuantity('');
  };

  const submitEdit = async () => {
    const price = parseFloat(editPrice);
    const quantity = parseInt(editQuantity);

    if (isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      alert('Price must be > 0 and Quantity must be a whole number > 0.');
      return;
    }

    try {
      await api.put(`/orders/${editOrderId}`, {
        price,
        quantity,
      });
      cancelEdit();
      setSuccessMessage('Order updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setSuccessMessage('Order deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  return (
    <div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Side</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map(order => (
            <tr key={order.id}>
              <td>{order.instrument}</td>
              <td>{order.side}</td>
              {editOrderId === order.id ? (
                <>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={editQuantity}
                      onChange={e => setEditQuantity(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={submitEdit}>Save</button>
                    <button onClick={cancelEdit} style={{ marginLeft: '5px' }}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{order.quantity}</td>
                  <td>${order.price}</td>
                  <td>
                    <button onClick={() => startEdit(order)}>Edit</button>
                    <button onClick={() => handleDelete(order.id)} style={{ color: 'red', marginLeft: '10px' }}>
                      Delete
                    </button>
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
