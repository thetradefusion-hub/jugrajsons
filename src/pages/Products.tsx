import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/product/ProductFilter';
import EmptyState from '@/components/common/EmptyState';
import api from '@/lib/api';

interface Product {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  concern: string[];
  productType: string;
  tags: string[];
  inStock: boolean;
  stockCount: number;
  ingredients: string[];
  benefits: string[];
  usage: string;
  whoShouldUse: string[];
  isBestseller: boolean;
  isNew: boolean;
  sku: string;
}

const Products = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('popularity');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    searchParams.get('concern') ? [searchParams.get('concern')!] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const tagFilter = searchParams.get('tag');
  const categoryParam = searchParams.get('category');
  const concernParam = searchParams.get('concern');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {
          limit: 1000, // Get all products
        };
        
        if (categoryParam) params.category = categoryParam;
        if (concernParam) params.concern = concernParam;
        if (searchQuery) params.search = searchQuery;

        console.log('Fetching products with params:', params);
        const response = await api.get('/products', { params });
        console.log('Products API response:', response.data);
        
        // Handle different response formats
        let fetchedProducts = [];
        if (Array.isArray(response.data)) {
          fetchedProducts = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          fetchedProducts = response.data.products;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          fetchedProducts = response.data.data;
        }
        
        console.log('Fetched products count:', fetchedProducts.length);
        
        // Transform backend products to frontend format
        const transformedProducts = fetchedProducts.map((p: any) => ({
          _id: p._id,
          id: p._id || p.slug,
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDescription: p.shortDescription,
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount || 0,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          images: p.images || [],
          category: p.category,
          concern: Array.isArray(p.concern) ? p.concern : (p.concern ? [p.concern] : []),
          productType: p.productType,
          tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []),
          inStock: p.inStock !== false,
          stockCount: p.stockCount || 0,
          ingredients: Array.isArray(p.ingredients) ? p.ingredients : (p.ingredients ? [p.ingredients] : []),
          benefits: Array.isArray(p.benefits) ? p.benefits : (p.benefits ? [p.benefits] : []),
          usage: p.usage || '',
          whoShouldUse: Array.isArray(p.whoShouldUse) ? p.whoShouldUse : (p.whoShouldUse ? [p.whoShouldUse] : []),
          isBestseller: p.isBestseller || false,
          isNew: p.isNew || false,
          sku: p.sku,
        }));
        
        console.log('Transformed products count:', transformedProducts.length);
        setProducts(transformedProducts);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        console.error('Error response:', error.response?.data);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, concernParam, searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    console.log('Filtering products. Total products:', products.length);
    console.log('Initial filtered count:', filtered.length);

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
      );
      console.log('After search filter:', filtered.length);
    }

    if (tagFilter === 'bestseller') {
      filtered = filtered.filter(p => p.isBestseller);
      console.log('After bestseller filter:', filtered.length);
    } else if (tagFilter === 'new') {
      filtered = filtered.filter(p => p.isNew);
      console.log('After new filter:', filtered.length);
    }

    if (selectedConcerns.length > 0) {
      filtered = filtered.filter(p => {
        // Check if concern array contains any selected concern
        const hasConcern = p.concern && Array.isArray(p.concern) && p.concern.some(c => selectedConcerns.includes(c));
        // Also check if category matches any selected concern (for backward compatibility)
        const hasCategoryMatch = p.category && selectedConcerns.includes(p.category);
        return hasConcern || hasCategoryMatch;
      });
      console.log('After concerns filter:', filtered.length);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
      console.log('After categories filter:', filtered.length);
    }

    // Price filter - check if price exists and is a number
    filtered = filtered.filter(p => {
      const price = Number(p.price);
      return !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    });
    console.log('After price filter (range:', priceRange, '):', filtered.length);

    if (selectedRating) {
      filtered = filtered.filter(p => (p.rating || 0) >= selectedRating);
      console.log('After rating filter:', filtered.length);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    console.log('Final filtered products count:', filtered.length);
    return filtered;
  }, [products, searchQuery, tagFilter, selectedConcerns, selectedCategories, priceRange, selectedRating, sortBy]);

  const handleClearAll = () => {
    setSelectedConcerns([]);
    setSelectedCategories([]);
    setPriceRange([0, 2000]);
    setSelectedRating(null);
  };

  return (
    <>
      <SEO title="Shop All Products" description="Browse our complete collection of authentic Ayurvedic products" />
      <main className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <ProductFilter
              selectedConcerns={selectedConcerns}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              selectedRating={selectedRating}
              onConcernChange={setSelectedConcerns}
              onCategoryChange={setSelectedCategories}
              onPriceChange={setPriceRange}
              onRatingChange={setSelectedRating}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {tagFilter === 'bestseller' ? 'Bestsellers' : tagFilter === 'new' ? 'New Arrivals' : 'All Products'}
                </h1>
                <p className="text-muted-foreground">{filteredProducts.length} products</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ProductFilter
                        selectedConcerns={selectedConcerns}
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                        selectedRating={selectedRating}
                        onConcernChange={setSelectedConcerns}
                        onCategoryChange={setSelectedCategories}
                        onPriceChange={setPriceRange}
                        onRatingChange={setSelectedRating}
                        onClearAll={handleClearAll}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-muted-foreground">Loading products...</div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id || product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState type="search" />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Products;
