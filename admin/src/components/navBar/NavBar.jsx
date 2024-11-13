import React from 'react'
import './NavBar.css'
import navlogo from '../../assets/Admin_Assets/logo.png'
import navProfile from '../../assets/Admin_Assets/nav-profile.svg'

const NavBar = () => {
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={navlogo} alt="" />
        <p>EQOShop</p>
      </div>

        <img src={navProfile} className='nav-profile' alt="" />
    </div>
  )
}

export default NavBar