import { Link } from 'react-router-dom';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import { useWishlist } from '@/context/WishlistContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <>
      <SEO title="My Wishlist" />
      <main className="container-custom py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/products"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="font-display text-2xl md:text-3xl font-bold">My Wishlist</h1>
          {items.length > 0 && <span className="text-muted-foreground">({items.length} items)</span>}
        </div>

        {items.length === 0 ? (
          <EmptyState type="wishlist" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Wishlist;
