// import { useState } from 'react';
// import OrderForm from './components/OrderForm';
// import OrderList from './components/OrderList';
// import OrderSearch from './components/OrderSearch'; // <-- import the new component

// function App() {
//   const [refreshFlag, setRefreshFlag] = useState(false);
//   const [viewAll, setViewAll] = useState(false);
//   const [orders, setOrders] = useState(null); // <-- for search results

//   const handleOrderCreated = () => {
//     setRefreshFlag(!refreshFlag);
//   };

//   return (
//     <div className="App" style={{ padding: '20px' }}>
//       <h1>Order Management System</h1>

//       {!viewAll ? (
//         <>
//           <OrderForm onOrderCreated={handleOrderCreated} />
//           <OrderList refreshFlag={refreshFlag} limit={5} />
//           <button onClick={() => setViewAll(true)} style={{ marginTop: '20px' }}>
//             View All Orders
//           </button>
//         </>
//       ) : (
//         <>
//           <button onClick={() => setViewAll(false)}>Back to Home</button>
//           <OrderSearch setOrders={setOrders} /> {/* <-- new search component */}
//           <OrderList orders={orders} refreshFlag={refreshFlag} />
//         </>
//       )}
//     </div>
//   );
// }

// export default App;
