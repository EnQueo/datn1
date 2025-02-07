import React from 'react'
import './SideBar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../../assets/Admin_Assets/Product_Cart.svg'
import list_product_icon from '../../assets/Admin_Assets/Product_list_icon.svg'
import order_icon from '../../assets/Admin_Assets/order_icon.svg'
import user_icon from '../../assets/Admin_Assets/user_icon.svg'
import coupon_icon from '../../assets/Admin_Assets/discount-svgrepo-com.svg'
import dashboard_icon from '../../assets/Admin_Assets/dashboard-svgrepo-com.svg'

const SideBar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
              <img src={dashboard_icon} alt="" className='user-icon'/>
              <p>Dashboard</p>
            </div>
        </Link>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
              <img src={list_product_icon} alt="" />
              <p>Product List</p>
            </div>
        </Link>
        <Link to={'/order'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
              <img src={order_icon} alt="" />
              <p>Orders</p>
            </div>
        </Link>
        <Link to={'/users'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
              <img src={user_icon} alt="" className='user-icon'/>
              <p>User</p>
            </div>
        </Link>
        <Link to={'/coupon'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
              <img src={coupon_icon} alt="" className='user-icon'/>
              <p>Promo</p>
            </div>
        </Link>
    </div>
  )
}

export default SideBar