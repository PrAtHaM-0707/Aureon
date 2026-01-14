// src/routes/cart.routes.ts
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

router.use(protect); 

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;