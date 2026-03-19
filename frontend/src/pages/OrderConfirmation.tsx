import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { state } = useLocation();
  const { orders } = useAuth();

  // First try: fresh order passed from Checkout (immediate)
  // Fallback: look in context (in case user refreshes page)
  const order = (state as { order?: any })?.order || 
                orders.find(o => o._id === orderId);

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <CheckCircle2 className="h-20 w-20 mx-auto mb-6 text-success" />
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We'll send you an email with tracking information once your order ships.
          </p>
        </div>

        <div className="bg-secondary p-8 mb-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-bold">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(order.date || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="w-20 h-20 bg-background overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary p-8 mb-8">
          <h2 className="font-bold mb-4">Shipping Address</h2>
          <p className="text-muted-foreground">{order.shippingAddress}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1" size="lg">
            <Link to="/orders">View Order History</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;