import { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((item) => {
    setCart((prev) => [...prev, { ...item, quantity: 1 }]);
  }, []);

  const value = { cart, addToCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};