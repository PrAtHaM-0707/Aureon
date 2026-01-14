import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { useAdmin } from '@/context/AdminContext';

const AdminDashboard = () => {
  const { stats, orders, loading } = useAdmin();

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
          />
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <a href="/admin/orders" className="text-sm text-primary hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-success/20 text-success' :
                        order.status === 'shipped' ? 'bg-warning/20 text-warning' :
                        order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </div>
          </div>

          {/* Placeholder */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-6">Top Products</h2>
            <p className="text-muted-foreground text-center py-8">
              Analytics coming soon
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Monthly Revenue</h2>
          <p className="text-muted-foreground text-center py-8">
            Chart analytics will be available soon
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;