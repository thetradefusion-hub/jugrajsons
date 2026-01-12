import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Leaf, Award, Truck, Star, ChevronRight, CheckCircle2, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import { concerns, testimonials } from '@/data/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';

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
  const [email, setEmail] = useState('');

  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);
  const featuredProducts = products.slice(0, 6);

  // Hero slides with background images
  const heroSlides = [
    {
      id: 1,
      badge: 'Up to 40% Off',
      title: 'Ancient Wisdom, Modern Wellness',
      gradient: 'from-emerald-600 via-green-600 to-teal-600',
      bgImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&q=80',
    },
    {
      id: 2,
      badge: 'New Arrivals',
      title: 'Pure Ayurvedic Skincare',
      gradient: 'from-amber-600 via-orange-600 to-rose-600',
      bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
    },
    {
      id: 3,
      badge: 'Expert Consultation',
      title: 'Personalized Health Solutions',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600',
      bgImage: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80',
    },
  ];

  // Trust features matching reference
  const trustFeatures = [
    { 
      icon: Shield, 
      title: '100% Authentic', 
      description: 'Genuine Ayurveda',
      image: '/placeholder.svg'
    },
    { 
      icon: Leaf, 
      title: 'Natural Herbs', 
      description: 'Pure ingredients',
      image: '/placeholder.svg'
    },
    { 
      icon: Award, 
      title: 'GMP Certified', 
      description: 'Quality assured',
      image: '/placeholder.svg'
    },
    { 
      icon: Truck, 
      title: 'Free Delivery', 
      description: 'Above Rs. 499',
      image: '/placeholder.svg'
    },
  ];

  // Trending tags
  const trendingTags = [
    { name: 'Ashwagandha', url: '/products?search=Ashwagandha' },
    { name: 'Immunity', url: '/products?search=Immunity' },
    { name: 'Digestive Care', url: '/products?search=Digestive Care' },
    { name: 'Hair Care', url: '/products?search=Hair Care' },
    { name: 'Weight Loss', url: '/products?search=Weight Loss' },
    { name: 'Skin Glow', url: '/products?search=Skin Glow' },
  ];

  // Why choose us
  const whyChooseUs = [
    {
      icon: Leaf,
      title: 'Pure Ingredients',
      description: 'Sourced from organic farms across India',
      image: '/placeholder.svg'
    },
    {
      icon: Award,
      title: 'Expert Formulas',
      description: 'By Ayurvedic doctors with decades of experience',
      image: '/placeholder.svg'
    },
    {
      icon: CheckCircle2,
      title: 'Lab Tested',
      description: 'Every batch tested for purity & potency',
      image: '/placeholder.svg'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping above Rs. 499, 3-5 days delivery',
      image: '/placeholder.svg'
    },
  ];

  // Shop by concern - 8 concerns matching reference
  const shopByConcern = concerns.slice(0, 8);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await api.get('/products', { params: { limit: 1000 } });
        const fetchedProducts = response.data.products || response.data || [];
        
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
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <>
      <SEO />
      <main className="overflow-x-hidden bg-white">
        {/* Hero Section - Matching Reference */}
        <section className="relative overflow-hidden">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full">
            <CarouselContent className="-ml-0">
              {heroSlides.map((slide) => (
                <CarouselItem key={slide.id} className="pl-0">
                  <div className={`relative bg-gradient-to-br ${slide.gradient} min-h-[280px] md:min-h-[500px] flex items-center py-8 md:py-16 overflow-hidden`}>
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${slide.bgImage})` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-80`} />
                    </div>
                    
                    <div className="container-custom w-full relative z-10">
                      <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <Badge className="mb-3 bg-white/25 backdrop-blur-md text-white border-white/40 px-3 py-1 text-xs md:text-sm font-bold shadow-lg">
                          {slide.badge}
                        </Badge>
                        
                        {/* Title */}
                        <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 md:mb-8 drop-shadow-lg">
                          {slide.title}
                        </h1>
                        
                        {/* Enhanced CTA Buttons with Combination Colors */}
                        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                          <Button 
                            asChild 
                            size="lg" 
                            className="bg-gradient-to-r from-white via-emerald-50 to-white text-emerald-700 hover:from-emerald-50 hover:via-white hover:to-emerald-50 rounded-full px-6 md:px-10 py-4 md:py-6 text-sm md:text-lg font-extrabold shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 group border-2 border-white/50"
                          >
                            <Link to="/products" className="flex items-center gap-2 md:gap-3">
                              <span>Shop Now</span>
                              <ArrowRight className="w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                          <Button 
                            asChild 
                            size="lg" 
                            className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white rounded-full px-6 md:px-10 py-4 md:py-6 text-sm md:text-lg font-extrabold shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 border-2 border-white/30"
                          >
                            <Link to="/products" className="flex items-center gap-2 md:gap-3 text-white">
                              Explore Products
                              <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation */}
            <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 border-white/30 text-white" />
            <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 border-white/30 text-white" />
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </section>

        {/* Enhanced Trust Features Section - Compact */}
        <section className="py-4 md:py-6 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center text-center p-2 md:p-4 rounded-lg bg-gradient-to-br from-emerald-50/50 to-teal-50/50 hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200"
                >
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-1.5 md:mb-3 shadow-md">
                    <feature.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[10px] md:text-sm text-gray-900 mb-0.5 leading-tight">{feature.title}</h3>
                  <p className="text-[9px] md:text-xs text-gray-600 leading-tight">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Trending Section */}
        <section className="py-6 md:py-8 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-green-50/50 border-b border-gray-100">
          <div className="container-custom">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <span className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Trending:
              </span>
              {trendingTags.map((tag) => (
                <Link
                  key={tag.name}
                  to={tag.url}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:text-emerald-800"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section - Matching Reference */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge className="mb-2 bg-emerald-100 text-emerald-700 border-0">Top Picks</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Bestsellers</h2>
              </div>
              <Link 
                to="/products?filter=bestseller" 
                className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            
            {productsLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : bestsellers.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {bestsellers.map((product, index) => (
                  <ProductCard key={product.id || product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">No bestsellers available</div>
            )}
            
            <div className="mt-8 md:hidden text-center">
              <Link 
                to="/products?filter=bestseller" 
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Shop by Health Concern - Matching Reference */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <Badge className="mb-2 bg-emerald-100 text-emerald-700 border-0">Find Your Solution</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Health Concern</h2>
              <p className="text-gray-600">Discover Ayurvedic solutions tailored to your wellness needs</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {shopByConcern.map((concern, index) => (
                <motion.div
                  key={concern.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/products?concern=${concern.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{concern.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                          {concern.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {products.filter(p => 
                            (p.concern && Array.isArray(p.concern) && p.concern.includes(concern.slug)) || 
                            p.category === concern.slug
                          ).length} Products
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section - Matching Reference */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge className="mb-2 bg-purple-100 text-purple-700 border-0">Curated For You</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
              </div>
              <Link 
                to="/products" 
                className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            
            {productsLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id || product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">No products available</div>
            )}
            
            <div className="mt-8 md:hidden text-center">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section - Matching Reference */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <Badge className="mb-2 bg-amber-100 text-amber-700 border-0">The Atharva Difference</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose Us?</h2>
              <p className="text-gray-600">Pure Ayurveda with modern quality standards</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Matching Reference */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <Badge className="mb-2 bg-rose-100 text-rose-700 border-0">Real Reviews</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
              <p className="text-gray-600">Trusted by 50,000+ happy customers</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-gray-700 mb-6 text-sm leading-relaxed">"{testimonial.text}"</p>
                      
                      {/* Customer Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
                          <p className="text-xs text-gray-600">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      {/* Verified Badge */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-emerald-600 font-medium">
                          ✓ Verified: {testimonial.product}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section - Matching Reference */}
        <section className="py-16 bg-emerald-600">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Get Wellness Tips & Offers</h2>
              <p className="text-emerald-50 mb-8">Subscribe for Ayurvedic health tips, new launches & exclusive discounts</p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border-0 rounded-full px-6"
                  required
                />
                <Button type="submit" size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 rounded-full px-8">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
              
              <p className="text-sm text-emerald-50 mt-4">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
