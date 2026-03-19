// src/context/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  sizes: number[];
  colors: string[];
  features: string[];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  rating: number;
  createdAt: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  addProduct: (productData: Omit<Product, '_id' | 'createdAt' | 'rating' | 'stockQuantity'>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      const res = await axios.get(`${API_BASE}/products/${id}`);
      return res.data.product;
    } catch (err) {
      console.error('Failed to fetch product', err);
      return null;
    }
  };

  const addProduct = async (productData: Omit<Product, '_id' | 'createdAt' | 'rating' | 'stockQuantity'>) => {
    try {
      const res = await axios.post(`${API_BASE}/products`, productData);
      setProducts(prev => [res.data.product, ...prev]);
    } catch (err) {
      console.error('Failed to add product', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await axios.put(`${API_BASE}/products/${id}`, productData);
      setProducts(prev => prev.map(p => p._id === id ? res.data.product : p));
    } catch (err) {
      console.error('Failed to update product', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete product', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      fetchProducts,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};