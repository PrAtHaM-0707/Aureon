// src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Truck, RotateCcw, Shield, Minus, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts, Product } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, products } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        const fetched = await getProduct(id);
        setProduct(fetched);
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, getProduct]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">Loading product...</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter(p => p._id !== product._id && (p.brand === product.brand || p.category === product.category))
    .slice(0, 4);
    

  const handleAddToCart = () => {
    if (!isAuthenticated) {
    toast({
      title: "Please log in",
      description: "You need to be logged in to add items to cart",
      variant: "destructive"
    });
    navigate('/login');
    return;
  }

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose your size before adding to cart",
        variant: "destructive"
      });
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-secondary overflow-hidden">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-secondary overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="lg:pt-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-destructive text-destructive-foreground text-sm font-semibold px-2 py-1">
                      SAVE ${product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Select Size</span>
                <button className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      h-12 font-medium border-2 transition-all
                      ${selectedSize === size
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:border-foreground'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <span className="font-semibold mb-4 block">Quantity</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="h-12 w-12 border-2 border-border hover:border-foreground transition-colors flex items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="h-12 w-12 border-2 border-border hover:border-foreground transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="lg"
                className="flex-1"
              >
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </Button>
              <Button variant="outline" size="lg" className="w-14">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-border mb-8">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">30 Day Returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Authenticity</p>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;