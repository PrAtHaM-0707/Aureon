import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const statusColors = {
  processing: 'bg-warning text-warning-foreground',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-success text-success-foreground',
  cancelled: 'bg-destructive text-destructive-foreground'
};

const Orders = () => {
  const { orders, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Loading orders...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view orders</h1>
          <p className="text-muted-foreground mb-8">
            You need to be signed in to view your order history.
          </p>
          <Button asChild size="lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
          <p className="text-muted-foreground mb-8">
            When you place an order, it will appear here.
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-border p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-bold">{order.orderId || order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase rounded-full ${statusColors[order.status] || 'bg-muted'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="w-20 h-20 bg-secondary overflow-hidden rounded-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Ships to:</span> {order.shippingAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;