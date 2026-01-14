import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: String,
  userName: String,
  items: [{
    productId: String,
    name: String,
    size: Number,
    quantity: Number,
    price: Number,
    image: String
  }],
  total: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: String,
  paymentId: String,
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled', 'pending'],
    default: 'pending'
  },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);