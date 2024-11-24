import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import "./PaymentMethod.css";

const PaymentMethod = () => {
  const { cartItems, all_product, getTotalCartAmount } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState(""); // Lưu phương thức thanh toán
  const [userData, setUserData] = useState(null); // Lưu thông tin người dùng
  const [loading, setLoading] = useState(true); // Để theo dõi trạng thái tải thông tin người dùng

  // Lấy danh sách sản phẩm từ cartItems và kết hợp với size
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

        const response = await fetch('http://192.168.55.106:4000/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Token lưu trong localStorage
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data); // Lưu thông tin người dùng vào state
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // useEffect chỉ chạy khi component được mount

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please choose a payment method.");
      return;
    }

    if (!userData) {
      alert("User data is not available.");
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
        username: userData?.name || "Guest", // Sử dụng tên người dùng từ userData nếu có
        total: getTotalCartAmount(),
        date: new Date().toISOString(),
        status: "pending",
      };

      const response = await fetch('http://192.168.55.106:4000/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order created successfully!");
        // Thực hiện hành động sau khi đặt hàng thành công, ví dụ: chuyển sang trang khác hoặc reset giỏ hàng
      } else {
        alert("Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="payment-container">
      <h1>Payment</h1>
      <div className="promo-section">
        <p>Have a promo code?</p>
        <input type="text" placeholder="Promo" />
      </div>

      <h3>How would you like to pay?</h3>
      <div className="payment-options">
        <button
          className={`payment-option ${paymentMethod === "googlepay" ? "active" : ""}`}
          onClick={() => setPaymentMethod("googlepay")}
        >
          Google Pay
        </button>
        <button
          className={`payment-option ${paymentMethod === "paypal" ? "active" : ""}`}
          onClick={() => setPaymentMethod("paypal")}
        >
          PayPal
        </button>
      </div>

      {paymentMethod && (
        <button className="proceed-button" onClick={handlePayment}>
          Proceed with {paymentMethod === "googlepay" ? "Google Pay" : "PayPal"}
        </button>
      )}

      <div className="cart-summary">
        <h2>Order Summary</h2>
        {cartProducts.length === 0 ? (
          <p>No products in the cart.</p>
        ) : (
          cartProducts.map((product) => {
            const quantity = cartItems[`${product.id}-${product.size}`];
            const totalPrice = product.new_price * quantity;

            return (
              <div key={`${product.id}-${product.size}`} className="cart-item">
                <p>{product.name} - {product.size}</p>
                <p>Quantity: {quantity}</p>
                <p>Price: ${product.new_price}</p>
                <p>Total: ${totalPrice}</p>
              </div>
            );
          })
        )}
        <hr />
        <h3>Total: ${getTotalCartAmount()}</h3>
      </div>
    </div>
  );
};

export default PaymentMethod;
