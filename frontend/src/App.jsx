import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OrderList from './components/OrderList'
import OrderForm from './components/OrderForm'

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleOrderCreated = () => {
    // Toggle refresh flag to tell OrderList to reload
    setRefreshFlag(!refreshFlag);
  };

  return (
      <div className="App" style={{ padding: '20px' }}>
      <h1>Order Management System</h1>
      <OrderForm onOrderCreated={handleOrderCreated} />
      <OrderList refreshFlag={refreshFlag} />
    </div>
  );
}

export default App;
