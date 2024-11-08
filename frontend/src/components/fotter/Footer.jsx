import React from 'react'
import './footer.css'
import footer_logo from '../assets/Frontend_Assets/logo_big.png'
import instagram_icon from '../assets/Frontend_Assets/instagram_icon.png'
import facebook_icon from '../assets/Frontend_Assets/facebook_icon.png'
import call_icon from '../assets/Frontend_Assets/call_icon.png'



const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>EQOShop</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Product</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={facebook_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={call_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr/>
        <p>Copyright @ 2024 - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
