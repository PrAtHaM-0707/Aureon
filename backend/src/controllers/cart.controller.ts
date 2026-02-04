// src/controllers/cart.controller.ts
import { Request, Response } from 'express';
import User from '../models/User.model';
import Product from '../models/Product.model';
import logger from '../utils/logger.js';

export const getCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    logger.error(`Get Cart Error: ${err}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.inStock) return res.status(400).json({ message: 'Product out of stock' });

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, size, quantity });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    if (quantity <= 0) {
      return removeFromCart(req, res);
    }

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    user.cart[itemIndex].quantity = quantity;
    await user.save();
    await user.populate('cart.product');

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    logger.error(`Update Cart Error: ${err}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { size } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(
      item => !(item.product.toString() === productId && item.size === size)
    );

    await user.save();
    await user.populate('cart.product');

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    logger.error(`Remove from Cart Error: ${err}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = [];
    await user.save();

    res.json({ success: true, cart: [] });
  } catch (err) {
    logger.error(`Clear Cart Error: ${err}`);
    res.status(500).json({ message: 'Server error' });
  }
};