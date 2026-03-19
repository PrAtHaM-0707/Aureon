import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tighter">
            Aureon
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Shop All
            </Link>
            <Link to="/shop?category=Running" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Running
            </Link>
            <Link to="/shop?category=Lifestyle" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Lifestyle
            </Link>
            <Link to="/shop?category=Basketball" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Basketball
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="p-2 hover:bg-secondary rounded-full transition-colors text-primary"
                title="Admin Panel"
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search sneakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Shop All
              </Link>
              <Link
                to="/shop?category=Running"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Running
              </Link>
              <Link
                to="/shop?category=Lifestyle"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Lifestyle
              </Link>
              <Link
                to="/shop?category=Basketball"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Basketball
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
