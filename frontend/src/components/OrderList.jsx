import { useState } from 'react';
import api from '../api';

function OrderList({ orders, limit, refreshOrders }) {
  const [editOrderId, setEditOrderId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const startEdit = (order) => {
    setEditOrderId(order.id);
    setEditStatus(order.status);
    setPrice(order.price);
    setQuantity(order.quantity);
  };

  const cancelEdit = () => {
    setEditOrderId(null);
    setEditStatus('');
    setPrice('');
    setQuantity('');
  };

  const submitEdit = async () => {
    try {
      await api.put(`/orders/${editOrderId}`, {
        price,
        quantity,
        status: editStatus,
      });
      cancelEdit();
      setSuccessMessage('Order updated successfully!');
      refreshOrders(); // Trigger refetch
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setSuccessMessage('Order deleted successfully!');
      refreshOrders(); // Trigger refetch
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
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
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}
      >
        <thead>
          <tr>
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
              <td>{order.instrument}</td>
              <td>
                {editOrderId === order.id ? (
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                ) : (
                  order.price
                )}
              </td>
              <td>
                {editOrderId === order.id ? (
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="number"
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
                    <button onClick={() => handleDelete(order.id)}
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

export default OrderList;
