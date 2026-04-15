import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Heart, Home, ShoppingBag } from 'lucide-react';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <>
      <SEO
        title="Wishlist | Jugraj Son's Hive"
        description="Apni pasand ki honey products save karein aur baad me shop karein."
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-28 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate border-b border-[#E6A817]/15 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.11] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative py-6 md:py-10">
            <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1F3D2B]">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <span className="font-medium text-[#2B1D0E]">Wishlist</span>
            </nav>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6A817]/35 bg-white/80 px-3 py-1 text-xs font-medium text-[#2B1D0E]/80">
                  <Heart className="h-3.5 w-3.5 fill-[#E6A817] text-[#E6A817]" />
                  Saved for later
                </div>
                <h1 className="font-display text-3xl font-bold leading-tight text-[#2B1D0E] md:text-5xl">Wishlist</h1>
                <p className="mt-2 max-w-xl text-sm text-[#2B1D0E]/75 md:text-base">
                  Jo products aapko pasand hain, yahin se turant shop par le ja sakte hain.
                </p>
                {items.length > 0 && (
                  <Badge className="mt-3 border-0 bg-[#1F3D2B] px-3 py-1 text-[#F5E9D7]">{items.length} items</Badge>
                )}
              </motion.div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-[#E6A817]/40 bg-white/90 text-[#2B1D0E] hover:bg-[#fff9ef]"
                >
                  <Link to="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Shop
                  </Link>
                </Button>
                {items.length > 0 && (
                  <Button asChild className="rounded-full bg-[#E6A817] font-semibold text-[#2B1D0E] hover:bg-[#d89c14]">
                    <Link to="/cart">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Go to cart
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom py-8 md:py-12">
          {items.length === 0 ? (
            <Card className="mx-auto max-w-lg rounded-3xl border border-[#E6A817]/25 bg-white/95 shadow-[0_16px_40px_rgba(43,29,14,0.06)]">
              <CardContent className="p-6 md:p-10 [&_a]:rounded-full [&_a]:bg-[#E6A817] [&_a]:px-8 [&_a]:font-semibold [&_a]:text-[#2B1D0E] [&_a]:hover:bg-[#d89c14]">
                <EmptyState
                  type="wishlist"
                  title="Wishlist abhi khali hai"
                  description="Jo honey jars pasand hon, product page se yahan save kar sakte hain — baad me shop se order karein."
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {items.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Wishlist;
