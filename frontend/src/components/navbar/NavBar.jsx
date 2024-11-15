import React, { useContext, useRef, useState } from 'react'
import './NavBar.css'
import nav_dropdown from '../assets/Frontend_Assets/nav_dropdown.png'
import logo from '../assets/Frontend_Assets/logo.png'
import cart_icon from '../assets/Frontend_Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'

const NavBar = () => {

    const [menu,setMenu] = useState("home")
    const {getTotalCartItems} = useContext(ShopContext)
    const menuRef = useRef()

    const dropdown_toggle = (e) => {
         menuRef.current.classList.toggle('nav-menu-visible');
         e.target.classList.toggle('open');
    }

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>EQOShop</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration: 'none'}} to='/'>Home</Link>{menu==="home"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("shoes")}}><Link style={{textDecoration: 'none'}} to='/shoes'>Shoes</Link>{menu==="shoes"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("basketballs")}}><Link style={{textDecoration: 'none'}} to='/basketballs'>Basketballs</Link>{menu==="basketballs"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("accessories")}}><Link style={{textDecoration: 'none'}} to='/accessories'>Accessories</Link>{menu==="accessories"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')
        ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>:<Link to='/login'><button>Login</button></Link>}
        <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default NavBar
