import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything yet.
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems})</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.product._id}-${item.size}`}
                className="flex gap-6 pb-6 border-b border-border"
              >
                <Link
                  to={`/product/${item.product._id}`}
                  className="w-32 h-32 bg-secondary flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {item.product.brand}
                      </p>
                      <Link
                        to={`/product/${item.product._id}`}
                        className="font-semibold hover:underline"
                      >
                        {item.product.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id, item.size)}
                      className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Size: {item.size}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                        className="h-8 w-8 border border-border hover:border-foreground transition-colors flex items-center justify-center"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                        className="h-8 w-8 border border-border hover:border-foreground transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{totalPrice >= 100 ? 'FREE' : '$10.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ${(totalPrice + (totalPrice >= 100 ? 0 : 10) + totalPrice * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
