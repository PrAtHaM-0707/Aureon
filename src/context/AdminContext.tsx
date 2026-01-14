import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface RegisteredUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

interface AdminOrder {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  items: Array<{
    productId: string;
    name: string;
    size: number;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  paymentId?: string;
  createdAt: string;
}

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

interface AdminContextType {
  users: RegisteredUser[];
  orders: AdminOrder[];
  stats: AdminStats;
  isAdmin: boolean;
  currentAdmin: RegisteredUser | null;
  loading: boolean;
  fetchData: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: AdminOrder['status']) => Promise<void>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const currentAdmin = isAdmin && user ? {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as 'user' | 'admin',
    createdAt: new Date().toISOString(),
  } : null;

  const fetchData = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsRes, usersRes, ordersRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/stats`),
        axios.get(`${API_BASE}/admin/users`),
        axios.get(`${API_BASE}/admin/orders`),
        axios.get(`${API_BASE}/products`),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setOrders(ordersRes.data.orders || []);
      setStats(prev => ({ ...prev, totalProducts: productsRes.data.products.length }));
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateOrderStatus = async (orderId: string, status: AdminOrder['status']) => {
  try {
    await axios.patch(`${API_BASE}/orders/${orderId}/status`, { status });
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o));
  } catch (err) {
    console.error('Failed to update order status', err);
    throw err;
  }
};

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      await axios.patch(`${API_BASE}/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) {
      console.error('Failed to update user role', err);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`${API_BASE}/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      orders,
      stats,
      isAdmin,
      currentAdmin,
      loading,
      fetchData,
      updateOrderStatus,
      updateUserRole,
      deleteUser,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};