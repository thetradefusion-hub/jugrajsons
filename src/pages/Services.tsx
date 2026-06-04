import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import { productTypes } from '@/data/products';

const Services = () => {
  return (
    <>
      <SEO
        title="Our Services — Jugraj Son's Hive"
        description="Honey, royal jelly, beeswax, apitherapy, beehive setup, bee box manufacturing, and beekeeping training — explore all Jugraj Son's Hive services."
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate overflow-hidden border-b border-[#E6A817]/20 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute -top-12 left-1/4 h-48 w-48 rounded-full bg-[#E6A817]/25 blur-3xl" />
          <div className="container-custom relative py-8 md:py-12">
            <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="hover:text-[#1F3D2B]">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
              <span className="font-medium text-[#2B1D0E]">Services</span>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge className="border-0 bg-[#1F3D2B] px-3 py-1 text-[10px] text-[#F5E9D7] md:text-xs">Jugraj Son&apos;s Hive</Badge>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[#2B1D0E] md:text-4xl lg:text-[2.75rem]">
                Our Services
              </h1>
            </motion.div>
          </div>
        </section>

        <section className="container-custom py-6 md:py-12">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {productTypes.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E6A817]/25 bg-white shadow-[0_6px_20px_rgba(43,29,14,0.06)] transition-all hover:border-[#E6A817]/50 hover:shadow-[0_10px_28px_rgba(43,29,14,0.1)] sm:rounded-2xl"
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
                    <h2 className="line-clamp-3 text-center font-display text-[11px] font-semibold leading-snug text-[#2B1D0E] group-hover:text-[#1F3D2B] sm:text-left sm:text-sm md:text-[1.05rem]">
                      {service.name}
                    </h2>
                    <span className="mt-auto inline-flex items-center justify-center gap-1 rounded-full bg-[#1F3D2B] px-2.5 py-1.5 text-[10px] font-semibold text-[#F5E9D7] transition-colors group-hover:bg-[#E6A817] group-hover:text-[#2B1D0E] sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm">
                      View Product
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Services;
