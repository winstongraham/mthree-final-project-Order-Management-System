import { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import OrderSearch from './components/OrderSearch';
import api from './api';

function App() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  // Fetch all orders from backend and update states
  const refreshOrders = async () => {
    try {
      const response = await api.get('/orders');
      setAllOrders(response.data);
      setFilteredOrders(response.data);
    } catch {
      alert('Failed to fetch orders');
    }
  };

  // On mount, fetch orders initially
  useEffect(() => {
    refreshOrders();
  }, []);

  // When order created, refresh orders
  const handleOrderCreated = () => {
    refreshOrders();
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>Order Management System</h1>

      {!viewAll ? (
        <>
          <OrderForm onOrderCreated={handleOrderCreated} />
          <OrderList orders={filteredOrders} limit={5} refreshOrders={refreshOrders} />
          <button onClick={() => setViewAll(true)} style={{ marginTop: '20px' }}>
            View All Orders
          </button>
        </>
      ) : (
        <>
          <OrderSearch
            allOrders={allOrders}
            setAllOrders={setAllOrders}
            setOrders={setFilteredOrders}
          />
          <button onClick={() => setViewAll(false)} style={{ marginBottom: '10px' }}>
            Back to Home
          </button>
          <OrderList orders={filteredOrders} refreshOrders={refreshOrders} />
        </>
      )}
    </div>
  );
}

export default App;
