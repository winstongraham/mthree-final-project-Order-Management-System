import React, { useEffect, useState } from 'react';
import api from '../api';

export default function OrderList({ refreshFlag }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return  <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Orders</h2>
            <ul>
                {orders.length === 0 && <li>No orders found.</li>}
                {orders.map(order => (
                    <li key={order.id}>
                        {order.instrument} - {order.quantity} @ ${order.price} [{order.side}]
                    </li>
                ))}
            </ul>
        </div>
    );
}