import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

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
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const tagFilter = searchParams.get('tag');
  const categoryParam = searchParams.get('category');
  const concernParam = searchParams.get('concern');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string | number> = { limit: 1000 };
        if (categoryParam) params.category = categoryParam;
        if (concernParam) params.concern = concernParam;
        if (searchQuery) params.search = searchQuery;

        const response = await api.get('/products', { params });

        let fetchedProducts: unknown[] = [];
        if (Array.isArray(response.data)) {
          fetchedProducts = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          fetchedProducts = response.data.products;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          fetchedProducts = response.data.data;
        }

        const transformedProducts = fetchedProducts.map((p: Record<string, unknown>) => ({
          _id: p._id as string,
          id: (p._id || p.slug) as string,
          name: p.name as string,
          slug: p.slug as string,
          description: p.description as string,
          shortDescription: p.shortDescription as string,
          price: p.price as number,
          originalPrice: p.originalPrice as number,
          discount: (p.discount as number) || 0,
          rating: (p.rating as number) || 0,
          reviewCount: (p.reviewCount as number) || 0,
          images: (p.images as string[]) || [],
          category: p.category as string,
          concern: Array.isArray(p.concern) ? (p.concern as string[]) : p.concern ? [p.concern as string] : [],
          productType: p.productType as string,
          tags: Array.isArray(p.tags) ? (p.tags as string[]) : p.tags ? [p.tags as string] : [],
          inStock: p.inStock !== false,
          stockCount: (p.stockCount as number) || 0,
          ingredients: Array.isArray(p.ingredients)
            ? (p.ingredients as string[])
            : p.ingredients
              ? [p.ingredients as string]
              : [],
          benefits: Array.isArray(p.benefits) ? (p.benefits as string[]) : p.benefits ? [p.benefits as string] : [],
          usage: (p.usage as string) || '',
          whoShouldUse: Array.isArray(p.whoShouldUse)
            ? (p.whoShouldUse as string[])
            : p.whoShouldUse
              ? [p.whoShouldUse as string]
              : [],
          isBestseller: Boolean(p.isBestseller),
          isNew: Boolean(p.isNew),
          sku: p.sku as string,
        }));

        setProducts(transformedProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, concernParam, searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery),
      );
    }

    if (tagFilter === 'bestseller') {
      filtered = filtered.filter((p) => p.isBestseller);
    } else if (tagFilter === 'new') {
      filtered = filtered.filter((p) => p.isNew);
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

    return filtered;
  }, [products, searchQuery, tagFilter, sortBy]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tagFilter, sortBy]);

  const pageTitle =
    tagFilter === 'bestseller' ? 'Bestsellers' : tagFilter === 'new' ? 'New Arrivals' : 'Shop Honey';

  const filterLink = (tag: string | null, label: string, icon?: React.ReactNode) => {
    const to = tag ? `/products?tag=${tag}` : '/products';
    const active = tagFilter === tag || (!tag && !tagFilter);
    return (
      <Link
        to={to}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors sm:gap-1.5 sm:px-3 sm:text-xs md:px-3.5 md:text-sm',
          active
            ? 'border-[#1F3D2B] bg-[#1F3D2B] text-[#F5E9D7]'
            : 'border-[#E6A817]/35 bg-white/80 text-[#2B1D0E]/85 hover:border-[#E6A817]/60',
        )}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <>
      <SEO
        title={`${pageTitle} | Jugraj Son's Hive`}
        description="Browse premium raw forest honey — pure, natural, direct from beekeepers."
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-10">
        <section className="relative isolate border-b border-[#E6A817]/15 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative py-3 sm:py-4 md:py-6">
            <nav className="mb-2 flex flex-wrap items-center gap-1 text-[11px] text-[#2B1D0E]/65 sm:mb-2.5 sm:text-xs md:text-sm">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1F3D2B]">
                <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-50 sm:h-3.5 sm:w-3.5" />
              <span className="font-medium text-[#2B1D0E]">Shop</span>
            </nav>

            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="min-w-0 flex-1">
                <Badge className="border-0 bg-[#1F3D2B] px-2 py-0.5 text-[10px] text-[#F5E9D7] md:px-2.5 md:text-xs">Jugraj Son&apos;s Hive</Badge>
                <h1 className="mt-1.5 font-display text-2xl font-bold leading-[1.15] text-[#2B1D0E] sm:text-3xl md:text-4xl lg:text-[2.5rem]">
                  {pageTitle}
                </h1>
                <p className="mt-1 max-w-xl text-xs leading-snug text-[#2B1D0E]/75 sm:text-sm md:text-[0.9375rem]">
                  Forest-sourced raw honey. Limited batches, no added sugar, no over-processing.
                </p>
              </motion.div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:max-w-md md:justify-end">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {filterLink(null, 'All')}
                  {filterLink('bestseller', 'Bestsellers', <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />)}
                  {filterLink('new', 'New', <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />)}
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-full rounded-full border-[#E6A817]/35 bg-white/90 text-xs text-[#2B1D0E] sm:h-10 sm:text-sm md:w-[min(200px,100%)]">
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

            <p className="mt-3 text-[11px] text-[#2B1D0E]/70 sm:text-xs md:mt-4 md:text-sm">
              {filteredProducts.length} products
              {filteredProducts.length > 0 && (
                <>
                  {' · '}
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}–
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                </>
              )}
            </p>
          </div>
        </section>

        <section className="container-custom py-4 sm:py-6 md:py-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-3xl border border-[#E6A817]/20 bg-white/60"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id || product._id} product={product} index={index} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border-[#E6A817]/40 bg-white/90 text-[#2B1D0E] hover:bg-[#fff9ef]"
                  >
                    Previous
                  </Button>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        size="sm"
                        variant={page === currentPage ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'min-w-[2.25rem] rounded-full',
                          page === currentPage
                            ? 'border-0 bg-[#E6A817] text-[#2B1D0E] hover:bg-[#d89c14]'
                            : 'border-[#E6A817]/35 bg-white/90 text-[#2B1D0E] hover:bg-[#fff9ef]',
                        )}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-full border-[#E6A817]/40 bg-white/90 text-[#2B1D0E] hover:bg-[#fff9ef]"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-[#E6A817]/20 bg-white/80 p-8 shadow-sm">
              <EmptyState type="search" />
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Products;
