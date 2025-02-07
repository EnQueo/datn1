import React, { useState, useEffect } from 'react';
import './Order.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/orders", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId); 
    }
  };

  return (
    <div className="order">
      <div className="order-format-main">
        <p style={{margin:"10px"}}>Username</p>
        <p>Total</p>
        <p>Date</p>
        <p>Status</p>
      </div>

      <div className="order-allorder">
        <hr />
        {orders.map((order) => (
          <div key={order._id} className="order-format">

            <div 
              className="order-summary" 
              onClick={() => toggleOrderDetails(order._id)}
            >
              <p>{order.username}</p>
              <p>${order.total}</p>
              <p>{new Date(order.date).toLocaleDateString()}</p>
              <select
                value={order.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    await fetch(`/orders/${order._id}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ newStatus }),
                    });
                    setOrders((prevOrders) =>
                      prevOrders.map((o) =>
                        o._id === order._id ? { ...o, status: newStatus } : o
                      )
                    );
                  } catch (error) {
                    console.error('Error updating status:', error);
                  }
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {selectedOrder === order._id && (
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
                <div className="order-contact">
                  <p><strong>Phone:</strong> {order.phoneNumber}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
