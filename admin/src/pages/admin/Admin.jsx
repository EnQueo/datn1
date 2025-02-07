import React from 'react'
import SideBar from '../../components/sideBar/SideBar'
import './Admin.css'
import {Routes,Route} from 'react-router-dom'
import AddProduct from '../../components/addProduct/AddProduct'
import ListProduct from '../../components/listProduct/ListProduct.JSX'
import Order from '../../components/orders/Order'
import Users from '../../components/users/Users'
import Coupon from '../../components/coupon/Coupon'
import Dashboard from '../../components/dashboard/Dashboard'

const Admin = () => {
  return (
    <div className='admin'>
      <SideBar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/> 
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/coupon' element={<Coupon/>}/>
      </Routes>
    </div>
  )
}

export default Admin