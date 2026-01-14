// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '@/context/ProductContext';
import { toast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, size: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, size: number) => Promise<void>;
  updateQuantity: (productId: string, size: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/cart`);
      setItems(res.data.cart || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        console.error('Failed to fetch cart', err);
        toast({ title: "Error", description: "Failed to load cart", variant: "destructive" });
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product: Product, size: number, quantity = 1) => {
    try {
      const res = await axios.post(`${API_BASE}/cart`, {
        productId: product._id,
        size,
        quantity
      });
      setItems(res.data.cart);
      toast({ title: "Added to cart", description: `${product.name} (Size ${size})` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    }
  };

  const removeFromCart = async (productId: string, size: number) => {
    try {
      const res = await axios.delete(`${API_BASE}/cart/${productId}`, { data: { size } });
      setItems(res.data.cart);
      toast({ title: "Removed", description: "Item removed from cart" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    }
  };

  const updateQuantity = async (productId: string, size: number, quantity: number) => {
    try {
      const res = await axios.put(`${API_BASE}/cart/${productId}`, { size, quantity });
      setItems(res.data.cart);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update quantity", variant: "destructive" });
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_BASE}/cart`);
      setItems([]);
      toast({ title: "Cart cleared" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to clear cart", variant: "destructive" });
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};