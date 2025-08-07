import { useState } from 'react';
import api from '../api';

export default function OrderList({ orders, limit, refreshOrders }) {
  const [editOrderId, setEditOrderId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const startEdit = (order) => {
    setEditOrderId(order.id);
    setEditStatus(order.status);
    setEditPrice(order.price);
    setEditQuantity(order.quantity);
  };

  const cancelEdit = () => {
    setEditOrderId(null);
    setEditStatus('');
    setEditPrice('');
    setEditQuantity('');
  };

  const submitEdit = async () => {
    try {
      await api.put(`/orders/${editOrderId}`, {
        price: Number(editPrice),
        quantity: Number(editQuantity),
        status: editStatus,
      });
      setSuccessMessage('Order updated successfully!');
      refreshOrders();
      cancelEdit();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update order');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.delete(`/orders/${orderId}`);
      setSuccessMessage('Order deleted successfully!');
      refreshOrders();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete order');
    }
  };

  return (
    <div>
      {successMessage && (
        <p style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</p>
      )}
      <table
        border="1"
        cellPadding="8"
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Instrument</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(limit ? orders.slice(0, limit) : orders).map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.instrument}</td>
              <td>
                {editOrderId === order.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                ) : (
                  order.price
                )}
              </td>
              <td>
                {editOrderId === order.id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                ) : (
                  order.quantity
                )}
              </td>
              <td>
                {editOrderId === order.id ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="filled">Filled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td>
                {editOrderId === order.id ? (
                  <>
                    <button onClick={submitEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(order)}>Edit</button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      style={{ color: 'red', marginLeft: '10px' }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
