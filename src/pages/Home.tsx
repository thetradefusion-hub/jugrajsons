import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Leaf, Award, Truck, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/seo/SEO';
import ProductCard from '@/components/product/ProductCard';
import { products, concerns, testimonials, blogPosts } from '@/data/products';

const Home = () => {
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  const trustFeatures = [
    { icon: Shield, title: 'GMP Certified', description: 'Quality assured manufacturing' },
    { icon: Leaf, title: '100% Ayurvedic', description: 'Pure herbal ingredients' },
    { icon: Award, title: '50+ Years Legacy', description: 'Trusted by generations' },
    { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹499' },
  ];

  return (
    <>
      <SEO />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-ayurveda-green to-ayurveda-green-dark text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-pattern-leaf opacity-30" />
          <div className="container-custom relative py-16 md:py-24 lg:py-32">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-ayurveda-gold/20 text-ayurveda-gold-light rounded-full text-sm font-medium mb-6">
                  Ancient Wisdom, Modern Wellness
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Discover the Power of Authentic Ayurveda
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
                  Transform your health naturally with our scientifically formulated Ayurvedic products. Trusted by over 1 million happy customers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-ayurveda-gold hover:bg-ayurveda-gold-light text-ayurveda-brown font-semibold">
                    <Link to="/products">
                      Shop Now <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Link to="/products?tag=bestseller">View Bestsellers</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Features */}
        <section className="py-8 bg-card border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
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
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Shop by Health Concern</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Find the right Ayurvedic solution for your specific health needs</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {concerns.slice(0, 10).map((concern, index) => (
                <motion.div
                  key={concern.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/products?concern=${concern.slug}`}
                    className="flex flex-col items-center p-4 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all group"
                  >
                    <span className="text-3xl mb-3">{concern.icon}</span>
                    <span className="font-medium text-sm text-center group-hover:text-primary transition-colors">{concern.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Bestsellers</h2>
                <p className="text-muted-foreground">Most loved products by our customers</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/products?tag=bestseller">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {bestsellers.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-muted-foreground">Join thousands of satisfied customers</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-ayurveda-gold text-ayurveda-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Start Your Wellness Journey Today</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Get 10% off on your first order. Use code: ATHARVA10
            </p>
            <Button asChild size="lg" className="bg-ayurveda-gold hover:bg-ayurveda-gold-light text-ayurveda-brown">
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
