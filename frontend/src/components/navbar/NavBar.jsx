import React, { useContext, useRef, useState, useEffect } from 'react';
import './NavBar.css';
import nav_dropdown from '../assets/Frontend_Assets/nav_dropdown.png';
import logo from '../assets/Frontend_Assets/logo.png';
import cart_icon from '../assets/Frontend_Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const NavBar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartItems } = useContext(ShopContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const menuRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes('/shoes')) {
      setMenu("shoes");
    } else if (currentPath.includes('/basketballs')) {
      setMenu("basketballs");
    } else if (currentPath.includes('/accessories')) {
      setMenu("accessories");
    } else {
      setMenu("home");
    }
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decodedToken.user.role === 'admin');
      } catch (error) {
        console.error("Invalid token: ", error);
        setIsAdmin(false);
      }
    }
  }, []);

  const dropdown_toggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace('/');
  };

  const user = localStorage.getItem('auth-token');

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="EQOShop" />
        <p>EQOShop</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="Dropdown" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => { setMenu("home") }}>
          <Link style={{ textDecoration: 'none' }} to='/'>Home</Link>
        </li>
        <li onClick={() => { setMenu("shoes") }}>
          <Link style={{ textDecoration: 'none' }} to='/shoes'>Shoes</Link>
        </li>
        <li onClick={() => { setMenu("basketballs") }}>
          <Link style={{ textDecoration: 'none' }} to='/basketballs'>Basketballs</Link>
        </li>
        <li onClick={() => { setMenu("accessories") }}>
          <Link style={{ textDecoration: 'none' }} to='/accessories'>Accessories</Link>
        </li>
      </ul>
      <div className="nav-login-cart">
        {user ? (
          <div className="nav-user-avatar">
            <img
              src="https://www.w3schools.com/w3images/avatar2.png"
              alt="User Avatar"
              className="user-avatar"
            />
            <span className="arrow-down" onClick={dropdown_toggle}>{dropdownVisible ? '▲' : '▼'}</span>
            {dropdownVisible && (
              <div className={`dropdown-menu ${dropdownVisible ? 'visible' : ''}`}>
                <Link to="/orders" className="dropdown-item">Orders</Link>
                <Link to="/user-profile" className="dropdown-item">Profile</Link>
                {isAdmin && (
                  <Link to="http://localhost:5173" className="dropdown-item">Admin Panel</Link>
                )}
                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}
        <Link to='/cart'><img src={cart_icon} alt="Cart Icon" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default NavBar;
