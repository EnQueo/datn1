import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import "./PaymentMethod.css";

const PaymentMethod = () => {
  const { cartItems, all_product, getTotalCartAmount } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState(""); 
  const [discount, setDiscount] = useState(0); 
  const [address, setAddress] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const totalAmount = getTotalCartAmount();

  const cartProducts = Object.keys(cartItems)
    .map((key) => {
      const [productId, size] = key.split("-");
      const product = all_product.find((product) => product.id === parseInt(productId));
      return product ? { ...product, size, quantity: cartItems[key] } : null;
    })
    .filter((product) => product !== null && product.quantity > 0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch('/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePromoCheck = async () => {
    if (!promoCode) {
      alert("Please enter a promo code.");
      return;
    }

    try {
      const response = await fetch('/promos/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setDiscount(data.discount_percentage);
        alert("Promo code applied successfully!");
      } else {
        alert(data.error || "Invalid promo code.");
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error checking promo code:", error);
      alert("Failed to check promo code.");
    }
  };

  const handlePayPalPayment = async () => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }
  
    if (!address || !phoneNumber) {
      alert("Please enter both shipping address and phone number.");
      return;
    }
  
    const orderData = {
      productDetails: cartProducts.map((product) => ({
        image: product.image,
        name: product.name,
        size: product.size,
        quantity: product.quantity,
        price: product.new_price,
      })),
      username: userData.name,
      total: totalAmount - (totalAmount * discount) / 100,
      address,
      phoneNumber,
    };
  
    localStorage.setItem("orderData", JSON.stringify(orderData));
  
    try {
      const response = await fetch("/paypal/create-order", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("orderId", data.orderId);
  
        window.location.href = data.approvalUrl;
      } else {
        alert("Failed to initiate PayPal payment.");
      }
    } catch (error) {
      console.error("Error initiating PayPal payment:", error);
      alert("Failed to initiate PayPal payment.");
    }
  };
  

  const handleCODPayment = async () => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }

    if (!address || !phoneNumber) {
      alert("Please enter both shipping address and phone number.");
      return;
    }

    try {
      const orderData = {
        productDetails: cartProducts.map((product) => ({
          image: product.image,
          name: product.name,
          size: product.size,
          quantity: product.quantity,
          price: product.new_price,
        })),
        username: userData.name,
        total: totalAmount - (totalAmount * discount) / 100,
        address,
        phoneNumber,
        status: "Pending",
      };

      const response = await fetch('/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order placed successfully! You chose Cash On Delivery.");
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error processing COD payment:", error);
      alert("Failed to place order.");
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  const discountMessage = discount ? `${discount}% off` : "No promo";

  return (
    <div className="payment-container">
      <h1>Payment</h1>
      <div className="promo-section">
        <p>Have a promo code?</p>
        <input
          type="text"
          placeholder="Promo"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button className="check-promo-button" onClick={handlePromoCheck}>Check Promo</button>
      </div>

      <h3>How would you like to pay?</h3>
      <div className="payment-options">
        <button
          className={`payment-option ${paymentMethod === "paypal" ? "active" : ""}`}
          onClick={() => setPaymentMethod("paypal")}
        >
          PayPal
        </button>
        <button
          className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}
          onClick={() => setPaymentMethod("cod")}
        >
          COD (Cash On Delivery)
        </button>
      </div>

      {paymentMethod === "paypal" && (
        <div>
          <h3>Confirm your order</h3>
          <button className="proceed-button" onClick={handlePayPalPayment}>
            Proceed with PayPal
          </button>
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="cod-container">
          <h3>Confirm your order</h3>
          <button className="proceed-button" onClick={handleCODPayment}>
            Proceed with COD
          </button>
        </div>
      )}

      <div className="address-section">
        <h3>Shipping Address</h3>
        <input
          type="text"
          placeholder="Enter shipping address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="phone-section">
        <h3>Phone Number</h3>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="cart-summary">
        <p>Order Summary:</p>
        {cartProducts.map((product) => (
          <div key={product.id}>
            <p>{product.name} ({product.size}) - {product.quantity} x ${product.new_price}</p>
          </div>
        ))}
        <p>Total: ${totalAmount}</p>
        <p>Discount: {discountMessage}</p>
      </div>
    </div>
  );
};

export default PaymentMethod;
