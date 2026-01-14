// src/pages/Shop.tsx
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts, Product } from '@/context/ProductContext';

const priceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "$150 - $200", min: 150, max: 200 },
  { label: "Over $200", min: 200, max: Infinity }
];

const Shop = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    category: true,
    price: true,
    size: false
  });

  const selectedBrands = searchParams.getAll('brand');
  const selectedCategories = searchParams.getAll('category');
  const selectedPriceRange = searchParams.get('price');
  const selectedSizes = searchParams.getAll('size').map(Number);
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  const showNew = searchParams.get('isNew') === 'true';
  const showSale = searchParams.get('onSale') === 'true';

  const brands = [...new Set(products.map(p => p.brand))].sort();
  const categories = [...new Set(products.map(p => p.category))].sort();
  const allSizes = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => a - b);

  const toggleFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const current = params.getAll(type);

    if (current.includes(value)) {
      params.delete(type);
      current.filter(v => v !== value).forEach(v => params.append(type, v));
    } else {
      params.append(type, value);
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        result = result.filter(p => p.price >= range.min && (range.max === Infinity || p.price <= range.max));
      }
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.some(s => p.sizes.includes(s)));
    }

    if (showNew) {
      result = result.filter(p => p.isNew);
    }

    if (showSale) {
      result = result.filter(p => p.originalPrice);
    }

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedBrands, selectedCategories, selectedPriceRange, selectedSizes, sortBy, showNew, showSale]);

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 ||
    selectedPriceRange || selectedSizes.length > 0 || showNew || showSale;

  const FilterSection = ({ title, name, expanded }: { title: string; name: keyof typeof expandedSections; expanded: boolean }) => (
    <button
      onClick={() => setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }))}
      className="flex items-center justify-between w-full py-3 border-b border-border"
    >
      <span className="font-semibold text-sm uppercase tracking-wider">{title}</span>
      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {searchQuery ? `Search: "${searchQuery}"` : 'All Sneakers'}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                params.set('sort', e.target.value);
                setSearchParams(params);
              }}
              className="h-11 px-4 border-2 border-border bg-background text-sm focus:outline-none focus:border-foreground"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        <div className="flex gap-8">
          <aside className={`
            fixed inset-0 z-50 bg-background p-6 overflow-auto md:relative md:inset-auto md:z-auto md:p-0 md:w-64 md:flex-shrink-0
            ${isFiltersOpen ? 'block' : 'hidden md:block'}
          `}>
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setIsFiltersOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm underline underline-offset-4 mb-6 hover:text-muted-foreground"
              >
                Clear all filters
              </button>
            )}
            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={showNew}
                  onCheckedChange={(checked) => {
                    const params = new URLSearchParams(searchParams);
                    if (checked) {
                      params.set('isNew', 'true');
                    } else {
                      params.delete('isNew');
                    }
                    setSearchParams(params);
                  }}
                />
                <span className="text-sm">New Arrivals</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={showSale}
                  onCheckedChange={(checked) => {
                    const params = new URLSearchParams(searchParams);
                    if (checked) {
                      params.set('onSale', 'true');
                    } else {
                      params.delete('onSale');
                    }
                    setSearchParams(params);
                  }}
                />
                <span className="text-sm">On Sale</span>
              </label>
            </div>
            <FilterSection title="Brand" name="brand" expanded={expandedSections.brand} />
            {expandedSections.brand && (
              <div className="py-4 space-y-3">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleFilter('brand', brand)}
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            )}
            <FilterSection title="Category" name="category" expanded={expandedSections.category} />
            {expandedSections.category && (
              <div className="py-4 space-y-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleFilter('category', category)}
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            )}
            <FilterSection title="Price" name="price" expanded={expandedSections.price} />
            {expandedSections.price && (
              <div className="py-4 space-y-3">
                {priceRanges.map(range => (
                  <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedPriceRange === range.label}
                      onCheckedChange={() => {
                        const params = new URLSearchParams(searchParams);
                        if (selectedPriceRange === range.label) {
                          params.delete('price');
                        } else {
                          params.set('price', range.label);
                        }
                        setSearchParams(params);
                      }}
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            )}
            <FilterSection title="Size" name="size" expanded={expandedSections.size} />
            {expandedSections.size && (
              <div className="py-4 grid grid-cols-4 gap-2">
                {allSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleFilter('size', size.toString())}
                    className={`
                      h-10 text-sm font-medium border-2 transition-colors
                      ${selectedSizes.includes(size)
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:border-foreground'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
            <Button
              onClick={() => setIsFiltersOpen(false)}
              className="w-full mt-8 md:hidden"
            >
              Show {filteredProducts.length} Results
            </Button>
          </aside>
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-semibold mb-2">No products found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;