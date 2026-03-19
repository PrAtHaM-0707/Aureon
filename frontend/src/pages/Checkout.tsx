import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CreditCard } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { AxiosError } from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { initiatePayment, isLoaded, isLoading } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const shipping = totalPrice >= 100 ? 0 : 10;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const handlePayment = async () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({ title: "Missing info", description: "Please fill shipping address", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const orderRes = await api.post('/orders', {
        items: items.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image || item.product.images[0]
        })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        total,
        paymentMethod: 'razorpay'
      });

      const order = orderRes.data.order;

      const rzpRes = await api.post('/orders/create-razorpay', {
        amount: total
      });

      const razorpayOrderId = rzpRes.data.razorpayOrderId;

      const result = await initiatePayment({
        amount: total,
        currency: 'INR',
        name: 'Aureon',
        description: `Order ${order.orderId}`,
        orderId: razorpayOrderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim() || 'Customer',
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#000000' }
      });

      if (result.success) {
        await api.patch(`/orders/${order._id}/payment`, {
          paymentId: result.paymentId
        });

        clearCart();
        toast({ title: "Payment successful!", description: `Order ${order.orderId} confirmed` });
        navigate(`/order-confirmation/${order._id}`, { 
  state: { order } 
});
      } else {
        toast({ title: "Payment failed", description: result.error || "Please try again", variant: "destructive" });
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || "Checkout failed. Please try again.";
      console.error('Checkout error:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </button>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold mb-4">Contact Information</h2>
              <Input
                type="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  <Input placeholder="Last name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
                <Input placeholder="Address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="City" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  <Input placeholder="State" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                  <Input placeholder="ZIP code" required value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                </div>
                <Input placeholder="Phone (optional)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5" />
                <h2 className="font-bold">Secure Payment via Razorpay</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Pay using UPI, Cards, Net Banking, or Wallets
              </p>
            </div>
          </div>
          <div>
            <div className="bg-secondary p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-background overflow-hidden">
                      <img src={item.product.image || item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Size {item.size} · Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-border mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handlePayment}
                className="w-full"
                size="lg"
                disabled={isProcessing || isLoading || !isLoaded}
              >
                {isProcessing || isLoading ? 'Processing...' : 'Pay with Razorpay'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;