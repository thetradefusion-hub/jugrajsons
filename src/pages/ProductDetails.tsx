import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
  Leaf,
  Share2,
  AlertCircle,
  TrendingUp,
  Award,
  Clock,
  Users,
  MessageSquare,
  CheckCircle2,
  Info,
  Sparkles,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
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
      <div className="min-h-[50vh] bg-[#F5E9D7] pb-28 pt-12">
        <div className="container-custom">
          <div className="mx-auto max-w-lg animate-pulse space-y-4">
            <div className="h-8 w-40 rounded-full bg-white/60" />
            <div className="aspect-square max-w-md rounded-3xl border border-[#E6A817]/20 bg-white/50" />
            <div className="h-24 rounded-2xl border border-[#E6A817]/15 bg-white/50" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] bg-[#F5E9D7] pb-28 pt-16 text-[#2B1D0E]">
        <div className="container-custom text-center">
          <h1 className="font-display text-3xl font-bold">Product not found</h1>
          <p className="mt-2 text-sm text-[#2B1D0E]/70">Is link sahi nahi lag raha — shop se dobara chuniye.</p>
          <Button asChild className="mt-8 rounded-full bg-[#E6A817] px-8 text-[#2B1D0E] hover:bg-[#d89c14]">
            <Link to="/products">Back to shop</Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <>
      <SEO title={product.name} description={product.shortDescription} />
      <main className="overflow-x-hidden bg-[#F5E9D7] pb-32 text-[#2B1D0E] md:pb-28">
        <section className="relative isolate border-b border-[#E6A817]/15 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.11] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative py-4 md:py-8">
            <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1F3D2B]">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <Link to="/products" className="hover:text-[#1F3D2B]">
                Shop
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <span className="max-w-[200px] truncate font-medium text-[#2B1D0E] sm:max-w-md">{product.name}</span>
            </nav>

            <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
              <div className="rounded-3xl border border-[#E6A817]/25 bg-white/90 p-3 shadow-[0_16px_40px_rgba(43,29,14,0.08)] md:p-5">
                <ProductGallery images={product.images} productName={product.name} />
              </div>

              <Card className="overflow-hidden rounded-3xl border border-[#E6A817]/25 bg-white shadow-[0_16px_40px_rgba(43,29,14,0.08)]">
                <CardContent className="space-y-5 p-5 md:p-7">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {product.isBestseller && (
                        <Badge className="flex items-center gap-1 border-0 bg-[#1F3D2B] px-2.5 py-1 text-xs text-[#F5E9D7]">
                          <Award className="h-3 w-3" />
                          Bestseller
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="flex items-center gap-1 border-0 bg-[#E6A817] px-2.5 py-1 text-xs font-semibold text-[#2B1D0E]">
                          <Sparkles className="h-3 w-3" />
                          New
                        </Badge>
                      )}
                      {product.discount > 0 && (
                        <Badge className="flex items-center gap-1 border-0 bg-[#2B1D0E]/10 px-2.5 py-1 text-xs font-semibold text-[#2B1D0E]">
                          <TrendingUp className="h-3 w-3" />
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-full border border-[#E6A817]/25 bg-[#fff9ef] text-[#2B1D0E] hover:bg-[#fff3df]"
                      onClick={handleShare}
                      aria-label="Share product"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#1F3D2B]/80">{product.productType}</p>
                    <h1 className="font-display text-2xl font-bold leading-tight text-[#2B1D0E] sm:text-3xl">{product.name}</h1>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full border border-[#E6A817]/35 bg-[#fff9ef] px-2.5 py-1">
                        <Star className="h-4 w-4 fill-[#E6A817] text-[#E6A817]" />
                        <span className="text-sm font-bold text-[#2B1D0E]">{product.rating}</span>
                      </div>
                      <span className="text-sm text-[#2B1D0E]/60">({product.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                    {stockStatus.icon && (
                      <div className={cn('flex items-center gap-1.5 text-xs font-semibold', stockStatus.color)}>
                        <stockStatus.icon className="h-4 w-4" />
                        <span>{stockStatus.text}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#2B1D0E]/55">
                    <span>SKU</span>
                    <span className="font-mono font-medium text-[#2B1D0E]">{product.sku}</span>
                  </div>

                  <div className="rounded-2xl border border-[#E6A817]/25 bg-[#fff9ef] p-4 md:p-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#2B1D0E] md:text-3xl">Rs. {product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <>
                          <span className="text-sm text-[#2B1D0E]/50 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                          <Badge className="border-0 bg-[#1F3D2B]/10 text-xs font-semibold text-[#1F3D2B]">{product.discount}% OFF</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[#2B1D0E]/80">{product.shortDescription}</p>

                  {product.description && product.description !== product.shortDescription && (
                    <div className="space-y-2 border-t border-[#E6A817]/15 pt-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2B1D0E]">
                        <Info className="h-4 w-4 text-[#1F3D2B]" />
                        Full description
                      </h3>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-[#2B1D0E]/75">{product.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#E6A817]/20 bg-[#fffaf2] p-3">
                      <Truck className="h-5 w-5 text-[#1F3D2B]" />
                      <span className="text-center text-[10px] font-semibold text-[#2B1D0E]/85">Shipping</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#E6A817]/20 bg-[#fffaf2] p-3">
                      <Shield className="h-5 w-5 text-[#1F3D2B]" />
                      <span className="text-center text-[10px] font-semibold text-[#2B1D0E]/85">Authentic</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#E6A817]/20 bg-[#fffaf2] p-3">
                      <RotateCcw className="h-5 w-5 text-[#1F3D2B]" />
                      <span className="text-center text-[10px] font-semibold text-[#2B1D0E]/85">Returns</span>
                    </div>
                  </div>

                  <Tabs defaultValue="benefits" className="mt-2 border-t border-[#E6A817]/15 pt-5">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border border-[#E6A817]/20 bg-[#fff9ef] p-1 sm:grid-cols-4">
                  <TabsTrigger
                    value="benefits"
                    className="rounded-xl text-xs data-[state=active]:bg-white data-[state=active]:text-[#2B1D0E] data-[state=active]:shadow-sm"
                  >
                    Benefits
                  </TabsTrigger>
                  <TabsTrigger
                    value="ingredients"
                    className="rounded-xl text-xs data-[state=active]:bg-white data-[state=active]:text-[#2B1D0E] data-[state=active]:shadow-sm"
                  >
                    Ingredients
                  </TabsTrigger>
                  <TabsTrigger
                    value="usage"
                    className="rounded-xl text-xs data-[state=active]:bg-white data-[state=active]:text-[#2B1D0E] data-[state=active]:shadow-sm"
                  >
                    How to use
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex items-center justify-center gap-1 rounded-xl text-xs data-[state=active]:bg-white data-[state=active]:text-[#2B1D0E] data-[state=active]:shadow-sm"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="benefits" className="mt-4">
                  {product.benefits?.length ? (
                    <ul className="space-y-3">
                      {product.benefits.map((benefit, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-3 rounded-xl border border-[#E6A817]/15 bg-[#fffaf2] p-3 text-sm text-[#2B1D0E]/90"
                        >
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1F3D2B]">
                            <Check className="h-4 w-4 text-[#F5E9D7]" />
                          </div>
                          <span className="flex-1 leading-relaxed">{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#2B1D0E]/60">Pure honey — detailed benefit list jald add ho sakti hai.</p>
                  )}
                </TabsContent>
                <TabsContent value="ingredients" className="mt-4">
                  {product.ingredients?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ing, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Badge className="border-0 bg-[#1F3D2B] px-3 py-1.5 text-[#F5E9D7]">
                            <Leaf className="mr-1.5 inline h-3 w-3" />
                            {ing}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#2B1D0E]/60">100% natural honey — single-ingredient purity.</p>
                  )}
                </TabsContent>
                <TabsContent value="usage" className="mt-4">
                  <div className="space-y-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-[#2B1D0E]/80">
                      {product.usage || 'Roz 1 spoon gungune paani ya doodh ke saath — subah ya shaam, apni routine ke hisaab se.'}
                    </p>
                    {product.whoShouldUse && product.whoShouldUse.length > 0 && (
                      <div className="mt-4 border-t border-[#E6A817]/15 pt-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2B1D0E]">
                          <Users className="h-4 w-4 text-[#1F3D2B]" />
                          Who should use
                        </h4>
                        <ul className="space-y-2">
                          {product.whoShouldUse.map((person, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#2B1D0E]/85">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1F3D2B]" />
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
                    <div className="py-8 text-center text-sm text-[#2B1D0E]/60">Loading reviews…</div>
                  ) : reviews.length === 0 ? (
                    <div className="space-y-2 py-8 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-[#2B1D0E]/25" />
                      <p className="text-sm text-[#2B1D0E]/75">No reviews yet</p>
                      <p className="text-xs text-[#2B1D0E]/55">Pehla review aap likh sakte hain.</p>
                      {isAuthenticated && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 rounded-full border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]"
                          onClick={() => {
                            // Scroll to review form
                            setTimeout(() => {
                              const reviewForm = document.getElementById('review-form');
                              if (reviewForm) {
                                reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                // Highlight the form
                                reviewForm.classList.add('ring-2', 'ring-[#E6A817]', 'ring-offset-2');
                                setTimeout(() => {
                                  reviewForm.classList.remove('ring-2', 'ring-[#E6A817]', 'ring-offset-2');
                                }, 2000);
                              }
                            }, 100);
                          }}
                        >
                          Write first review
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review._id} className="border border-[#E6A817]/20 bg-[#fffaf2]">
                          <CardContent className="p-4">
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <p className="text-sm font-semibold text-[#2B1D0E]">{review.userId?.name || 'Anonymous'}</p>
                                <div className="mt-1 flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        'h-3 w-3',
                                        i < review.rating ? 'fill-[#E6A817] text-[#E6A817]' : 'text-[#2B1D0E]/25',
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-[#2B1D0E]/50">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-[#2B1D0E]/80">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {isAuthenticated && (
                    <Card id="review-form" className="mt-6 border-2 border-dashed border-[#E6A817]/40 bg-white/90">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-[#2B1D0E]">
                          <MessageSquare className="h-4 w-4 text-[#1F3D2B]" />
                          Write a review
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
                          type="button"
                          onClick={handleSubmitReview}
                          disabled={submittingReview || !reviewComment.trim()}
                          className="w-full rounded-full bg-[#1F3D2B] text-[#F5E9D7] hover:bg-[#173423]"
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
                    <Card className="mt-6 border-2 border-dashed border-[#E6A817]/35 bg-white/80">
                      <CardContent className="p-6 text-center">
                        <MessageSquare className="mx-auto mb-3 h-12 w-12 text-[#2B1D0E]/25" />
                        <p className="mb-4 text-sm text-[#2B1D0E]/75">Review ke liye login kijiye.</p>
                        <Button asChild className="rounded-full bg-[#E6A817] text-[#2B1D0E] hover:bg-[#d89c14]">
                          <Link to="/login">Login</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
            </div>
          </div>
        </section>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-[#E6A817]/25 bg-[#F5E9D7]/95 p-4 shadow-[0_-8px_30px_rgba(43,29,14,0.08)] backdrop-blur-lg safe-area-bottom">
          <div className="container-custom flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-[#E6A817]/40 bg-white text-[#2B1D0E] shadow-sm hover:bg-[#fff9ef]"
              onClick={() => {
                const pid = product.id || product._id;
                if (inWishlist) {
                  removeFromWishlist(pid);
                  toast({ title: 'Removed from wishlist', variant: 'default' });
                } else {
                  addToWishlist(product);
                  toast({ title: 'Added to wishlist', description: 'Product saved for later' });
                }
              }}
              aria-label="Wishlist"
            >
              <Heart className={cn('h-5 w-5 transition-all', inWishlist && 'scale-105 fill-[#c45a5a] text-[#c45a5a]')} />
            </Button>

            {!product.inStock || product.stockCount === 0 ? (
              <Button
                type="button"
                size="lg"
                disabled
                className="h-14 flex-1 cursor-not-allowed rounded-full bg-[#2B1D0E]/15 text-base font-semibold text-[#2B1D0E]/50"
              >
                <AlertCircle className="mr-2 h-5 w-5" /> Out of stock
              </Button>
            ) : quantity === 0 ? (
              <Button
                type="button"
                size="lg"
                className="group relative h-14 flex-1 overflow-hidden rounded-full bg-[#E6A817] text-base font-bold text-[#2B1D0E] shadow-lg transition-transform hover:scale-[1.01] hover:bg-[#d89c14]"
                onClick={() => {
                  addItem(product);
                  toast({
                    title: 'Added to cart',
                    description: `${product.name} cart me add ho gaya.`,
                  });
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-105" />
                  <span>Add to cart</span>
                  <span className="font-extrabold">Rs. {product.price.toLocaleString()}</span>
                </span>
              </Button>
            ) : (
              <div className="flex h-14 flex-1 items-center justify-between rounded-full border border-[#1F3D2B]/20 bg-[#1F3D2B] px-2 shadow-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-[#F5E9D7] hover:bg-white/15"
                  onClick={() => updateQuantity(product.id || product._id, quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl font-extrabold text-[#F5E9D7]">{quantity}</span>
                  <span className="text-[10px] font-semibold text-[#F5E9D7]/85">in cart</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-[#F5E9D7] hover:bg-white/15"
                  onClick={() => updateQuantity(product.id || product._id, quantity + 1)}
                  disabled={product.stockCount > 0 && quantity >= product.stockCount}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container-custom mt-10 pb-8 md:mt-14 md:pb-12">
            <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2B]/75">More from the hive</p>
                <h2 className="font-display text-2xl font-bold text-[#2B1D0E] md:text-3xl">You may also like</h2>
              </div>
              <Button asChild variant="outline" className="mt-2 w-fit rounded-full border-[#E6A817]/40 bg-white/90 text-[#2B1D0E] hover:bg-[#fff9ef] md:mt-0">
                <Link to="/products">View all</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id || p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ProductDetails;
