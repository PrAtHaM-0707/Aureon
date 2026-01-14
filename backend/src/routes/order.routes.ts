import express, { Request, Response } from 'express';
import {
  createOrder,
  createRazorpayOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/order.controller';
import { protect, admin } from '../middleware/auth.middleware';
import Order from '../models/Order.model';

const router = express.Router();

// Proper authenticated request type — user is optional (set by middleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

router.post('/', protect, createOrder);
router.post('/create-razorpay', protect, createRazorpayOrder);

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

// Payment confirmation route - now fully type-safe
router.patch('/:id/payment', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.body;

    // req.user is optional, so we need to check it
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    order.paymentId = paymentId;
    order.status = 'processing';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error('Payment update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin status update using custom orderId
router.patch('/:orderId/status', protect, admin, updateOrderStatus);

export default router;