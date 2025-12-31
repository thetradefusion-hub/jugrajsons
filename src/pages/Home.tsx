import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Leaf, Award, Truck, Star, ChevronRight, Sparkles, Heart, Zap, CheckCircle2, TrendingUp, Users, Clock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import { concerns, testimonials } from '@/data/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface ActiveCoupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  validUntil: string;
}

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

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState<ActiveCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(true);

  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);

  const trustFeatures = [
    { icon: Shield, title: 'GMP Certified', description: 'Quality assured', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { icon: Leaf, title: '100% Natural', description: 'Pure herbs', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { icon: Award, title: '50+ Years', description: 'Legacy trust', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { icon: Truck, title: 'Free Delivery', description: 'Above ₹499', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50' },
  ];

  const quickActions = [
    { icon: Zap, label: 'Quick Order', path: '/products', color: 'bg-gradient-to-br from-amber-400 to-orange-500', hover: 'hover:from-amber-500 hover:to-orange-600' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: 'bg-gradient-to-br from-rose-400 to-pink-500', hover: 'hover:from-rose-500 hover:to-pink-600' },
    { icon: Sparkles, label: 'New Arrivals', path: '/products?tag=new', color: 'bg-gradient-to-br from-violet-400 to-purple-500', hover: 'hover:from-violet-500 hover:to-purple-600' },
    { icon: Award, label: 'Best Sellers', path: '/products?tag=bestseller', color: 'bg-gradient-to-br from-emerald-400 to-teal-500', hover: 'hover:from-emerald-500 hover:to-teal-600' },
  ];

  const stats = [
    { icon: Users, value: '1M+', label: 'Happy Customers', color: 'text-blue-600' },
    { icon: Award, value: '50+', label: 'Years Experience', color: 'text-amber-600' },
    { icon: CheckCircle2, value: '100%', label: 'Natural Products', color: 'text-emerald-600' },
    { icon: TrendingUp, value: '4.8', label: 'Average Rating', color: 'text-purple-600' },
  ];

  const heroSlides = [
    {
      id: 1,
      title: 'Discover',
      highlight: 'Authentic',
      subtitle: 'Ayurveda',
      description: 'Transform your health naturally with scientifically formulated products backed by 50+ years of Ayurvedic expertise',
      gradient: 'from-emerald-600 via-green-600 to-teal-600',
      badge: 'Ancient Wisdom, Modern Wellness',
    },
    {
      id: 2,
      title: 'Natural',
      highlight: 'Herbal',
      subtitle: 'Wellness',
      description: 'Experience the power of 100% natural ingredients, carefully selected and processed using traditional Ayurvedic methods',
      gradient: 'from-amber-600 via-orange-600 to-rose-600',
      badge: 'Pure & Authentic Products',
    },
    {
      id: 3,
      title: 'Expert',
      highlight: 'Consultation',
      subtitle: 'Available',
      description: 'Get personalized health recommendations from our certified Ayurvedic experts and start your wellness journey today',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600',
      badge: 'Certified Ayurvedic Experts',
    },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await api.get('/products', { params: { limit: 1000 } });
        const fetchedProducts = response.data.products || response.data || [];
        
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
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch active coupon from admin panel
  useEffect(() => {
    const fetchActiveCoupon = async () => {
      try {
        const response = await api.get('/coupons/active?active=true');
        const coupons = response.data;
        
        // Get the first active coupon (or the one with highest discount)
        if (coupons && coupons.length > 0) {
          // Sort by discount value (highest first) if percentage, or by discount value if fixed
          const sortedCoupons = coupons.sort((a: ActiveCoupon, b: ActiveCoupon) => {
            if (a.discountType === 'percentage' && b.discountType === 'percentage') {
              return b.discountValue - a.discountValue;
            }
            return b.discountValue - a.discountValue;
          });
          setActiveCoupon(sortedCoupons[0]);
        }
      } catch (error) {
        console.error('Error fetching active coupon:', error);
        // Fallback to default - don't show error to user
      } finally {
        setCouponLoading(false);
      }
    };

    fetchActiveCoupon();
  }, []);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Auto-play functionality
  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  return (
    <>
      <SEO />
      <main className="overflow-x-hidden bg-white">
        {/* Hero Section - Premium Slider Design */}
        <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full">
            <CarouselContent className="-ml-0">
              {heroSlides.map((slide, index) => (
                <CarouselItem key={slide.id} className="pl-0">
                  <div className={`relative bg-gradient-to-br ${slide.gradient} overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center`}>
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0">
                      <div className="absolute top-20 right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
                      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="absolute top-32 left-10 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hidden lg:block"
                    />
                    <motion.div
                      animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                      className="absolute bottom-32 right-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hidden lg:block"
                    />
                    
                    <div className="container-custom relative py-20 md:py-32 lg:py-40 z-10 w-full">
                      <div className="max-w-5xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-center"
                        >
                          {/* Badge */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30 shadow-xl"
                          >
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              <Leaf className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-base md:text-lg font-bold text-white">{slide.badge}</span>
                            <Sparkles className="w-5 h-5 text-amber-300" />
                          </motion.div>
                          
                          {/* Main Heading */}
                          <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]"
                          >
                            {slide.title}{' '}
                            <span className="relative inline-block">
                              <span className="relative z-10 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                                {slide.highlight}
                              </span>
                              <motion.div
                                className="absolute -inset-4 bg-amber-400/30 rounded-2xl blur-2xl"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent">
                              {slide.subtitle}
                            </span>
                          </motion.h1>
                          
                          {/* Description */}
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                          >
                            {slide.description}
                          </motion.p>
                          
                          {/* CTA Buttons */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="flex flex-wrap gap-4 justify-center mb-16 relative z-20 w-full"
                            style={{ position: 'relative', zIndex: 20 }}
                          >
                            <Button 
                              asChild 
                              size="lg" 
                              className="h-16 px-8 md:px-12 text-base md:text-lg font-bold bg-white text-emerald-700 hover:bg-gray-50 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group border-2 border-white/20 relative z-10 min-w-[160px]"
                              style={{ position: 'relative', zIndex: 10 }}
                            >
                              <Link to="/products" className="flex items-center gap-3 whitespace-nowrap">
                                <span>Shop Now</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                            <Button 
                              asChild 
                              size="lg" 
                              className="h-16 px-8 md:px-12 text-base md:text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-400 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group relative z-10 min-w-[180px]"
                              style={{ position: 'relative', zIndex: 10 }}
                            >
                              <Link to="/expert" className="flex items-center gap-3 whitespace-nowrap">
                                <Sparkles className="w-5 h-5" />
                                <span>Consult Expert</span>
                              </Link>
                            </Button>
                          </motion.div>

                          {/* Stats */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                          >
                            {stats.map((stat, statIndex) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + statIndex * 0.1, duration: 0.5 }}
                                className="text-center"
                              >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-3">
                                  <stat.icon className={`w-7 h-7 ${stat.color.replace('text-', 'text-white')}`} />
                                </div>
                                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                                <div className="text-sm md:text-base text-white/80 font-medium">{stat.label}</div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Wave Decoration */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 120L60 110C120 100 240 80 360 73C480 66 600 73 720 80C840 86 960 93 1080 96C1200 100 1320 100 1380 100L1440 100V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="left-4 md:left-8 h-12 w-12 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm" />
            <CarouselNext className="right-4 md:right-8 h-12 w-12 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm" />
            
            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </section>

        {/* Quick Actions - Premium Cards */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 -mt-1">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Quick Access</h2>
              <p className="text-gray-600 text-lg">Everything you need, just a click away</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link to={action.path}>
                    <Card className="h-full border-2 border-purple-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${action.color} ${action.hover} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all`}
                        >
                          <action.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{action.label}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Features - Premium Design */}
        <section className="py-16 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
              <p className="text-gray-600 text-lg">Trusted by millions for authentic Ayurvedic solutions</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className={`h-full border-2 border-transparent hover:border-${feature.color.split('-')[1]}-300 ${feature.bg} shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-700 font-medium">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Concern - Premium Grid */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          <div className="container-custom">
            <Card className="border-2 border-emerald-300 shadow-2xl bg-white overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">Shop by Concern</h2>
                    <p className="text-gray-700 text-lg font-medium">Find solutions tailored to your health needs</p>
                  </div>
                  <Link 
                    to="/products" 
                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    View All <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {concerns.slice(0, 16).map((concern, index) => (
                    <motion.div
                      key={concern.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03, duration: 0.3, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <Link to={`/products?concern=${concern.slug}`}>
                        <Card className="h-full border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-5 text-center">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className="text-4xl mb-3"
                            >
                              {concern.icon}
                            </motion.div>
                            <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2">{concern.name}</span>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-10 md:hidden text-center">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg"
                  >
                    View All <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Special Offer Banner - Ultra Premium Enhanced Design */}
        <section className="py-16 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 relative overflow-hidden">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: 0,
                }}
                animate={{
                  y: [null, Math.random() * 100 + '%'],
                  x: [null, Math.random() * 100 + '%'],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <Card className="border-4 border-amber-400 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 shadow-2xl overflow-hidden relative backdrop-blur-sm">
                {/* Enhanced Background Effects */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-300/30 to-orange-300/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]" />
                </div>

                {/* Floating Decorative Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 15, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-2xl backdrop-blur-sm border border-amber-300/30 hidden lg:block"
                />
                <motion.div
                  animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, -15, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-8 left-8 w-20 h-20 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full backdrop-blur-sm border border-rose-300/30 hidden lg:block"
                />

                <CardContent className="p-10 md:p-16 relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left flex-1">
                      {/* Enhanced Badge with Animation */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        animate={{ 
                          scale: [1, 1.08, 1],
                          rotate: [0, 2, -2, 0],
                        }}
                        transition={{ 
                          scale: { duration: 2, repeat: Infinity },
                          rotate: { duration: 3, repeat: Infinity }
                        }}
                        className="inline-block mb-6"
                      >
                        <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-0 font-extrabold px-6 py-3 text-base md:text-lg shadow-lg relative overflow-hidden group">
                          <span className="relative z-10 flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              🔥
                            </motion.span>
                            Limited Time Offer
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              ⚡
                            </motion.span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Badge>
                      </motion.div>

                      {/* Enhanced Heading with Gradient Text */}
                      <motion.h3 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-tight"
                      >
                        <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                          Get{' '}
                        </span>
                        <motion.span
                          animate={{ 
                            scale: [1, 1.1, 1],
                            textShadow: [
                              '0 0 0px rgba(251, 191, 36, 0)',
                              '0 0 20px rgba(251, 191, 36, 0.5)',
                              '0 0 0px rgba(251, 191, 36, 0)',
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block text-amber-600 relative"
                        >
                          {activeCoupon ? (
                            activeCoupon.discountType === 'percentage' 
                              ? `${activeCoupon.discountValue}% OFF`
                              : `₹${activeCoupon.discountValue} OFF`
                          ) : (
                            couponLoading ? 'Loading...' : '20% OFF'
                          )}
                          <motion.div
                            className="absolute -inset-2 bg-amber-400/20 rounded-lg blur-xl"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.span>
                      </motion.h3>

                      {/* Enhanced Code Display */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mb-8"
                      >
                        {activeCoupon?.description && (
                          <p className="text-lg md:text-xl text-gray-700 font-medium mb-3">
                            {activeCoupon.description}
                          </p>
                        )}
                        <p className="text-xl md:text-2xl text-gray-800 font-semibold mb-4">
                          Use code:
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="inline-block"
                        >
                          <div className="relative group">
                            <div className="relative inline-block">
                              <span className="font-extrabold text-3xl md:text-4xl bg-white px-6 py-3 rounded-xl inline-block border-4 border-emerald-400 shadow-2xl relative overflow-hidden">
                                <span 
                                  className="relative z-10 inline-block text-emerald-700"
                                  style={{
                                    background: 'linear-gradient(to right, #059669, #0d9488, #059669)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                  }}
                                >
                                  {activeCoupon ? activeCoupon.code : (couponLoading ? 'Loading...' : 'ATHARVA20')}
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                              </span>
                              <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity -z-10"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Enhanced CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        <Button 
                          asChild 
                          size="lg" 
                          className="h-16 px-12 text-xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 relative overflow-hidden group border-2 border-emerald-500"
                        >
                          <Link to="/products" className="flex items-center gap-3 relative z-10">
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              Shop Now
                            </motion.span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            />
                          </Link>
                        </Button>
                      </motion.div>

                      {/* Additional Urgency Text */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mt-6 text-sm md:text-base text-gray-700 font-semibold flex items-center justify-center md:justify-start gap-2"
                      >
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Offer ends soon! Don't miss out</span>
                      </motion.p>
                    </div>

                    {/* Enhanced Right Side Visual */}
                    <div className="hidden md:block relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                        className="relative"
                      >
                        {/* Multiple Sparkles with Different Animations */}
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity }
                          }}
                          className="absolute top-0 left-0"
                        >
                          <Sparkles className="w-40 h-40 text-amber-400/60" />
                        </motion.div>
                        <motion.div
                          animate={{ 
                            rotate: [360, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ 
                            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity }
                          }}
                          className="absolute top-8 right-8"
                        >
                          <Sparkles className="w-32 h-32 text-orange-400/50" />
                        </motion.div>
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            y: [0, -15, 0],
                          }}
                          transition={{ 
                            rotate: { duration: 4, repeat: Infinity },
                            y: { duration: 3, repeat: Infinity }
                          }}
                          className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        >
                          <Sparkles className="w-36 h-36 text-rose-400/70" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Bestsellers - Premium Layout */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-teal-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">Bestsellers</h2>
                <p className="text-gray-700 text-lg font-medium">Most loved by our customers</p>
              </div>
              <Link 
                to="/products?tag=bestseller" 
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product, index) => (
                <motion.div
                  key={product.id || product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 md:hidden text-center">
              <Link 
                to="/products?tag=bestseller" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg"
              >
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials - Premium Cards */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50/30">
          <div className="container-custom">
            <Card className="border-2 border-amber-300 shadow-2xl bg-white">
              <CardContent className="p-10 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
                  <p className="text-gray-700 text-lg font-medium">What our satisfied customers say about us</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card className="h-full border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex gap-1 mb-4">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm mb-6 line-clamp-4 leading-relaxed font-medium">"{testimonial.text}"</p>
                          <div className="pt-4 border-t-2 border-amber-200">
                            <p className="font-bold text-base text-gray-900 mb-1">{testimonial.name}</p>
                            <p className="text-xs text-gray-600 font-semibold">{testimonial.location}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section - Premium Final */}
        <section className="py-24 bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
          </div>
          <div className="container-custom text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                Start Your Wellness Journey
              </h2>
              <p className="text-xl md:text-2xl text-emerald-50/90 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
                Get personalized Ayurvedic recommendations from our certified experts and transform your health naturally
              </p>
              <Button 
                asChild 
                size="lg" 
                className="h-16 px-12 text-xl font-bold bg-amber-500 hover:bg-amber-600 text-emerald-900 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110"
              >
                <Link to="/expert" className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Consult Expert</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
