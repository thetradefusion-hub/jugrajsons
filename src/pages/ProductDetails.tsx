import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Check, Package, Leaf,
  Share2, AlertCircle, TrendingUp, Award, Clock, Users, MessageSquare, HelpCircle,
  CheckCircle2, Info, Sparkles, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import SEO from '@/components/seo/SEO';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// Package size options
const packageSizes = [
  { id: 'small', label: '30 Tablets', multiplier: 0.5, popular: false },
  { id: 'medium', label: '60 Tablets', multiplier: 1, popular: true },
  { id: 'large', label: '120 Tablets', multiplier: 1.8, popular: false },
  { id: 'family', label: '180 Tablets', multiplier: 2.5, popular: false },
];

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

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToRecentlyViewed, items: recentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState('medium');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const quantity = product ? getItemQuantity(product.id || product._id) : 0;
  const inWishlist = product ? isInWishlist(product.id || product._id) : false;

  const selectedPackage = packageSizes.find(s => s.id === selectedSize)!;
  const adjustedPrice = product ? Math.round(product.price * selectedPackage.multiplier) : 0;
  const adjustedOriginalPrice = product ? Math.round(product.originalPrice * selectedPackage.multiplier) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${slug}`);
        const p = response.data;
        
        // Transform backend product to frontend format
        const transformedProduct: Product = {
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
          concern: p.concern || [],
          productType: p.productType,
          tags: p.tags || [],
          inStock: p.inStock !== false,
          stockCount: p.stockCount || 0,
          ingredients: p.ingredients || [],
          benefits: p.benefits || [],
          usage: p.usage || '',
          whoShouldUse: p.whoShouldUse || [],
          isBestseller: p.isBestseller || false,
          isNew: p.isNew || false,
          sku: p.sku,
        };
        
        setProduct(transformedProduct);

        // Fetch related products based on concerns
        if (p.concern && p.concern.length > 0) {
          try {
            const relatedResponse = await api.get('/products', {
              params: { limit: 20 }
            });
            const allProducts = relatedResponse.data.products || relatedResponse.data || [];
            
            const transformedAllProducts = allProducts.map((prod: any) => ({
              _id: prod._id,
              id: prod._id || prod.slug,
              name: prod.name,
              slug: prod.slug,
              description: prod.description,
              shortDescription: prod.shortDescription,
              price: prod.price,
              originalPrice: prod.originalPrice,
              discount: prod.discount || 0,
              rating: prod.rating || 0,
              reviewCount: prod.reviewCount || 0,
              images: prod.images || [],
              category: prod.category,
              concern: prod.concern || [],
              productType: prod.productType,
              tags: prod.tags || [],
              inStock: prod.inStock !== false,
              stockCount: prod.stockCount || 0,
              ingredients: prod.ingredients || [],
              benefits: prod.benefits || [],
              usage: prod.usage || '',
              whoShouldUse: prod.whoShouldUse || [],
              isBestseller: prod.isBestseller || false,
              isNew: prod.isNew || false,
              sku: prod.sku,
            }));

            // Filter related products
            const related = transformedAllProducts
              .filter((prod: Product) => 
                (prod.id || prod._id) !== (transformedProduct.id || transformedProduct._id) &&
                prod.concern.some((c: string) => p.concern.includes(c))
              )
              .slice(0, 4);
            
            setRelatedProducts(related);
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            setRelatedProducts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    if (!product) return;
    try {
      setReviewsLoading(true);
      const response = await api.get(`/reviews/product/${product._id}`);
      setReviews(response.data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      // If endpoint doesn't exist or error, set empty array
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.shortDescription,
          url: url,
        });
        toast({
          title: 'Shared!',
          description: 'Product link shared successfully',
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      toast({
        title: 'Link Copied!',
        description: 'Product link copied to clipboard',
      });
    }
  };

  const getStockStatus = () => {
    if (!product) return { text: '', color: '', icon: null };
    if (!product.inStock || product.stockCount === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', icon: AlertCircle };
    }
    if (product.stockCount < 10) {
      return { text: `Only ${product.stockCount} left!`, color: 'text-amber-600', icon: AlertCircle };
    }
    return { text: 'In Stock', color: 'text-emerald-600', icon: CheckCircle2 };
  };

  const stockStatus = getStockStatus();

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to write a review',
        variant: 'destructive',
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please write your review comment',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      
      toast({
        title: 'Review Submitted!',
        description: 'Your review is pending approval. Thank you!',
      });
      
      setReviewComment('');
      setReviewRating(5);
      
      // Refresh reviews after a short delay
      setTimeout(() => {
        fetchReviews();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }


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
              {/* Badges & Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 flex-wrap">
                  {product.isBestseller && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs px-2.5 py-0.5">
                      <Award className="w-3 h-3 mr-1" />
                      Bestseller
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-xs px-2.5 py-0.5">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-xs px-2.5 py-0.5">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Title & Category */}
              <div>
                <p className="text-xs text-primary uppercase tracking-wider font-medium mb-1">{product.productType}</p>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
              </div>

              {/* Rating & Stock Status */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-sm text-amber-700 dark:text-amber-400">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
                {stockStatus.icon && (
                  <div className={cn("flex items-center gap-1.5 text-xs font-medium", stockStatus.color)}>
                    <stockStatus.icon className="w-4 h-4" />
                    <span>{stockStatus.text}</span>
                  </div>
                )}
              </div>

              {/* SKU */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>SKU:</span>
                <span className="font-mono font-medium">{product.sku}</span>
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

              {/* Full Description */}
              {product.description && product.description !== product.shortDescription && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Full Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

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
                <TabsList className="w-full grid grid-cols-4 h-12 bg-muted/50 rounded-xl p-1">
                  <TabsTrigger value="benefits" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">Benefits</TabsTrigger>
                  <TabsTrigger value="ingredients" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">Ingredients</TabsTrigger>
                  <TabsTrigger value="usage" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">How to Use</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="benefits" className="mt-4">
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-sm p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="flex-1">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="ingredients" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0 px-3 py-1.5">
                          <Leaf className="w-3 h-3 mr-1.5" />
                          {ing}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="usage" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.usage}
                    </p>
                    {product.whoShouldUse && product.whoShouldUse.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Who Should Use
                        </h4>
                        <ul className="space-y-2">
                          {product.whoShouldUse.map((person, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{person}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  {reviewsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No reviews yet</p>
                      <p className="text-xs text-muted-foreground/70">Be the first to review this product!</p>
                      {isAuthenticated && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Scroll to review form
                            setTimeout(() => {
                              const reviewForm = document.getElementById('review-form');
                              if (reviewForm) {
                                reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                // Highlight the form
                                reviewForm.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                                setTimeout(() => {
                                  reviewForm.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                                }, 2000);
                              }
                            }, 100);
                          }}
                          className="mt-4"
                        >
                          Write First Review
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review._id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-sm">{review.userId?.name || 'Anonymous'}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-3 h-3",
                                        i < review.rating
                                          ? "fill-amber-500 text-amber-500"
                                          : "text-muted-foreground"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Write Review Form - Always visible when authenticated */}
                  {isAuthenticated && (
                    <Card id="review-form" className="border-2 border-dashed mt-6">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Write a Review
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setReviewRating(rating)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    "w-6 h-6 transition-colors",
                                    rating <= reviewRating
                                      ? "fill-amber-500 text-amber-500"
                                      : "text-muted-foreground hover:text-amber-400"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Selected: {reviewRating} out of 5</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Your Review</label>
                          <Textarea
                            placeholder="Share your experience with this product... What did you like? What could be improved?"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={5}
                            className="resize-none"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {reviewComment.length} characters
                          </p>
                        </div>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={submittingReview || !reviewComment.trim()}
                          className="w-full"
                          size="lg"
                        >
                          {submittingReview ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Submit Review
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                          Your review will be reviewed by admin before being published
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {!isAuthenticated && (
                    <Card className="border-2 border-dashed mt-6">
                      <CardContent className="p-6 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Please login to write a review
                        </p>
                        <Button asChild>
                          <Link to="/login">Login to Review</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border p-4 safe-area-bottom shadow-lg">
          <div className="container-custom flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-xl border-2 hover:scale-105 transition-transform"
              onClick={() => {
                if (inWishlist) {
                  removeFromWishlist(product.id);
                  toast({ title: 'Removed from wishlist', variant: 'default' });
                } else {
                  addToWishlist(product);
                  toast({ title: 'Added to wishlist', description: 'Product saved for later' });
                }
              }}
            >
              <Heart className={cn('w-5 h-5 transition-all', inWishlist && 'fill-red-500 text-red-500 scale-110')} />
            </Button>
            
            {!product.inStock || product.stockCount === 0 ? (
              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-xl bg-muted text-muted-foreground font-semibold text-base cursor-not-allowed"
                disabled
              >
                <AlertCircle className="w-5 h-5 mr-2" /> Out of Stock
              </Button>
            ) : quantity === 0 ? (
              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-xl bg-gradient-to-r from-emerald-600 via-primary to-teal-600 hover:from-emerald-700 hover:via-primary/90 hover:to-teal-700 font-extrabold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-[1.02] relative overflow-hidden group"
                onClick={() => {
                  addItem(product);
                  toast({
                    title: '✅ Added to Cart!',
                    description: `${product.name} added successfully`,
                  });
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Add to Cart</span>
                  <span className="font-black">₹{adjustedPrice.toLocaleString()}</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-primary to-teal-600 rounded-xl h-14 px-3 shadow-2xl border-2 border-emerald-500/30">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-white hover:bg-white/25 rounded-lg transition-all hover:scale-110"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-extrabold text-xl text-white">{quantity}</span>
                  <span className="text-[10px] text-white/90 font-semibold">in cart</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-white hover:bg-white/25 rounded-lg transition-all hover:scale-110"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  disabled={product.stockCount > 0 && quantity >= product.stockCount}
                >
                  <Plus className="w-5 h-5" />
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
              {relatedProducts.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ProductDetails;
