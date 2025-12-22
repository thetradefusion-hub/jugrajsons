import { useState, useMemo } from 'react';
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
import { products } from '@/data/products';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    searchParams.get('concern') ? [searchParams.get('concern')!] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const tagFilter = searchParams.get('tag');

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
      );
    }

    if (tagFilter === 'bestseller') {
      filtered = filtered.filter(p => p.isBestseller);
    } else if (tagFilter === 'new') {
      filtered = filtered.filter(p => p.isNew);
    }

    if (selectedConcerns.length > 0) {
      filtered = filtered.filter(p =>
        p.concern.some(c => selectedConcerns.includes(c))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedRating) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  }, [searchQuery, tagFilter, selectedConcerns, selectedCategories, priceRange, selectedRating, sortBy]);

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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
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
