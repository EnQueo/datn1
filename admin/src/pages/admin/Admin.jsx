import React from 'react'
import SideBar from '../../components/sideBar/SideBar'
import './Admin.css'
import {Routes,Route} from 'react-router-dom'
import AddProduct from '../../components/addProduct/AddProduct'
import ListProduct from '../../components/listProduct/ListProduct.JSX'

const Admin = () => {
  return (
    <div className='admin'>
      <SideBar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
      </Routes>
    </div>
  )
}

export default Admin