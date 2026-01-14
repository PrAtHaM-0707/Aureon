import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getAllProducts,
  updateUserRole,
  deleteUser,
} from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect, admin); // All routes below require admin

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/products', getAllProducts);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;