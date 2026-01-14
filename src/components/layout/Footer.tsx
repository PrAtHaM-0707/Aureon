import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter">Aureon</h3>
            <p className="text-background/70 text-sm">
              Premium sneakers for every style. Authentic products, fast shipping.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/shop" className="hover:text-background transition-colors">
                  All Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Running" className="hover:text-background transition-colors">
                  Running
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Lifestyle" className="hover:text-background transition-colors">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Basketball" className="hover:text-background transition-colors">
                  Basketball
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Returns
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  FAQ
                </span>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="font-semibold">Account</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/login" className="hover:text-background transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-background transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-background transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © 2024 Aureon. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <span className="hover:text-background cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-background cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
