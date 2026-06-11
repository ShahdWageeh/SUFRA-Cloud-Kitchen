"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import cartService from "@/services/cartService";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isCustomer } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart(null);
      return;
    }

    setLoading(true);
    try {
      const result = await cartService.getCart();
      if (result.success) {
        setCart(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (mealId, quantity = 1) => {
    setLoading(true);
    try {
      const result = await cartService.addItem(mealId, quantity);
      if (result.success) {
        setCart(result.data);
        toast.success(result.message || "Added to cart");
      }
      return result;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add item to cart";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (mealId, quantity) => {
    setLoading(true);
    try {
      const result = await cartService.updateQuantity(mealId, quantity);
      if (result.success) {
        setCart(result.data);
      }
      return result;
    } catch (error) {
      toast.error("Failed to update quantity");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (mealId) => {
    setLoading(true);
    try {
      const result = await cartService.removeItem(mealId);
      if (result.success) {
        setCart(result.data);
        toast.success("Item removed from cart");
      }
      return result;
    } catch (error) {
      toast.error("Failed to remove item");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const result = await cartService.clearCart();
      if (result.success) {
        setCart(null);
        toast.success("Cart cleared");
      }
      return result;
    } catch (error) {
      toast.error("Failed to clear cart");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cartItems = useMemo(() => cart?.items || [], [cart]);
  
  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const cartTotal = useMemo(() => 
    cartItems.reduce((total, item) => total + (item.mealId.price * item.quantity), 0), 
    [cartItems]
  );

  const value = {
    cart,
    cartItems,
    cartCount,
    cartTotal,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
