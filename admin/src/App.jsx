import React from 'react'
import NavBar from './components/navBar/NavBar'
import Admin from './pages/admin/admin'
import Order from './components/orders/Order'

const App = () => {
  return (
    <div>
      <NavBar/>
      <Admin/>
    </div>
  )
}

export default App