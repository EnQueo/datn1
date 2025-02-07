import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/Admin_Assets/logo.png';

const NavBar = () => {
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="EQOShop" />
        <p>EQOShop Admin Panel</p>
      </div>
      <ul className='nav-menu'>
        <li>
          <Link style={{ textDecoration: 'none' }} to='http://localhost:3000'>Home</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
