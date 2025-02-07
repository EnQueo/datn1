import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = {};
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => {
    fetch('/allproducts')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); 
        setAll_product(data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (itemId, size) => {
    const key = `${itemId}-${size}`; 
    setCartItems((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const removeFromCart = (itemId, size) => {
    const key = `${itemId}-${size}`;
    setCartItems((prev) => {
    const updatedCart = { ...prev };
    delete updatedCart[key];
    return updatedCart;
    });
  };

  const removeFromQuantity = (itemId,size) => {
    const key = `${itemId}-${size}`;
    setCartItems((prev) => ({ ...prev, [key]: (prev[key] || 0) - 1}));
  }

  const addToQuantity = (itemId, size) => {
    const key = `${itemId}-${size}`;
    setCartItems((prev) => ({...prev, [key]: (prev[key] || 0) + 1}));
  };
  
  const applyPromoCode = (discount) => {
    setPromoDiscount(discount)
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const [itemId, size] = key.split("-");
        const itemInfo = all_product.find((product) => product.id === parseInt(itemId));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[key];
        }
      }
    }

    if (promoDiscount > 0) {
      totalAmount = totalAmount - (totalAmount * promoDiscount) / 100;
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        totalItem += cartItems[key];
      }
    }
    return totalItem;
  };

  const contextValue = { all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems, removeFromQuantity,addToQuantity };
  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
