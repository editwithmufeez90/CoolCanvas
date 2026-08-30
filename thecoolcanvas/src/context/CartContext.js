"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('coolcanvas_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('coolcanvas_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, qty = 1) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: Math.min(product.stock || 10, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: Math.min(product.stock || 10, qty) }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    setCart((prev) => {
      const itemToUpdate = prev.find(item => item.id === id && item.size === size);
      if (!itemToUpdate) return prev;
      if (quantity < 1 || quantity > (itemToUpdate.stock || 10)) return prev;
      
      return prev.map(item => 
        item.id === id && item.size === size 
          ? { ...item, quantity }
          : item
      );
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.salePrice * item.quantity), 0);

  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      directCheckoutItem,
      setDirectCheckoutItem
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
