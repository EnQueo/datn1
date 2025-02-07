import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../context/ShopContext';
import remove_icon from '../assets/Frontend_Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount, addToQuantity, removeFromQuantity } = useContext(ShopContext);

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setShowPopup(true);
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="cartItems">
      <div className="cartItems-format-main">
        <p>Products</p>
        <p>Name</p>
        <p>Price</p>
        <p>Size</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {Object.keys(cartItems).map((key) => {
        const [productId, size] = key.split("-");
        const product = all_product.find((p) => p.id === parseInt(productId));

        if (product && cartItems[key] > 0) {
          return (
            <div key={key}>
              <div className="cartItems-format cartItems-format-main">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="cartIcon-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.new_price}</p>
                <p>{size}</p>
                <div className="cartItems-quantity-control">
                  <button onClick={() => removeFromQuantity(productId, size)}>-</button>
                  <button className="cartItems-quantity">{cartItems[key]}</button>
                  <button onClick={() => addToQuantity(productId, size)}>+</button>
                </div>
                <p>${product.new_price * cartItems[key]}</p>
                <img
                  className="cartItems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(product.id, size)}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartItems-down">
        <div className="cartItems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartItems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount().toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>You must log in to proceed to checkout.</p>
            <button onClick={() => navigate('/login')}>Go to Login</button>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
