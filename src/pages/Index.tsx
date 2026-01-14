// src/pages/Index.tsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductContext';

const Index = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNew);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-secondary overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80"
            alt="Hero sneakers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl animate-slide-up">
            <p className="text-sm uppercase tracking-widest mb-4">New Collection</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Step Into
              <br />
              <span className="text-muted-foreground">Greatness</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the latest drops from top brands. Premium sneakers for every style.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="hero" size="lg">
                <Link to="/shop">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop?isNew=true">New Arrivals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured</h2>
            <Link
              to="/shop"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-2"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Running', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80' },
              { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' },
              { name: 'Basketball', image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name}`}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-background text-2xl font-bold tracking-wider uppercase">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* New Arrivals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link
              to="/shop?isNew=true"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-2"
            >
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {newArrivals.map((product, index) => (
              <div
                key={product._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-background/70 mb-8 max-w-md mx-auto">
            Be the first to know about new drops, exclusive releases, and special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-background/50"
            />
            <Button
              type="submit"
              className="bg-background text-foreground hover:bg-background/90"
              size="lg"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Index;