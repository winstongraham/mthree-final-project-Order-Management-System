import React, { useEffect, useState } from 'react';
import api from '../api';

export default function OrderList({ refreshFlag }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [editOrderId, setEditOrderId] = useState(null);
    const [editPrice, setEditPrice] = useState('');
    const [editQuantity, setEditQuantity] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [refreshFlag]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

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
        try {
            await api.put(`/orders/${editOrderId}`, {
                price: editPrice,
                quantity: editQuantity,
            });
            cancelEdit();
            fetchOrders();
            setSuccessMessage('Order updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert('Failed to update order');
        }
    };

    const handleDelete = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);
            await fetchOrders();
            setSuccessMessage('Order deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <ul>
                {orders.slice(-5).map(order => (
                    <li key={order.id}>
                        {order.instrument} - 
                        {editOrderId === order.id ? (
                            <>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editPrice}
                                    onChange={e => setEditPrice(e.target.value)}
                                />
                                <input
                                    type="number"
                                    value={editQuantity}
                                    onChange={e => setEditQuantity(e.target.value)}
                                />
                                <button onClick={submitEdit}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {order.quantity} @ ${order.price} [{order.side}]
                                <button onClick={() => startEdit(order)}>Edit</button>
                            </>
                        )}
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
