import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Order {
  _id: string;
  orderId: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    name: string;
    size: number;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  shippingAddress: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, '_id' | 'date'>) => Promise<string>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fetch orders whenever user changes (login, signup, refresh, etc.)
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { token, user: userData } = data;
      localStorage.setItem('token', token);
      setUser(userData);
      // fetchOrders will be triggered by useEffect above
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data } = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
      });
      const { token, user: userData } = data;
      localStorage.setItem('token', token);
      setUser(userData);
      // fetchOrders will be triggered by useEffect
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setOrders([]);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const addOrder = async (orderData: Omit<Order, '_id' | 'date'>) => {
    try {
      const { data } = await api.post('/orders', orderData);
      const newOrder = data.order;

      // Refetch all orders to ensure fresh, consistent data from DB
      await fetchOrders();

      return newOrder.orderId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateProfile,
      orders,
      addOrder,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};