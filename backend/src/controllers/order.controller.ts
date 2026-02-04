import { Request, Response } from 'express';
import Order from '../models/Order.model';
import Product from '../models/Product.model';
import User from '../models/User.model';
import Razorpay from 'razorpay';
import logger from '../utils/logger.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let total = 0;
    for (const item of req.body.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      total += Number(product.price) * Number(item.quantity); // Fixed: explicit Number conversion
    }

    const orderId = 'ORD-' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    const order = await Order.create({
      orderId,
      user: req.user!.id,
      userEmail: user.email,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
      items: req.body.items,
      total,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      status: 'pending',
      date: new Date(),
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    logger.error(`Create Order Error: ${err}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // Fixed: ensure number
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ success: true, razorpayOrderId: razorpayOrder.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find and update by custom orderId field
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(`Order status updated: ${orderId} → ${status}`);
    res.json({ success: true, order });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};