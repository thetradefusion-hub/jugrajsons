import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEO from '@/components/seo/SEO';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { cn } from '@/lib/utils';

const ProductDetails = () => {
  const { slug } = useParams();
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToRecentlyViewed, items: recentlyViewed } = useRecentlyViewed();

  const product = products.find(p => p.slug === slug);
  const quantity = product ? getItemQuantity(product.id) : 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id && p.concern.some(c => product.concern.includes(c))).slice(0, 4);

  return (
    <>
      <SEO title={product.name} description={product.shortDescription} />
      <main className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isBestseller && <Badge className="badge-bestseller">Bestseller</Badge>}
              {product.isNew && <Badge className="badge-new">New Launch</Badge>}
            </div>

            {/* Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{product.productType}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('w-5 h-5', i < Math.floor(product.rating) ? 'fill-ayurveda-gold text-ayurveda-gold' : 'text-muted-foreground/30')} />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <Badge className="badge-discount">{product.discount}% OFF</Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground">{product.shortDescription}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {quantity === 0 ? (
                <Button size="lg" className="flex-1" onClick={() => addItem(product)}>
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
              ) : (
                <div className="flex items-center gap-4 bg-muted rounded-lg p-2">
                  <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, quantity - 1)}><Minus className="w-4 h-4" /></Button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus className="w-4 h-4" /></Button>
                </div>
              )}
              <Button variant="outline" size="lg" onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}>
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-destructive text-destructive')} />
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
              <div className="flex items-center gap-2 text-sm"><Truck className="w-5 h-5 text-primary" /><span>Free Shipping</span></div>
              <div className="flex items-center gap-2 text-sm"><Shield className="w-5 h-5 text-primary" /><span>100% Authentic</span></div>
              <div className="flex items-center gap-2 text-sm"><RotateCcw className="w-5 h-5 text-primary" /><span>Easy Returns</span></div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="benefits" className="mt-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="usage">How to Use</TabsTrigger>
              </TabsList>
              <TabsContent value="benefits" className="mt-4">
                <ul className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /><span>{benefit}</span></li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="ingredients" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <Badge key={i} variant="secondary">{ing}</Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="usage" className="mt-4">
                <p className="text-muted-foreground">{product.usage}</p>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ProductDetails;
