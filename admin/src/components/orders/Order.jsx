import React, { useState, useEffect } from 'react';
import './Order.css';

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://192.168.55.106:4000/orders", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json(); // Chuyển đổi response thành JSON
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, productIndex, newStatus) => {
    try {
      const response = await fetch(`http://192.168.55.106:4000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIndex, newStatus }), // Gửi dữ liệu cập nhật
      });
  
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? updatedOrder.order : order
          )
        );
        console.log('Status updated successfully');
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  

  return (
    <div className='order'>
      <div className="order-format-main">
        <p>Product</p>
        <p>Product Name</p>
        <p>Username</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Date</p>
        <p>Status</p>
      </div>
      <div className="order-allorder">
        <hr />
        {orders.map((order) => (
        <div key={order._id} className="order-format">
          {order.productDetails.map((product, index) => (
            <React.Fragment key={index}>
              <img src={product.image} alt={product.name} className="order-product-icon" />
              <p>{product.name}</p>
              <p>{order.username}</p>
              <p>{product.quantity}</p>
              <p>${order.total}</p>
              <p>{new Date(order.date).toLocaleDateString()}</p>
              <select
                value={order.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    await fetch(`http://192.168.55.106:4000/orders/${order._id}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ newStatus }),
                    });
                    // Cập nhật trạng thái trên frontend
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
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </React.Fragment>
          ))}
        </div>
      ))}

      </div>
    </div>
  );
};

export default Order;
