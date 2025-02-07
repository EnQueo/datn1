import React, { useState } from 'react';
import './Footer.css';
import footer_logo from '../assets/Frontend_Assets/logo_big.png';
import instagram_icon from '../assets/Frontend_Assets/instagram_icon.png';
import facebook_icon from '../assets/Frontend_Assets/facebook_icon.png';
import call_icon from '../assets/Frontend_Assets/call_icon.png';
import cross_icon from '../assets/Frontend_Assets/cart_cross_icon.png';

const Footer = () => {
  const [popupContent, setPopupContent] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupContent('');
  };

  return (
    <div className='footer'>
      {isPopupVisible && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={cross_icon} className="popup-close" onClick={closePopup} alt=''/>
            <p>{popupContent}</p>
          </div>
        </div>
      )}

      <div className="footer-logo">
        <img src={footer_logo} alt="Footer Logo" />
        <p>EQOShop</p>
      </div>

      <ul className="footer-links">
        <li onClick={() => showPopup('EQOShop - 5 years experiece')}>Company</li>
        <li>
          <a href="/basketballs" className='no-style-link'>Product</a>
        </li>
        <li onClick={() => showPopup('123 Doi Can')}>Offices</li>
        <li>
          <a href="/about" className='no-style-link'>About</a>
        </li>
        <li onClick={() => showPopup('Owner: 0862128902')}>Contact</li>
      </ul>

      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagram_icon} alt="Instagram" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebook_icon} alt="Facebook" />
          </a>
        </div>
        <div className="footer-icons-container" onClick={() => showPopup('Hotline: 1900 1827')}>
          <img src={call_icon} alt="Call" />
        </div>
      </div>

      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;