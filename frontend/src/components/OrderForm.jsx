import React, { useState } from 'react';
import api from '../api';

export default function Order({ onOrderCreated }) {
    const [instrument, setInstrument] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [side, setSide] = useState('buy'); // default side
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSumbit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic frontend validation
        if (!instrument || !quantity || !price) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/orders',  {
                instrument,
                quantity: Number(quantity),
                price: Number(price),
                side, 
            });
            setLoading(false);
            onOrderCreated(response.data) // Notify parent
            // Clear form
            setInstrument('');
            setQuantity('');
            setPrice('');
            setSide('buy');
        }   catch (err) {
            setLoading(false);
            setError('Failed to create order. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSumbit} style={{ marginBottom: '20px' }}>
            <h3>Create New Order</h3>

            <div>
                <label>Instrument: </label>
                <input
                    type='text'
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value.toUpperCase())}
                    placeholder='e.g. AAPLE'
                />
            </div>

            <div>
                <label>Quantity: </label>
                <input
                    type='number'
                    min='1'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder='e.g. 10'
                />
            </div>

            <div>
                <label>Price: </label>
                <input
                    type='number'
                    min='0.01'
                    step='0.01'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder='e.g. 150.00'
                />
            </div>

            <div>
                <label>Side: </label>
                <select value={side} onChange={(e) => setSide(e.target.value)}>
                    <option value='buy'>Buy</option>
                    <option value='sell'>Sell</option>
                </select>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type='submit' disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Order'}
            </button>
        </form>
    );
};