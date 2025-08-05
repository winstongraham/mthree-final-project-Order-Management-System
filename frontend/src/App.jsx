import { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const handleOrderCreated = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Order Management System</h1>

      {!viewAll ? (
        <>
          <OrderForm onOrderCreated={handleOrderCreated} />
          <OrderList refreshFlag={refreshFlag} limit={5} />
          <button onClick={() => setViewAll(true)} style={{ marginTop: '20px' }}>
            View All Orders
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setViewAll(false)}>Back to Home</button>
          <OrderList refreshFlag={refreshFlag} /> {/* No limit: show all */}
        </>
      )}
    </div>
  );
}

export default App;
