import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- 1. STATE INITIALIZATION ---
  
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );

  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : 'Razorpay'
  );

  // Sync Cart Items to LocalStorage automatically
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);


  // --- 2. CART FUNCTIONS ---

  const updateQty = (id, qty) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const addToCart = (product, size) => {
    const existItem = cartItems.find((x) => x.id === product.id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) => (x.id === existItem.id ? { ...product, qty: x.qty + 1, size } : x))
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1, size }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };


  // --- 3. CHECKOUT FUNCTIONS ---

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  // --- 4. PROVIDER EXPORT ---
  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQty,
        clearCart,
        shippingAddress, 
        saveShippingAddress, 
        paymentMethod,
        savePaymentMethod
      }}
    > 
      {children}
    </CartContext.Provider>
  );
};