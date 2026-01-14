import { Request, Response } from 'express';
import User from '../models/User.model';
import Order from '../models/Order.model';
import Product from '../models/Product.model';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueResult] = await Promise.all([
      User.countDocuments(), // ← All users including admins
      Order.countDocuments(), // ← Total orders ever placed (never decreases)
      Product.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders, // ← Remains cumulative
        totalProducts,
        totalRevenue: revenueResult[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all orders belonging to this user
    await Order.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ 
      success: true, 
      message: "User and all their orders have been permanently deleted" 
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: "Server error" });
  }
};