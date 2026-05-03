import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import { OurStoryCard } from '@/components/about/OurStoryCard';
import { PressGallery } from '@/components/about/PressGallery';

const About = () => {
  return (
    <>
      <SEO
        title="About Us — Jugraj Son's Hive"
        description="लोकेश गजाम और जुगराज संस हाइव की कहानी — शुद्ध शहद, जैविक खेती, और मधुमक्खी पालन से जुड़ा सफर।"
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate overflow-hidden border-b border-[#E6A817]/20 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-[#E6A817]/20 blur-3xl" />
          <div className="container-custom relative py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge className="border-0 bg-[#2B1D0E] px-3 py-1 text-[10px] text-[#F5E9D7] md:text-xs">About Us</Badge>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[#2B1D0E] md:text-4xl lg:text-[2.75rem]">
                Our story &amp; promise
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#2B1D0E]/75 md:text-base" lang="hi">
                इंजीनियरिंग से मधुमक्खी पालन तक — जुगराज संस हाइव की पूरी कहानी यहीं पढ़ें।
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#E6A817] px-6 font-semibold text-[#2B1D0E] hover:bg-[#d89c14]"
                >
                  <Link to="/products">
                    Shop honey <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-[#1F3D2B]/35 bg-white/80 text-[#1F3D2B] hover:bg-[#fff9ef]">
                  <Link to="/contact">Contact</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <PressGallery />

        <section className="py-8 md:py-12">
          <div className="container-custom">
            <OurStoryCard />
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
