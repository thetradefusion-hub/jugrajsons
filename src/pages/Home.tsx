import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  ShieldCheck,
  TestTube2,
  Trees,
  Sparkles,
  HeartPulse,
  Activity,
  Zap,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import { productTypes } from '@/data/products';

interface Testimonial {
  name: string;
  city: string;
  text: string;
}

const Home = () => {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const heroSlides = ['/slider1.png', '/slider2.png', '/slider3.png'];

  const trustFeatures = [
    { icon: Leaf, title: '100% Natural', subtitle: 'Bilkul shuddh, bina processing' },
    { icon: ShieldCheck, title: 'No Added Sugar', subtitle: 'Jo taste hai, wo asli hai' },
    { icon: Trees, title: 'Direct from Beekeepers', subtitle: 'Forest source se seedha' },
    { icon: TestTube2, title: 'Lab Tested Purity', subtitle: 'Quality pe no compromise' },
  ];

  const whyChooseUs = [
    { icon: Sparkles, title: 'Raw & Unprocessed', text: 'Heat treatment aur over-filtering ke bina natural enzymes preserve rehte hain.' },
    { icon: Trees, title: 'Forest Sourced', text: 'Jungle belt ke trusted apiaries se seasonal collection from authentic regions.' },
    { icon: ShieldCheck, title: 'Limited Batch Production', text: 'Small batches for tighter quality control and better traceability.' },
    { icon: CheckCircle2, title: 'Better than Commercial Honey', text: 'No dilution, no artificial blending, no sugar tricks.' },
  ];

  const benefits = [
    { icon: HeartPulse, title: 'Immunity Support', text: 'Roz subah 1 spoon se natural wellness routine build hota hai.' },
    { icon: Activity, title: 'Better Digestion', text: 'Warm water ke saath lene par gut ko soothing support milta hai.' },
    { icon: Zap, title: 'Natural Energy', text: 'Refined sugar ka cleaner alternative for daily active lifestyle.' },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Neha Arora',
      city: 'Gurgaon',
      text: 'Asli shahad ka taste tabhi aata hai jab wo seedha prakriti se aaye. Iska flavor genuinely rich hai.',
    },
    {
      name: 'Rohit Mehta',
      city: 'Mumbai',
      text: 'Morning lemon-honey routine mein clear difference feel hua. Premium quality lagti hai aur repeat order worth hai.',
    },
    {
      name: 'Priyanka S.',
      city: 'Bengaluru',
      text: 'Packaging classy hai, taste natural hai, aur sweetness bilkul balanced. Family ke liye trusted ban gaya.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const revealUp = (delay = 0, y = 18) => ({
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.45, ease: 'easeOut', delay },
  });

  return (
    <>
      <SEO
        title="Jugraj Son's Hive - Premium Forest Honey"
        description="Premium raw forest honey — trust and purity in every jar. Shop pure honey online, direct from beekeepers."
      />
      <main className="overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-0">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-[#E6A817]/20 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -top-16 right-0 h-52 w-52 rounded-full bg-[#E6A817]/25 blur-3xl" />
          <div className="container-custom relative py-8 md:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center md:text-left"
              >
                <Badge className="mb-4 border-0 bg-[#1F3D2B] px-3 py-1 text-xs text-[#F5E9D7] md:px-4 md:text-sm">Premium Raw Forest Honey</Badge>
                <h1
                  lang="hi"
                  className="font-devanagari text-2xl font-semibold leading-snug tracking-tight text-[#2B1D0E] sm:text-3xl md:text-[2.35rem] md:leading-[1.25] lg:text-[2.65rem]"
                >
                  <span className="block bg-gradient-to-r from-[#2B1D0E] via-[#3d2918] to-[#2B1D0E] bg-clip-text text-transparent">
                    हम शहद बेचते नहीं, विश्वास बांटते हैं।
                  </span>
                  <span className="mt-2 block text-[#1F3D2B] md:mt-3">
                    चख कर देखिए, आपको शुद्धता खुद बताएगी अपनी कहानी।
                  </span>
                </h1>
                <p className="mt-4 max-w-xl text-sm text-[#2B1D0E]/80 md:text-lg">
                  Pure Forest Honey, Direct from Beekeepers. No chemicals, no added sugar, no over-processing.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-1.5 md:justify-start md:gap-2">
                  {['Limited Batch', 'Forest Sourced', 'No Added Sugar'].map((tag) => (
                    <span key={tag} className="rounded-full border border-[#E6A817]/40 bg-white/70 px-2.5 py-1 text-[10px] font-medium text-[#2B1D0E]/80 md:px-3 md:text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 md:mt-8 md:justify-start md:gap-3">
                  <Button asChild size="lg" className="h-11 flex-1 rounded-full bg-[#E6A817] px-5 text-sm text-[#2B1D0E] hover:bg-[#d89c14] md:h-12 md:flex-none md:px-8 md:text-base">
                    <Link to="/products">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-11 rounded-full border-[#1F3D2B]/40 bg-transparent px-4 text-sm text-[#1F3D2B] hover:bg-[#1F3D2B]/5 md:h-12 md:px-6 md:text-base">
                    <Link to="/about">About Us</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="relative"
              >
                <div className="rounded-2xl border border-[#E6A817]/30 bg-white/80 p-3 shadow-[0_20px_40px_rgba(43,29,14,0.12)] md:rounded-3xl md:p-4">
                  <div className="relative overflow-hidden rounded-2xl">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={heroSlides[activeHeroSlide]}
                        src={heroSlides[activeHeroSlide]}
                        alt={`Jugraj Son's Hive hero ${activeHeroSlide + 1}`}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="aspect-[4/3] w-full bg-[#2B1D0E]/5 object-contain md:h-[380px] md:aspect-auto md:object-cover"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
                      <button
                        type="button"
                        onClick={() => setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur hover:bg-black/50 md:h-9 md:w-9"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                      </button>

                      <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur md:gap-2 md:px-3">
                        {heroSlides.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveHeroSlide(index)}
                            className={`h-2.5 rounded-full transition-all ${
                              activeHeroSlide === index ? 'w-6 bg-[#E6A817]' : 'w-2.5 bg-white/80'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur hover:bg-black/50 md:h-9 md:w-9"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute left-4 top-0 h-10 w-20 rounded-b-2xl bg-[#E6A817]/90 md:left-6 md:h-12 md:w-24" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-b border-[#E6A817]/10 bg-white py-10 md:py-12">
          <div className="container-custom">
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl text-[#2B1D0E] md:text-3xl">Built on Purity and Trust</h2>
              <p className="mt-2 text-sm text-[#2B1D0E]/70">Premium quality standards with authentic sourcing.</p>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
              {trustFeatures.map((feature, index) => (
                <motion.div key={feature.title} {...revealUp(index * 0.08, 14)} className="w-[80%] min-w-[80%] snap-center rounded-2xl border border-[#E6A817]/20 bg-[#fffaf2] p-4 shadow-sm md:w-auto md:min-w-0 md:p-5">
                  <div className="mb-3 inline-flex rounded-full bg-[#1F3D2B] p-3">
                    <feature.icon className="h-5 w-5 text-[#F5E9D7]" />
                  </div>
                  <h3 className="font-display text-xl text-[#2B1D0E]">{feature.title}</h3>
                  <p className="mt-1 text-sm text-[#2B1D0E]/70">{feature.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-12 md:py-16">
          <div className="container-custom">
            <div className="mb-8 text-center md:mb-10">
              <Badge className="border-0 bg-[#2B1D0E] text-[#F5E9D7]">Our Services</Badge>
              <h2 className="mt-3 font-display text-3xl text-[#2B1D0E] md:text-4xl">Explore by Category</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#2B1D0E]/75 md:text-base">
                शहद, रॉयल जेली, बी वैक्स, एपिथेरेपी और मधुमक्खी पालन — category चुनकर products देखें।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {productTypes.map((service, idx) => (
                <motion.div key={service.id} {...revealUp(idx * 0.05, 14)} className="min-w-0">
                  <Link
                    to={`/services/${service.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E6A817]/20 bg-white shadow-[0_8px_22px_rgba(43,29,14,0.07)] transition-all hover:-translate-y-0.5 hover:border-[#E6A817]/45 hover:shadow-[0_14px_30px_rgba(43,29,14,0.1)] sm:rounded-2xl md:rounded-3xl"
                  >
                    <div className="flex w-full items-center justify-center bg-[#f5efe3] p-1 sm:p-1.5">
                      <img
                        src={encodeURI(service.image)}
                        alt={service.name}
                        className="block h-auto w-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4">
                      <h3 className="line-clamp-3 text-center font-display text-[11px] font-semibold leading-snug text-[#2B1D0E] group-hover:text-[#1F3D2B] sm:text-left sm:text-sm md:text-base">
                        {service.name}
                      </h3>
                      <span className="mt-auto inline-flex items-center justify-center gap-1 rounded-full bg-[#E6A817] px-2.5 py-1.5 text-[10px] font-semibold text-[#2B1D0E] transition-colors group-hover:bg-[#1F3D2B] group-hover:text-[#F5E9D7] sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm">
                        View Product
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center md:mt-10">
              <Button asChild size="lg" className="rounded-full bg-[#1F3D2B] px-6 text-[#F5E9D7] hover:bg-[#2a523c]">
                <Link to="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="bg-white py-12 md:py-16">
          <div className="container-custom">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl text-[#2B1D0E] md:text-4xl">Why Choose Jugraj Son&apos;s Hive</h2>
              <p className="mt-2 text-sm text-[#2B1D0E]/70">Not mass-market. Premium, authentic, direct-from-source honey.</p>
            </div>
            <div className="grid gap-4 md:gap-5 md:grid-cols-2">
              {whyChooseUs.map((item, idx) => (
                <motion.div key={item.title} {...revealUp(idx * 0.08, 14)}>
                  <Card className="h-full rounded-2xl border border-[#E6A817]/20 bg-[#fff9ef]">
                    <CardContent className="p-5 md:p-6">
                      <div className="mb-3 inline-flex rounded-full bg-[#1F3D2B] p-2.5">
                        <item.icon className="h-5 w-5 text-[#F5E9D7]" />
                      </div>
                      <h3 className="font-display text-2xl text-[#2B1D0E]">{item.title}</h3>
                      <p className="mt-2 text-sm text-[#2B1D0E]/75">{item.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story teaser → full About page */}
        <section id="our-story" className="py-12 md:py-16">
          <div className="container-custom">
            <Card className="overflow-hidden rounded-3xl border border-[#E6A817]/20 bg-[#2B1D0E] text-[#F5E9D7] shadow-[0_16px_40px_rgba(43,29,14,0.12)]">
              <CardContent className="p-6 text-center md:p-10 md:text-left">
                <Badge className="border-0 bg-[#E6A817] px-2.5 py-0.5 text-[10px] font-medium text-[#2B1D0E] md:text-xs">
                  Our Story
                </Badge>
                <h2
                  lang="hi"
                  className="mt-4 font-devanagari text-xl font-semibold leading-snug text-[#F5E9D7] sm:text-2xl md:text-3xl"
                >
                  लोकेश गजाम ने मधुमक्खी पालन से खड़ी की सफलता की मिसाल
                </h2>
                <p
                  lang="hi"
                  className="mx-auto mt-3 max-w-2xl font-devanagari text-sm leading-relaxed text-[#F5E9D7]/85 md:mx-0 md:text-base"
                >
                  इंजीनियरिंग के बाद &apos;जुगराज संस हाइव&apos; के माध्यम से शुद्ध शहद और जैविक खेती — पूरी कहानी, सफर और वादे एक ही जगह पढ़ें।
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 rounded-full bg-[#E6A817] px-8 font-semibold text-[#2B1D0E] hover:bg-[#d89c14]"
                >
                  <Link to="/about">
                    पूरी कहानी पढ़ें <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white py-12 md:py-16">
          <div className="container-custom">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl text-[#2B1D0E] md:text-4xl">Daily Honey Benefits</h2>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {benefits.map((benefit, idx) => (
                <motion.div key={benefit.title} {...revealUp(idx * 0.08, 16)} className="w-[82%] min-w-[82%] snap-center md:w-auto md:min-w-0">
                  <Card className="rounded-2xl border border-[#E6A817]/20 bg-[#fff9ef]">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 inline-flex rounded-full bg-[#E6A817] p-3">
                        <benefit.icon className="h-5 w-5 text-[#2B1D0E]" />
                      </div>
                      <h3 className="font-display text-2xl text-[#2B1D0E]">{benefit.title}</h3>
                      <p className="mt-2 text-sm text-[#2B1D0E]/75">{benefit.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl text-[#2B1D0E] md:text-4xl">What Honey Lovers Say</h2>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {testimonials.map((item, idx) => (
                <motion.div key={item.name} {...revealUp(idx * 0.08, 12)} className="w-[86%] min-w-[86%] snap-center md:w-auto md:min-w-0">
                  <Card className="h-full rounded-2xl border border-[#E6A817]/20 bg-white">
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <Quote className="h-4 w-4 text-[#E6A817]" />
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-[#E6A817] text-[#E6A817]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-[#2B1D0E]/80">"{item.text}"</p>
                      <div className="mt-5 border-t border-[#E6A817]/20 pt-4">
                        <p className="font-semibold text-[#2B1D0E]">{item.name}</p>
                        <p className="text-xs text-[#2B1D0E]/60">{item.city}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[#E6A817]/25 bg-white py-10 md:py-14">
          <div className="container-custom">
            <Card className="rounded-3xl border border-[#E6A817]/20 bg-gradient-to-r from-[#173423] to-[#214733] text-[#FFF8E9] shadow-[0_20px_40px_rgba(23,52,35,0.25)]">
              <CardContent className="flex flex-col items-center justify-between gap-4 p-5 text-center md:gap-6 md:p-8 md:flex-row md:text-left">
                <div>
                  <h3 className="font-display text-2xl text-[#FFF8E9] md:text-3xl">Taste the difference of real forest honey.</h3>
                  <p className="mt-2 text-sm text-[#FFF8E9]">Mindful living ke liye premium, authentic honey choose kijiye.</p>
                </div>
                <Button asChild size="lg" className="h-11 w-full rounded-full bg-[#E6A817] px-8 text-[#2B1D0E] hover:bg-[#d89c14] md:h-12 md:w-auto">
                  <Link to="/products">
                    Explore Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
