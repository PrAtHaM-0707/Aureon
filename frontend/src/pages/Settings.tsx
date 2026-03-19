import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Lock,
  Trash2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { AxiosError } from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "Success",
        description: "Your password has been changed successfully.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await api.delete('/auth/delete-account');
        logout();
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
        navigate("/");
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to delete account",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
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
                className="flex items-center gap-3 p-3 bg-secondary font-medium"
              >
                <SettingsIcon className="h-5 w-5" />
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
          <div className="lg:col-span-3 space-y-8">
            {/* Notifications */}
            <div className="bg-secondary p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5" />
                <h2 className="text-xl font-bold">Notifications</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about your order status
                    </p>
                  </div>
                  <Switch
                    checked={orderUpdates}
                    onCheckedChange={setOrderUpdates}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotions & Drops</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new releases and exclusive offers
                    </p>
                  </div>
                  <Switch
                    checked={promotions}
                    onCheckedChange={setPromotions}
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-secondary p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-5 w-5" />
                <h2 className="text-xl font-bold">Security</h2>
              </div>

              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-secondary p-8 border-2 border-destructive/20">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-bold text-destructive">
                  Danger Zone
                </h2>
              </div>

              <p className="text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
