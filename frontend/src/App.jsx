import { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import OrderSearch from './components/OrderSearch';
import api from './api';

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await api.get('/orders');
        setAllOrders(response.data);
        setFilteredOrders(response.data);
      } catch {
        alert('Failed to fetch all orders');
      }
    };

    fetchAllOrders();
  }, [refreshFlag]);

  const handleOrderCreated = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>Order Management System</h1>

      {!viewAll ? (
        <>
          <OrderForm onOrderCreated={handleOrderCreated} />
          <OrderList orders={filteredOrders} limit={5} />
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
          <OrderList orders={filteredOrders} />
        </>
      )}
    </div>
  );
}

export default App;




{/* <div
  className="App"
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  }}
> */}
