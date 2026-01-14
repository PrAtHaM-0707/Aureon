import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Settings, LogOut } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout, orders, loading } =
    useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Sync formData with user whenever user changes (on load, login, update, etc.)
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.patch(`${API_BASE_URL}/auth/update-profile`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Update context with fresh data from server
      updateProfile(res.data.user);

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (err: unknown) {
      let message = "Failed to update profile";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  const handleEditClick = () => {
    // Ensure form is populated with latest user data when opening edit mode
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to current user values
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 bg-secondary font-medium"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
              >
                <Package className="h-5 w-5" />
                Orders
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 w-full text-left hover:bg-secondary transition-colors text-destructive"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-secondary p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Profile Information</h2>
                {!isEditing && (
                  <Button variant="outline" onClick={handleEditClick}>
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="opacity-50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        First Name
                      </p>
                      <p className="font-medium">{user?.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Last Name
                      </p>
                      <p className="font-medium">{user?.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <Link
                  to="/orders"
                  className="text-sm underline underline-offset-4 hover:text-muted-foreground"
                >
                  View All
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="bg-secondary p-8 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order._id}
                      className="bg-secondary p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{order.orderId || order._id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;