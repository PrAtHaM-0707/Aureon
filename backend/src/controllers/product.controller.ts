// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import Product from '../models/Product.model';
import { cacheService } from '../services/cache.service';

const CACHE_TTL = 60 * 5; // 5 minutes

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, isNew, isFeatured } = req.query;
    const cacheKey = `products:list:${JSON.stringify(req.query)}`;
    
    const cached = await cacheService.get(cacheKey);
    if (cached) return res.json({ success: true, products: cached, source: 'cache' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (isNew === 'true') query.isNew = true;
    if (isFeatured === 'true') query.isFeatured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    await cacheService.set(cacheKey, products, CACHE_TTL);

    res.json({ success: true, products, source: 'db' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const cacheKey = `products:detail:${req.params.id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return res.json({ success: true, product: cached, source: 'cache' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await cacheService.set(cacheKey, product, CACHE_TTL);
    res.json({ success: true, product, source: 'db' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    await cacheService.flushPattern('products:list:*');
    
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await cacheService.del(`products:detail:${req.params.id}`);
    await cacheService.flushPattern('products:list:*');
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await cacheService.del(`products:detail:${req.params.id}`);
    await cacheService.flushPattern('products:list:*');
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};