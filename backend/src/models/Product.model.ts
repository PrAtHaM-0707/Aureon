// src/models/Product.model.ts
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    brand: { type: String, required: true },
    sizes: [{ type: Number, required: true }],
    colors: [{ type: String, required: true }],
    features: [{ type: String, required: true }],
    inStock: { type: Boolean, default: true },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    stockQuantity: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);