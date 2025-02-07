import React, { useState, useEffect } from 'react';
import './css/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/user-orders", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        if (data && data.length === 0) {
          setOrders([]);
        } else {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setSelectedOrder((prevSelectedOrder) => 
      prevSelectedOrder === orderId ? null : orderId
    );
  };

  return (
    <div className='order'>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <>
          <div className="order-format-main">
            <p>Order Date</p>
            <p>Total</p>
            <p>Status</p>
          </div>
          <div className="order-allorder">
            <hr />
            {orders.map((order) => {
              const isSelected = selectedOrder === order._id;
              return (
                <div key={order._id} className="order-format">
                  <div 
                    className="order-summary" 
                    onClick={() => toggleOrderDetails(order._id)} 
                  >
                    <p>{new Date(order.date).toLocaleDateString()}</p>
                    <p>${order.total}</p>
                    <p>{order.status}</p>
                  </div>

                  {isSelected && (
                    <div className="order-details">
                      {order.productDetails.map((product, index) => (
                        <div key={index} className="product-detail">
                          <img src={product.image[0]} alt={product.name} className="order-product-icon" />
                          <div className="product-info">
                            <p>{product.name}</p>
                            <p>Size: {product.size}</p>
                            <p>Quantity: {product.quantity}</p>
                            <p>Price: ${product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
