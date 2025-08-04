import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OrderList from './components/OrderList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
      <h1>Order Management System</h1>
      <OrderList />
    </div>
    </>
  )
}

export default App
