import React, { useEffect, useState } from "react";

const Success = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrderData = localStorage.getItem("orderData");
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
      handlePaymentSuccess(JSON.parse(storedOrderData));
    } else {
      console.error("Order data is missing from localStorage.");
    }
  }, []);

  const handlePaymentSuccess = async () => {
    const orderData = JSON.parse(localStorage.getItem("orderData"));
    const orderId = localStorage.getItem("orderId");
  
    if (!orderId) {
      alert("Order ID is missing.");
      return;
    }
  
    try {
      const response = await fetch("/paypal/capture-payment", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          productDetails: orderData.productDetails,
          username: orderData.username,
          total: orderData.total,
          address: orderData.address,
          phoneNumber: orderData.phoneNumber,
          status: "Pending", 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Payment successful! Order has been saved.");
        window.location.href = "/orders";
      } else {
        alert("Failed to capture payment.");
      }
    } catch (error) {
      console.error("Error processing PayPal payment:", error);
      alert("Error processing payment.");
    }
  };
  
  return (
    <div>
      <h1>Payment Successful!</h1>
    </div>
  );
};
export default Success;