import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Leaf, Award, Truck, Star, ChevronRight, Sparkles, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import { products, concerns, testimonials } from '@/data/products';

const Home = () => {
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);

  const trustFeatures = [
    { icon: Shield, title: 'GMP Certified', description: 'Quality assured', color: 'from-emerald-500 to-teal-500' },
    { icon: Leaf, title: '100% Natural', description: 'Pure herbs', color: 'from-green-500 to-emerald-500' },
    { icon: Award, title: '50+ Years', description: 'Legacy trust', color: 'from-amber-500 to-orange-500' },
    { icon: Truck, title: 'Free Delivery', description: 'Above ₹499', color: 'from-blue-500 to-indigo-500' },
  ];

  const quickActions = [
    { icon: Zap, label: 'Quick Order', path: '/products', color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: 'bg-gradient-to-br from-rose-400 to-pink-500' },
    { icon: Sparkles, label: 'New Arrivals', path: '/products?tag=new', color: 'bg-gradient-to-br from-violet-400 to-purple-500' },
    { icon: Award, label: 'Best Sellers', path: '/products?tag=bestseller', color: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
  ];

  return (
    <>
      <SEO />
      <main className="overflow-x-hidden">
        {/* Hero Section - App Style */}
        <section className="relative bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-900 text-white overflow-hidden min-h-[280px] md:min-h-[400px]">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-5 -right-10 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom relative pt-6 pb-16 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ancient Wisdom, Modern Wellness</span>
              </motion.div>
              
              <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-3">
                Discover <span className="text-amber-300">Authentic Ayurveda</span>
              </h1>
              
              <p className="text-sm md:text-base text-white/80 mb-6 max-w-md mx-auto">
                Transform your health naturally with scientifically formulated products.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full shadow-lg h-10 px-5">
                  <Link to="/products">
                    Shop Now <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full h-10 px-5">
                  <Link to="/expert">Consult Expert</Link>
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 80L60 73C120 66 240 53 360 46C480 40 600 40 720 43C840 46 960 53 1080 56C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V80Z" fill="hsl(var(--background))"/>
            </svg>
          </div>
        </section>

        {/* Quick Actions - Mobile App Style */}
        <section className="py-6 -mt-2">
          <div className="container-custom">
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={action.path}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${action.color} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-105 transition-transform`}>
                      <action.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Features - Horizontal Scroll */}
        <section className="py-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4 md:px-8 min-w-max md:justify-center">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-card rounded-2xl p-3 pr-5 shadow-sm border border-border"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Concern */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl md:text-2xl font-bold">Shop by Concern</h2>
              <Link to="/products" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {concerns.slice(0, 10).map((concern, index) => (
                <motion.div
                  key={concern.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    to={`/products?concern=${concern.slug}`}
                    className="flex flex-col items-center p-3 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all group"
                  >
                    <span className="text-2xl md:text-3xl mb-2">{concern.icon}</span>
                    <span className="font-medium text-xs text-center group-hover:text-primary transition-colors line-clamp-1">{concern.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offer Banner */}
        <section className="py-4">
          <div className="container-custom">
            <Card className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 border-0 overflow-hidden">
              <CardContent className="p-5 md:p-8 flex items-center justify-between relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-white/90 text-sm font-medium mb-1">Limited Time Offer</p>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Get 20% OFF</h3>
                  <p className="text-white/80 text-sm mb-3">Use code: ATHARVA20</p>
                  <Button asChild size="sm" className="bg-white text-orange-600 hover:bg-white/90 rounded-full font-semibold">
                    <Link to="/products">Shop Now</Link>
                  </Button>
                </div>
                <div className="hidden md:block">
                  <Sparkles className="w-20 h-20 text-white/30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold">Bestsellers</h2>
                <p className="text-sm text-muted-foreground">Most loved by customers</p>
              </div>
              <Link to="/products?tag=bestseller" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {bestsellers.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-8 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Customer Love</h2>
              <p className="text-sm text-muted-foreground">Join thousands of satisfied customers</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">"{testimonial.text}"</p>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 bg-gradient-to-br from-primary to-teal-700 text-white">
          <div className="container-custom text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Start Your Wellness Journey</h2>
            <p className="text-white/80 max-w-md mx-auto mb-6 text-sm">
              Get personalized Ayurvedic recommendations from our certified experts
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full font-semibold">
              <Link to="/expert">
                Consult Expert <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;