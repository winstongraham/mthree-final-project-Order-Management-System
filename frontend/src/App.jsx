import { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import OrderSearch from './components/OrderSearch';
import UserList from './components/UserList';  // Import new UserList component
import api from './api';

function App() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [view, setView] = useState('orders'); // 'orders' or 'users'

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
    if (view === 'orders') {
      refreshOrders();
    }
  }, [view]);

  // When order created, refresh orders
  const handleOrderCreated = () => {
    refreshOrders();
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>Order Management System</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('orders')} disabled={view === 'orders'}>
          Orders
        </button>
        <button onClick={() => setView('users')} disabled={view === 'users'} style={{ marginLeft: '10px' }}>
          Users
        </button>
      </div>

      {view === 'orders' && (
        <>
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
        </>
      )}

      {view === 'users' && <UserList />}
    </div>
  );
}

export default App;
