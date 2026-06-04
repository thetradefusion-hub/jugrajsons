import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { getCategoryLabel, productTypes } from '@/data/products';

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

const ServiceCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = productTypes.find((c) => c.slug === slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    if (!slug || !service) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products', { params: { category: slug, limit: 1000 } });

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
  }, [slug, service]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return list.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }
  }, [products, sortBy]);

  if (!service) {
    return (
      <main className="min-h-screen bg-[#F5E9D7] pb-24 md:pb-12">
        <div className="container-custom py-16 text-center">
          <h1 className="font-display text-2xl font-semibold text-[#2B1D0E]">Service not found</h1>
          <p className="mt-2 text-sm text-[#2B1D0E]/70">This category does not exist.</p>
          <Button asChild className="mt-6 rounded-full bg-[#1F3D2B] text-[#F5E9D7]">
            <Link to="/services">All Services</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={`${service.name} | Services — Jugraj Son's Hive`}
        description={service.description}
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate border-b border-[#E6A817]/15 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative py-6 md:py-10">
            <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1F3D2B]">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
              <Link to="/services" className="hover:text-[#1F3D2B]">
                Services
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
              <span className="line-clamp-1 font-medium text-[#2B1D0E]">{service.name}</span>
            </nav>

            <div className="grid gap-5 md:grid-cols-[minmax(0,280px)_1fr] md:items-center">
              <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-[#E6A817]/25 bg-[#f5efe3] p-2 shadow-md">
                <img
                  src={encodeURI(service.image)}
                  alt={service.name}
                  className="block h-auto w-full max-w-full object-contain"
                />
              </div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Badge className="border-0 bg-[#1F3D2B] px-2.5 py-0.5 text-[10px] text-[#F5E9D7] md:text-xs">Service</Badge>
                <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-[#2B1D0E] sm:text-3xl md:text-4xl">
                  {service.name}
                </h1>
              </motion.div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#2B1D0E]/70 md:text-sm">
                {loading ? 'Loading…' : `${sortedProducts.length} product${sortedProducts.length === 1 ? '' : 's'} & services`}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-full rounded-full border-[#E6A817]/35 bg-white/90 text-xs sm:w-[200px] sm:text-sm">
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
        </section>

        <section className="container-custom py-6 md:py-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-3xl border border-[#E6A817]/20 bg-white/60"
                />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="rounded-2xl border border-[#E6A817]/25 bg-white/80 px-6 py-14 text-center">
              <h2 className="font-display text-xl font-semibold text-[#2B1D0E]">No products yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#2B1D0E]/70">
                {getCategoryLabel(service.slug)} listings will appear here once added from the admin panel.
              </p>
              <Button asChild variant="outline" className="mt-6 rounded-full border-[#1F3D2B]/30">
                <Link to="/services">Browse all services</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-1 rounded-full border border-[#1F3D2B]/30 bg-white/80 px-5 py-2.5 text-sm font-medium text-[#1F3D2B] hover:bg-[#fff9ef]"
            >
              ← All services
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default ServiceCategory;
