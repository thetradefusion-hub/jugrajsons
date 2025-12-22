import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Check, Package, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/seo/SEO';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { cn } from '@/lib/utils';

// Package size options
const packageSizes = [
  { id: 'small', label: '30 Tablets', multiplier: 0.5, popular: false },
  { id: 'medium', label: '60 Tablets', multiplier: 1, popular: true },
  { id: 'large', label: '120 Tablets', multiplier: 1.8, popular: false },
  { id: 'family', label: '180 Tablets', multiplier: 2.5, popular: false },
];

const ProductDetails = () => {
  const { slug } = useParams();
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToRecentlyViewed, items: recentlyViewed } = useRecentlyViewed();
  const [selectedSize, setSelectedSize] = useState('medium');

  const product = products.find(p => p.slug === slug);
  const quantity = product ? getItemQuantity(product.id) : 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  const selectedPackage = packageSizes.find(s => s.id === selectedSize)!;
  const adjustedPrice = product ? Math.round(product.price * selectedPackage.multiplier) : 0;
  const adjustedOriginalPrice = product ? Math.round(product.originalPrice * selectedPackage.multiplier) : 0;

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
      <main className="pb-24">
        {/* Product Header - Mobile App Style */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="container-custom pt-4 pb-6">
            {/* Gallery */}
            <ProductGallery images={product.images} productName={product.name} />
          </div>
        </div>

        {/* Product Info Card */}
        <div className="container-custom -mt-4 relative z-10">
          <Card className="border-0 shadow-xl rounded-t-3xl overflow-hidden">
            <CardContent className="p-5 space-y-5">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isBestseller && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs px-2.5 py-0.5">
                    🏆 Bestseller
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-xs px-2.5 py-0.5">
                    ✨ New
                  </Badge>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <p className="text-xs text-primary uppercase tracking-wider font-medium mb-1">{product.productType}</p>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-sm text-amber-700 dark:text-amber-400">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              {/* Package Size Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Select Package Size</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {packageSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={cn(
                        "relative p-3 rounded-xl border-2 transition-all text-left",
                        selectedSize === size.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {size.popular && (
                        <span className="absolute -top-2 right-2 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                      <span className="font-semibold text-sm block">{size.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ₹{Math.round(product.price * size.multiplier).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Price for {selectedPackage.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">₹{adjustedPrice.toLocaleString()}</span>
                    {adjustedOriginalPrice > adjustedPrice && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">₹{adjustedOriginalPrice.toLocaleString()}</span>
                        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-0 text-xs">
                          {product.discount}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">{product.shortDescription}</p>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-center font-medium">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-center font-medium">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-center font-medium">Easy Returns</span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="benefits" className="mt-4">
                <TabsList className="w-full grid grid-cols-3 h-12 bg-muted/50 rounded-xl p-1">
                  <TabsTrigger value="benefits" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">Benefits</TabsTrigger>
                  <TabsTrigger value="ingredients" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">Ingredients</TabsTrigger>
                  <TabsTrigger value="usage" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">How to Use</TabsTrigger>
                </TabsList>
                <TabsContent value="benefits" className="mt-4">
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="ingredients" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, i) => (
                      <Badge key={i} variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0">
                        <Leaf className="w-3 h-3 mr-1" />
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="usage" className="mt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.usage}</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border p-4 safe-area-bottom">
          <div className="container-custom flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-xl border-2"
              onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
            >
              <Heart className={cn('w-5 h-5', inWishlist && 'fill-red-500 text-red-500')} />
            </Button>
            
            {quantity === 0 ? (
              <Button 
                size="lg" 
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 font-semibold text-base shadow-lg"
                onClick={() => addItem(product)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-primary rounded-xl h-12 px-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-primary-foreground hover:bg-white/20"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-bold text-lg text-primary-foreground">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-primary-foreground hover:bg-white/20"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container-custom mt-8">
            <h2 className="font-display text-lg font-bold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ProductDetails;
